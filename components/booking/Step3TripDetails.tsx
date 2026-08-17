'use client'

import { useEffect, useState } from 'react'
import { BookingState, MILEAGE_SERVICES, HOURLY_SERVICES } from './types'
import { isLongDistanceReclassified } from '@/lib/pricing'
import AddressAutocompleteInput from './AddressAutocompleteInput'
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'

const PASSENGER_OPTIONS = ['1', '2', '3', '4', '5', '6', '7']

interface Props {
  state: BookingState
  update: (patch: Partial<BookingState>) => void
}

export default function Step3TripDetails({ state, update }: Props) {
  const isMileage = state.serviceType && MILEAGE_SERVICES.includes(state.serviceType)
  const isHourly = state.serviceType && HOURLY_SERVICES.includes(state.serviceType)

  const [distanceLoading, setDistanceLoading] = useState(false)
  const [distanceError, setDistanceError] = useState<string | null>(null)
  const [isDemoDistance, setIsDemoDistance] = useState(false)
  const [airportSwitchNotice, setAirportSwitchNotice] = useState<string | null>(null)

  const handleAirportDetected = () => {
    if (state.serviceType && state.serviceType !== 'airport' && MILEAGE_SERVICES.includes(state.serviceType)) {
      update({ serviceType: 'airport' })
      setAirportSwitchNotice('We switched this to Airport Transportation since an airport was entered as your pickup or dropoff.')
    }
  }

  useEffect(() => {
    if (!isMileage || !state.pickupAddress.trim() || !state.dropoffAddress.trim()) return

    const timeout = setTimeout(async () => {
      setDistanceLoading(true)
      setDistanceError(null)
      try {
        const res = await fetch('/api/maps/distance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin: state.pickupAddress, destination: state.dropoffAddress }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        update({ distanceMiles: data.distanceMiles, durationMinutes: data.durationMinutes })
        setIsDemoDistance(!!data.demo)
      } catch {
        setDistanceError("Couldn't calculate distance — you can still continue, we'll confirm before your ride.")
      } finally {
        setDistanceLoading(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 600)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pickupAddress, state.dropoffAddress, isMileage])

  return (
    <div>
      <h2 className="font-playfair text-xl sm:text-3xl text-white tracking-[0.02em] mb-1 sm:mb-2">
        Trip <span className="text-km-gold italic">Details</span>
      </h2>
      <p className="text-white/45 text-sm mb-4 sm:mb-10">Tell us where and when.</p>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="form-label" htmlFor="pickupAddress">
            Pickup Address <span className="text-km-gold">*</span>
          </label>
          <AddressAutocompleteInput
            id="pickupAddress"
            placeholder={state.serviceType === 'airport' ? 'Address or airport code' : 'Enter pickup address'}
            value={state.pickupAddress}
            onChange={(v) => update({ pickupAddress: v })}
            onPlaceSelected={(place) => {
              update({
                pickupAddress: place.address,
                pickupPlaceId: place.placeId,
                pickupLat: place.lat,
                pickupLng: place.lng,
              })
              if (place.isAirport) handleAirportDetected()
            }}
          />
        </div>

        {isMileage && (
          <div>
            <label className="form-label" htmlFor="dropoffAddress">
              Dropoff Address <span className="text-km-gold">*</span>
            </label>
            <AddressAutocompleteInput
              id="dropoffAddress"
              placeholder="Address or destination"
              value={state.dropoffAddress}
              onChange={(v) => update({ dropoffAddress: v })}
              onPlaceSelected={(place) => {
                update({
                  dropoffAddress: place.address,
                  dropoffPlaceId: place.placeId,
                  dropoffLat: place.lat,
                  dropoffLng: place.lng,
                })
                if (place.isAirport) handleAirportDetected()
              }}
            />
            {airportSwitchNotice && (
              <div className="mt-3 bg-km-gold/10 border border-km-gold/30 text-km-gold px-4 py-3 text-xs sm:text-sm rounded-sm">
                ✈️ {airportSwitchNotice}
              </div>
            )}
            {distanceLoading && <p className="text-white/40 text-xs mt-2">Calculating distance…</p>}
            {!distanceLoading && state.distanceMiles !== null && (
              <p className="text-km-gold text-xs mt-2">
                Estimated driving distance: {state.distanceMiles} miles (~{state.durationMinutes} minutes)
                {isDemoDistance && <span className="text-white/30"> — demo estimate, connect Google Maps for live data</span>}
              </p>
            )}
            {!distanceLoading && distanceError && <p className="text-white/40 text-xs mt-2">{distanceError}</p>}

            {!distanceLoading && isLongDistanceReclassified(state.serviceType!, state.durationMinutes || undefined) && (
              <div className="mt-3 sm:mt-4 bg-km-gold text-black px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm rounded-sm font-medium">
                ⚠️ This trip has been classified as Long Distance (45+ min drive) and will be billed at $6/mile instead of
                $5/mile.
              </div>
            )}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="form-label" htmlFor="pickupDate">
              {isHourly ? 'Start Date' : 'Pickup Date'} <span className="text-km-gold">*</span>
            </label>
            <DatePicker id="pickupDate" value={state.pickupDate} onChange={(v) => update({ pickupDate: v })} />
          </div>
          <div>
            <label className="form-label" htmlFor="pickupTime">
              {isHourly ? 'Start Time' : 'Pickup Time'} <span className="text-km-gold">*</span>
            </label>
            <TimePicker id="pickupTime" value={state.pickupTime} onChange={(v) => update({ pickupTime: v })} />
          </div>
        </div>

        {isMileage && (
          <div>
            <button
              type="button"
              onClick={() => update({ isRoundTrip: !state.isRoundTrip })}
              className={`px-6 py-3 text-xs font-bold tracking-luxury uppercase border transition-all duration-200 ${
                state.isRoundTrip ? 'bg-km-gold text-black border-km-gold' : 'bg-transparent text-white/50 border-white/15 hover:border-km-gold/40'
              }`}
              aria-pressed={state.isRoundTrip}
            >
              {state.isRoundTrip ? '✓ Round Trip' : 'Round Trip'}
            </button>
            {state.isRoundTrip && (
              <div className="mt-3 sm:mt-5 max-w-xs">
                <label className="form-label" htmlFor="returnTime">
                  Return Time
                </label>
                <TimePicker id="returnTime" value={state.returnTime} onChange={(v) => update({ returnTime: v })} />
                <p className="text-km-gold/80 text-xs mt-2 sm:mt-3">Round trip discount: -$10 applied</p>
              </div>
            )}
          </div>
        )}

        {isHourly && (
          <div>
            <label className="form-label">
              Number of Hours <span className="text-km-gold">*</span>
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => update({ hoursRequested: Math.max(2, state.hoursRequested - 0.5) })}
                className="w-10 h-10 flex items-center justify-center border border-white/15 text-white/60 hover:border-km-gold hover:text-km-gold transition-colors"
                aria-label="Decrease hours"
              >
                −
              </button>
              <span className="font-playfair text-2xl text-white w-16 text-center">{state.hoursRequested}</span>
              <button
                type="button"
                onClick={() => update({ hoursRequested: state.hoursRequested + 0.5 })}
                className="w-10 h-10 flex items-center justify-center border border-white/15 text-white/60 hover:border-km-gold hover:text-km-gold transition-colors"
                aria-label="Increase hours"
              >
                +
              </button>
              <span className="text-white/40 text-xs">2-hour minimum</span>
            </div>
          </div>
        )}

        <div className="max-w-xs">
          <label className="form-label" htmlFor="passengers">
            Passenger Count <span className="text-km-gold">*</span>
          </label>
          <select
            id="passengers"
            className="form-input"
            value={state.passengerCount}
            onChange={(e) => update({ passengerCount: e.target.value })}
          >
            {PASSENGER_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} passenger{n !== '1' ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export function isStep3Valid(state: BookingState) {
  const isMileage = state.serviceType && MILEAGE_SERVICES.includes(state.serviceType)
  const base = state.pickupAddress.trim().length > 0 && state.pickupDate.length > 0 && state.pickupTime.length > 0
  if (isMileage) return base && state.dropoffAddress.trim().length > 0
  return base
}
