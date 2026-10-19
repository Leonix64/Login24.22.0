import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    CLIENT_ORIGIN: z.string().url(),
    MONGODB_URI: z.string().regex(/^mongodb(\+srv)?:\/\//, "Debe empezar con mongodb:// o mongodb+srv://"),
    JWT_ACCESS_SECRET: z.string().min(32, "Mínimo 32 caracteres"),
    ACCESS_TOKEN_TTL: z.string().default("15m"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:");
    for (const issue of parsed.error.issues) {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
}

export const env = parsed.data;
