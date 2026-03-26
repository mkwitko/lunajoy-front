import { z } from "zod";

const envSchema = z.object({
  VITE_MODE: z.enum(["development", "production", "test"]),
  VITE_HTTP_API_URL: z.string(),
  VITE_GOOGLE_CLIENT_ID: z.string(),
});

export const env = envSchema.parse(import.meta.env);
