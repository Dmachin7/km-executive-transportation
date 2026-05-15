import AnimatedSection from './AnimatedSection'

/*
 * ─────────────────────────────────────────────────────────────────
 * FUTURE: Dynamic Pricing Calculator
 * ─────────────────────────────────────────────────────────────────
 * When ready, replace the static pricing cards below with the
 * <PricingCalculator /> component (stub at bottom of this file).
 *
 * Requirements:
 *   • Google Maps Distance Matrix API — calculates mileage between
 *     pickup and drop-off addresses.
 *   • Rate tiers (confirm with client before shipping):
 *       - 2:00 AM – 5:00 AM  →  $5 / mile  (late-night premium rate)
 *       - All other hours     →  $4 / mile  (standard rate)
 *   • Inputs: pickup address, drop-off address, date, time-of-day
 *   • Output: estimated fare with per-mile rate breakdown
 *   • Env var needed: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 *
 * To activate:
 *   import PricingCalculator from './PricingCalculator'
 *   Replace the <PricingGrid /> below with: <PricingCalculator />
 * ─────────────────────────────────────────────────────────────────
 */

const PLANS = [
  {
    label:    'Airport Transfers',
    price:    'Call for Pricing',
    priceTag: null,
    features: [
      'All Tampa Bay airports',
      'Flight-tracking included',
      '24/7 availability',
      'Meet & greet service',
    ],
    cta:     'Book Now',
    href:    'mailto:kmexecutivetransportationllc@gmail.com',
    featured: false,
  },
  {
    label:    'Premier Hourly Service',
    price:    '$100',
    priceTag: '/ hour',
    features: [
      'Minimum 2-hour booking',
      'Point-to-point or as-directed',
      'Business or personal use',
      'Professional chauffeur',
    ],
    cta:     'Book Now',
    href:    'mailto:kmexecutivetransportationllc@gmail.com',
    featured: true,
  },
  {
    label:    'Group & Event Transport',
    price:    'Call for Pricing',
    priceTag: null,
    features: [
      'Up to 7 passengers',
      'Events, galas & nightlife',
      'Multi-stop itineraries',
      'Complimentary water',
    ],
    cta:     'Inquire',
    href:    'tel:+18139957275',
    featured: false,
  },
]

function PricingGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
      {PLANS.map((plan, i) => (
        <AnimatedSection key={plan.label} delay={i * 120}>
          <div
            className={`relative h-full flex flex-col p-8 lg:p-10 border transition-all duration-500 ${
              plan.featured
                ? 'bg-[#0f0d07] border-km-gold/60 shadow-[0_0_40px_rgba(201,168,76,0.12)]'
                : 'bg-km-dark border-white/5 hover:border-km-gold/25'
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-px left-0 right-0 h-px bg-gold-gradient" aria-hidden="true" />
            )}

            {/* Label */}
            <p className="eyebrow text-[9px] mb-5">{plan.label}</p>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-white/8">
              <div className="flex items-end gap-2">
                <span className="font-playfair text-3xl lg:text-4xl text-white">
                  {plan.price}
                </span>
                {plan.priceTag && (
                  <span className="text-white/40 text-sm mb-1">{plan.priceTag}</span>
                )}
              </div>
              {plan.featured && (
                <p className="text-[10px] text-km-gold/70 mt-1">Starting rate — contact for exact quote</p>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-white/55 text-sm">
                  <svg className="w-3.5 h-3.5 text-km-gold flex-shrink-0" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href={plan.href}
              className={`text-center text-[10px] tracking-luxury uppercase font-bold px-6 py-4 transition-all duration-300 ${
                plan.featured
                  ? 'bg-km-gold hover:bg-km-gold-lt text-black'
                  : 'border border-km-gold/50 text-km-gold hover:bg-km-gold hover:text-black'
              }`}
            >
              {plan.cta} →
            </a>
          </div>
        </AnimatedSection>
      ))}
    </div>
  )
}

/*
 * PricingCalculator — stub component
 * Uncomment and build out when Google Maps API integration is ready.
 *
 * function PricingCalculator() {
 *   // TODO: Integrate Google Maps Distance Matrix API
 *   // API key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 *   //
 *   // Rate logic:
 *   //   const hour = new Date(selectedDateTime).getHours()
 *   //   const ratePerMile = (hour >= 2 && hour < 5) ? 5 : 4
 *   //   const estimatedFare = distanceInMiles * ratePerMile
 *   //
 *   // Fields: pickup address, dropoff address, date + time picker
 *   return (
 *     <div>
 *       <p>Pricing calculator coming soon.</p>
 *     </div>
 *   )
 * }
 */

export default function Pricing() {
  return (
    <section id="pricing" className="bg-km-black py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <AnimatedSection className="text-center mb-4">
          <span className="gold-line mx-auto" />
          <p className="eyebrow mb-4">Transparent Rates</p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-white tracking-[0.03em] mb-4">
            Executive Taste,{' '}
            <span className="text-km-gold italic">Executive Rates</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection className="text-center mb-14" delay={100}>
          <p className="text-white/45 text-sm max-w-xl mx-auto leading-relaxed">
            Premium private transportation with straightforward pricing. No surge prices, no hidden
            fees — just professional service tailored to your executive needs.
          </p>
        </AnimatedSection>

        <PricingGrid />

        {/* Disclaimer */}
        <AnimatedSection className="mt-10 text-center" delay={400}>
          <p className="text-white/25 text-xs tracking-wide">
            All rates subject to change. Contact us for custom itineraries or multi-day bookings.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
