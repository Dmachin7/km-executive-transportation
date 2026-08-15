const STEP_LABELS = ['Your Info', 'Service', 'Trip Details', 'Add-Ons', 'Review', 'Payment']

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex-shrink-0 mb-4 sm:mb-8 lg:mb-10">
      <p className="text-center text-km-gold text-[10px] sm:text-xs tracking-luxury uppercase font-semibold mb-3">
        Step {current} of {STEP_LABELS.length} — {STEP_LABELS[current - 1]}
      </p>
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1
          const isActive = step === current
          const isDone = step < current
          return (
            <div key={label} className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-xs font-bold border transition-all duration-300 flex-shrink-0 ${
                  isActive
                    ? 'bg-km-gold text-black border-km-gold'
                    : isDone
                    ? 'bg-km-gold/15 text-km-gold border-km-gold/50'
                    : 'bg-transparent text-white/30 border-white/15'
                }`}
              >
                {isDone ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {step < STEP_LABELS.length && (
                <div className={`w-4 sm:w-8 h-px ${isDone ? 'bg-km-gold/50' : 'bg-white/10'}`} aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
