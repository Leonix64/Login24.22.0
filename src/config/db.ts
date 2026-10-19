import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export async function connectDB() {
    mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
    await mongoose.connect(env.MONGODB_URI);
    logger.info("MongoDB connected");
}

export async function disconnectDB() {
    await mongoose.disconnect();
}
