import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kmexecutivetransportation.com'),
  title: 'Tampa Bay Luxury Transportation Services | KM Executive Transportation',
  description:
    'Experience top-notch Tampa Bay luxury transportation services with KM Executive Transportation. Book now!',
  keywords: [
    'Tampa Bay luxury transportation',
    'executive chauffeur Tampa',
    'private car service Tampa',
    'airport transfers Tampa',
    'black car service Tampa Bay',
  ],
  openGraph: {
    title: 'Tampa Bay Luxury Transportation Services | KM Executive Transportation',
    description:
      'Experience top-notch Tampa Bay luxury transportation services with KM Executive Transportation. Book now!',
    url: 'https://www.kmexecutivetransportation.com',
    siteName: 'KM Executive Transportation',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/assets/vehicle/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'KM Executive Transportation — Black Chevrolet Suburban',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tampa Bay Luxury Transportation | KM Executive Transportation',
    description: 'Premium private chauffeur service across Tampa Bay — 24/7 airport & executive rides.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
