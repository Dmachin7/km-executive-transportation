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
    // Mobile: locked to the viewport, nothing scrolls except the content
    // pane itself — header, step dots, and nav buttons stay put so the
    // whole flow reads as one screen per step. Desktop reverts to normal
    // page scroll since there's plenty of room.
    <main className="h-[100dvh] sm:h-auto sm:min-h-screen bg-km-black flex flex-col overflow-hidden sm:overflow-visible sm:py-20 lg:py-28">
      <div className="flex flex-col flex-1 min-h-0 sm:flex-none sm:min-h-0 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-10">
        {/* Compact mobile top bar */}
        <div className="flex-shrink-0 flex sm:hidden items-center py-3">
          <Link href="/" className="text-white/50 hover:text-km-gold text-xs tracking-luxury uppercase transition-colors">
            ← Home
          </Link>
        </div>

        {/* Full header, desktop only */}
        <div className="hidden sm:block text-center mb-4 flex-shrink-0">
          <Link href="/" className="inline-block mb-8 text-white/40 hover:text-km-gold text-xs tracking-luxury uppercase transition-colors">
            ← Back to Home
          </Link>
          <span className="gold-line mx-auto" />
          <p className="eyebrow mb-3">Reserve Your Ride</p>
          <h1 className="font-playfair text-3xl sm:text-4xl text-white tracking-[0.03em]">
            Book Your <span className="text-km-gold italic">Executive Ride</span>
          </h1>
        </div>

        {!confirmedBookingNumber && (
          <div className="flex-shrink-0">
            <StepIndicator current={step} />
          </div>
        )}

        <div className="flex flex-col flex-1 min-h-0 sm:flex-none bg-km-darker border border-white/5 sm:mb-0 overflow-hidden">
          {confirmedBookingNumber ? (
            <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-10 lg:p-14">
              <Confirmation bookingNumber={confirmedBookingNumber} state={state} />
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-10 lg:p-14">
                {step === 1 && <Step1YourInfo state={state} update={update} />}
                {step === 2 && (
                  <Step2SelectService
                    state={state}
                    update={update}
                    onSelect={() => setTimeout(() => setStep((s) => Math.min(6, s + 1)), 350)}
                  />
                )}
                {step === 3 && <Step3TripDetails state={state} update={update} />}
                {step === 4 && <Step4AddOns state={state} update={update} />}
                {step === 5 && <Step5Review state={state} update={update} />}
                {step === 6 && <Step6Payment state={state} onSuccess={setConfirmedBookingNumber} />}
              </div>

              {/* Nav buttons — pinned, always visible, never scrolled away */}
              {step < 6 && (
                <div className="flex-shrink-0 flex items-center justify-between px-5 sm:px-10 lg:px-14 py-4 sm:py-6 border-t border-white/5">
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
