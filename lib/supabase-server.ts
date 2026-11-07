import { createClient } from "@supabase/supabase-js";

// Cliente del lado del servidor — usa la service role key (solo en API routes)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
