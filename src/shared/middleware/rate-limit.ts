import { rateLimit } from "express-rate-limit";
import { env } from "../../config/env.js";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: env.NODE_ENV === "production" ? 10 : 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: { code: "TOO_MANY_REQUESTS", message: "too many requests, please try again later" } },
});
