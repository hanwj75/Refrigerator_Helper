import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

type SupabaseBrowserClient = ReturnType<typeof createClient<any>>;

let browserClient: SupabaseBrowserClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabasePublishableKey);
}

export function getSupabaseClient() {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.",
    );
  }

  if (!browserClient) {
    browserClient = createClient(env.supabaseUrl, env.supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

export const supabase = isSupabaseConfigured() ? getSupabaseClient() : null;
