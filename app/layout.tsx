import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'LOPEZ TRAVEL — Viagens Sob Medida & Experiências Exclusivas',
  description:
    'Agência de viagens de altíssimo luxo. Roteiros sob medida, hospitalidade ultra-premium, aviação privada e acessos exclusivos pelo mundo.',
  keywords: [
    'viagens de luxo',
    'roteiro personalizado',
    'viagens sob medida',
    'roteiros exclusivos',
    'Lopez Travel',
    'concierge de viagem',
    'hotéis 5 estrelas',
    'safáris privados',
  ],
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>
      <body className="font-sans antialiased bg-navy-950 text-champagne selection:bg-gold selection:text-navy-950">
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
