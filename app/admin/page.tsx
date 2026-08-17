import Link from 'next/link'
import { getServerSupabase } from '@/lib/supabase-server'
import { formatCurrency, formatDateTime, SERVICE_LABELS, STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/format'
import StatusBadge from '@/components/admin/StatusBadge'

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const activeFilter = STATUS_FILTERS.includes(searchParams.status as any) ? searchParams.status! : 'all'

  const supabase = getServerSupabase()
  let query = supabase.from('bookings').select('*').order('pickup_datetime', { ascending: true })
  if (activeFilter !== 'all') query = query.eq('status', activeFilter)

  const { data: bookings, error } = await query

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <h1 className="font-playfair text-2xl sm:text-3xl text-white tracking-[0.02em]">
          Bookings
        </h1>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <Link
              key={s}
              href={s === 'all' ? '/admin' : `/admin?status=${s}`}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${
                activeFilter === s
                  ? 'bg-km-gold text-black border-km-gold font-semibold'
                  : 'text-white/50 border-white/15 hover:border-km-gold/40'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
            </Link>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">Failed to load bookings: {error.message}</p>}

      {!error && bookings?.length === 0 && (
        <p className="text-white/40 text-sm">No bookings found.</p>
      )}

      {!error && bookings && bookings.length > 0 && (
        <div className="border border-white/5 overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-white/5 text-left text-white/40 text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Booking</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Pickup</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="text-km-gold hover:text-km-gold-lt font-medium">
                      {b.booking_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white/80">{b.customer_name}</td>
                  <td className="px-4 py-3 text-white/60">{SERVICE_LABELS[b.service_type] || b.service_type}</td>
                  <td className="px-4 py-3 text-white/60">{formatDateTime(b.pickup_datetime)}</td>
                  <td className="px-4 py-3 text-white/80">{formatCurrency(b.total_price)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={b.payment_status} label={PAYMENT_STATUS_LABELS[b.payment_status] || b.payment_status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={b.status} label={STATUS_LABELS[b.status] || b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
