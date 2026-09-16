'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'

const LOGIN_IMG =
  'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwzfHxTYW50b3Jpbml8ZW58MHx8fHwxNzg5NTk0ODY5fDA&ixlib=rb-4.1.0&q=85'

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('admin@lopeztravel.com')
  const [password, setPassword] = useState('lopez2025')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      toast.success(`Bem-vinda, ${res.user.name}!`)
      onLogin(res.user, res.token)
    } catch (err) {
      toast.error(err.message || 'Falha no login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image src={LOGIN_IMG} alt="Santorini" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/20" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-gold">Lopez Travel</p>
          <h2 className="font-display text-4xl font-medium leading-tight text-champagne">
            Backoffice de viagens de luxo.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-champagne/60">
            Gerencie leads, clientes, roteiros e fornecedores em um só lugar.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-8 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold tracking-wide text-champagne">LOPEZ</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">Travel</span>
          </div>
          <h1 className="font-display text-2xl text-foreground">Acesso ao painel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Entre com suas credenciais de administrador.</p>

          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@lopeztravel.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="mt-8 w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
            Entrar
          </Button>

          <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Credenciais de demonstração</p>
            <p className="mt-1">admin@lopeztravel.com · lopez2025</p>
          </div>
        </form>
      </div>
    </div>
  )
}
