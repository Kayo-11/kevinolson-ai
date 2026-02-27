import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
let initAttempted = false;

export function getSupabase(): SupabaseClient | null {
  if (!initAttempted) {
    initAttempted = true;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      client = createClient(url, key);
    }
  }
  return client;
}
