import Link from 'next/link'
import { buildMonthGrid, toETDateKey, todayETDateKey, MONTH_NAMES } from '@/lib/calendar'
import { formatCurrency } from '@/lib/format'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const DOT_STYLES: Record<string, string> = {
  pending: 'bg-white/40',
  confirmed: 'bg-km-gold',
  completed: 'bg-emerald-400',
  cancelled: 'bg-red-400',
}

interface Props {
  bookings: any[]
  year: number
  month: number // 1-indexed
  status: string
}

function monthLinkHref(year: number, month: number, status: string) {
  const params = new URLSearchParams({ view: 'calendar', year: String(year), month: String(month) })
  if (status !== 'all') params.set('status', status)
  return `/admin?${params.toString()}`
}

export default function BookingCalendar({ bookings, year, month, status }: Props) {
  const cells = buildMonthGrid(year, month)
  const todayKey = todayETDateKey()

  const byDay = new Map<string, any[]>()
  for (const b of bookings) {
    const key = toETDateKey(b.pickup_datetime)
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key)!.push(b)
  }

  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <Link
          href={monthLinkHref(prevYear, prevMonth, status)}
          className="w-9 h-9 flex items-center justify-center text-km-gold hover:text-km-gold-lt border border-white/10 hover:border-km-gold/40 transition-colors"
          aria-label="Previous month"
        >
          ‹
        </Link>
        <p className="font-playfair text-xl text-white tracking-[0.02em]">
          {MONTH_NAMES[month - 1]} <span className="text-km-gold">{year}</span>
        </p>
        <Link
          href={monthLinkHref(nextYear, nextMonth, status)}
          className="w-9 h-9 flex items-center justify-center text-km-gold hover:text-km-gold-lt border border-white/10 hover:border-km-gold/40 transition-colors"
          aria-label="Next month"
        >
          ›
        </Link>
      </div>

      <div className="border border-white/5 overflow-x-auto">
        <div className="grid grid-cols-7 min-w-[720px]">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-white/30 text-[11px] uppercase tracking-wider py-3 border-b border-white/5">
              {w}
            </div>
          ))}

          {cells.map((cell, i) => {
            if (!cell) return <div key={i} className="min-h-[110px] border-b border-r border-white/5 bg-white/[0.01]" />
            const dayBookings = byDay.get(cell.dateKey) || []
            const isToday = cell.dateKey === todayKey
            const visible = dayBookings.slice(0, 3)
            const overflowCount = dayBookings.length - visible.length

            return (
              <div key={i} className="min-h-[110px] border-b border-r border-white/5 p-2 flex flex-col gap-1">
                <span className={`text-xs ${isToday ? 'text-km-gold font-semibold' : 'text-white/40'}`}>{cell.day}</span>
                {visible.map((b) => (
                  <Link
                    key={b.id}
                    href={`/admin/bookings/${b.id}`}
                    className="flex items-center gap-1.5 text-[11px] text-white/70 hover:text-km-gold truncate"
                    title={`${b.booking_number} — ${b.customer_name} — ${formatCurrency(b.total_price)}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_STYLES[b.status] || 'bg-white/40'}`} />
                    <span className="truncate">{b.customer_name}</span>
                  </Link>
                ))}
                {overflowCount > 0 && <span className="text-[10px] text-white/30">+{overflowCount} more</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
