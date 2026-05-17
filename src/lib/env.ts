import { z } from "zod";

const envSchema = z.object({
  // App
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Database
  DATABASE_URL: z.string().min(1),

  // OAuth
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // Email
  SENDER_EMAIL: z.string().email(),
  EMAIL_PASSWORD: z.string().min(1),

  // Paddle
  PADDLE_API_KEY: z.string().min(1),
  PADDLE_CLIENT_TOKEN: z.string().min(1),
  PADDLE_NOTIFICATION_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_PADDLE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),

  // Rate limiting
  RATELIMIT_WINDOW: z.coerce.number().positive().default(10),
  RATELIMIT_MAX: z.coerce.number().positive().default(100),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:");
  console.error(_env.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables. Check logs for details.");
}

export const env = _env.data;
