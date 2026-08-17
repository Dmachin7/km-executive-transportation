import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// For use inside Server Components, Route Handlers, and Server Actions —
// reads/writes the session cookie so RLS policies see the logged-in user.
export function getServerSupabase() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component that can't set cookies — safe to
            // ignore since middleware refreshes the session on every request.
          }
        },
      },
    }
  )
}
