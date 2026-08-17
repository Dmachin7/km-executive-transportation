import { getServerSupabase } from './supabase-server'

// Resolves the logged-in admin's profile, or null if there is no session or
// the session belongs to a non-admin account. Callers must treat null as
// "reject the request" — never fall back to trusting the request body.
export async function getAdminProfile() {
  const supabase = getServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (!profile || profile.account_type !== 'admin') return null

  return profile
}
