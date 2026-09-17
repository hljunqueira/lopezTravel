'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LopezLogo from '@/components/brand/LopezLogo'

const LOGIN_COVER =
  'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?crop=entropy&cs=srgb&fm=jpg&q=85'

interface LoginScreenProps {
  onLogin: (user: { name: string; email: string; role: string }, token: string) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@lopeztravel.com')
  const [password, setPassword] = useState('lopez2025')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Verify credentials
    setTimeout(() => {
      if (email.toLowerCase().trim() === 'admin@lopeztravel.com' && password === 'lopez2025') {
        const user = {
          name: 'Ana Lopez',
          email: 'admin@lopeztravel.com',
          role: 'admin',
        }
        toast.success(`Bem-vinda de volta, ${user.name}!`)
        onLogin(user, 'token-auth-lopez-2026')
      } else {
        toast.error('E-mail ou senha incorretos.')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-navy-950 text-champagne lg:grid-cols-2">
      {/* Left Photographic Banner */}
      <div className="relative hidden lg:block">
        <Image
          src={LOGIN_COVER}
          alt="Santorini Luxury Resort"
          fill
          priority
          sizes="50vw"
          className="object-cover brightness-[0.7] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/20" />
        <div className="absolute bottom-16 left-16 right-16">
          <LopezLogo variant="horizontal" size="md" className="mb-6" />
          <h2 className="font-serif text-4xl font-light leading-tight text-champagne">
            Acesso Restrito ao Backoffice Concierge.
          </h2>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-champagne/70">
            Painel administrativo privativo para gestão de clientes Ultra-VIP, pipeline de
            oportunidades, itinerários de luxo e rede global de fornecedores.
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="mb-8 flex flex-col items-center text-center">
            <LopezLogo size="md" variant="full" />
            <h1 className="mt-6 font-serif text-3xl font-light text-champagne">
              Portal Concierge
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wider text-champagne/50">
              Digite suas credenciais de acesso seguro.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-champagne/70">
                E-mail Corporativo
              </Label>
              <Input
                id="email"
                type="email"
                required
                className="border-gold/20 bg-navy-900 text-sm text-champagne focus:border-gold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lopeztravel.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-champagne/70">
                Senha de Acesso
              </Label>
              <Input
                id="password"
                type="password"
                required
                className="border-gold/20 bg-navy-900 text-sm text-champagne focus:border-gold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light py-6 text-xs font-semibold uppercase tracking-[0.2em] text-navy-950 shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all duration-300 hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                <span>Entrar no Painel</span>
              </>
            )}
          </Button>

          {/* Demonstration Notice */}
          <div className="rounded-xl border border-gold/15 bg-navy-900/50 p-4 text-center text-xs text-champagne/60">
            <p className="font-medium text-gold">Credenciais de Acesso de Demonstração:</p>
            <p className="mt-1 font-mono text-[11px] text-champagne/80">
              admin@lopeztravel.com · lopez2025
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
