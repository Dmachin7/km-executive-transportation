'use client'

import { useRouter } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase-browser'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = getBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-xs tracking-luxury uppercase font-semibold text-white/40 hover:text-km-gold transition-colors"
    >
      Sign Out
    </button>
  )
}
