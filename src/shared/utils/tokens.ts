import { createHash, randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { env } from "../../config/env.js";

const secret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const ISSUER = "login-api";

export function signAccessToken(userId: string) {
    return new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(userId)
        .setIssuer(ISSUER)
        .setIssuedAt()
        .setExpirationTime(env.ACCESS_TOKEN_TTL)
        .sign(secret);
}

export async function verifyAccessToken(token: string) {
    const { payload } = await jwtVerify(token, secret, {
        algorithms: ["HS256"],
        issuer: ISSUER,
    });
    return payload;
}

export const generateRefreshToken = () => randomBytes(32).toString("base64url");

export const hashToken = (token: string) =>
    createHash("sha256").update(token).digest("hex");
