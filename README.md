# KM Executive Transportation — Website

Premium, fully responsive Next.js website for **KM Executive Transportation** — a private chauffeur service based in Tampa Bay, Florida.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Adding Your Assets

### Logo
Place your logo file at:
```
/public/assets/logo/logo.png
```
The navbar and footer both show a text fallback ("KM EXECUTIVE") until the file is present.

### Vehicle Photos
| File | Section | Min. Size |
|------|---------|-----------|
| `/public/assets/vehicle/hero.jpg` | Hero background | 1920×1080px |
| `/public/assets/vehicle/suburban.jpg` | About section | 800×1000px |

---

## Project Structure

```
├── app/
│   ├── layout.tsx          Root layout — fonts, SEO metadata
│   ├── page.tsx            Main page — assembles all sections
│   └── globals.css         Tailwind + custom CSS utilities
├── components/
│   ├── AnimatedSection.tsx  Scroll-triggered fade-in wrapper
│   ├── Navbar.tsx           Sticky nav, transparent→black on scroll
│   ├── Hero.tsx             Full-screen hero with CTAs
│   ├── Services.tsx         Three service cards
│   ├── About.tsx            Brand story + vehicle photo
│   ├── Pricing.tsx          Pricing cards (+ future calculator stub)
│   ├── ContactForm.tsx      Reservation form → mailto
│   ├── Testimonials.tsx     Client testimonials
│   ├── Coverage.tsx         Service area cities
│   ├── Footer.tsx           Logo, links, social, copyright
│   └── FloatingContact.tsx  Mobile fixed "Contact Now" button
├── public/
│   └── assets/
│       ├── logo/            ← Drop logo.png here
│       └── vehicle/         ← Drop hero.jpg and suburban.jpg here
```

---

## Future: Dynamic Pricing Calculator

**Status:** Stub comment is in `components/Pricing.tsx` — replace `<PricingGrid />` with `<PricingCalculator />` when ready.

### What It Needs

| Item | Detail |
|------|--------|
| **API** | Google Maps Distance Matrix API |
| **Env var** | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| **Rate structure** | 2:00 AM – 5:00 AM → **$5/mile** (late-night premium) · All other hours → **$4/mile** (standard) |
| **Inputs** | Pickup address, drop-off address, date, time-of-day |
| **Output** | Estimated fare with per-mile rate breakdown |

### Rate Logic (pseudocode)
```ts
const hour = new Date(selectedDateTime).getHours()  // 0–23
const ratePerMile = (hour >= 2 && hour < 5) ? 5 : 4
const estimatedFare = distanceMiles * ratePerMile
```

### Component Stub Location
```
components/PricingCalculator.tsx  ← create this file
```
See the stub comment at the bottom of `components/Pricing.tsx` for full integration notes.

---

## Future: Booking System Integration

The `ContactForm` component is intentionally modular. When a calendar or scheduling platform is chosen (e.g. Cal.com, Calendly, or custom), replace the `handleSubmit` function's `window.location.href = mailto:...` with an API call to the scheduling service.

The form fields are already in the shape needed for most booking systems.

---

## Future: Direct Chauffeur Communication

A direct messaging channel between client and chauffeur is planned. Recommended approach:
- Integrate a chat widget (e.g. Crisp, Intercom, or a custom WebSocket solution)
- Or surface a WhatsApp/SMS deep-link button alongside the booking form

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3
- **Fonts:** Playfair Display (headings) + Inter (body) via `next/font/google`
- **Images:** `next/image` with AVIF/WebP optimization
- **Animations:** IntersectionObserver (no heavy library)
- **Form:** `mailto:` with JS-built body; degrades gracefully without JS

---

## Contact & Booking

- **Phone:** +1 813.995.7275
- **Email:** kmexecutivetransportationllc@gmail.com
- **Instagram:** [@kmexecutiveservices](http://www.instagram.com/kmexecutiveservices)
- **TikTok:** [@kmexectransportation](http://www.tiktok.com/kmexectransportation)
