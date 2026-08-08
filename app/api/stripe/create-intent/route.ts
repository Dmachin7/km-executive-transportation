import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const { bookingId } = await req.json()

  if (!bookingId) {
    return NextResponse.json({ error: 'bookingId is required' }, { status: 400 })
  }

  const supabase = getServiceSupabase()
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const amount = booking.payment_type === 'deposit' ? booking.deposit_amount : booking.total_price
  const amountInCents = Math.round(Number(amount) * 100)

  const stripe = getStripe()

  let stripeCustomerId = booking.stripe_customer_id as string | null
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      name: booking.customer_name,
      email: booking.customer_email,
      phone: booking.customer_phone,
    })
    stripeCustomerId = customer.id
  }

  // Full payment: standard automatic-capture PaymentIntent, charged immediately.
  // Deposit: same, but with setup_future_usage so the card can be charged
  // again off-session for the remaining balance on ride day.
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    customer: stripeCustomerId,
    ...(booking.payment_type === 'deposit' ? { setup_future_usage: 'off_session' as const } : {}),
    metadata: {
      booking_number: booking.booking_number,
      service_type: booking.service_type,
      pickup_datetime: booking.pickup_datetime,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
    },
  })

  // The initial charge — whether full payment or deposit — is stored in
  // deposit_payment_intent_id. balance_payment_intent_id is reserved for the
  // later top-up charge on deposit bookings only.
  await supabase
    .from('bookings')
    .update({
      deposit_payment_intent_id: paymentIntent.id,
      stripe_customer_id: stripeCustomerId,
    })
    .eq('id', bookingId)

  return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id })
}
