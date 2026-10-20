import type { RequestHandler } from "express";
import { errors } from "jose";
import { AppError } from "../errors/app-error.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const authenticate: RequestHandler = async (req, _res, next) => {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        throw new AppError(401, "Missing or malformed Authorization header", "MISSING_TOKEN");
    }

    const token = header.slice("Bearer ".length).trim();

    try {
        const payload = await verifyAccessToken(token);

        if (!payload.sub) {
            throw new AppError(401, "Invalid token", "INVALID_TOKEN");
        }

        req.auth = { userId: payload.sub };
        next();
    } catch (err) {
        if (err instanceof AppError) throw err;

        // The front uses this specific code to know it should call /auth/refresh
        if (err instanceof errors.JWTExpired) {
            throw new AppError(401, "Access token expired", "TOKEN_EXPIRED");
        }

        throw new AppError(401, "Invalid token", "INVALID_TOKEN")
    }
};
