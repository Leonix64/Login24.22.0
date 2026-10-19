import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/app-error.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";
import { generateRefreshToken, hashToken, signAccessToken } from "../../shared/utils/tokens.js";
import { createUser, findByEmailWithPassword, findById, toPublicUser } from "../users/user.service.js";
import { RefreshTokenModel } from "./refresh-token.model.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// A hash of lies to make the timestamps match when the email doesn't exist
const DUMMY_HASH = await hashPassword("dummy-password-for-timing");

type SessionUser = Parameters<typeof toPublicUser>[0];

function isDuplicateKeyError(err: unknown) {
    return typeof err === "object" && err !== null && "code" in err && err.code === 11000;
}

const invalidSession = () => new AppError(401, "Invalid session", "INVALID_REFRESH_TOKEN");

async function issueRefreshToken(userId: string, familyId: string = randomUUID()) {
    const token = generateRefreshToken();
    await RefreshTokenModel.create({
        userId,
        familyId,
        tokenHash: hashToken(token), // The hash goes in the database, never the token
        expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * DAY_MS),
    });
    return token;
}

function revokeFamily(familyId: string) {
    return RefreshTokenModel.updateMany({ familyId, revokedAt: null }, { revokedAt: new Date() });
}

async function buildSession(user: SessionUser, familyId?: string) {
    const [accessToken, refreshToken] = await Promise.all([
        signAccessToken(user.id),
        issueRefreshToken(user.id, familyId),
    ]);
    return { user: toPublicUser(user), accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
    const passwordHash = await hashPassword(input.password);

    try {
        const user = await createUser({ name: input.name, email: input.email, passwordHash });
        return await buildSession(user);
    } catch (err) {
        if (isDuplicateKeyError(err)) {
            throw new AppError(409, "Email already registered", "EMAIL_TAKEN");
        }
        throw err;
    }
}

export async function login(input: LoginInput) {
    const user = await findByEmailWithPassword(input.email);

    const valid = await verifyPassword(user?.passwordHash ?? DUMMY_HASH, input.password);

    if (!user || !valid) {
        throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    return buildSession(user);
}

export async function refresh(rawToken: string | undefined) {
    if (!rawToken) throw new AppError(401, "No active session", "NO_REFRESH_TOKEN");

    const stored = await RefreshTokenModel.findOne({ tokenHash: hashToken(rawToken) });
    if (!stored) throw invalidSession();

    const reused = async () => {
        await revokeFamily(stored.familyId);
        return new AppError(401, "Invalid session", "REFRESH_TOKEN_REUSED");
    };

    // Token already used: The entire family is killed.
    if (stored.revokedAt) throw await reused();

    if (stored.expiresAt <= new Date()) throw invalidSession();

    // “Claim” the token atomically: only ONE request can win it
    const claimed = await RefreshTokenModel.findOneAndUpdate(
        { _id: stored._id, revokedAt: null },
        { revokedAt: new Date() },
    );
    if (!claimed) throw await reused();

    const user = await findById(stored.userId.toString());
    if (!user) {
        await revokeFamily(stored.familyId);
        throw invalidSession();
    }

    // Same familyId: this is the next link in the same chain
    return buildSession(user, stored.familyId);
}

export async function logout(rawToken: string | undefined) {
    if (!rawToken) return;
    const stored = await RefreshTokenModel.findOne({ tokenHash: hashToken(rawToken) });
    if (stored) await revokeFamily(stored.familyId);
}