import AnimatedSection from './AnimatedSection'

const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
        <line x1="24" y1="10" x2="24" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="32" x2="24" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="24" x2="16" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="32" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="21" x2="29" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Private Chauffeur Service',
    body: `Elevate your daily itinerary with professional hourly bookings. Whether for business meetings or site visits, our private drivers provide a refined, discreet environment tailored to your executive needs.`,
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <path d="M6 30 L18 18 L30 22 L42 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34 10 L42 10 L42 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 38 L40 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="34" r="2" fill="currentColor" />
        <circle cx="24" cy="34" r="2" fill="currentColor" />
        <circle cx="36" cy="34" r="2" fill="currentColor" />
      </svg>
    ),
    title: 'Airport Transfers',
    body: `Seamless arrivals and departures across Tampa, St. Petersburg, and Clearwater. Our 24/7 executive service is meticulously timed to your schedule — ensuring you arrive in uncompromised comfort and quiet sophistication.`,
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 38 C4 30 10 26 16 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M44 38 C44 30 38 26 32 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 26 C16 30 20 32 24 32 C28 32 32 30 32 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 38 L38 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Group & Event Transportation',
    body: `From curated nightlife experiences to executive beach outings, our spacious black Chevrolet Suburban accommodates your group in elevated comfort and style. Every detail thoughtfully managed.`,
  },
]

export default function Services() {
  return (
    <section id="services" className="bg-km-black py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <span className="gold-line mx-auto" />
          <p className="eyebrow mb-4">What We Offer</p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-white tracking-[0.03em]">
            Executive Services
          </h2>
        </AnimatedSection>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((svc, i) => (
            <AnimatedSection key={svc.title} delay={i * 120}>
              <div className="group h-full bg-km-dark border border-white/5 hover:border-km-gold/30 p-8 lg:p-10 transition-all duration-500 flex flex-col">
                {/* Gold top accent */}
                <div className="w-full h-px bg-km-gold mb-8" aria-hidden="true" />

                {/* Icon */}
                <div className="text-km-gold mb-6 group-hover:scale-110 transition-transform duration-300">
                  {svc.icon}
                </div>

                {/* Title */}
                <h3 className="font-playfair text-xl text-white mb-4 tracking-[0.02em]">
                  {svc.title}
                </h3>

                {/* Body */}
                <p className="text-white/55 text-sm leading-[1.85] flex-1">
                  {svc.body}
                </p>

                {/* Book link */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-km-gold text-[10px] tracking-luxury uppercase font-semibold hover:gap-3 transition-all duration-200"
                  >
                    Book This Service
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
