'use client'

import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, ArrowDown, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'

export interface DestinationHero {
  id: string
  code: string
  destination: string
  landmark: string
  country: string
  description: string
  highlights: string[]
  season: string
  recommendedDays: string
  videoUrl: string
  posterUrl: string
}

export const HERO_DESTINATIONS: DestinationHero[] = [
  {
    id: 'cristo-redentor',
    code: '01',
    destination: 'Rio de Janeiro',
    landmark: 'O Espetáculo do Cristo Redentor e as Baías Sagradas',
    country: 'Brasil',
    description:
      'Sobrevoe o Cristo Redentor em voo privativo de helicóptero, brinde ao pôr do sol no Morro da Urca com chef exclusivo e viva a energia inconfundível do Rio com acesso VIP aos cenários mais cobiçados do planeta.',
    highlights: [
      'Voo privativo de helicóptero sobre o Corcovado e Pão de Açúcar',
      'Acesso exclusivo aos pés do monumento antes do horário público',
      'Charter náutico privativo pelas Ilhas Cagarras com chef particular',
    ],
    season: 'Abril a Outubro',
    recommendedDays: '5 a 7 dias',
    videoUrl: '/media/destinations/01-rio.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'paris',
    code: '02',
    destination: 'Paris',
    landmark: 'A Elegância Eterna e o Ícone da Torre Eiffel',
    country: 'França',
    description:
      'Admire as luzes cintilantes da Torre Eiffel a bordo de um barco clássico de mogno pelo Rio Sena, deguste alta gastronomia em bistrôs estrelados e acesse o Museu do Louvre após o fechamento dos portões.',
    highlights: [
      'Visita noturna privada ao Museu do Louvre conduzida por historiador titular',
      'Cruzeiro privativo em barco de mogno Riva com jantar assinado por chef Michelin',
      'Voo de helicóptero às caves históricas subterrâneas de Champagne em Épernay',
    ],
    season: 'Maio a Outubro',
    recommendedDays: '7 a 10 dias',
    videoUrl: '/media/destinations/02-paris.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
  },
  {
    id: 'noronha',
    code: '03',
    destination: 'Fernando de Noronha',
    landmark: 'O Paraíso Esmeralda e as Praias Mais Bonitas do Mundo',
    country: 'Brasil',
    description:
      'Mergulhe em piscinas naturais cristalinas cercadas por golfinhos e tartarugas marinhas, contemple o pôr do sol dourado diante do Morro Dois Irmãos e descubra o santuário oceânico mais exclusivo do Brasil.',
    highlights: [
      'Mergulho de contemplação com biólogo marinho e registro fotográfico subaquático',
      'Pôr do sol reservado no Mirante dos Dois Irmãos com chef e sommelier local',
      'Charter privativo em veleiro contornando as praias mais intactas do arquipélago',
    ],
    season: 'Agosto a Janeiro',
    recommendedDays: '6 a 8 dias',
    videoUrl: '/media/destinations/03-noronha.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'maldivas',
    code: '04',
    destination: 'Maldivas',
    landmark: 'Águas Turquesa Cristalinas e Vilas Suspensas Sobre o Oceano',
    country: 'Oceano Índico',
    description:
      'Desperte sobre uma lagoa azul-turquesa infinita em bangalôs flutuantes com hidroavião privativo, jante sob as estrelas em bancos de areia isolados e viva o ápice do romance e relaxamento tropical.',
    highlights: [
      'Residência sobre a lagoa em atol privativo com hidroavião exclusivo',
      'Jantar sensorial sob as estrelas em banco de areia efêmero no meio do oceano',
      'Degustação vertical de safras raras em adega submersa a 6 metros sob o mar',
    ],
    season: 'Novembro a Abril',
    recommendedDays: '8 a 12 dias',
    videoUrl: '/media/destinations/04-maldivas.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2065&auto=format&fit=crop',
  },
  {
    id: 'santorini',
    code: '05',
    destination: 'Santorini',
    landmark: 'O Pôr do Sol Mais Deslumbrante do Mediterrâneo',
    country: 'Grécia',
    description:
      'Caminhe pelas vielas caiadas de branco e cúpulas azuis debruçadas sobre o penhasco do Mar Egeu, navegue em catamarã privativo pela caldeira vulcânica e encante-se com o entardecer mais famoso do mundo.',
    highlights: [
      'Charter privativo em catamarã pelas caldeiras vulcânicas ao pôr do sol',
      'Acesso fechado às ruínas de Akrotiri guiado por arqueólogo titular',
      'Degustação vertical de safras vulcânicas raras em adega de pedra de 300 anos',
    ],
    season: 'Maio a Outubro',
    recommendedDays: '6 a 9 dias',
    videoUrl: '/media/destinations/05-santorini.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'kyoto',
    code: '06',
    destination: 'Kyoto',
    landmark: 'A Serenidade Sagrada dos Templos Milenares e Bosques Zen',
    country: 'Japão',
    description:
      'Perca-se na magia milenar da Floresta de Bambu de Arashiyama ao amanhecer, encante-se com o brilho reluzente do Pavilhão Dourado Kinkaku-ji e sinta a profunda harmonia da cerimônia do chá ancestral.',
    highlights: [
      'Cerimônia do chá privativa conduzida por grão-mestre de 15ª geração',
      'Acesso matinal exclusivo ao Templo Dourado de Kinkaku-ji antes do público',
      'Jantar kaiseki em templo budista zen com monges titulares',
    ],
    season: 'Março a Maio & Outubro a Novembro',
    recommendedDays: '7 a 10 dias',
    videoUrl: '/media/destinations/06-kyoto.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'dolomitas',
    code: '07',
    destination: 'Dolomitas',
    landmark: 'A Majestade dos Alpes Italianos e Lagos de Cristal',
    country: 'Itália',
    description:
      'Contemple as imponentes muralhas de rocha rosada do Tre Cime di Lavaredo, navegue pelas águas esmeralda do Lago di Braies em barcos de madeira clássicos e desfrute de refúgios alpinos cinematográficos no coração da Itália.',
    highlights: [
      'Charter privativo em lancha de mogno Riva Aquarama pelo Lago di Como',
      'Heliesqui exclusivo com guia alpino sênior e refúgio privativo nas Dolomitas',
      'Degustação de safras raras em adega de castelo medieval exclusivo',
    ],
    season: 'Junho a Setembro ou Dezembro a Março',
    recommendedDays: '8 a 12 dias',
    videoUrl: '/media/destinations/07-dolomitas.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'serengeti',
    code: '08',
    destination: 'Serengeti',
    landmark: 'O Maior Espetáculo da Vida Selvagem na Savana Africana',
    country: 'Tanzânia',
    description:
      'Sobrevoe a imensidão dourada da savana em balão de ar quente ao nascer do sol, presencie a lendária Grande Migração de leões e manadas em safáris fotográficos 4x4 e descanse sob o céu estrelado em tendas de safári ultraluxuosas.',
    highlights: [
      'Safári em balão de ar quente ao amanhecer seguido de café da manhã imperial na savana',
      'Expedição 4x4 privativa acompanhada por zoólogo sênior da reserva',
      'Tendas de luxo ultraconfortáveis com mordomo dedicado sob as estrelas',
    ],
    season: 'Junho a Outubro',
    recommendedDays: '7 a 10 dias',
    videoUrl: '/media/destinations/08-serengeti.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'dubai',
    code: '09',
    destination: 'Dubai',
    landmark: 'Arranha-Céus Futuristas e a Vanguarda Arquitetônica',
    country: 'Emirados Árabes',
    description:
      'Sobrevoe as torres monumentais de Downtown Dubai e o icônico Burj Khalifa, deslumbre-se com o design arrojado da cidade do futuro e desfrute de experiências 7 estrelas no epicentro do luxo mundial.',
    highlights: [
      'Acampamento privativo de luxo em dunas isoladas com falcoaria real',
      'Sobrevoo em helicóptero privativo sobre a costa e os arquipélagos artificiais',
      'Jantar sensorial preparado por chef Michelin sob o céu estrelado do deserto',
    ],
    season: 'Novembro a Março',
    recommendedDays: '5 a 8 dias',
    videoUrl: '/media/destinations/09-dubai.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'borabora',
    code: '10',
    destination: 'Bora Bora',
    landmark: 'A Pérola do Pacífico Sul sob o Majestoso Monte Otemanu',
    country: 'Polinésia Francesa',
    description:
      'Flutue sobre as lagoas azul-turquesa mais famosas do mundo diante da silhueta verdejante do Monte Otemanu, nade com arraias dóceis em recifes de corais multicoloridos e celebre a vida em bangalôs suspensos dos sonhos.',
    highlights: [
      'Bangalô sobre a água com piscina de borda infinita e piso de vidro sobre o recife',
      'Expedição privativa em catamarã para nadar com arraias e tubarões em baías secretas',
      'Jantar polinésio privativo servido na praia de um motu deserto ao entardecer',
    ],
    season: 'Maio a Outubro',
    recommendedDays: '8 a 12 dias',
    videoUrl: '/media/destinations/10-borabora.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop',
  },
]

