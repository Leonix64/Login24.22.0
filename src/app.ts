import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { apiRouter } from "./routes.js";
import { errorHandler } from "./shared/middleware/error-handler.js";
import { AppError } from "./shared/errors/app-error.js";

export const app = express();

app.use(
    pinoHttp({
        logger,
        serializers: {
            req: (req) => ({ id: req.id, method: req.method, url: req.url }),
            res: (res) => ({ statusCode: res.statusCode }),
        },
    }),
);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api", apiRouter);

app.use((_req, _res, next) => {
    next(new AppError(404, "not found", "NOT_FOUND"));
});

app.use(errorHandler);
