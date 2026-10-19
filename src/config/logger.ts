import { pino } from "pino";
import { env } from "./env.js";

export const logger = pino({
    level: env.NODE_ENV === "production" ? "info" : "debug",
    redact: ["req.headers.authorization", "req.headers.cookie", 'res.headers["set-cookie"]'],
    transport: env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
});