export default function HeroCinematic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isAutoCycling, setIsAutoCycling] = useState(true)

  const current = HERO_DESTINATIONS[activeIndex]

  // Auto cycle destination every 8.5 seconds
  useEffect(() => {
    if (!isAutoCycling || !isPlaying) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_DESTINATIONS.length)
    }, 8500)
    return () => clearInterval(timer)
  }, [isAutoCycling, isPlaying])

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      gsap.from('.hero-content-block', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
      })
    },
    { scope: containerRef, dependencies: [activeIndex] }
  )

  const handleSelectDestination = (index: number) => {
    setActiveIndex(index)
    setIsAutoCycling(false)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_DESTINATIONS.length)
    setIsAutoCycling(false)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_DESTINATIONS.length) % HERO_DESTINATIONS.length)
    setIsAutoCycling(false)
  }

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
    setIsAutoCycling(false)
  }

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const el = document.getElementById(targetId)
    if (el) {
      const top = window.scrollY + el.getBoundingClientRect().top - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={containerRef}
      aria-label="Apresentação Cinematográfica Lopez Travel"
      className="relative isolate h-screen min-h-[700px] w-full overflow-hidden bg-[#060A18] text-champagne flex flex-col justify-start"
    >
      {/* 1. Full-Screen Cinematic Video Background Layer */}
      <div className="absolute inset-0 h-full w-full z-0">
        {HERO_DESTINATIONS.map((dest, idx) => {
          const isActive = idx === activeIndex
          // Intelligent preloading: only mount video if active or immediately adjacent
          const shouldMountVideo =
            Math.abs(idx - activeIndex) <= 1 ||
            (activeIndex === 0 && idx === HERO_DESTINATIONS.length - 1) ||
            (activeIndex === HERO_DESTINATIONS.length - 1 && idx === 0)

          return (
            <div
              key={dest.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background High-Res Poster Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${dest.posterUrl})` }}
              />

              {/* Dynamic Video Loop */}
              {shouldMountVideo && (
                <video
                  src={dest.videoUrl}
                  poster={dest.posterUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="relative h-full w-full object-cover object-center brightness-[0.72] contrast-[1.08]"
                />
              )}
            </div>
          )
        })}

        {/* Cinematic Vignettes & Gradients for Supreme Legibility */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#060A18] via-[#060A18]/40 to-transparent" />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#060A18]/80 via-[#060A18]/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-36 z-20 bg-gradient-to-b from-[#060A18]/90 to-transparent" />
      </div>

      {/* 2. Elevated Content (Upper Third) */}
      <div className="relative z-30 mx-auto w-full max-w-7xl px-6 md:px-12 pt-36 sm:pt-40 md:pt-44 lg:pt-48">
        <div className="hero-content-block max-w-3xl">
          {/* Monumental Destination Heading */}
          <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-champagne leading-[0.95] mb-4">
            {current.destination}
          </h1>

          {/* Subtitle / Key Landmark */}
          <p className="font-editorial italic text-2xl sm:text-3xl md:text-4xl text-gold-light/95 tracking-wide mb-6">
            {current.landmark}
          </p>

          {/* Description */}
          <p className="max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed text-champagne/90 mb-8">
            {current.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#planeje-sua-viagem"
              onClick={(e) => handleSmoothScroll(e, 'planeje-sua-viagem')}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy-950 transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-[1.02]"
            >
              <span>Solicitar Roteiro Sob Medida</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#destinos"
              onClick={(e) => handleSmoothScroll(e, 'destinos')}
              className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-[#060A18]/40 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-champagne/90 backdrop-blur-md transition-all duration-300 hover:border-gold hover:text-gold hover:bg-gold/10"
            >
              <span>Explorar Destinos</span>
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Bottom Minimalist Luxury Controls */}
      <div className="absolute bottom-8 right-6 md:right-12 z-30 flex items-center gap-3">
        {/* Destination Dashes */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {HERO_DESTINATIONS.map((dest, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={dest.id}
                onClick={() => handleSelectDestination(idx)}
                className="group relative py-2 focus:outline-none"
                aria-label={`Destino ${dest.code}: ${dest.destination}`}
              >
                <div
                  className={`h-0.5 transition-all duration-500 rounded-full ${
                    isActive
                      ? 'w-6 sm:w-7 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                      : 'w-2 sm:w-2.5 bg-champagne/30 group-hover:bg-champagne/60 group-hover:w-4'
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* Minimal Play/Pause */}
        <button
          onClick={togglePlay}
          className="p-1 text-champagne/60 hover:text-gold transition-colors"
          aria-label={isPlaying ? 'Pausar ciclo automático' : 'Iniciar ciclo automático'}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>
    </section>
  )
}
