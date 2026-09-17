'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface DestinationItem {
  id: string
  name: string
  region: string
  category: string
  coordinates: string
  image: string
  season: string
  tag: string
  span: string
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'maldivas',
    name: 'Soneva Jani & Cheval Blanc',
    region: 'Maldivas · Oceano Índico',
    category: 'Vilas Sobre as Águas',
    coordinates: "5° 22' N · 73° 21' E",
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?crop=entropy&cs=srgb&fm=jpg&q=85',
    season: 'Melhor Época: Nov — Abr',
    tag: 'Reserva Exclusiva',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    id: 'santorini',
    name: 'Falésias de Oia & Mar Egeu',
    region: 'Grécia · Ilhas Cíclades',
    category: 'Vilas Privadas & Iates',
    coordinates: "36° 27' N · 25° 22' E",
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?crop=entropy&cs=srgb&fm=jpg&q=85',
    season: 'Melhor Época: Mai — Out',
    tag: 'Iate Privativo',
    span: 'lg:col-span-1',
  },
  {
    id: 'kyoto',
    name: 'Kyoto & Aman Ryokan',
    region: 'Japão · Honshu Ocidental',
    category: 'Cultura & Gastronomia Kaiseki',
    coordinates: "35° 01' N · 135° 46' E",
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=srgb&fm=jpg&q=85',
    season: 'Melhor Época: Mar — Mai',
    tag: 'Acesso Antecipado',
    span: 'lg:col-span-1',
  },
  {
    id: 'dolomitas',
    name: 'Dolomitas & Lago di Como',
    region: 'Itália · Alpes Setentrionais',
    category: 'Chalés & Navegação Riva',
    coordinates: "46° 26' N · 11° 51' E",
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?crop=entropy&cs=srgb&fm=jpg&q=85',
    season: 'Melhor Época: Jun — Set',
    tag: 'Heliesqui & Riva Privée',
    span: 'lg:col-span-2',
  },
  {
    id: 'serengeti',
    name: 'Planícies do Serengeti',
    region: 'Tanzânia · África Oriental',
    category: 'Safári Aéreo & Conservação',
    coordinates: "2° 19' S · 34° 50' E",
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?crop=entropy&cs=srgb&fm=jpg&q=85',
    season: 'Melhor Época: Jul — Out',
    tag: 'Expedição Privativa',
    span: 'lg:col-span-1',
  },
]

export default function Destinations() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      gsap.from('.dest-header', {
        y: 35,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      gsap.from('.dest-card-item', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.dest-grid-wrapper',
          start: 'top 75%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section id="destinos" ref={sectionRef} className="relative bg-navy-950 py-28 sm:py-36">
      {/* Background Subtle Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-900/40 via-navy-950 to-navy-950" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="dest-header mb-16 flex flex-col items-start justify-between gap-8 border-b border-gold/15 pb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
              Coleções & Destinos Selecionados
            </p>
            <h2 className="font-editorial italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#FFF6E0]">
              Lugares que Merecem Ser Vividos com Discrição
            </h2>
          </div>
          <p className="max-w-md text-sm font-light leading-relaxed text-champagne/70">
            Nossa equipe de especialistas inspeciona pessoalmente cada hotel, vila privativa e parceiro de aviação.
            Garantimos acomodações de nível presidencial e acesso prioritário global.
          </p>
        </div>

        {/* Bento / Editorial Grid */}
        <div className="dest-grid-wrapper grid auto-rows-[280px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((dest) => (
            <article
              key={dest.id}
              className={`dest-card-item group relative overflow-hidden rounded-2xl border border-gold/15 bg-navy-900 shadow-[0_4px_30px_rgba(0,0,0,0.6)] transition-all duration-500 hover:border-gold/45 ${dest.span}`}
            >
              {/* Image */}
              <Image
                src={dest.image}
                alt={`${dest.name}, ${dest.region}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:brightness-95"
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
              <div className="absolute inset-0 bg-navy-950/20 transition-opacity duration-500 group-hover:opacity-0" />

              {/* Card Top Bar */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
                <span className="rounded-full border border-gold/40 bg-navy-950/75 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gold backdrop-blur-md">
                  {dest.tag}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-champagne/60">
                  {dest.coordinates}
                </span>
              </div>

              {/* Card Content Bottom */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold/90">
                  {dest.category}
                </p>
                <div className="mt-1.5 flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-champagne sm:text-3xl">
                      {dest.name}
                    </h3>
                    <p className="mt-1 text-xs font-light text-champagne/70">
                      {dest.region} · <span className="text-gold/80">{dest.season}</span>
                    </p>
                  </div>
                  <a
                    href="#contato"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-navy-950/70 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-navy-950"
                    aria-label={`Consultar roteiro para ${dest.name}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
