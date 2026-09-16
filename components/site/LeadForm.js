'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
import { api } from '@/lib/api'

const FIELD =
  'w-full rounded-lg border border-champagne/15 bg-white/[0.03] px-4 py-3 text-sm text-champagne placeholder:text-champagne/35 outline-none transition-colors focus:border-gold/60'

const BUDGETS = ['Até R$ 30k', 'R$ 30k - R$ 50k', 'R$ 50k - R$ 80k', 'R$ 80k+']

export default function LeadForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', destination: '', budget: '', message: '' })
  const [loading, setLoading] = useState(false)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      toast.error('Por favor, preencha nome e e-mail.')
      return
    }
    setLoading(true)
    try {
      await api.post('/leads', { ...form, source: 'website', status: 'new' })
      toast.success('Recebemos o seu pedido! Um consultor entrará em contato em breve.')
      setForm({ name: '', email: '', phone: '', destination: '', budget: '', message: '' })
    } catch (err) {
      toast.error(err.message || 'Não foi possível enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contato" className="relative overflow-hidden bg-navy py-24 sm:py-32">
      <div className="absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">Comece a planejar</p>
          <h2 className="font-display text-3xl font-medium leading-tight text-champagne sm:text-4xl lg:text-5xl">
            Conte-nos o seu próximo sonho de viagem.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-champagne/65">
            Preencha o formulário e um de nossos consultores entrará em contato para desenhar uma proposta exclusiva, sem compromisso.
          </p>
          <div className="mt-10 space-y-3 text-sm text-champagne/70">
            <p><span className="text-gold">Telefone</span> · +55 11 4000-1234</p>
            <p><span className="text-gold">E-mail</span> · concierge@lopeztravel.com</p>
            <p><span className="text-gold">Atendimento</span> · Seg a Sex, 9h – 19h</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-gold/15 bg-navy-900/60 p-8 backdrop-blur">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input className={FIELD} placeholder="Nome completo *" value={form.name} onChange={update('name')} />
            <input className={FIELD} type="email" placeholder="E-mail *" value={form.email} onChange={update('email')} />
            <input className={FIELD} placeholder="Telefone / WhatsApp" value={form.phone} onChange={update('phone')} />
            <input className={FIELD} placeholder="Destino de interesse" value={form.destination} onChange={update('destination')} />
          </div>
          <select className={`${FIELD} mt-4`} value={form.budget} onChange={update('budget')}>
            <option value="" className="bg-navy-900">Orçamento estimado</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-navy-900">{b}</option>
            ))}
          </select>
          <textarea
            className={`${FIELD} mt-4 min-h-[120px] resize-none`}
            placeholder="Conte-nos sobre a viagem que você imagina..."
            value={form.message}
            onChange={update('message')}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-semibold uppercase tracking-widest text-navy transition-all hover:bg-gold-light disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? 'Enviando...' : 'Enviar pedido'}
          </button>
        </form>
      </div>
    </section>
  )
}
