import AnimatedSection from './AnimatedSection'

const CITIES = [
  'Tampa',
  'St. Petersburg',
  'Clearwater',
  'Surrounding Tampa Bay Areas',
]

export default function Coverage() {
  return (
    <section className="bg-km-darker py-20 lg:py-24 border-y border-white/5" aria-labelledby="coverage-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">

        <AnimatedSection>
          <span className="gold-line mx-auto" />
          <p id="coverage-heading" className="eyebrow mb-8">Service Coverage</p>

          {/* City names */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0">
            {CITIES.map((city, i) => (
              <div key={city} className="flex items-center">
                <span className="font-playfair text-lg md:text-xl lg:text-2xl text-km-gold tracking-[0.04em]">
                  {city}
                </span>
                {i < CITIES.length - 1 && (
                  <span className="hidden md:inline mx-5 text-km-gold/25 text-xl select-none" aria-hidden="true">
                    •
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-white/30 text-xs tracking-luxury uppercase">
            Available 24 hours a day, 7 days a week
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
