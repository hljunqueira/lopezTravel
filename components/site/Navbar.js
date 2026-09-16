'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Destinos', href: '#destinos' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Contato', href: '#contato' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-navy/90 backdrop-blur-md border-b border-gold/15 py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-wide text-champagne">LOPEZ</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">Travel</span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium uppercase tracking-widest text-champagne/70 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/admin"
            className="rounded-full border border-gold/40 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-navy"
          >
            Backoffice
          </Link>
        </div>

        <button className="text-champagne md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold/15 bg-navy/95 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-champagne/80"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/admin"
              className="rounded-full border border-gold/40 px-5 py-2 text-center text-xs font-semibold uppercase tracking-widest text-gold"
            >
              Backoffice
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
