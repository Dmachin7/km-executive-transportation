'use client'

import Image from 'next/image'
import { useState } from 'react'

const QUICK_LINKS = [
  { href: '#home',     label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#pricing',  label: 'Pricing' },
  { href: '#contact',  label: 'Contact' },
]

/* Social icon SVGs */
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FooterLogo() {
  const [logoError, setLogoError] = useState(false)
  return logoError ? (
    <span className="font-playfair text-white text-lg tracking-luxury">
      KM <span className="text-km-gold">EXECUTIVE</span>
    </span>
  ) : (
    <Image
      src="/assets/logo/logo.png"
      alt="KM Executive Transportation"
      width={130}
      height={52}
      className="h-10 w-auto object-contain"
      onError={() => setLogoError(true)}
    />
  )
}

export default function Footer() {
  return (
    <footer className="bg-km-black border-t border-white/5" aria-label="Site footer">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">

          {/* ── Brand column ── */}
          <div>
            {/* Logo */}
            <div className="mb-5">
              <FooterLogo />
            </div>

            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Tampa Bay&rsquo;s premier private chauffeur service — delivering executive-level comfort, reliability, and discretion, 24/7.
            </p>

            {/* Social links */}
            <div className="flex gap-4 mt-7">
              <a
                href="http://www.instagram.com/kmexecutiveservices"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-km-gold transition-colors duration-200"
                aria-label="KM Executive on Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="http://www.tiktok.com/kmexectransportation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-km-gold transition-colors duration-200"
                aria-label="KM Executive on TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* ── Quick links ── */}
          <div>
            <h3 className="eyebrow text-[9px] mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-white/45 hover:text-km-gold text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-km-gold/0 group-hover:bg-km-gold/60 transition-all duration-200" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="eyebrow text-[9px] mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+18139957275"
                  className="flex items-start gap-3 text-white/45 hover:text-km-gold transition-colors duration-200 group"
                >
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-km-gold/60 group-hover:text-km-gold transition-colors" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 2h3l1.5 4L6 7.5c1.2 2.4 3.1 4.3 5.5 5.5L13 11.5l4 1.5v3a1 1 0 0 1-1 1C6.6 17 1 11.4 1 3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm">+1 813.995.7275</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:kmexecutivetransportation@gmail.com"
                  className="flex items-start gap-3 text-white/45 hover:text-km-gold transition-colors duration-200 group"
                >
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-km-gold/60 group-hover:text-km-gold transition-colors" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm break-all">kmexecutivetransportation@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/45">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-km-gold/60" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M8 1C5 1 2.5 3.5 2.5 7c0 4.5 5.5 9 5.5 9s5.5-4.5 5.5-9C13.5 3.5 11 1 8 1z" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <span className="text-sm">Tampa Bay, Florida</span>
              </li>
            </ul>

            <a href="#contact" className="btn-gold inline-block mt-8 text-[9px]">
              Reserve Now
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            &copy; 2026 KM Executive Transportation. All rights reserved.
          </p>
          <p className="text-white/15 text-[10px] tracking-wide">
            Tampa Bay&apos;s Premium Black Car Service
          </p>
        </div>
      </div>
    </footer>
  )
}
