import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { paymentReceiptEmail } from '@/lib/emails'

// TODO: gate this to admin sessions once /auth + middleware exist. There is
// no session/role check yet — this route is not safe to expose publicly
// until that lands.
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (!booking.saved_payment_method_id || !booking.stripe_customer_id) {
    return NextResponse.json({ error: 'No saved payment method on file for this booking' }, { status: 400 })
  }

  const balanceDue = Number(booking.balance_due)
  if (!balanceDue || balanceDue <= 0) {
    return NextResponse.json({ error: 'No remaining balance to charge' }, { status: 400 })
  }

  const stripe = getStripe()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(balanceDue * 100),
    currency: 'usd',
    customer: booking.stripe_customer_id,
    payment_method: booking.saved_payment_method_id,
    confirm: true,
    off_session: true,
    metadata: {
      booking_number: booking.booking_number,
      charge_type: 'remaining_balance',
    },
  })

  const { data: updated, error: updateError } = await supabase
    .from('bookings')
    .update({
      payment_status: 'paid_in_full',
      balance_due: 0,
      amount_paid: booking.total_price,
      balance_charged_at: new Date().toISOString(),
      balance_payment_intent_id: paymentIntent.id,
    })
    .eq('id', params.id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  try {
    const resend = getResend()
    const receipt = paymentReceiptEmail(updated, balanceDue)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: updated.customer_email,
      subject: receipt.subject,
      html: receipt.html,
      text: receipt.text,
    })
  } catch (emailError) {
    console.error('Payment receipt email failed to send:', emailError)
  }

  return NextResponse.json({ success: true, amountCharged: balanceDue, booking: updated })
}
