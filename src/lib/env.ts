import { z } from "zod";

const envSchema = z.object({
  VITE_APP_NAME: z.string().default("Refrigerator Helper"),
  VITE_API_BASE_URL: z.string().default("/"),
  VITE_SUPABASE_URL: z.string().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
});

const parsedEnv = envSchema.parse({
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

export const env = {
  appName: parsedEnv.VITE_APP_NAME,
  apiBaseUrl: parsedEnv.VITE_API_BASE_URL,
  supabaseUrl: parsedEnv.VITE_SUPABASE_URL,
  supabaseAnonKey: parsedEnv.VITE_SUPABASE_ANON_KEY,
};
