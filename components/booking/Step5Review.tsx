import { calculatePrice, getDepositAmount } from '@/lib/pricing'
import { BookingState, gratuityPct, pickupDatetimeISO } from './types'

interface Props {
  state: BookingState
  update: (patch: Partial<BookingState>) => void
}

export default function Step5Review({ state, update }: Props) {
  const isoDatetime = pickupDatetimeISO(state)
  const pricing = calculatePrice({
    serviceType: state.serviceType!,
    distanceMiles: state.distanceMiles || 0,
    durationMinutes: state.durationMinutes || undefined,
    hoursRequested: state.hoursRequested,
    isRoundTrip: state.isRoundTrip,
    addonMeetGreet: state.addonMeetGreet,
    addonExtraStop: state.addonExtraStop,
    pickupDatetime: isoDatetime ? new Date(isoDatetime) : new Date(),
    gratuityPct: gratuityPct(state),
  })
  const depositAmount = getDepositAmount(pricing.total)
  const balanceDue = Math.round((pricing.total - depositAmount) * 100) / 100

  return (
    <div>
      <h2 className="font-playfair text-2xl sm:text-3xl text-white tracking-[0.02em] mb-2">
        Review &amp; <span className="text-km-gold italic">Payment</span>
      </h2>
      <p className="text-white/45 text-sm mb-10">Confirm your trip details and choose how to pay.</p>

      {/* Price breakdown card */}
      <div className="bg-km-dark border border-white/10 p-6 lg:p-8 mb-8">
        <p className="eyebrow text-[9px] mb-5">Price Breakdown</p>
        <div className="space-y-3">
          {pricing.breakdown.map((line, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-white/55">{line.label}</span>
              <span className={line.type === 'discount' ? 'text-km-gold/80' : 'text-white/80'}>
                {line.amount < 0 ? '-' : ''}${Math.abs(line.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-km-gold/30 mt-6 pt-6 flex items-end justify-between">
          <span className="text-white/60 text-sm tracking-luxury uppercase">Total</span>
          <span className="font-playfair text-3xl lg:text-4xl text-km-gold">${pricing.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment option cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        <button
          type="button"
          onClick={() => update({ paymentType: 'full' })}
          className={`text-left p-6 lg:p-7 border transition-all duration-300 ${
            state.paymentType === 'full' ? 'bg-[#0f0d07] border-km-gold' : 'bg-km-dark border-white/5 hover:border-km-gold/30'
          }`}
          aria-pressed={state.paymentType === 'full'}
        >
          <p className="eyebrow text-[9px] mb-3">Pay In Full</p>
          <p className="font-playfair text-2xl text-white mb-4">${pricing.total.toFixed(2)}</p>
          <p className="text-white/55 text-sm mb-2">Complete payment now</p>
          <p className="text-white/35 text-xs leading-relaxed">Fully refundable until 24 hours before your scheduled pickup</p>
        </button>

        <button
          type="button"
          onClick={() => update({ paymentType: 'deposit' })}
          className={`text-left p-6 lg:p-7 border transition-all duration-300 ${
            state.paymentType === 'deposit' ? 'bg-[#0f0d07] border-km-gold' : 'bg-km-dark border-white/5 hover:border-km-gold/30'
          }`}
          aria-pressed={state.paymentType === 'deposit'}
        >
          <p className="eyebrow text-[9px] mb-3">Pay Deposit</p>
          <p className="font-playfair text-2xl text-white mb-4">${depositAmount.toFixed(2)}</p>
          <p className="text-white/55 text-sm mb-2">Charge ${depositAmount.toFixed(2)} now (25% deposit)</p>
          <p className="text-white/35 text-xs leading-relaxed">Deposit refundable until 24 hours before scheduled pickup</p>
        </button>
      </div>

      {state.paymentType === 'deposit' && (
        <div className="mt-6 bg-km-dark border border-km-gold/25 p-6">
          <p className="text-km-gold text-sm font-semibold mb-2">📋 About your remaining balance</p>
          <p className="text-white/55 text-sm leading-relaxed">
            Your remaining balance of ${balanceDue.toFixed(2)} will be charged to your card on file on the day of your
            service, prior to your pickup time. You will receive a receipt when the charge is processed.
          </p>
        </div>
      )}
    </div>
  )
}
