'use client'

import { useState, FormEvent } from 'react'
import AnimatedSection from './AnimatedSection'

const SERVICE_OPTIONS = [
  'Airport Transfer',
  'Hourly Service',
  'Group & Event Transportation',
]

const PASSENGER_OPTIONS = ['1', '2', '3', '4', '5', '6', '7']

interface FormState {
  firstName:       string
  lastName:        string
  phone:           string
  pickup:          string
  dropoff:         string
  date:            string
  timeHour:        string
  timeMinute:      string
  ampm:            'AM' | 'PM'
  passengers:      string
  serviceType:     string
  specialRequests: string
}

const EMPTY: FormState = {
  firstName:       '',
  lastName:        '',
  phone:           '',
  pickup:          '',
  dropoff:         '',
  date:            '',
  timeHour:        '',
  timeMinute:      '',
  ampm:            'AM',
  passengers:      '',
  serviceType:     '',
  specialRequests: '',
}

export default function ContactForm() {
  const [form, setForm]       = useState<FormState>(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const time = form.timeHour && form.timeMinute
      ? `${form.timeHour}:${form.timeMinute} ${form.ampm}`
      : 'Not specified'

    const body = [
      `RESERVATION REQUEST — KM EXECUTIVE TRANSPORTATION`,
      ``,
      `Name:             ${form.firstName} ${form.lastName}`,
      `Phone:            ${form.phone}`,
      ``,
      `Pickup Location:  ${form.pickup}`,
      `Drop-off:         ${form.dropoff}`,
      `Date:             ${form.date}`,
      `Time:             ${time}`,
      `Passengers:       ${form.passengers}`,
      `Service:          ${form.serviceType}`,
      ``,
      `Special Requests: ${form.specialRequests || 'None'}`,
    ].join('\n')

    const subject = `Reservation Request — ${form.firstName} ${form.lastName}`
    window.location.href =
      `mailto:kmexecutivetransportationllc@gmail.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section id="contact" className="bg-km-darker py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <span className="gold-line mx-auto" />
          <p className="eyebrow mb-4">Reserve Your Ride</p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-white tracking-[0.03em] mb-4">
            Luxury Reservation{' '}
            <span className="text-km-gold italic">Request</span>
          </h2>
          <p className="text-white/45 text-sm max-w-lg mx-auto leading-relaxed">
            Please provide your travel details below to book your executive transportation service.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          {/* Fallback: form degrades to direct mailto if JS is disabled */}
          <noscript>
            <p className="text-km-gold text-sm text-center mb-4">
              Please{' '}
              <a href="mailto:kmexecutivetransportationllc@gmail.com" className="underline">
                email us directly
              </a>{' '}
              to make a reservation.
            </p>
          </noscript>

          <form
            onSubmit={handleSubmit}
            /* Graceful no-JS fallback — submits form fields directly to mailto */
            action="mailto:kmexecutivetransportationllc@gmail.com"
            method="GET"
            encType="text/plain"
            className="space-y-6"
            noValidate
          >
            {/* Name row */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="form-label" htmlFor="firstName">First Name <span className="text-km-gold">*</span></label>
                <input id="firstName" name="firstName" type="text" required autoComplete="given-name"
                  className="form-input" placeholder="John"
                  value={form.firstName} onChange={set('firstName')} />
              </div>
              <div>
                <label className="form-label" htmlFor="lastName">Last Name <span className="text-km-gold">*</span></label>
                <input id="lastName" name="lastName" type="text" required autoComplete="family-name"
                  className="form-input" placeholder="Smith"
                  value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="form-label" htmlFor="phone">Phone Number <span className="text-km-gold">*</span></label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel"
                className="form-input" placeholder="+1 (813) 000-0000"
                value={form.phone} onChange={set('phone')} />
            </div>

            {/* Locations */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="form-label" htmlFor="pickup">Pickup Location <span className="text-km-gold">*</span></label>
                <input id="pickup" name="pickup" type="text" required
                  className="form-input" placeholder="Address or airport code"
                  value={form.pickup} onChange={set('pickup')} />
              </div>
              <div>
                <label className="form-label" htmlFor="dropoff">Drop-off Location <span className="text-km-gold">*</span></label>
                <input id="dropoff" name="dropoff" type="text" required
                  className="form-input" placeholder="Address or destination"
                  value={form.dropoff} onChange={set('dropoff')} />
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="form-label" htmlFor="date">Date <span className="text-km-gold">*</span></label>
                <input id="date" name="date" type="date" required
                  className="form-input [color-scheme:dark]"
                  value={form.date} onChange={set('date')} />
              </div>

              <div>
                <label className="form-label">Time <span className="text-km-gold">*</span></label>
                <div className="flex gap-2">
                  <input
                    type="number" min={1} max={12} placeholder="HH" required
                    className="form-input w-20 text-center"
                    value={form.timeHour} onChange={set('timeHour')}
                    aria-label="Hour"
                  />
                  <span className="flex items-center text-white/40 font-bold text-lg">:</span>
                  <input
                    type="number" min={0} max={59} placeholder="MM" required
                    className="form-input w-20 text-center"
                    value={form.timeMinute} onChange={set('timeMinute')}
                    aria-label="Minute"
                  />
                  {/* AM / PM toggle */}
                  <div className="flex" role="group" aria-label="AM or PM">
                    {(['AM', 'PM'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, ampm: period }))}
                        className={`px-4 text-xs font-bold tracking-wider transition-all duration-200 border ${
                          form.ampm === period
                            ? 'bg-km-gold text-black border-km-gold'
                            : 'bg-transparent text-white/40 border-white/10 hover:border-km-gold/40'
                        }`}
                        aria-pressed={form.ampm === period}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Passengers + Service */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="form-label" htmlFor="passengers">Passenger Count <span className="text-km-gold">*</span></label>
                <select id="passengers" name="passengers" required
                  className="form-input"
                  value={form.passengers} onChange={set('passengers')}>
                  <option value="" disabled>Select count</option>
                  {PASSENGER_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} passenger{n !== '1' ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="serviceType">Service Type <span className="text-km-gold">*</span></label>
                <select id="serviceType" name="serviceType" required
                  className="form-input"
                  value={form.serviceType} onChange={set('serviceType')}>
                  <option value="" disabled>Select service</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special requests */}
            <div>
              <label className="form-label" htmlFor="specialRequests">Special Requests</label>
              <textarea id="specialRequests" name="specialRequests" rows={4}
                className="form-input resize-none" placeholder="Any additional instructions, accessibility needs, or preferences..."
                value={form.specialRequests} onChange={set('specialRequests')} />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button type="submit" className="btn-gold w-full text-center">
                {submitted ? 'Opening email client…' : 'Book Your Service'}
              </button>
              <p className="text-center text-white/25 text-xs mt-4 leading-relaxed">
                Submitting opens your default email app with all details pre-filled.
                <br />
                Or call us directly at{' '}
                <a href="tel:+18139957275" className="text-km-gold/70 hover:text-km-gold">
                  +1 813.995.7275
                </a>
              </p>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </section>
  )
}
