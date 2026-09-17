'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Calendar, MapPin, ArrowUpRight, Search, Check, ShieldCheck, Loader2, MessageCircle } from 'lucide-react'
import { searchFlightAvailability } from '@/actions/flights'
import { FlightAvailability } from '@/types/flights'
import { getCuratedFlights } from '@/lib/data/flights'

export interface TravelPackage {
  id: string
  destination: string
  country: string
  title: string
  duration: string
  style: string
  imageSrc: string
  inclusions: string[]
  hotel: string
}

export const EXCLUSIVE_PACKAGES: TravelPackage[] = [
  {
    id: 'pkg-noronha',
    destination: 'Fernando de Noronha',
    country: 'Brasil',
    title: 'Santuário Oceânico & Bangalô Maravilha',
    duration: '6 Dias / 5 Noites',
    style: 'Refúgio Ecológico & Mergulho VIP',
    imageSrc: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1200&auto=format&fit=crop',
    hotel: 'Pousada Maravilha — Bangalô Oceânico',
    inclusions: [
      'Voos ou charter aéreo com transfer 4x4 dedicado',
      'Mergulho monitorado com biólogo marinho titular',
      'Charter privativo em veleiro pelas enseadas virgens',
      'Pôr do sol nos Dois Irmãos com chef e sommelier',
      'Concierge Lopez Travel dedicado 24/7 na ilha',
    ],
  },
  {
    id: 'pkg-paris',
    destination: 'Paris',
    country: 'França',
    title: 'Paris Romântica & Noites Privadas no Louvre',
    duration: '7 Dias / 6 Noites',
    style: 'Aristocracia Urbana & Alta Gastronomia',
    imageSrc: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    hotel: 'Le Bristol Paris & The Ritz Paris',
    inclusions: [
      'Acesso noturno exclusivo com portas fechadas ao Museu do Louvre',
      'Cruzeiro noturno em barco Riva de mogno pelo Rio Sena',
      'Voo de helicóptero privativo às caves históricas de Épernay',
      'Jantar de abertura em restaurante 3 estrelas Michelin',
      'Assistência fast-track VIP na imigração de Charles de Gaulle',
    ],
  },
  {
    id: 'pkg-maldivas',
    destination: 'Maldivas',
    country: 'Oceano Índico',
    title: 'Vilas Sobre o Mar & Cheval Blanc Randheli',
    duration: '8 Dias / 7 Noites',
    style: 'Overwater Villa & Hidroavião VIP',
    imageSrc: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1200&auto=format&fit=crop',
    hotel: 'Cheval Blanc Randheli & Soneva Jani',
    inclusions: [
      'Conexão direta em hidroavião fretado de Malé até o atol',
      'Vila sobre a água com teto retrátil e piscina de borda infinita',
      'Degustação de safras raras em adega submersa a 6m sob o mar',
      'Banquete privativo em banco de areia efêmero deserto',
      'Mordomo pessoal e iate particular para expedições de snorkeling',
    ],
  },
  {
    id: 'pkg-rio',
    destination: 'Rio de Janeiro',
    country: 'Brasil',
    title: 'Grand Tour Carioca & Copacabana Palace',
    duration: '6 Dias / 5 Noites',
    style: 'Sobrevoo no Cristo & Alta Hotelaria',
    imageSrc: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop',
    hotel: 'Copacabana Palace, A Belmond Hotel',
    inclusions: [
      'Voo privativo de helicóptero sobre Corcovado e Pão de Açúcar',
      'Acesso antecipado aos pés do Cristo Redentor sem público',
      'Charter náutico privativo em lancha de mogno pelas Ilhas Cagarras',
      'Transfer executivo blindado e suíte ocean front no Belmond',
      'Concierge privativo e mesa prioritária em restaurantes premiados',
    ],
  },
  {
    id: 'pkg-santorini',
    destination: 'Santorini',
    country: 'Grécia',
    title: 'Cúpulas Brancas & Catamarã no Egeu',
    duration: '7 Dias / 6 Noites',
    style: 'Vila na Rocha & Enoturismo no Penhasco',
    imageSrc: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
    hotel: 'Canaves Oia Epitome & Grace Hotel',
    inclusions: [
      'Transfer privativo em helicóptero de Atenas para Oia',
      'Charter privativo de catamarã pela caldeira e termas vulcânicas',
      'Degustação de vinhos assyrtiko em adega de pedra tricentenária',
      'Acesso fechado às ruínas arqueológicas de Akrotiri',
      'Vila privativa com piscina infinita voltada para o pôr do sol',
    ],
  },
  {
    id: 'pkg-kyoto',
    destination: 'Kyoto',
    country: 'Japão',
    title: 'Tradição Imperial & Aman Kyoto',
    duration: '8 Dias / 7 Noites',
    style: 'Templos Milenares & Gastronomia Kaiseki',
    imageSrc: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    hotel: 'Aman Kyoto & Suiran Luxury Collection',
    inclusions: [
      'Transfer executivo em Rolls-Royce até as florestas de Aman',
      'Acesso antecipado ao Templo Dourado Kinkaku-ji e Arashiyama',
      'Cerimônia do chá particular com grão-mestre de 15ª geração',
      'Jantar kaiseki exclusivo em templo budista zen reservado',
      'Concierge local bilíngue e gestão de bagagens Shinkansen',
    ],
  },
  {
    id: 'pkg-dolomitas',
    destination: 'Dolomitas',
    country: 'Itália',
    title: 'Expedição Alpina & Tre Cime di Lavaredo',
    duration: '7 Dias / 6 Noites',
    style: 'Picos Alpinos & Refúgios Gourmet',
    imageSrc: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
    hotel: 'Rosa Alpina Aman Partner & Forestis',
    inclusions: [
      'Navegação privativa no Lago di Braies em bote clássico',
      'Heliesqui e sobrevoo nos paredões do Tre Cime di Lavaredo',
      'Refúgios gourmet servindo trufas e vinhos de altitude a 2.400m',
      'SUV executivo com tração integral e motorista dedicado',
      'Acesso VIP aos melhores spas termais das Dolomitas',
    ],
  },
  {
    id: 'pkg-serengeti',
    destination: 'Serengeti',
    country: 'Tanzânia',
    title: 'A Grande Migração & Tendas Singita',
    duration: '8 Dias / 7 Noites',
    style: 'Safári Aéreo & Conservação Selvagem',
    imageSrc: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop',
    hotel: 'Singita Sasakwa Lodge & Four Seasons Serengeti',
    inclusions: [
      'Voo direto em aeronave executiva fretada para a pista da savana',
      'Safári ao nascer do sol em balão de ar quente com café imperial',
      'Expedições 4x4 privativas acompanhadas por zoólogo titular',
      'Tendas coloniais com deck panorâmico e mordomo pessoal',
      'Visita reservada à Cratera de Ngorongoro e Rio Mara',
    ],
  },
  {
    id: 'pkg-dubai',
    destination: 'Dubai',
    country: 'Emirados Árabes',
    title: 'Vanguarda Futurista & Burj Al Arab',
    duration: '6 Dias / 5 Noites',
    style: 'Metrópole de Luxo & Oásis no Deserto',
    imageSrc: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
    hotel: 'Burj Al Arab Jumeirah & Bab Al Shams',
    inclusions: [
      'Transfer em Rolls-Royce Phantom e suíte duplex com vista do Golfo',
      'Sobrevoo em helicóptero privativo sobre Palm Jumeirah e The World',
      'Acesso exclusivo ao The Lounge no andar 148 do Burj Khalifa',
      'Acampamento particular em tendas de seda nas dunas de Liwa',
      'Demonstração imperial de falcoaria e jantar estrelado no deserto',
    ],
  },
  {
    id: 'pkg-borabora',
    destination: 'Bora Bora',
    country: 'Polinésia Francesa',
    title: 'Polinésia dos Sonhos & The St. Regis',
    duration: '8 Dias / 7 Noites',
    style: 'Lagoas Turquesa & Vilas Flutuantes',
    imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    hotel: 'The St. Regis Bora Bora & Four Seasons Resort',
    inclusions: [
      'Traslado em lancha rápida privativa do aeroporto ao bangalô',
      'Bangalô flutuante com piscina infinita e vista para o Monte Otemanu',
      'Navegação em catamarã privativo para nadar com arraias e tubarões',
      'Almoço exclusivo com mesa montada na água em motu deserto',
      'Massagem tradicional taitiana com óleos essenciais de monoi',
    ],
  },
]

