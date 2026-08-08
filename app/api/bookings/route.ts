import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { calculatePrice, getDepositAmount, PricingInput } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    profileId,
    customerName,
    customerEmail,
    customerPhone,
    serviceType,
    pickupAddress,
    pickupLat,
    pickupLng,
    dropoffAddress,
    dropoffLat,
    dropoffLng,
    pickupDatetime,
    distanceMiles,
    durationMinutes,
    hoursRequested,
    isRoundTrip,
    isCashPayment,
    specialRequests,
    passengerCount,
    addonMeetGreet,
    addonExtraStop,
    gratuityPct,
    paymentType,
  } = body

  if (!customerName || !customerEmail || !customerPhone || !serviceType || !pickupAddress || !pickupDatetime) {
    return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
  }

  // Recompute pricing server-side from raw trip inputs — never trust a
  // client-submitted total, since that would let a request tamper with the
  // charge amount.
  const pricingInput: PricingInput = {
    serviceType,
    distanceMiles,
    durationMinutes,
    hoursRequested,
    isRoundTrip: !!isRoundTrip,
    addonMeetGreet: !!addonMeetGreet,
    addonExtraStop: !!addonExtraStop,
    pickupDatetime: new Date(pickupDatetime),
    gratuityPct: gratuityPct || 0,
  }
  const pricing = calculatePrice(pricingInput)
  const depositAmount = paymentType === 'deposit' ? getDepositAmount(pricing.total) : null

  const supabase = getServiceSupabase()

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      profile_id: profileId || null,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      // Persisted service_type reflects what's actually billed — if a
      // 45+ minute "everyday" trip got auto-reclassified, the row is
      // recorded (and priced) as long_distance, not the original selection.
      service_type: pricing.wasReclassified ? 'long_distance' : serviceType,
      pickup_address: pickupAddress,
      pickup_lat: pickupLat || null,
      pickup_lng: pickupLng || null,
      dropoff_address: dropoffAddress || null,
      dropoff_lat: dropoffLat || null,
      dropoff_lng: dropoffLng || null,
      pickup_datetime: pickupDatetime,
      distance_miles: distanceMiles || null,
      hours_requested: hoursRequested || null,
      is_round_trip: !!isRoundTrip,
      is_cash_payment: !!isCashPayment,
      special_requests: specialRequests || null,
      passenger_count: passengerCount || 1,
      addon_meet_greet: !!addonMeetGreet,
      addon_extra_stop: !!addonExtraStop,
      addon_late_night: pricing.isLateNight,
      gratuity_pct: gratuityPct || 0,
      base_price: pricing.basePrice,
      addon_total: pricing.addonTotal,
      round_trip_discount: pricing.roundTripDiscount,
      loyalty_discount: pricing.loyaltyDiscount,
      gratuity_amount: pricing.gratuityAmount,
      total_price: pricing.total,
      payment_type: paymentType === 'deposit' ? 'deposit' : 'full',
      deposit_amount: depositAmount,
      amount_paid: 0,
      balance_due: pricing.total,
      status: 'pending',
      payment_status: 'unpaid',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ booking, pricing })
}
