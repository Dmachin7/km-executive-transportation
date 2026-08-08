const STEP_LABELS = ['Your Info', 'Service', 'Trip Details', 'Add-Ons', 'Review', 'Payment']

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-3 mb-12 lg:mb-16 overflow-x-auto px-2">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1
        const isActive = step === current
        const isDone = step < current
        return (
          <div key={label} className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
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
              <span className={`hidden sm:block text-[9px] tracking-luxury uppercase ${isActive ? 'text-km-gold' : 'text-white/30'}`}>
                {label}
              </span>
            </div>
            {step < STEP_LABELS.length && (
              <div className={`w-4 sm:w-10 h-px ${isDone ? 'bg-km-gold/50' : 'bg-white/10'}`} aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}
