import { BookingState, GratuityChoice } from './types'

const GRATUITY_OPTIONS: Array<{ value: GratuityChoice; label: string }> = [
  { value: '0', label: 'None' },
  { value: '18', label: '18%' },
  { value: '20', label: '20%' },
  { value: '22', label: '22%' },
  { value: 'custom', label: 'Custom' },
]

function isLateNight(pickupTime: string) {
  if (!pickupTime) return false
  const hour = Number(pickupTime.split(':')[0])
  return hour >= 22 || hour < 6
}

interface Props {
  state: BookingState
  update: (patch: Partial<BookingState>) => void
}

export default function Step4AddOns({ state, update }: Props) {
  const lateNight = isLateNight(state.pickupTime)

  return (
    <div>
      <h2 className="font-playfair text-xl sm:text-3xl text-white tracking-[0.02em] mb-1 sm:mb-2">
        Add-<span className="text-km-gold italic">Ons</span>
      </h2>
      <p className="text-white/45 text-sm mb-4 sm:mb-10">Customize your ride.</p>

      <div className="space-y-4 sm:space-y-8">
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => update({ addonMeetGreet: !state.addonMeetGreet })}
            className={`text-left p-4 sm:p-6 border transition-all duration-300 ${
              state.addonMeetGreet ? 'bg-[#0f0d07] border-km-gold' : 'bg-km-dark border-white/5 hover:border-km-gold/30'
            }`}
            aria-pressed={state.addonMeetGreet}
          >
            <div className="flex items-center justify-between mb-1 sm:mb-3">
              <h3 className="font-playfair text-base text-white">Meet & Greet</h3>
              <span className="text-km-gold text-sm font-semibold">+$25</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">Your chauffeur meets you with a name sign</p>
          </button>

          <button
            type="button"
            onClick={() => update({ addonExtraStop: !state.addonExtraStop })}
            className={`text-left p-4 sm:p-6 border transition-all duration-300 ${
              state.addonExtraStop ? 'bg-[#0f0d07] border-km-gold' : 'bg-km-dark border-white/5 hover:border-km-gold/30'
            }`}
            aria-pressed={state.addonExtraStop}
          >
            <div className="flex items-center justify-between mb-1 sm:mb-3">
              <h3 className="font-playfair text-base text-white">Additional Stop</h3>
              <span className="text-km-gold text-sm font-semibold">+$15</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">Add one extra stop along your route</p>
          </button>
        </div>

        {lateNight && (
          <div className="border border-km-gold/30 bg-km-gold/5 px-4 py-3 sm:px-5 sm:py-4 text-sm text-km-gold/90">
            <p className="font-semibold">Late night rate applies to your booking</p>
            <p className="text-km-gold/70 mt-1">+ 15% automatically added for rides scheduled between 10PM and 6AM</p>
          </div>
        )}

        <div>
          <p className="form-label mb-2 sm:mb-3">Gratuity</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {GRATUITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ gratuityChoice: opt.value })}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold tracking-luxury uppercase border transition-all duration-200 ${
                  state.gratuityChoice === opt.value
                    ? 'bg-km-gold text-black border-km-gold'
                    : 'bg-transparent text-white/50 border-white/15 hover:border-km-gold/40'
                }`}
                aria-pressed={state.gratuityChoice === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {state.gratuityChoice === 'custom' && (
            <input
              type="number"
              min={0}
              max={100}
              className="form-input mt-3 sm:mt-4 max-w-[160px]"
              placeholder="%"
              value={state.gratuityCustom}
              onChange={(e) => update({ gratuityCustom: e.target.value })}
            />
          )}
        </div>

        <div>
          <label className="form-label" htmlFor="specialRequests">
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            rows={2}
            className="form-input resize-none"
            placeholder="Music preferences, accommodations, additional details..."
            value={state.specialRequests}
            onChange={(e) => update({ specialRequests: e.target.value })}
          />
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.isCashPayment}
              onChange={(e) => update({ isCashPayment: e.target.checked })}
              className="mt-1 w-4 h-4 accent-km-gold flex-shrink-0"
            />
            <span className="text-white/60 text-sm">I plan to pay in cash</span>
          </label>
          {state.isCashPayment && (
            <p className="text-white/40 text-xs mt-2 sm:mt-3 leading-relaxed max-w-md">
              A deposit is still required to secure your booking. Your card will be held on file and charged the deposit amount.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
