import React from 'react'

interface LopezLogoProps {
  className?: string
  variant?: 'full' | 'icon' | 'horizontal'
  size?: 'sm' | 'md' | 'lg'
}

export default function LopezLogo({
  className = '',
  variant = 'full',
  size = 'md',
}: LopezLogoProps) {
  // Dimensions based on size
  const iconDimensions = {
    sm: 32,
    md: 48,
    lg: 72,
  }[size]

  // Monogram SVG with exact LT intertwining and metallic gold gradient
  const Monogram = (
    <svg
      width={iconDimensions}
      height={iconDimensions}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ltGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9F1D8" />
          <stop offset="35%" stopColor="#E6C868" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA8220" />
        </linearGradient>
        <linearGradient id="ltRingGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#F9F1D8" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8A6715" />
        </linearGradient>
      </defs>

      {/* Elegant Outer Ring */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="url(#ltRingGrad)"
        strokeWidth="2.2"
        fill="none"
      />

      {/* Classical Serif 'L' */}
      <text
        x="36"
        y="66"
        fontFamily="'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif"
        fontSize="54"
        fontWeight="600"
        fill="url(#ltGoldGrad)"
        textAnchor="middle"
        letterSpacing="-0.02em"
      >
        L
      </text>

      {/* Classical Serif 'T' interlaced */}
      <text
        x="63"
        y="66"
        fontFamily="'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif"
        fontSize="54"
        fontWeight="600"
        fill="url(#ltGoldGrad)"
        textAnchor="middle"
        letterSpacing="-0.02em"
      >
        T
      </text>
    </svg>
  )

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{Monogram}</div>
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3.5 ${className}`}>
        {Monogram}
        <div className="flex flex-col">
          <span className="font-serif text-xl font-medium tracking-[0.14em] text-champagne">
            LOPEZ
          </span>
          <div className="my-0.5 h-[1px] w-full bg-gradient-to-r from-gold via-gold/80 to-gold/30" />
          <span className="text-[9px] font-medium uppercase tracking-[0.38em] text-gold/90">
            TRAVEL
          </span>
        </div>
      </div>
    )
  }

  // Full stacked brand layout (matches exact uploaded image)
  return (
    <div className={`inline-flex flex-col items-center text-center ${className}`}>
      {Monogram}
      <div className="mt-2.5 flex flex-col items-center">
        <span
          className={`font-serif font-medium tracking-[0.18em] text-champagne ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'
          }`}
        >
          LOPEZ
        </span>
        <div className="my-1.5 h-[1px] w-full max-w-[140px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <span
          className={`font-sans font-medium uppercase tracking-[0.42em] text-gold/90 ${
            size === 'sm' ? 'text-[8px]' : size === 'lg' ? 'text-[11px]' : 'text-[9px]'
          }`}
        >
          TRAVEL
        </span>
      </div>
    </div>
  )
}
