import AnimatedSection from './AnimatedSection'

const TESTIMONIALS = [
  {
    quote:
      'We had an amazing experience! Our driver was professional, friendly, and communicative from the moment he picked us up until he dropped us off. He made sure my girlfriends and I felt safe the entire time, and his customer service was top-notch. We even ended up making a playlist together, which made the ride even more fun! I truly appreciated how attentive and accommodating he was throughout the whole experience. I will definitely be using this service again and highly recommend it!',
    author: 'KM Executive Transportation',
  },
  {
    quote:
      "Hakeem made our Tampa trip truly stress-free and enjoyable. He was always responsive, got us to every destination on time, and gave excellent recommendations for things to do and places to visit. After a packed concert with terrible traffic, he went out of his way to pick us up, showing his dedication and professionalism. Friendly, reliable, and knowledgeable, Hakeem was a huge part of what made our vacation so memorable.",
    author: 'KM Executive Transportation',
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
            What Our Riders Are Saying
          </p>
        </AnimatedSection>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={i} delay={i * 120}>
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
                </figcaption>
              </figure>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
