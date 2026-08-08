import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

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

  return NextResponse.json({ booking })
}
