// supabaseClient.js
// Initializes a single Supabase client for the app using Vite env vars.
// Exposes `supabase` for DB + auth operations across the codebase.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session across refreshes and restore if found in URL
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
