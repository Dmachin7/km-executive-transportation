'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  id?: string
  value: string // HH:MM 24h
  onChange: (v: string) => void
  step?: number // minutes, default 30
}

function formatDisplay(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

function buildOptions(step: number): string[] {
  const out: string[] = []
  for (let mins = 0; mins < 24 * 60; mins += step) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
  return out
}

export default function TimePicker({ id, value, onChange, step = 30 }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const options = buildOptions(step)

  useEffect(() => setMounted(true), [])

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

  useEffect(() => {
    if (open && listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]') as HTMLElement | null
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'center' })
      } else {
        listRef.current.scrollTop = 0
      }
    }
  }, [open])

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
        className="fixed inset-x-4 bottom-6 z-50 sm:inset-x-auto sm:bottom-auto sm:w-56
                   bg-km-darker border border-km-gold/25 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
      >
        <div ref={listRef} className="max-h-72 overflow-y-auto py-2">
          {options.map((t) => {
            const isSelected = t === value
            return (
              <button
                key={t}
                type="button"
                data-selected={isSelected}
                onClick={() => {
                  onChange(t)
                  setOpen(false)
                }}
                className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                  isSelected ? 'bg-km-gold text-black font-semibold' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                {formatDisplay(t)}
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
        <span className={value ? 'text-white' : 'text-white/35'}>{value ? formatDisplay(value) : 'Select time'}</span>
        <svg className="w-4 h-4 text-km-gold flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {open && mounted && createPortal(panel, document.body)}
    </div>
  )
}
