import { createClient } from "@supabase/supabase-js";

// Vite uses import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// This check helps debug if the .env file isn't loading
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase environment variables are missing! Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
