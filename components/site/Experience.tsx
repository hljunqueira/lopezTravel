'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ShieldCheck, Compass, Headset, Crown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PILLARS = [
  {
    title: 'Design de Viagens Sob Medida',
    tag: 'Roteiros Exclusivos',
    description:
      'Nenhum itinerário é pré-fabricado. Cada detalhe é desenhado a partir do seu perfil, ritmo e ocasião pessoal por consultores seniores.',
    icon: Compass,
  },
  {
    title: 'Acesso Irrestrito',
    tag: 'Parcerias Globais',
    description:
      'Acesso a palácios fechados ao público, reservas prioritárias em restaurantes 3 estrelas Michelin e vilas com mordomo e chef executivo dedicado.',
    icon: Crown,
  },
  {
    title: 'Concierge Privativo 24/7',
    tag: 'Acompanhamento Total',
    description:
      'Um único ponto de contato cuida de você antes, durante e após a jornada, antecipando imprevistos com aeronaves reservas e planos de contingência.',
    icon: Headset,
  },
  {
    title: 'Discrição & Segurança',
    tag: 'Privacidade Absoluta',
    description:
      'Garantia de confidencialidade estrita, seguros internacionais de alta cobertura e gestão de privacidade para famílias e executivos C-level.',
    icon: ShieldCheck,
  },
]

const METRICS = [
  { value: '15+', label: 'Anos de Tradição & Excelência' },
  { value: '60+', label: 'Destinos com Presença Global' },
  { value: '98%', label: 'Índice de Retenção de Clientes' },
  { value: '100%', label: 'Roteiros Feitos Sob Medida' },
]

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      gsap.from('.exp-pillar', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section id="experiencia" ref={sectionRef} className="relative border-t border-gold/15 bg-navy-950 py-28 sm:py-36">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
            A Filosofia Lopez Travel
          </p>
          <h2 className="font-editorial italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#FFF6E0] sm:whitespace-nowrap">
            A Experiência Lopez Travel
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-champagne/70">
            Seu mundo começa aqui. Acreditamos que o verdadeiro luxo não é apenas o destino,
            mas a tranquilidade de saber que cada minuto foi cuidadosamente planejado por especialistas.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="exp-pillar flex flex-col justify-between rounded-2xl border border-gold/15 bg-navy-900/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:bg-navy-900/90"
              >
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/5 text-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold/80">
                    {pillar.tag}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-light text-champagne">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-xs font-light leading-relaxed text-champagne/65">
                    {pillar.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Numbers Strip */}
        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-gold/15 pt-16 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="font-serif text-4xl font-light text-gold sm:text-5xl lg:text-6xl">
                {metric.value}
              </p>
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-champagne/60">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
