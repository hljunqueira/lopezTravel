'use client'

import { Compass, ShieldCheck, Headset, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: Compass,
    title: 'Roteiros sob medida',
    desc: 'Cada itinerário é desenhado do zero, alinhado ao seu ritmo, gostos e ocasião.',
  },
  {
    icon: Sparkles,
    title: 'Acesso exclusivo',
    desc: 'Suítes, mesas e experiências reservadas através da nossa rede global de parceiros.',
  },
  {
    icon: Headset,
    title: 'Concierge 24/7',
    desc: 'Um consultor dedicado acompanha você antes, durante e depois de cada viagem.',
  },
  {
    icon: ShieldCheck,
    title: 'Tranquilidade total',
    desc: 'Cada reserva é protegida e monitorada, com planos de contingência para tudo.',
  },
]

const STATS = [
  { value: '15+', label: 'anos de experiência' },
  { value: '60+', label: 'destinos no mundo' },
  { value: '98%', label: 'clientes recorrentes' },
  { value: '24/7', label: 'concierge dedicado' },
]

export default function Experience() {
  return (
    <section id="experiencia" className="relative border-t border-gold/10 bg-navy-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">A experiência Lopez</p>
          <h2 className="font-display text-3xl font-medium leading-tight text-champagne sm:text-4xl lg:text-5xl">
            O luxo está nos detalhes que você nem percebe.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gold/10 bg-gold/10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-navy-950 p-8 transition-colors hover:bg-navy-900">
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mb-3 font-display text-xl text-champagne">{f.title}</h3>
              <p className="text-sm leading-relaxed text-champagne/60">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-gold/10 pt-14 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-semibold text-gold sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-champagne/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
