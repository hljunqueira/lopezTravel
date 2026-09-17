'use client'

import React from 'react'
import Link from 'next/link'
import LopezLogo from '@/components/brand/LopezLogo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        const top = window.scrollY + target.getBoundingClientRect().top - 80
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="border-t border-gold/15 bg-navy-950 py-16 text-champagne sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-10 border-b border-gold/10 pb-14 text-center md:flex-row md:text-left">
          {/* Official Brand Logo */}
          <div>
            <LopezLogo variant="horizontal" size="md" />
            <p className="mt-4 max-w-sm text-xs font-light leading-relaxed text-champagne/60">
              Desenhamos jornadas extraordinárias e roteiros sob medida para viajantes exigentes.
              Excelência, privacidade e exclusividade em cada detalhe.
            </p>
          </div>

          {/* Quick Links & Direct WhatsApp */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-medium uppercase tracking-[0.2em] text-champagne/70">
            <a
              href="#destinos"
              onClick={(e) => handleScrollTo(e, '#destinos')}
              className="transition-colors duration-300 hover:text-gold"
            >
              Destinos
            </a>
            <a
              href="#o-que-fazer"
              onClick={(e) => handleScrollTo(e, '#o-que-fazer')}
              className="transition-colors duration-300 hover:text-gold"
            >
              O Que Fazer
            </a>
            <a
              href="#pacotes-e-voos"
              onClick={(e) => handleScrollTo(e, '#pacotes-e-voos')}
              className="transition-colors duration-300 hover:text-gold"
            >
              Pacotes & Voos
            </a>
            <a
              href="#roteiro-assinatura"
              onClick={(e) => handleScrollTo(e, '#roteiro-assinatura')}
              className="transition-colors duration-300 hover:text-gold"
            >
              Roteiros
            </a>
            <a
              href="#planeje-sua-viagem"
              onClick={(e) => handleScrollTo(e, '#planeje-sua-viagem')}
              className="transition-colors duration-300 hover:text-gold"
            >
              Planejar Viagem
            </a>
            <a
              href="https://wa.me/message/X25KJIEIT4L3F1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-gold hover:bg-gold hover:text-navy-950 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              <span>WhatsApp VIP</span>
            </a>
            <Link
              href="/admin"
              className="text-gold/90 transition-colors duration-300 hover:text-gold"
            >
              Portal Concierge
            </Link>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-[11px] font-light text-champagne/40 sm:flex-row">
          <p>© {currentYear} LOPEZ TRAVEL. Todos os direitos reservados.</p>
          <p className="tracking-wider text-champagne/50">
            ATENDIMENTO GLOBAL & EXPERIÊNCIAS EXCLUSIVAS
          </p>
        </div>
      </div>
    </footer>
  )
}
