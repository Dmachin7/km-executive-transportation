import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminProfile } from '@/lib/admin-auth'
import SignOutButton from '@/components/admin/SignOutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAdminProfile()
  if (!profile) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-km-black">
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-playfair text-lg text-white tracking-[0.02em]">
            KM <span className="text-km-gold italic">Admin</span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-white/40 text-xs hidden sm:inline">{profile.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">{children}</main>
    </div>
  )
}
