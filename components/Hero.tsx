export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] md:min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background image + overlay ──
          Place your hero vehicle image at: /public/assets/vehicle/hero.jpg  */}
      <div
        className="absolute inset-0 hero-bg bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.75) 60%, rgba(10,10,10,0.95) 100%),
            url('/assets/vehicle/hero.jpg')
          `,
        }}
        aria-hidden="true"
      />

      {/* Fallback gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse at center top, #1a1410 0%, #0A0A0A 70%)' }}
        aria-hidden="true"
      />

      {/* ── Decorative corner lines (desktop only) ── */}
      <div className="absolute top-32 left-8 w-16 h-16 border-t border-l border-km-gold/30 hidden lg:block" aria-hidden="true" />
      <div className="absolute top-32 right-8 w-16 h-16 border-t border-r border-km-gold/30 hidden lg:block" aria-hidden="true" />
      <div className="absolute bottom-16 left-8 w-16 h-16 border-b border-l border-km-gold/30 hidden lg:block" aria-hidden="true" />
      <div className="absolute bottom-16 right-8 w-16 h-16 border-b border-r border-km-gold/30 hidden lg:block" aria-hidden="true" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-5 md:mb-6">
          <div className="h-px w-8 md:w-12 bg-km-gold/60" aria-hidden="true" />
          <p className="eyebrow text-[9px] md:text-[10px]">Tampa Bay&apos;s Premier Chauffeur Service</p>
          <div className="h-px w-8 md:w-12 bg-km-gold/60" aria-hidden="true" />
        </div>

        {/* Headline */}
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-[0.04em] mb-5 md:mb-6">
          Luxury Transportation
          <br />
          <span className="text-km-gold italic">in Tampa Bay</span>
        </h1>

        {/* Badge */}
        <p className="text-[8px] tracking-[0.12em] md:text-[10px] md:tracking-luxury uppercase text-white/50 font-semibold mb-6 md:mb-5">
          Professional &nbsp;•&nbsp; Reliable &nbsp;•&nbsp; Executive &nbsp;•&nbsp; 24/7
        </p>

        {/* Divider — hidden on mobile to reduce clutter */}
        <div className="hidden md:block w-16 h-px bg-km-gold mx-auto mb-7" aria-hidden="true" />

        {/* Body copy — hidden on mobile */}
        <p className="hidden md:block text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-light">
          Reliable, Professional, Executive-Level Service —{' '}
          <span className="text-white/80">24/7 Airport &amp; Private Rides</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contact" className="btn-gold w-full sm:w-auto text-center">
            Book Your Ride
          </a>
          <a href="tel:+18139957275" className="btn-outline w-full sm:w-auto text-center">
            Call Today
          </a>
        </div>

        {/* Scroll indicator — desktop only */}
        <div className="hidden md:flex mt-16 flex-col items-center gap-2 opacity-40" aria-hidden="true">
          <p className="text-[9px] tracking-luxury uppercase text-white">Scroll</p>
          <div className="w-px h-8 bg-white/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full bg-km-gold animate-[scrollline_1.8s_ease-in-out_infinite]" style={{ height: '40%' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
