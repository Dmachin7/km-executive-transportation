import { BookingState, ServiceType } from './types'

function CarIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
      <path d="M6 30 L18 18 L30 22 L42 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 10 L42 10 L42 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 38 L40 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="34" r="2" fill="currentColor" />
      <circle cx="24" cy="34" r="2" fill="currentColor" />
      <circle cx="36" cy="34" r="2" fill="currentColor" />
    </svg>
  )
}

function PlaneIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
      <path
        d="M24 4 L27 20 L42 26 L42 30 L27 27 L25 40 L31 44 L31 46 L24 44 L17 46 L17 44 L23 40 L21 27 L6 30 L6 26 L21 20 L24 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HighwayIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
      <path d="M16 6 L6 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 6 L42 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="23" y1="10" x2="22" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="21" y1="22" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="34" x2="18" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SteeringWheelIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 6 L24 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.5 32 L20.5 26.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M37.5 32 L27.5 26.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
      <polygon
        points="24,4 30,18 45,19 33,29 37,44 24,35 11,44 15,29 3,19 18,18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SERVICES: Array<{ type: ServiceType; icon: React.ReactNode; title: string; body: string }> = [
  { type: 'everyday', icon: <CarIcon />, title: 'Everyday Transportation', body: 'Point-to-point travel around Tampa Bay' },
  { type: 'airport', icon: <PlaneIcon />, title: 'Airport Transportation', body: 'All Tampa Bay area airports' },
  { type: 'long_distance', icon: <HighwayIcon />, title: 'Long Distance Transportation', body: 'Travel beyond the Tampa Bay area' },
  { type: 'chauffeur', icon: <SteeringWheelIcon />, title: 'Private Chauffeur', body: 'Hourly service, you set the itinerary' },
  { type: 'event', icon: <StarIcon />, title: 'Event Transportation', body: 'Weddings, proms, concerts & more' },
]

interface Props {
  state: BookingState
  update: (patch: Partial<BookingState>) => void
}

export default function Step2SelectService({ state, update }: Props) {
  return (
    <div>
      <h2 className="font-playfair text-xl sm:text-3xl text-white tracking-[0.02em] mb-1 sm:mb-2">
        Select Your <span className="text-km-gold italic">Service</span>
      </h2>
      <p className="text-white/45 text-sm mb-4 sm:mb-10">Choose the service that fits your trip.</p>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
        {SERVICES.map((svc) => {
          const selected = state.serviceType === svc.type
          return (
            <button
              key={svc.type}
              type="button"
              onClick={() => update({ serviceType: svc.type })}
              className={`group text-left p-4 sm:p-6 lg:p-8 border transition-all duration-300 flex sm:block items-center gap-4 sm:gap-0 ${
                selected ? 'bg-[#0f0d07] border-km-gold shadow-[0_0_30px_rgba(201,168,76,0.15)]' : 'bg-km-dark border-white/5 hover:border-km-gold/40'
              }`}
            >
              <div
                className={`[&_svg]:w-7 [&_svg]:h-7 sm:[&_svg]:w-9 sm:[&_svg]:h-9 mb-0 sm:mb-5 flex-shrink-0 transition-colors ${selected ? 'text-km-gold' : 'text-km-gold/70 group-hover:text-km-gold'}`}
              >
                {svc.icon}
              </div>
              <div>
                <h3 className="font-playfair text-base sm:text-lg text-white mb-0.5 sm:mb-2 tracking-[0.01em]">{svc.title}</h3>
                <p className="hidden sm:block text-white/50 text-sm leading-relaxed mt-1">{svc.body}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function isStep2Valid(state: BookingState) {
  return state.serviceType !== null
}
