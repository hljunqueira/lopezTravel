'use client'

import Navbar from '@/components/site/Navbar'
import Hero from '@/components/site/Hero'
import Destinations from '@/components/site/Destinations'
import Experience from '@/components/site/Experience'
import LeadForm from '@/components/site/LeadForm'
import Footer from '@/components/site/Footer'

export default function App() {
  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <Hero />
      <Destinations />
      <Experience />
      <LeadForm />
      <Footer />
    </main>
  )
}
