import { AppError } from "../../shared/errors/app-error.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";
import { signAccessToken } from "../../shared/utils/tokens.js";
import { createUser, findUserByEmailWithPassword, toPublicUser } from "../users/user.service.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

// Dummy hash for timing attack prevention
const DUMMY_HASH = await hashPassword("dummy-password-for-timing");

function isDuplicateKeyError(err: unknown) {
    return typeof err === "object" && err !== null && "code" in err && err.code === 11000;
}

export async function register(input: RegisterInput) {
    const passwordHash = await hashPassword(input.password);

    try {
        const user = await createUser({ name: input.name, email: input.email, passwordHash });
        const accessToken = await signAccessToken(user.id);
        return { user: toPublicUser(user), accessToken };
    } catch (err) {
        if (isDuplicateKeyError(err)) {
            throw new AppError(400, "Email already exists", "EMAIL_TAKEN");
        }
        throw err;
    }
}

export async function login(input: LoginInput) {
    const user = await findUserByEmailWithPassword(input.email);

    const valid = await verifyPassword(user?.passwordHash ?? DUMMY_HASH, input.password);

    if (!user || !valid) {
        throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const accessToken = await signAccessToken(user.id);
    return { user: toPublicUser(user), accessToken };
}
