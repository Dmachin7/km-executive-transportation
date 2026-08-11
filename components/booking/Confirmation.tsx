'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookingState } from './types'

interface Props {
  bookingNumber: string
  state: BookingState
}

export default function Confirmation({ bookingNumber, state }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`text-center py-4 sm:py-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-8 rounded-full border-2 border-km-gold flex items-center justify-center">
        <svg className="w-5 h-5 sm:w-7 sm:h-7 text-km-gold" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline points="4,13 9,18 20,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="font-playfair text-2xl sm:text-4xl text-white mb-2 sm:mb-4">Booking Confirmed!</h2>

      <p className="font-playfair text-xl sm:text-2xl text-km-gold mb-4 sm:mb-8 tracking-[0.03em]">{bookingNumber}</p>

      <div className="max-w-sm mx-auto bg-km-dark border border-white/10 p-4 sm:p-6 text-left mb-4 sm:mb-8 space-y-2">
        <p className="text-white/70 text-sm">
          <span className="text-white/40">Service:</span> {state.serviceType?.replace('_', ' ')}
        </p>
        <p className="text-white/70 text-sm">
          <span className="text-white/40">Pickup:</span> {state.pickupAddress}
        </p>
        <p className="text-white/70 text-sm">
          <span className="text-white/40">Date:</span> {state.pickupDate} at {state.pickupTime}
        </p>
      </div>

      <p className="text-white/45 text-sm mb-4 sm:mb-10">A confirmation email has been sent to {state.email}</p>

      <Link href="/" className="btn-outline inline-block">
        Return Home
      </Link>
    </div>
  )
}
