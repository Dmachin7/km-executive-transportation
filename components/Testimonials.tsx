import AnimatedSection from './AnimatedSection'

const TESTIMONIALS = [
  {
    quote:  'The absolute standard for executive travel in Tampa. Professional, punctual, and the Suburban was immaculate.',
    author: 'Jennifer S.',
    title:  'Corporate Liaison',
  },
  {
    quote:  'Our primary choice for late-night airport transfers. Direct communication with the chauffeur makes every transition seamless.',
    author: 'Marcus V.',
    title:  'Technology Executive',
  },
  {
    quote:  'Exceptional reliability for our group gala transportation. Immaculate vehicle quality and superior professionalism across the board.',
    author: 'Sarah L.',
    title:  'Senior Event Coordinator',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-km-black py-24 lg:py-32" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <span className="gold-line mx-auto" />
          <p id="testimonials-heading" className="eyebrow">
            Trusted by Tampa&apos;s Professionals
          </p>
        </AnimatedSection>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={t.author} delay={i * 120}>
              <figure className="h-full bg-km-dark border border-white/5 hover:border-km-gold/20 p-8 lg:p-10 flex flex-col transition-all duration-400">

                {/* Gold opening quote */}
                <span
                  className="font-playfair text-8xl leading-none text-km-gold/25 select-none -mt-2 -ml-1 mb-2"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Stars */}
                <div className="flex gap-1 mb-5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-km-gold" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                      <polygon points="7,1 8.8,5.4 13.5,5.4 9.9,8.3 11.3,13 7,10.1 2.7,13 4.1,8.3 0.5,5.4 5.2,5.4" />
                    </svg>
                  ))}
                </div>

                {/* Quote body */}
                <blockquote className="text-white/65 text-sm leading-[1.85] flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <figcaption className="mt-7 pt-6 border-t border-white/8">
                  <p className="text-km-gold text-[10px] tracking-luxury uppercase font-semibold">
                    — {t.author}
                  </p>
                  <p className="text-white/35 text-xs mt-1">{t.title}</p>
                </figcaption>
              </figure>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
