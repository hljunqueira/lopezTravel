import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Lopez Travel — Viagens de Luxo Sob Medida',
  description:
    'Lopez Travel desenha experiências de viagem extraordinárias e sob medida para clientes exigentes. Destinos exclusivos, curadoria impecável e atendimento de alto padrão.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans antialiased bg-navy text-champagne">
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
