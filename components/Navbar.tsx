'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '#home',     label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#pricing',  label: 'Pricing' },
  { href: '#contact',  label: 'Contact' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navBase =
    'fixed top-0 left-0 right-0 z-50 transition-all duration-500'
  const navBg = scrolled
    ? 'bg-km-black/98 backdrop-blur-sm shadow-[0_1px_0_rgba(201,168,76,0.15)]'
    : 'bg-transparent'

  return (
    <nav className={`${navBase} ${navBg}`} role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 lg:h-24">

          {/* ── Logo ── */}
          <a href="#home" className="flex-shrink-0 flex items-center gap-3" aria-label="KM Executive Transportation — home">
            {!logoError ? (
              <Image
                src="/assets/logo/logo.png"
                alt="KM Executive Transportation"
                width={140}
                height={56}
                className="h-12 w-auto object-contain"
                onError={() => setLogoError(true)}
                priority
              />
            ) : (
              /* Text fallback until logo asset is placed at /public/assets/logo/logo.png */
              <span className="font-playfair text-white text-lg tracking-luxury">
                KM <span className="text-km-gold">EXECUTIVE</span>
              </span>
            )}
          </a>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-white/70 hover:text-km-gold transition-colors duration-200 text-[11px] tracking-luxury uppercase font-semibold"
              >
                {label}
              </a>
            ))}
          </div>

          {/* ── Book Now CTA ── */}
          <div className="hidden md:block">
            <a href="#contact" className="btn-gold text-[10px]">
              Book Now
            </a>
          </div>

          {/* ── Hamburger ── */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[6px] group"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-px bg-white transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`md:hidden bg-km-black/98 backdrop-blur-sm border-t border-white/5 overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-screen py-6' : 'max-h-0'}`}
      >
        <div className="px-6 flex flex-col gap-5">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-white/70 hover:text-km-gold transition-colors text-[11px] tracking-luxury uppercase font-semibold py-1 border-b border-white/5"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="btn-gold text-center mt-2"
          >
            Book Now
          </a>
        </div>
      </div>
    </nav>
  )
}
