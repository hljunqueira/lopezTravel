'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const DESTINATIONS = [
  {
    name: 'Santorini',
    region: 'Grécia',
    tag: 'Ilhas do Egeu',
    img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxTYW50b3Jpbml8ZW58MHx8fHwxNzg5NTk0ODY5fDA&ixlib=rb-4.1.0&q=85',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    name: 'Maldivas',
    region: 'Índico',
    tag: 'Overwater Villas',
    img: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxNYWxkaXZlc3xlbnwwfHx8fDE3ODk1OTQ4Njl8MA&ixlib=rb-4.1.0&q=85',
    span: '',
  },
  {
    name: 'Dubai',
    region: 'Emirados Árabes',
    tag: 'Luxo Urbano',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxEdWJhaXxlbnwwfHx8fDE3ODk1OTQ4NzV8MA&ixlib=rb-4.1.0&q=85',
    span: '',
  },
  {
    name: 'Paris',
    region: 'França',
    tag: 'Cultura & Gastronomia',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwzfHxQYXJpc3xlbnwwfHx8fDE3ODk1OTQ4NzV8MA&ixlib=rb-4.1.0&q=85',
    span: 'lg:col-span-2',
  },
]

export default function Destinations() {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      gsap.from('.dest-head', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      })
      gsap.from('.dest-card', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.dest-grid', start: 'top 80%' },
      })
    },
    { scope: rootRef }
  )

  return (
    <section id="destinos" ref={rootRef} className="relative bg-navy py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="dest-head mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">Destinos em destaque</p>
            <h2 className="max-w-xl font-display text-3xl font-medium leading-tight text-champagne sm:text-4xl lg:text-5xl">
              Lugares que merecem ser vividos sem pressa.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-champagne/60">
            Selecionamos cada endereço, hotel e experiência pessoalmente. Nada em nossos roteiros é deixado ao acaso.
          </p>
        </div>

        <div className="dest-grid grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <article
              key={d.name}
              className={`dest-card group relative overflow-hidden rounded-2xl ${d.span}`}
            >
              <Image
                src={d.img}
                alt={`${d.name}, ${d.region}`}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">{d.tag}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-medium text-champagne">{d.name}</h3>
                    <p className="text-sm text-champagne/60">{d.region}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
