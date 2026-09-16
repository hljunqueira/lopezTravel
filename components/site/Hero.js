'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowDown, ArrowUpRight, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HeroMedia from '@/components/site/HeroMedia'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const Hero = () => {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const progressRef = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)', reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
      const { desktop, reduced } = context.conditions
      if (reduced) return

      gsap.from('.hero-reveal', {
        y: 24, opacity: 0, duration: 1.05, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity',
      })
      gsap.fromTo(bgRef.current, { yPercent: -3 }, {
        yPercent: desktop ? 5 : 2,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
      gsap.to(contentRef.current, {
        y: desktop ? -48 : -18, opacity: 0.15, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
      gsap.fromTo(progressRef.current, { scaleY: 0.15 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
    return () => media.revert()
  }, { scope: sectionRef })

  const navigateToSection = (event) => {
    const hash = event.currentTarget.getAttribute('href')
    const target = document.querySelector(hash)
    if (!target) return
    event.preventDefault()
    const offset = document.querySelector('header')?.getBoundingClientRect()?.height || 0
    const top = window.scrollY + target.getBoundingClientRect().top - offset
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    window.history.replaceState(null, '', hash)
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }

  return (
    <section ref={sectionRef} aria-labelledby="hero-heading" data-testid="hero" className="dark relative isolate flex min-h-[max(700px,100svh)] w-full items-center overflow-hidden bg-background text-foreground sm:min-h-[max(740px,100svh)]">
      <HeroMedia motionRef={bgRef} />

      <div className="container pointer-events-none relative z-10 w-full pb-48 pt-36 sm:pb-52 sm:pt-40">
        <div ref={contentRef} className="pointer-events-auto max-w-3xl">
          <p className="hero-reveal mb-6 flex items-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/75 sm:mb-8">
            <span className="h-px w-8 shrink-0 bg-primary/70" aria-hidden="true" />
            Lopez Travel · Viagens sob medida
          </p>
          <h1 id="hero-heading" className="hero-reveal max-w-3xl font-sans text-[clamp(2.5rem,4.5vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.045em]">
            Para onde<br />você quer ir?
          </h1>
          <p className="hero-reveal mt-6 max-w-[400px] font-sans text-base font-normal leading-relaxed text-foreground/80 sm:mt-8 sm:max-w-[450px] sm:text-lg">
            Conte com a gente para montar o roteiro, escolher os hotéis e organizar os detalhes da sua viagem.
          </p>
          <div className="hero-reveal mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4">
            <Button asChild className="h-12 gap-5 rounded-full px-7 text-sm font-medium shadow-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-[52px]">
              <a href="#destinos" onClick={navigateToSection}>
                Ver destinos <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full border-foreground/30 bg-background/10 px-7 text-sm font-medium shadow-none backdrop-blur-sm hover:border-primary/60 hover:bg-background/30 hover:text-foreground focus-visible:ring-2 sm:h-[52px]">
              <a href="#contato" onClick={navigateToSection}>Falar com a equipe</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 sm:bottom-28">
        <div className="container flex items-end justify-between gap-8">
          <div className="flex items-center gap-3">
            <Globe2 className="h-4 w-4 text-primary/80" strokeWidth={1.3} aria-hidden="true" />
            <p className="font-sans text-xs text-foreground/75 sm:text-sm">Viagens pelo Brasil e pelo mundo</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="container">
          <div className="flex h-[84px] items-center border-t border-foreground/15 sm:h-[100px]">
            <a href="#destinos" onClick={navigateToSection} className="pointer-events-auto inline-flex min-h-11 items-center gap-3 rounded-sm text-[9px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-4 sm:text-[10px]">
              <span className="relative hidden h-9 w-px overflow-hidden bg-foreground/20 sm:block" aria-hidden="true">
                <span ref={progressRef} className="absolute inset-0 origin-top bg-primary" />
              </span>
              <ArrowDown className="h-4 w-4" strokeWidth={1.3} aria-hidden="true" />
              <span>Conheça os destinos</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