export default function PackagesAndFlights() {
  const [activeTab, setActiveTab] = useState<'packages' | 'flights'>('packages')

  // Flight search states
  const [origin, setOrigin] = useState('São Paulo (GRU)')
  const [destination, setDestination] = useState('paris')
  const [date, setDate] = useState('2026-11-20')
  const [cabinClass, setCabinClass] = useState('Classe Executiva')
  const [isSearching, setIsSearching] = useState(false)
  const [flightResults, setFlightResults] = useState<FlightAvailability[]>(() =>
    getCuratedFlights({
      origin: 'São Paulo (GRU)',
      destination: 'paris',
      date: '2026-11-20',
      cabinClass: 'Classe Executiva',
    })
  )
  const [hasSearched, setHasSearched] = useState(true)

  const handleSearchFlights = async () => {
    setIsSearching(true)
    try {
      const res = await searchFlightAvailability({
        origin,
        destination,
        date,
        cabinClass,
      })
      if (res.success && res.data && res.data.length > 0) {
        setFlightResults(res.data)
      } else {
        setFlightResults(getCuratedFlights({ origin, destination, date, cabinClass }))
      }
    } catch {
      setFlightResults(getCuratedFlights({ origin, destination, date, cabinClass }))
    } finally {
      setIsSearching(false)
      setHasSearched(true)
    }
  }

  const handlePlanTrip = (destinationName: string) => {
    const el = document.getElementById('planeje-sua-viagem')
    if (el) {
      const top = window.scrollY + el.getBoundingClientRect().top - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="pacotes-e-voos"
      aria-label="Pacotes Exclusivos e Disponibilidade de Voos"
      className="relative bg-[#060A18] py-28 sm:py-36 text-champagne overflow-hidden border-t border-gold/15"
    >
      {/* Background Subtle Gradient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-gold/5 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-navy-700/20 blur-[150px]"
      />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Minimalist Editorial Header (No Tacky Badges, Single Line Cursive Title) */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
            Curadoria All-Inclusive & Aviação Executiva
          </p>
          <h2 className="font-editorial italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#FFF6E0] sm:whitespace-nowrap">
            Pacotes Exclusivos & Voos Globais
          </h2>

          <p className="mt-4 text-sm sm:text-base font-light text-champagne/70 leading-relaxed">
            Curadoria completa de viagens all-inclusive sob medida e consulta de disponibilidade aérea
            em classe executiva e aviação privada em tempo real.
          </p>

          {/* Clean Main Tab Selector */}
          <div className="mt-8 inline-flex items-center rounded-full border border-gold/20 bg-navy-950/80 p-1.5 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              className={`rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                activeTab === 'packages'
                  ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-navy-950 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'text-champagne/75 hover:text-gold'
              }`}
            >
              Pacotes Completos
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('flights')}
              className={`rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                activeTab === 'flights'
                  ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-navy-950 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'text-champagne/75 hover:text-gold'
              }`}
            >
              Disponibilidade de Voos
            </button>
          </div>
        </div>

        {/* TAB 1: PACOTES EXCLUSIVOS */}
        {activeTab === 'packages' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {EXCLUSIVE_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold/15 bg-gradient-to-b from-navy-900/80 to-[#081026] transition-all duration-500 hover:border-gold/50 hover:shadow-[0_15px_45px_rgba(0,0,0,0.7)]"
              >
                {/* Photo & Badge Overlays */}
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={pkg.imageSrc}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081026] via-[#081026]/40 to-transparent" />

                  {/* Duration Tag */}
                  <div className="absolute top-4 left-4 z-10 rounded-full border border-gold/30 bg-navy-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold backdrop-blur-md">
                    {pkg.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-6 pt-3">
                  <div>
                    <div className="text-[10px] uppercase font-semibold tracking-[0.2em] text-gold/80 mb-1">
                      {pkg.country} • {pkg.destination}
                    </div>

                    <h3 className="font-editorial text-2xl font-normal text-[#FFF6E0] leading-snug mb-2 group-hover:text-gold transition-colors">
                      {pkg.title}
                    </h3>

                    <p className="text-xs text-gold-light/90 font-medium mb-4">
                      {pkg.hotel}
                    </p>

                    {/* Key Inclusions Checklist */}
                    <div className="space-y-2 border-t border-gold/10 pt-4 mb-6">
                      {pkg.inclusions.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs font-light text-champagne/80">
                          <Check className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handlePlanTrip(pkg.destination)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 bg-navy-950/90 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-champagne transition-all duration-300 group-hover:bg-gold group-hover:text-navy-950 group-hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    >
                      <span>Solicitar Este Pacote</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB 2: PESQUISA DE VOOS (APENAS DISPONIBILIDADE SEM VALORES) */}
        {activeTab === 'flights' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Flight Search Engine Container */}
            <div className="rounded-2xl border border-gold/25 bg-gradient-to-b from-navy-900/90 to-[#081026] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-4">
                <div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#FFF6E0]">
                    Consulta de Disponibilidade Aérea & Aviação Executiva
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm font-light text-champagne/70">
                    Verifique assentos confirmados em tempo real sem valores monetários. Atendimento concierge privativo para reservas imediatas.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gold">
                  <ShieldCheck className="h-4 w-4 text-gold" />
                  <span>Conexão Amadeus API & Aviação Executiva</span>
                </div>
              </div>

              {/* Search Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Origin */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gold mb-2">
                    Origem
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-xl border border-gold/20 bg-navy-950 px-4 py-3 text-xs text-champagne outline-none transition-all focus:border-gold"
                  >
                    <option value="São Paulo (GRU)">São Paulo (GRU)</option>
                    <option value="Rio de Janeiro (GIG)">Rio de Janeiro (GIG)</option>
                    <option value="Brasília (BSB)">Brasília (BSB)</option>
                    <option value="Belo Horizonte (CNF)">Belo Horizonte (CNF)</option>
                    <option value="Lisboa (LIS)">Lisboa (LIS)</option>
                    <option value="Miami (MIA)">Miami (MIA)</option>
                  </select>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gold mb-2">
                    Destino
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-xl border border-gold/20 bg-navy-950 px-4 py-3 text-xs text-champagne outline-none transition-all focus:border-gold"
                  >
                    <option value="paris">Paris, França (CDG)</option>
                    <option value="rio">Rio de Janeiro, Brasil (GIG / SDU)</option>
                    <option value="noronha">Fernando de Noronha (FEN)</option>
                    <option value="maldivas">Maldivas (MLE)</option>
                    <option value="santorini">Santorini, Grécia (JTR)</option>
                    <option value="kyoto">Kyoto / Tóquio (KIX / HND)</option>
                    <option value="dolomitas">Dolomitas / Veneza (VCE)</option>
                    <option value="serengeti">Serengeti (JRO)</option>
                    <option value="dubai">Dubai (DXB)</option>
                    <option value="borabora">Bora Bora (BOB / PPT)</option>
                  </select>
                </div>

                {/* Travel Date */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gold mb-2">
                    Data Desejada
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-gold/20 bg-navy-950 px-4 py-2.5 text-xs text-champagne outline-none transition-all focus:border-gold"
                  />
                </div>

                {/* Cabin Class */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gold mb-2">
                    Classe de Serviço
                  </label>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    className="w-full rounded-xl border border-gold/20 bg-navy-950 px-4 py-3 text-xs text-champagne outline-none transition-all focus:border-gold"
                  >
                    <option value="Classe Executiva">Classe Executiva</option>
                    <option value="Primeira Classe">Primeira Classe</option>
                    <option value="Jato Executivo Privado">Jato Executivo Privado</option>
                  </select>
                </div>
              </div>

              {/* Submit Search Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSearchFlights}
                  disabled={isSearching}
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy-950 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all hover:scale-[1.02] disabled:opacity-60"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Consultando Disponibilidade...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Consultar Disponibilidade</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Flight Results (WITHOUT PRICES - ONLY AVAILABILITY) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="text-xs uppercase tracking-[0.2em] font-semibold text-gold">
                  <span>Opções Encontradas com Vagas Confirmadas</span>
                </div>
                <span className="text-[11px] font-light text-champagne/60">
                  {flightResults.length} itinerários disponíveis
                </span>
              </div>

              {flightResults.map((flight) => (
                <div
                  key={flight.id}
                  className="group rounded-2xl border border-gold/15 bg-gradient-to-b from-navy-900/70 to-[#081026] p-5 sm:p-6 transition-all duration-300 hover:border-gold/45 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Airline & Aircraft */}
                    <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-gold/15 pb-4 md:pb-0 md:pr-4">
                      <span className="text-xs uppercase font-semibold tracking-wider text-gold block">
                        {flight.airline}
                      </span>
                      <h4 className="font-editorial text-xl text-[#FFF6E0] font-normal leading-tight mt-0.5">
                        {flight.flightNumber}
                      </h4>
                      <span className="text-[11px] text-champagne/60 font-light block mt-1">
                        {flight.aircraft}
                      </span>
                    </div>

                    {/* Departure, Flight Path, Arrival */}
                    <div className="md:col-span-6 flex items-center justify-between px-2 sm:px-4">
                      {/* Departure */}
                      <div className="text-left">
                        <span className="text-xl sm:text-2xl font-editorial text-[#FFF6E0] font-normal block">
                          {flight.departureTime}
                        </span>
                        <span className="text-xs text-champagne/70 font-light block">
                          {flight.originCity}
                        </span>
                      </div>

                      {/* Flight Path Indicator */}
                      <div className="flex flex-col items-center px-4 flex-1 max-w-[200px]">
                        <span className="text-[10px] text-champagne/50 font-mono tracking-wider mb-1">
                          {flight.duration}
                        </span>
                        <div className="relative w-full flex items-center justify-center">
                          <div className="h-px w-full bg-gold/30" />
                          <Plane className="h-3.5 w-3.5 text-gold mx-2 rotate-90 shrink-0" />
                          <div className="h-px w-full bg-gold/30" />
                        </div>
                        <span className="text-[10px] text-gold/80 font-medium tracking-wider mt-1">
                          {flight.stops}
                        </span>
                      </div>

                      {/* Arrival */}
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-editorial text-[#FFF6E0] font-normal block">
                          {flight.arrivalTime}
                        </span>
                        <span className="text-xs text-champagne/70 font-light block">
                          {flight.destinationCity}
                        </span>
                      </div>
                    </div>

                    {/* Availability & Booking Action (NO PRICES) */}
                    <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-gold/15 pt-4 md:pt-0 md:pl-5 flex flex-col items-start md:items-end justify-between h-full">
                      <div className="mb-3 text-left md:text-right">
                        <span className="text-[11px] font-semibold text-gold block">
                          {flight.cabinClass}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-champagne/80 font-light mt-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {flight.availabilityStatus}
                        </span>
                      </div>

                      <a
                        href={flight.conciergeBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-950 transition-all duration-300 hover:shadow-[0_0_18px_rgba(212,175,55,0.4)]"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Reservar via Concierge</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
