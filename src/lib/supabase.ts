import { createClient } from "@supabase/supabase-js";

/* ═══════════════════════════════════════════════════════════════════
   Supabase Client — Fragua Systems CRM
   
   Two clients:
   - supabase (anon): for client-side operations
   - supabaseAdmin (service_role): for server-side operations
   ═══════════════════════════════════════════════════════════════════ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side (anon) — respects RLS policies
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (service_role) — bypasses RLS for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);