import dotenv from "dotenv";
import { z } from "zod";
import path from "path";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const envSchema = z.object({
    PORT: z.string().default("3000"),
    MONGO_URI: z.string(),
    FRONTEND_URL: z.string(),
    JWT_SECRET: z.string(),
});


const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("Invalid environment variables:", _env.error.format());
    process.exit(1);
}

export const APP_CONFIG = _env.data;
