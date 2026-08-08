import { createClient } from '@supabase/supabase-js'

// Server-only client — bypasses RLS via the service role key. Never import
// this from a client component; it is only safe inside API routes/server code.
export function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
