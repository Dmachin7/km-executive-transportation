import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { bookingConfirmationEmail, adminNewBookingEmail } from '@/lib/emails'

// Records the outcome of the initial (automatic-capture) charge once Stripe
// confirms it client-side. There is no manual capture step anymore — this
// PATCH is what turns a 'pending'/'unpaid' booking into 'confirmed'.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { depositPaymentIntentId, savedPaymentMethodId, paymentType } = await req.json()

  const supabase = getServiceSupabase()

  const { data: existing, error: fetchError } = await supabase
    .from('bookings')
    .select('total_price, deposit_amount')
    .eq('id', params.id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const amountPaid = paymentType === 'deposit' ? Number(existing.deposit_amount) : Number(existing.total_price)
  const balanceDue = paymentType === 'deposit' ? Number(existing.total_price) - Number(existing.deposit_amount) : 0

  const { data: booking, error } = await supabase
    .from('bookings')
    .update({
      deposit_payment_intent_id: depositPaymentIntentId || null,
      saved_payment_method_id: savedPaymentMethodId || null,
      deposit_paid_at: new Date().toISOString(),
      status: 'confirmed',
      payment_status: paymentType === 'deposit' ? 'deposit_paid' : 'paid_in_full',
      amount_paid: amountPaid,
      balance_due: balanceDue,
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Best-effort — a failed email shouldn't fail the booking, which is
  // already confirmed and paid at this point.
  try {
    const resend = getResend()
    const confirmation = bookingConfirmationEmail(booking)
    const adminAlert = adminNewBookingEmail(booking)
    await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: booking.customer_email,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: process.env.ADMIN_EMAIL!,
        subject: adminAlert.subject,
        html: adminAlert.html,
        text: adminAlert.text,
      }),
    ])
  } catch (emailError) {
    console.error('Booking confirmation email failed to send:', emailError)
  }

  return NextResponse.json({ booking })
}
