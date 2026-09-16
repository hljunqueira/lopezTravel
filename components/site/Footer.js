'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-navy-950 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold tracking-wide text-champagne">LOPEZ</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">Travel</span>
          </Link>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-champagne/60">
            <a href="#destinos" className="transition-colors hover:text-gold">Destinos</a>
            <a href="#experiencia" className="transition-colors hover:text-gold">Experiência</a>
            <a href="#contato" className="transition-colors hover:text-gold">Contato</a>
            <Link href="/admin" className="transition-colors hover:text-gold">Backoffice</Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-gold/10 pt-6 text-xs text-champagne/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Lopez Travel. Todos os direitos reservados.</p>
          <p>Viagens de luxo sob medida · São Paulo, Brasil</p>
        </div>
      </div>
    </footer>
  )
}
