'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  id?: string
  value: string // YYYY-MM-DD
  onChange: (v: string) => void
  minDate?: string // YYYY-MM-DD, defaults to today
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toDateOnly(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function parseYMD(s: string): Date | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function toYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplay(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DatePicker({ id, value, onChange, minDate }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const selected = parseYMD(value)
  const min = toDateOnly(minDate ? parseYMD(minDate) || new Date() : new Date())
  const [viewMonth, setViewMonth] = useState(() => selected || min)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (selected) setViewMonth(selected)
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const reposition = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width })
  }

  useLayoutEffect(() => {
    if (!open) return
    reposition()
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const canGoPrev = new Date(year, month, 1) > new Date(min.getFullYear(), min.getMonth(), 1)

  const panel = (
    <>
      <div className="fixed inset-0 bg-black/70 z-40 sm:hidden" onClick={() => setOpen(false)} />
      <div
        ref={panelRef}
        style={
          typeof window !== 'undefined' && window.innerWidth >= 640
            ? { top: coords.top, left: coords.left }
            : undefined
        }
        className="fixed inset-x-4 bottom-6 z-50 sm:inset-x-auto sm:bottom-auto sm:w-80
                   bg-km-darker border border-km-gold/25 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-4 sm:p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => setViewMonth(new Date(year, month - 1, 1))}
            className="w-8 h-8 flex items-center justify-center text-km-gold hover:text-km-gold-lt disabled:opacity-20 disabled:hover:text-km-gold transition-colors"
            aria-label="Previous month"
          >
            ‹
          </button>
          <p className="font-playfair text-white text-base tracking-[0.02em]">
            {MONTHS[month]} <span className="text-km-gold">{year}</span>
          </p>
          <button
            type="button"
            onClick={() => setViewMonth(new Date(year, month + 1, 1))}
            className="w-8 h-8 flex items-center justify-center text-km-gold hover:text-km-gold-lt transition-colors"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((w, i) => (
            <div key={i} className="text-center text-white/30 text-[10px] tracking-luxury uppercase py-2">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />
            const dOnly = toDateOnly(d)
            const isPast = dOnly < min
            const isSelected = selected && toYMD(d) === toYMD(selected)
            const isToday = toYMD(dOnly) === toYMD(new Date())
            return (
              <button
                key={i}
                type="button"
                disabled={isPast}
                onClick={() => {
                  onChange(toYMD(d))
                  setOpen(false)
                }}
                className={`aspect-square text-sm flex items-center justify-center transition-colors
                  ${isSelected ? 'bg-km-gold text-black font-semibold' : 'text-white/70 hover:bg-white/5'}
                  ${isPast ? 'text-white/15 cursor-not-allowed hover:bg-transparent' : ''}
                  ${isToday && !isSelected ? 'border border-km-gold/40' : ''}
                `}
              >
                {d.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        className="form-input text-left flex items-center justify-between"
      >
        <span className={selected ? 'text-white' : 'text-white/35'}>
          {selected ? formatDisplay(selected) : 'Select date'}
        </span>
        <svg className="w-4 h-4 text-km-gold flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {open && mounted && createPortal(panel, document.body)}
    </div>
  )
}
