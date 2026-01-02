import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Client-side must use ONLY anon key.
// Service role must NEVER be shipped to the frontend bundle.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // This error helps catch missing env vars in dev/build.
  // In Lovable, env vars are typically set in platform settings.
  console.warn("Missing Supabase env vars. Check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
