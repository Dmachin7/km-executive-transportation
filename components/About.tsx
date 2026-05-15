'use client'

import Image from 'next/image'
import { useState } from 'react'
import AnimatedSection from './AnimatedSection'

function VehicleImage() {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="relative z-10 w-full h-full bg-[#1a1510]">
      {!imgError && (
        <Image
          src="/assets/vehicle/suburban.jpg"
          alt="KM Executive Transportation — Black Chevrolet Suburban"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          onError={() => setImgError(true)}
        />
      )}
      {/* Placeholder shown when image is missing */}
      {imgError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 border border-km-gold/30 flex items-center justify-center" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-km-gold/50">
              <rect x="2" y="8" width="28" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="24" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 12 L10 8 L22 8 L26 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-white/20 text-[10px] tracking-luxury uppercase">Place vehicle photo here</p>
          <p className="text-white/15 text-[9px]">/public/assets/vehicle/suburban.jpg</p>
        </div>
      )}
      {/* Placeholder always visible until image loads */}
      {!imgError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none" aria-hidden="true">
          <p className="text-white/10 text-[10px] tracking-luxury uppercase">
            /public/assets/vehicle/suburban.jpg
          </p>
        </div>
      )}
      {/* Gold overlay gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8), transparent)' }}
        aria-hidden="true"
      />
    </div>
  )
}

export default function About() {
  return (
    <section
      id="about"
      className="bg-km-darker py-24 lg:py-32 relative overflow-hidden"
      aria-label="The Executive Standard"
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Text column ── */}
          <AnimatedSection>
            <span className="gold-line" />
            <p className="eyebrow mb-4">Our Standard</p>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-white tracking-[0.03em] mb-8 leading-tight">
              The Executive
              <br />
              <span className="text-km-gold italic">Standard</span>
            </h2>

            <div className="space-y-5 text-white/55 text-sm leading-[1.9]">
              <p>
                Experience the pinnacle of private travel across Tampa Bay, where every detail is
                thoughtfully curated to deliver a refined and effortless journey. Our pristine black
                Chevrolet Suburban serves as more than just transportation—it is a statement of
                sophistication, comfort, and quiet confidence.
              </p>
              <p>
                Immaculately maintained and meticulously prepared for each ride, it reflects our
                unwavering commitment to excellence in both presentation and performance.
              </p>
              <p>
                From the moment your experience begins, you are met with a standard of service that
                prioritizes professionalism, discretion, and precision. Every route is carefully
                planned, every arrival executed seamlessly, ensuring your schedule is honored
                without compromise.
              </p>
            </div>

            {/* Distinguishing stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { value: '24/7',    label: 'Availability' },
                { value: '100%',    label: 'Professional' },
                { value: '5★',      label: 'Rated Service' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-playfair text-2xl text-km-gold mb-1">{value}</p>
                  <p className="text-[10px] tracking-luxury uppercase text-white/40">{label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* ── Image column ──
              Place vehicle interior/exterior photo at: /public/assets/vehicle/suburban.jpg */}
          <AnimatedSection delay={200} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* Gold frame accent */}
              <div className="absolute -top-3 -right-3 w-full h-full border border-km-gold/25 z-0" aria-hidden="true" />
              <VehicleImage />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
