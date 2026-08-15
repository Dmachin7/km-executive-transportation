export type ServiceType = 'everyday' | 'airport' | 'long_distance' | 'chauffeur' | 'event'
export type GratuityChoice = '0' | '18' | '20' | '22' | 'custom'

export interface BookingState {
  // Step 1
  firstName: string
  lastName: string
  email: string
  phone: string
  saveInfo: boolean

  // Step 2
  serviceType: ServiceType | null

  // Step 3
  pickupAddress: string
  pickupPlaceId: string | null
  pickupLat: number | null
  pickupLng: number | null
  dropoffAddress: string
  dropoffPlaceId: string | null
  dropoffLat: number | null
  dropoffLng: number | null
  pickupDate: string // YYYY-MM-DD
  pickupTime: string // HH:MM 24h
  returnTime: string // HH:MM 24h
  passengerCount: string
  isRoundTrip: boolean
  hoursRequested: number
  distanceMiles: number | null
  durationMinutes: number | null

  // Step 4
  addonMeetGreet: boolean
  addonExtraStop: boolean
  gratuityChoice: GratuityChoice
  gratuityCustom: string
  specialRequests: string
  isCashPayment: boolean

  // Step 5
  paymentType: 'full' | 'deposit'
}

export const MILEAGE_SERVICES: ServiceType[] = ['everyday', 'airport', 'long_distance']
export const HOURLY_SERVICES: ServiceType[] = ['chauffeur', 'event']

export const EMPTY_BOOKING_STATE: BookingState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  saveInfo: false,
  serviceType: null,
  pickupAddress: '',
  pickupPlaceId: null,
  pickupLat: null,
  pickupLng: null,
  dropoffAddress: '',
  dropoffPlaceId: null,
  dropoffLat: null,
  dropoffLng: null,
  pickupDate: '',
  pickupTime: '',
  returnTime: '',
  passengerCount: '1',
  isRoundTrip: false,
  hoursRequested: 2,
  distanceMiles: null,
  durationMinutes: null,
  addonMeetGreet: false,
  addonExtraStop: false,
  gratuityChoice: '0',
  gratuityCustom: '',
  specialRequests: '',
  isCashPayment: false,
  paymentType: 'full',
}

// Demo prefill — service + trip fields pre-filled so the flow (and the
// pricing engine) can be clicked through end-to-end before Google Maps is
// wired up. Harmless once it is: real addresses just overwrite these.
function threeDaysFromNowISODate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  return d.toISOString().slice(0, 10)
}

export const DEFAULT_BOOKING_STATE: BookingState = {
  ...EMPTY_BOOKING_STATE,
  serviceType: 'everyday',
  pickupAddress: 'Tampa International Airport (TPA)',
  dropoffAddress: '400 N Ashley Dr, Tampa, FL',
  pickupDate: threeDaysFromNowISODate(),
  pickupTime: '14:00',
}

export function gratuityPct(state: BookingState): number {
  if (state.gratuityChoice === 'custom') return Number(state.gratuityCustom) || 0
  return Number(state.gratuityChoice)
}

export function pickupDatetimeISO(state: BookingState): string | null {
  if (!state.pickupDate || !state.pickupTime) return null
  return new Date(`${state.pickupDate}T${state.pickupTime}:00`).toISOString()
}
