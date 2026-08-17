'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getBrowserSupabase } from '@/lib/supabase-browser'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = getBrowserSupabase()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Invalid email or password.')
      setSubmitting(false)
      return
    }

    router.push(searchParams.get('next') || '/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-km-black flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8 text-white/40 hover:text-km-gold text-xs tracking-luxury uppercase transition-colors">
            ← Back to Home
          </Link>
          <span className="gold-line mx-auto" />
          <p className="eyebrow mb-3">Admin</p>
          <h1 className="font-playfair text-3xl text-white tracking-[0.03em]">
            Sign <span className="text-km-gold italic">In</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-km-darker border border-white/5 p-6 sm:p-8 space-y-5">
          <div>
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-gold w-full text-center disabled:opacity-50">
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
