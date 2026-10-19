import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDB, disconnectDB } from "./config/db.js";

async function main() {
    await connectDB();

    const server = app.listen(env.PORT, () => {
        logger.info(`Server is running on http://localhost:${env.PORT}`);
    });

    function shutdown(signal: string) {
        logger.info(`${signal} received, shutting down...`);
        server.close(async () => {
            await disconnectDB();
            process.exit(0);
        });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
    logger.error(err, "Error starting the server");
    process.exit(1);
});
