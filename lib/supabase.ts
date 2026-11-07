import { createClient } from "@supabase/supabase-js";

// Cliente del lado del cliente (browser) — usa la clave anon pública
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
