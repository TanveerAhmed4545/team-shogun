import { z } from "zod";

const envSchema = z.object({
  // MongoDB
  MONGODB_URI: z.string().min(1),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),

  // SMTP / Email
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(1),

  // ImgBB
  IMGBB_API_KEY: z.string().min(1),

  // Security
  CRON_SECRET: z.string().min(1).optional().default("team-shogun-cron-secret-123"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const config = _env.data;
