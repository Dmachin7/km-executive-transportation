'use client'

export default function FloatingContact() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    /* Visible on mobile only — fixed bottom-right */
    <button
      onClick={scrollToContact}
      className="
        fixed bottom-6 right-6 z-40
        flex items-center gap-2.5
        bg-km-gold hover:bg-km-gold-lt
        text-black text-[10px] font-bold tracking-luxury uppercase
        px-5 py-3.5
        shadow-[0_4px_24px_rgba(201,168,76,0.35)]
        hover:shadow-[0_6px_32px_rgba(201,168,76,0.50)]
        transition-all duration-300
        md:hidden
      "
      aria-label="Scroll to contact form"
    >
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 4h12v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
      Contact Now
    </button>
  )
}
