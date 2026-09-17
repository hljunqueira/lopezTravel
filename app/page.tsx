import React from 'react'
import Navbar from '@/components/site/Navbar'
import HeroCinematic from '@/components/site/HeroCinematic'
import DestinationActivities from '@/components/site/DestinationActivities'
import PackagesAndFlights from '@/components/site/PackagesAndFlights'
import Destinations from '@/components/site/Destinations'
import SignatureItinerary from '@/components/site/SignatureItinerary'
import Experience from '@/components/site/Experience'
import LeadForm from '@/components/site/LeadForm'
import Footer from '@/components/site/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-navy-950 text-champagne selection:bg-gold selection:text-navy-950">
      <Navbar />
      <HeroCinematic />
      <Destinations />
      <DestinationActivities />
      <PackagesAndFlights />
      <SignatureItinerary />
      <Experience />
      <LeadForm />
      <Footer />
    </main>
  )
}
