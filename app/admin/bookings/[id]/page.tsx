import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSupabase } from '@/lib/supabase-server'
import { formatCurrency, formatDateTime, SERVICE_LABELS, STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/format'
import StatusBadge from '@/components/admin/StatusBadge'
import BookingActions from '@/components/admin/BookingActions'

export const dynamic = 'force-dynamic'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-white/35 text-[11px] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white/85 text-sm">{value}</p>
    </div>
  )
}

export default async function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServerSupabase()
  const { data: booking } = await supabase.from('bookings').select('*').eq('id', params.id).single()

  if (!booking) notFound()

  const balanceDue = Number(booking.balance_due) || 0
  const canChargeBalance = booking.payment_type === 'deposit' && balanceDue > 0 && !!booking.saved_payment_method_id

  return (
    <div>
      <Link href="/admin" className="text-white/40 hover:text-km-gold text-xs tracking-luxury uppercase transition-colors">
        ← All Bookings
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4 mt-4 mb-8">
        <h1 className="font-playfair text-2xl sm:text-3xl text-white tracking-[0.02em]">{booking.booking_number}</h1>
        <div className="flex gap-2">
          <StatusBadge value={booking.status} label={STATUS_LABELS[booking.status] || booking.status} />
          <StatusBadge value={booking.payment_status} label={PAYMENT_STATUS_LABELS[booking.payment_status] || booking.payment_status} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-km-darker border border-white/5 p-5 sm:p-6">
            <h2 className="font-playfair text-lg text-white mb-4">Customer</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Name" value={booking.customer_name} />
              <Field label="Email" value={<a href={`mailto:${booking.customer_email}`} className="hover:text-km-gold">{booking.customer_email}</a>} />
              <Field label="Phone" value={<a href={`tel:${booking.customer_phone}`} className="hover:text-km-gold">{booking.customer_phone}</a>} />
            </div>
          </section>

          <section className="bg-km-darker border border-white/5 p-5 sm:p-6">
            <h2 className="font-playfair text-lg text-white mb-4">Trip</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Service" value={SERVICE_LABELS[booking.service_type] || booking.service_type} />
              <Field label="Pickup Date/Time" value={formatDateTime(booking.pickup_datetime)} />
              <Field label="Pickup Address" value={booking.pickup_address} />
              {booking.dropoff_address && <Field label="Dropoff Address" value={booking.dropoff_address} />}
              {booking.distance_miles != null && <Field label="Distance" value={`${booking.distance_miles} miles`} />}
              {booking.hours_requested != null && <Field label="Hours" value={booking.hours_requested} />}
              <Field label="Round Trip" value={booking.is_round_trip ? 'Yes' : 'No'} />
              <Field label="Passengers" value={booking.passenger_count} />
              <Field label="Cash Payment" value={booking.is_cash_payment ? 'Yes' : 'No'} />
            </div>
            {(booking.addon_meet_greet || booking.addon_extra_stop || booking.addon_late_night) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {booking.addon_meet_greet && <span className="text-km-gold text-xs border border-km-gold/30 px-2 py-1">Meet & Greet</span>}
                {booking.addon_extra_stop && <span className="text-km-gold text-xs border border-km-gold/30 px-2 py-1">Extra Stop</span>}
                {booking.addon_late_night && <span className="text-km-gold text-xs border border-km-gold/30 px-2 py-1">Late Night</span>}
              </div>
            )}
            {booking.special_requests && (
              <div className="mt-4">
                <p className="text-white/35 text-[11px] uppercase tracking-wider mb-1">Special Requests</p>
                <p className="text-white/70 text-sm leading-relaxed">{booking.special_requests}</p>
              </div>
            )}
          </section>

          <section className="bg-km-darker border border-white/5 p-5 sm:p-6">
            <h2 className="font-playfair text-lg text-white mb-4">Pricing</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Base price</span>
                <span>{formatCurrency(booking.base_price)}</span>
              </div>
              {Number(booking.addon_total) > 0 && (
                <div className="flex justify-between text-white/60">
                  <span>Add-ons</span>
                  <span>{formatCurrency(booking.addon_total)}</span>
                </div>
              )}
              {Number(booking.round_trip_discount) > 0 && (
                <div className="flex justify-between text-white/60">
                  <span>Round trip discount</span>
                  <span>-{formatCurrency(booking.round_trip_discount)}</span>
                </div>
              )}
              {Number(booking.loyalty_discount) > 0 && (
                <div className="flex justify-between text-white/60">
                  <span>Loyalty discount</span>
                  <span>-{formatCurrency(booking.loyalty_discount)}</span>
                </div>
              )}
              {Number(booking.gratuity_amount) > 0 && (
                <div className="flex justify-between text-white/60">
                  <span>Gratuity ({booking.gratuity_pct}%)</span>
                  <span>{formatCurrency(booking.gratuity_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-semibold pt-2 border-t border-white/10">
                <span>Total</span>
                <span>{formatCurrency(booking.total_price)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Amount Paid</span>
                <span>{formatCurrency(booking.amount_paid)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Balance Due</span>
                <span>{formatCurrency(booking.balance_due)}</span>
              </div>
            </div>
          </section>
        </div>

        <div>
          <BookingActions
            bookingId={booking.id}
            currentStatus={booking.status}
            canChargeBalance={canChargeBalance}
            balanceDue={balanceDue}
          />
        </div>
      </div>
    </div>
  )
}
