import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Pricing from '@/components/Pricing'
import ContactForm from '@/components/ContactForm'
import Testimonials from '@/components/Testimonials'
import Coverage from '@/components/Coverage'
import Footer from '@/components/Footer'
import FloatingContact from '@/components/FloatingContact'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Pricing />
        <Testimonials />
        <Coverage />
        <ContactForm />
      </main>
      <Footer />
      <FloatingContact />
    </>
  )
}
