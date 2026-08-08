export interface PricingInput {
  serviceType: 'everyday' | 'airport' | 'long_distance' | 'chauffeur' | 'event'
  distanceMiles?: number
  durationMinutes?: number
  hoursRequested?: number
  isRoundTrip: boolean
  addonMeetGreet: boolean
  addonExtraStop: boolean
  pickupDatetime: Date
  gratuityPct: number
  businessDiscountPct?: number
  birthdayDiscountPct?: number
}

export interface PricingResult {
  basePrice: number
  lateNightFee: number
  addonTotal: number
  roundTripDiscount: number
  loyaltyDiscount: number
  gratuityAmount: number
  subtotal: number
  total: number
  isLateNight: boolean
  wasReclassified: boolean
  originalServiceType: string
  breakdown: Array<{
    label: string
    amount: number
    type: 'charge' | 'discount'
  }>
}

// Trip duration threshold (minutes) beyond which an "everyday" trip is
// auto-billed as long_distance, regardless of what the customer selected.
const LONG_DISTANCE_DURATION_THRESHOLD = 45

export function isLongDistanceReclassified(
  serviceType: PricingInput['serviceType'],
  durationMinutes?: number
): boolean {
  return serviceType === 'everyday' && (durationMinutes || 0) > LONG_DISTANCE_DURATION_THRESHOLD
}

const MILEAGE_SERVICE_TYPES = ['everyday', 'airport', 'long_distance'] as const
const HOURLY_SERVICE_TYPES = ['chauffeur', 'event'] as const

const RATES = {
  everyday:      { perMile: 5, min: 40 },
  airport:       { perMile: 5, min: 50 },
  long_distance: { perMile: 6, min: 50 },
  chauffeur:     { perHour: 100, minHours: 2 },
  event:         { perHour: 100, minHours: 2 },
}

// Deposit: 25% confirmed by client
export const DEPOSIT_PCT = 0.25
export function getDepositAmount(total: number) {
  return Math.round(total * DEPOSIT_PCT * 100) / 100
}

// Birthday discount: 15% confirmed by client
export const BIRTHDAY_DISCOUNT_PCT = 0.15

export function calculatePrice(input: PricingInput): PricingResult {
  const breakdown: PricingResult['breakdown'] = []
  let basePrice = 0

  // Auto-reclassify to long_distance if trip duration exceeds 45 minutes
  const wasReclassified = isLongDistanceReclassified(input.serviceType, input.durationMinutes)
  const effectiveServiceType = wasReclassified ? 'long_distance' : input.serviceType

  // Mileage-based. Round trip charges for both legs (base price × 2), then
  // the flat $10 round-trip discount is applied later against the doubled
  // total — confirmed with Daniel: 10mi everyday round trip = $50 + $50 − $10 = $90.
  if ((MILEAGE_SERVICE_TYPES as readonly string[]).includes(effectiveServiceType)) {
    const rate = RATES[effectiveServiceType as (typeof MILEAGE_SERVICE_TYPES)[number]]
    const miles = input.distanceMiles || 0
    const calculated = miles * rate.perMile
    const oneWay = Math.max(rate.min, calculated)
    basePrice = input.isRoundTrip ? oneWay * 2 : oneWay

    breakdown.push({
      label: `${miles.toFixed(1)} miles × $${rate.perMile}/mile (min $${rate.min})${
        input.isRoundTrip ? ' × 2 (round trip)' : ''
      }`,
      amount: basePrice,
      type: 'charge',
    })
  }

  // Hourly-based
  if ((HOURLY_SERVICE_TYPES as readonly string[]).includes(effectiveServiceType)) {
    const rate = RATES[effectiveServiceType as (typeof HOURLY_SERVICE_TYPES)[number]]
    const hours = Math.max(rate.minHours, input.hoursRequested || rate.minHours)
    basePrice = hours * rate.perHour
    breakdown.push({
      label: `${hours} hours × $${rate.perHour}/hr`,
      amount: basePrice,
      type: 'charge',
    })
  }

  // Late night detection
  const hour = new Date(input.pickupDatetime).getHours()
  const isLateNight = hour >= 22 || hour < 6
  let lateNightFee = 0
  if (isLateNight) {
    lateNightFee = basePrice * 0.15
    breakdown.push({
      label: 'Late Night Rate (10PM–6AM +15%)',
      amount: lateNightFee,
      type: 'charge',
    })
  }

  // Add-ons
  let addonTotal = 0
  if (input.addonMeetGreet) {
    addonTotal += 25
    breakdown.push({ label: 'Meet & Greet Service', amount: 25, type: 'charge' })
  }
  if (input.addonExtraStop) {
    addonTotal += 15
    breakdown.push({ label: 'Additional Stop', amount: 15, type: 'charge' })
  }

  // Round trip discount (applied against the already-doubled base price)
  let roundTripDiscount = 0
  if (input.isRoundTrip) {
    roundTripDiscount = 10
    breakdown.push({ label: 'Round Trip Discount', amount: -10, type: 'discount' })
  }

  // Business/loyalty discount
  let loyaltyDiscount = 0
  const discountPct = input.businessDiscountPct || input.birthdayDiscountPct || 0
  if (discountPct > 0) {
    const base = basePrice + lateNightFee + addonTotal - roundTripDiscount
    loyaltyDiscount = base * (discountPct / 100)
    breakdown.push({
      label: `Discount (${discountPct}%)`,
      amount: -loyaltyDiscount,
      type: 'discount',
    })
  }

  const subtotal = basePrice + lateNightFee + addonTotal - roundTripDiscount - loyaltyDiscount

  let gratuityAmount = 0
  if (input.gratuityPct > 0) {
    gratuityAmount = subtotal * (input.gratuityPct / 100)
    breakdown.push({
      label: `Gratuity (${input.gratuityPct}%)`,
      amount: gratuityAmount,
      type: 'charge',
    })
  }

  const total = subtotal + gratuityAmount

  return {
    basePrice,
    lateNightFee,
    addonTotal,
    roundTripDiscount,
    loyaltyDiscount,
    gratuityAmount,
    subtotal,
    total,
    isLateNight,
    wasReclassified,
    originalServiceType: input.serviceType,
    breakdown,
  }
}
