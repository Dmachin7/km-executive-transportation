import { BookingState } from './types'

interface Props {
  state: BookingState
  update: (patch: Partial<BookingState>) => void
}

export default function Step1YourInfo({ state, update }: Props) {
  return (
    <div>
      <h2 className="font-playfair text-2xl sm:text-3xl text-white tracking-[0.02em] mb-2">
        Your <span className="text-km-gold italic">Information</span>
      </h2>
      <p className="text-white/45 text-sm mb-10">Let's start with how we can reach you.</p>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="form-label" htmlFor="firstName">
              First Name <span className="text-km-gold">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              required
              autoComplete="given-name"
              className="form-input"
              placeholder="John"
              value={state.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="lastName">
              Last Name <span className="text-km-gold">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              required
              autoComplete="family-name"
              className="form-input"
              placeholder="Smith"
              value={state.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="email">
            Email <span className="text-km-gold">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="form-input"
            placeholder="john@example.com"
            value={state.email}
            onChange={(e) => update({ email: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="phone">
            Phone <span className="text-km-gold">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            className="form-input"
            placeholder="+1 (813) 000-0000"
            value={state.phone}
            onChange={(e) => update({ phone: e.target.value })}
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.saveInfo}
            onChange={(e) => update({ saveInfo: e.target.checked })}
            className="mt-1 w-4 h-4 accent-km-gold flex-shrink-0"
          />
          <span className="text-white/60 text-sm">
            Save my info for future bookings <span className="text-white/40">(create a free account)</span>
          </span>
        </label>

        <p className="text-white/30 text-xs leading-relaxed">
          We collect your information first to ensure accurate pricing for your trip.
        </p>
      </div>
    </div>
  )
}

export function isStep1Valid(state: BookingState) {
  return (
    state.firstName.trim().length > 0 &&
    state.lastName.trim().length > 0 &&
    /^\S+@\S+\.\S+$/.test(state.email) &&
    state.phone.trim().length > 0
  )
}
