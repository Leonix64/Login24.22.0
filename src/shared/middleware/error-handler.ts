import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    if (err instanceof ZodError) {
        res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "invalid request data",
                details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
            },
        });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
        return;
    }

    // JSON parse error handling
    if (typeof err === "object" && err !== null && "type" in err && err.type === "entity.parse.failed") {
        res.status(400).json({ error: { code: "INVALID_JSON", message: "invalid JSON" } });
        return;
    }

    req.log.error(err);
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "internal server error" } });
};
