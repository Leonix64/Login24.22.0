import { rateLimit } from "express-rate-limit";
import { env } from "../../config/env.js";

const message = {
    error: { code: "TOO_MANY_REQUESTS", message: "Too many attempts, please try again later" },
};

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.NODE_ENV === "production" ? 10 : 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message,
});

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.NODE_ENV === "production" ? 60 : 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message,
});
