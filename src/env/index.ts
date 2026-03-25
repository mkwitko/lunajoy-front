import { z } from "zod";

const envSchema = z.object({
  VITE_HTTP_API_URL: z.string(),
});

export const env = envSchema.parse(import.meta.env);
