import { SignJWT, jwtVerify } from "jose";
import { env } from "../../config/env.js";

const secret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const ISSUER = "login-back";

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
