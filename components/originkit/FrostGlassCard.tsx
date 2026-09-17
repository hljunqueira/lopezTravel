'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export interface FrostGlassCardProps {
  imageSrc: string
  imageAlt: string
  category: string
  title: string
  description: string
  duration?: string
  season?: string
  accessLevel?: string
  onActionClick?: () => void
  actionLabel?: string
  className?: string
}

export default function FrostGlassCard({
  imageSrc,
  imageAlt,
  category,
  title,
  description,
  duration,
  season,
  accessLevel = 'Bespoke Concierge',
  onActionClick,
  actionLabel = 'Solicitar Roteiro',
  className = '',
}: FrostGlassCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#111C3D]/80 via-[#0B132B]/90 to-[#081026]/95 p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#D4AF37]/45 hover:shadow-[0_16px_40px_-10px_rgba(212,175,55,0.18)] ${className}`}
    >
      {/* Top Media Container with Vignette and Parallax Zoom */}
      <div className="relative mb-5 h-56 w-full overflow-hidden rounded-xl bg-navy-900/60">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
        />
        {/* Subtle Dark Vignette & Golden Rim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-black/30" />
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />

        {/* Access Badge (Strictly Anti-IA, Sobrio e Elegante) */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#081026]/85 px-3 py-1 text-[10px] font-semibold tracking-wider text-[#F7E7CE] uppercase backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          <span>{accessLevel}</span>
        </div>

        {duration && (
          <div className="absolute bottom-3 right-3 z-10 rounded-md border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md">
            {duration}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              {category}
            </span>
            {season && (
              <span className="text-[11px] tracking-wide text-champagne/60">
                {season}
              </span>
            )}
          </div>

          <h3 className="mb-3 font-serif text-2xl font-light text-[#FFF6E0] transition-colors duration-300 group-hover:text-[#F3D382]">
            {title}
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-champagne/75">
            {description}
          </p>
        </div>

        {/* Action Footer */}
        <div className="mt-6 pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
          <span className="text-[11px] tracking-widest text-[#D4AF37]/80 uppercase">
            Seleção Exclusiva
          </span>

          <button
            type="button"
            onClick={onActionClick}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3.5 py-1.5 text-xs font-medium text-[#F7E7CE] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B]"
          >
            <span>{actionLabel}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
