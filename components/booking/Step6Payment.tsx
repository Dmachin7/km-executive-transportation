'use client'

import { useEffect, useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { getStripePromise } from '@/lib/stripe-client'
import { calculatePrice, getDepositAmount } from '@/lib/pricing'
import { BookingState, gratuityPct, pickupDatetimeISO } from './types'

interface Props {
  state: BookingState
  onSuccess: (bookingNumber: string) => void
}

function CheckoutForm({
  amount,
  onSuccess,
  bookingId,
  bookingNumber,
  paymentType,
}: {
  amount: number
  onSuccess: (n: string) => void
  bookingId: string
  bookingNumber: string
  paymentType: 'full' | 'deposit'
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setError(null)

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message || 'Payment failed. Please check your card details and try again.')
      setSubmitting(false)
      return
    }

    // Persist the payment method + payment status now that Stripe has
    // confirmed the charge (automatic capture — no manual capture step).
    const paymentMethodId =
      typeof paymentIntent?.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent?.payment_method?.id

    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        depositPaymentIntentId: paymentIntent?.id,
        savedPaymentMethodId: paymentMethodId,
        paymentType,
      }),
    })

    onSuccess(bookingNumber)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-km-dark border border-white/10 p-6">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button type="submit" disabled={!stripe || submitting} className="btn-gold w-full text-center disabled:opacity-50">
        {submitting ? 'Processing…' : `Complete Booking — $${amount.toFixed(2)}`}
      </button>

      <p className="text-white/30 text-xs text-center leading-relaxed">
        By completing this booking you agree to our cancellation policy. Refunds are available up to 24 hours before your scheduled pickup time.
      </p>
    </form>
  )
}

export default function Step6Payment({ state, onSuccess }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [bookingNumber, setBookingNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isoDatetime = pickupDatetimeISO(state)!
  const pricing = calculatePrice({
    serviceType: state.serviceType!,
    distanceMiles: state.distanceMiles || 0,
    durationMinutes: state.durationMinutes || undefined,
    hoursRequested: state.hoursRequested,
    isRoundTrip: state.isRoundTrip,
    addonMeetGreet: state.addonMeetGreet,
    addonExtraStop: state.addonExtraStop,
    pickupDatetime: new Date(isoDatetime),
    gratuityPct: gratuityPct(state),
  })
  const amount = state.paymentType === 'deposit' ? getDepositAmount(pricing.total) : pricing.total

  useEffect(() => {
    let cancelled = false

    async function createBookingAndIntent() {
      try {
        const bookingRes = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: `${state.firstName} ${state.lastName}`,
            customerEmail: state.email,
            customerPhone: state.phone,
            serviceType: state.serviceType,
            pickupAddress: state.pickupAddress,
            dropoffAddress: state.dropoffAddress || null,
            pickupDatetime: isoDatetime,
            distanceMiles: state.distanceMiles,
            durationMinutes: state.durationMinutes,
            hoursRequested: state.hoursRequested,
            isRoundTrip: state.isRoundTrip,
            isCashPayment: state.isCashPayment,
            specialRequests: state.specialRequests,
            passengerCount: Number(state.passengerCount),
            addonMeetGreet: state.addonMeetGreet,
            addonExtraStop: state.addonExtraStop,
            gratuityPct: gratuityPct(state),
            paymentType: state.paymentType,
          }),
        })
        if (!bookingRes.ok) throw new Error('Could not create booking')
        const { booking } = await bookingRes.json()
        if (cancelled) return
        setBookingId(booking.id)
        setBookingNumber(booking.booking_number)

        const intentRes = await fetch('/api/stripe/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: booking.id }),
        })
        if (!intentRes.ok) throw new Error('Could not initialize payment')
        const { clientSecret } = await intentRes.json()
        if (cancelled) return
        setClientSecret(clientSecret)
      } catch (err) {
        if (!cancelled) setError('Something went wrong setting up payment. Please try again.')
      }
    }

    createBookingAndIntent()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h2 className="font-playfair text-2xl sm:text-3xl text-white tracking-[0.02em] mb-2">
        Payment
      </h2>
      <p className="text-white/45 text-sm mb-2">
        {state.paymentType === 'deposit' ? 'Deposit' : 'Full payment'} due now
      </p>
      <p className="font-playfair text-3xl text-km-gold mb-10">${amount.toFixed(2)}</p>

      {error && <p className="text-red-400 text-sm mb-6">{error}</p>}

      {!clientSecret && !error && <p className="text-white/40 text-sm">Preparing secure payment…</p>}

      {clientSecret && bookingId && bookingNumber && (
        <Elements
          stripe={getStripePromise()}
          options={{
            clientSecret,
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#C9A84C',
                colorBackground: '#0D0D0D',
                colorText: '#ffffff',
                colorDanger: '#f87171',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                borderRadius: '0px',
              },
            },
          }}
        >
          <CheckoutForm
            amount={amount}
            onSuccess={onSuccess}
            bookingId={bookingId}
            bookingNumber={bookingNumber}
            paymentType={state.paymentType}
          />
        </Elements>
      )}
    </div>
  )
}
