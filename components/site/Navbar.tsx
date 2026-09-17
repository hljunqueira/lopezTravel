'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import LopezLogo from '@/components/brand/LopezLogo'

const NAV_LINKS = [
  { label: 'Destinos', href: '#destinos' },
  { label: 'O Que Fazer', href: '#o-que-fazer' },
  { label: 'Pacotes & Voos', href: '#pacotes-e-voos' },
  { label: 'Roteiros', href: '#roteiro-assinatura' },
  { label: 'Experiência', href: '#experiencia' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      setMobileOpen(false)
      const cleanId = href.replace('#', '')
      const target = document.getElementById(cleanId) || document.querySelector(href)
      if (target) {
        const offset = 80
        const top = window.scrollY + target.getBoundingClientRect().top - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060A18]/95 backdrop-blur-xl border-b border-gold/20 py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
          : 'bg-[#060A18]/70 backdrop-blur-md border-b border-gold/15 py-5 sm:py-6'
      }`}
    >
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
        {/* Official Brand Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-3 transition-opacity hover:opacity-90 z-10">
          <LopezLogo variant="horizontal" size="sm" />
        </Link>

        {/* Desktop Links (In-flow flex layout with zero collision) */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-5 xl:gap-8 px-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[11px] xl:text-xs font-medium uppercase tracking-[0.16em] xl:tracking-[0.2em] text-champagne/75 transition-colors duration-300 hover:text-gold hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 z-10">
          <Link
            href="/admin"
            className="rounded-full border border-gold/30 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-champagne/80 transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold whitespace-nowrap"
          >
            Portal Concierge
          </Link>
          <a
            href="#planeje-sua-viagem"
            onClick={(e) => handleNavClick(e, '#planeje-sua-viagem')}
            className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-4 py-2 text-[10px] xl:text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-950 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] whitespace-nowrap"
          >
            Planejar Viagem
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="text-champagne/90 transition-colors hover:text-gold lg:hidden z-10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-gold/20 bg-navy-950/98 px-6 py-7 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs font-medium uppercase tracking-[0.25em] text-champagne/80 hover:text-gold"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-gold/15 pt-5">
              <a
                href="#planeje-sua-viagem"
                onClick={(e) => handleNavClick(e, '#planeje-sua-viagem')}
                className="rounded-full bg-gold py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-950"
              >
                Planejar Viagem
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-gold/40 py-2.5 text-center text-xs font-medium uppercase tracking-[0.2em] text-gold"
              >
                Portal Concierge
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
