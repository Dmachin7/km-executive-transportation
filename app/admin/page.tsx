import Link from 'next/link'
import { getServerSupabase } from '@/lib/supabase-server'
import { formatCurrency, formatDateTime, SERVICE_LABELS, STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/format'
import { todayETDateKey } from '@/lib/calendar'
import StatusBadge from '@/components/admin/StatusBadge'
import BookingCalendar from '@/components/admin/BookingCalendar'

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const
const VIEWS = ['list', 'calendar'] as const

export const dynamic = 'force-dynamic'

function viewLinkHref(view: string, status: string) {
  const params = new URLSearchParams()
  if (view !== 'list') params.set('view', view)
  if (status !== 'all') params.set('status', status)
  const qs = params.toString()
  return qs ? `/admin?${qs}` : '/admin'
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { status?: string; view?: string; year?: string; month?: string }
}) {
  const activeFilter = STATUS_FILTERS.includes(searchParams.status as any) ? searchParams.status! : 'all'
  const activeView = VIEWS.includes(searchParams.view as any) ? searchParams.view! : 'list'

  const [todayYear, todayMonth] = todayETDateKey().split('-').map(Number)
  const year = Number(searchParams.year) || todayYear
  const month = Number(searchParams.month) || todayMonth

  const supabase = getServerSupabase()

  let bookings: any[] | null = null
  let error: { message: string } | null = null

  if (activeView === 'calendar') {
    // Pad a day on each side of the calendar month so nothing near a
    // month boundary gets dropped by an Eastern-vs-UTC offset — the exact
    // day bucketing happens client-side in BookingCalendar via toETDateKey.
    const rangeStart = new Date(year, month - 2, 28).toISOString()
    const rangeEnd = new Date(year, month, 2).toISOString()
    let query = supabase
      .from('bookings')
      .select('*')
      .gte('pickup_datetime', rangeStart)
      .lt('pickup_datetime', rangeEnd)
      .order('pickup_datetime', { ascending: true })
    if (activeFilter !== 'all') query = query.eq('status', activeFilter)
    const res = await query
    bookings = res.data
    error = res.error
  } else {
    let query = supabase.from('bookings').select('*').order('pickup_datetime', { ascending: true })
    if (activeFilter !== 'all') query = query.eq('status', activeFilter)
    const res = await query
    bookings = res.data
    error = res.error
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="font-playfair text-2xl sm:text-3xl text-white tracking-[0.02em]">
          Bookings
        </h1>
        <div className="flex gap-1 border border-white/15">
          {VIEWS.map((v) => (
            <Link
              key={v}
              href={viewLinkHref(v, activeFilter)}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                activeView === v ? 'bg-km-gold text-black font-semibold' : 'text-white/50 hover:text-km-gold'
              }`}
            >
              {v === 'list' ? 'List' : 'Calendar'}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s}
            href={
              activeView === 'calendar'
                ? `/admin?view=calendar&year=${year}&month=${month}${s === 'all' ? '' : `&status=${s}`}`
                : viewLinkHref(activeView, s)
            }
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

      {error && <p className="text-red-400 text-sm">Failed to load bookings: {error.message}</p>}

      {!error && activeView === 'calendar' && bookings && (
        <BookingCalendar bookings={bookings} year={year} month={month} status={activeFilter} />
      )}

      {!error && activeView === 'list' && bookings?.length === 0 && (
        <p className="text-white/40 text-sm">No bookings found.</p>
      )}

      {!error && activeView === 'list' && bookings && bookings.length > 0 && (
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
