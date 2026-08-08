'use client'

import { useState } from 'react'
import Link from 'next/link'
import StepIndicator from '@/components/booking/StepIndicator'
import Step1YourInfo, { isStep1Valid } from '@/components/booking/Step1YourInfo'
import Step2SelectService, { isStep2Valid } from '@/components/booking/Step2SelectService'
import Step3TripDetails, { isStep3Valid } from '@/components/booking/Step3TripDetails'
import Step4AddOns from '@/components/booking/Step4AddOns'
import Step5Review from '@/components/booking/Step5Review'
import Step6Payment from '@/components/booking/Step6Payment'
import Confirmation from '@/components/booking/Confirmation'
import { BookingState, EMPTY_BOOKING_STATE } from '@/components/booking/types'

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState<BookingState>(EMPTY_BOOKING_STATE)
  const [confirmedBookingNumber, setConfirmedBookingNumber] = useState<string | null>(null)

  const update = (patch: Partial<BookingState>) => setState((prev) => ({ ...prev, ...patch }))

  const canProceed =
    (step === 1 && isStep1Valid(state)) ||
    (step === 2 && isStep2Valid(state)) ||
    (step === 3 && isStep3Valid(state)) ||
    step === 4 ||
    step === 5

  return (
    <main className="min-h-screen bg-km-black py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-4">
          <Link href="/" className="inline-block mb-8 text-white/40 hover:text-km-gold text-xs tracking-luxury uppercase transition-colors">
            ← Back to Home
          </Link>
          <span className="gold-line mx-auto" />
          <p className="eyebrow mb-3">Reserve Your Ride</p>
          <h1 className="font-playfair text-3xl sm:text-4xl text-white tracking-[0.03em]">
            Book Your <span className="text-km-gold italic">Executive Ride</span>
          </h1>
        </div>

        {!confirmedBookingNumber && <StepIndicator current={step} />}

        <div className="bg-km-darker border border-white/5 p-6 sm:p-10 lg:p-14">
          {confirmedBookingNumber ? (
            <Confirmation bookingNumber={confirmedBookingNumber} state={state} />
          ) : (
            <>
              {step === 1 && <Step1YourInfo state={state} update={update} />}
              {step === 2 && <Step2SelectService state={state} update={update} />}
              {step === 3 && <Step3TripDetails state={state} update={update} />}
              {step === 4 && <Step4AddOns state={state} update={update} />}
              {step === 5 && <Step5Review state={state} update={update} />}
              {step === 6 && <Step6Payment state={state} onSuccess={setConfirmedBookingNumber} />}

              {/* Nav buttons */}
              {step < 6 && (
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className={`text-xs tracking-luxury uppercase font-semibold text-white/40 hover:text-km-gold transition-colors ${
                      step === 1 ? 'invisible' : ''
                    }`}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={!canProceed}
                    onClick={() => setStep((s) => Math.min(6, s + 1))}
                    className="btn-gold disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {step === 5 ? 'Proceed to Payment' : 'Continue'} →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
