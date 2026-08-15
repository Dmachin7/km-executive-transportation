'use client'

import { useEffect, useRef } from 'react'
import { loadGoogleMapsPlaces } from '@/lib/google-maps-loader'

export interface PlaceResult {
  address: string
  placeId: string | null
  lat: number | null
  lng: number | null
}

interface Props {
  id: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onPlaceSelected: (place: PlaceResult) => void
}

// Tampa Bay bounding box — biases (doesn't restrict) suggestions toward the
// service area without blocking a customer typing an out-of-area address.
const TAMPA_BAY_BOUNDS = {
  north: 28.2,
  south: 27.6,
  east: -82.3,
  west: -82.9,
}

export default function AddressAutocompleteInput({ id, placeholder, value, onChange, onPlaceSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false

    loadGoogleMapsPlaces()
      .then(() => {
        if (cancelled || !inputRef.current || autocompleteRef.current) return

        const google = (window as any).google
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'place_id', 'geometry'],
          componentRestrictions: { country: 'us' },
          bounds: TAMPA_BAY_BOUNDS,
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          const address = place.formatted_address || inputRef.current?.value || ''
          onChange(address)
          onPlaceSelected({
            address,
            placeId: place.place_id || null,
            lat: place.geometry?.location?.lat() ?? null,
            lng: place.geometry?.location?.lng() ?? null,
          })
        })

        autocompleteRef.current = autocomplete
      })
      .catch((err) => {
        console.error('Google Places Autocomplete failed to load:', err)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      className="form-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
    />
  )
}
