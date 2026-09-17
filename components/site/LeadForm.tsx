'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Send, CheckCircle2, ShieldCheck, MessageCircle } from 'lucide-react'
import { createLead } from '@/actions/leads'

const INPUT_CLASS =
  'w-full rounded-xl border border-gold/20 bg-navy-950/60 px-4 py-3.5 text-sm text-champagne placeholder:text-champagne/30 outline-none transition-all duration-300 focus:border-gold/70 focus:bg-navy-950 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)]'

const DESTINATION_OPTIONS = [
  '01 • Rio de Janeiro, Brasil',
  '02 • Paris, França',
  '03 • Fernando de Noronha, Brasil',
  '04 • Maldivas',
  '05 • Santorini, Grécia',
  '06 • Kyoto, Japão',
  '07 • Dolomitas, Itália',
  '08 • Serengeti, Tanzânia',
  '09 • Dubai, Emirados Árabes',
  '10 • Bora Bora, Polinésia Francesa',
  'Outro Destino Personalizado',
]

const BUDGET_OPTIONS = [
  'Até R$ 15.000',
  'R$ 15.000 — R$ 30.000',
  'R$ 30.000 — R$ 60.000',
  'Acima de R$ 60.000',
  'A definir com o consultor',
]

const STYLE_OPTIONS = [
  'Vila Privada à Beira-Mar',
  'Resort 5 Estrelas & Overwater Villa',
  'Safári & Expedição Privativa',
  'Iate Privativo & Cruzeiro Exclusivo',
  'Roteiro Enogastronômico & Cultural',
]

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    budget: '',
    style: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Por favor, informe seu nome e e-mail de contato.')
      return
    }

    setLoading(true)
    try {
      const fullMessage = [
        formData.style ? `Estilo Preferido: ${formData.style}` : '',
        formData.message ? `Observações: ${formData.message}` : '',
      ]
        .filter(Boolean)
        .join('\n')

      const result = await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination,
        budget: formData.budget,
        message: fullMessage,
        source: 'Formulário do Site',
      })

      if (result.success) {
        setSubmitted(true)
        toast.success('Solicitação recebida com sucesso. Um de nossos consultores entrará em contato.')
      } else {
        toast.error(result.error || 'Erro ao enviar a solicitação. Tente novamente.')
      }
    } catch {
      toast.error('Ocorreu uma instabilidade momentânea. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="planeje-sua-viagem" className="relative border-t border-gold/15 bg-navy-950 py-28 sm:py-36">
      {/* Anchor alias for #contato */}
      <div id="contato" className="absolute -top-24 pointer-events-none" />

      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 sm:px-8 lg:grid-cols-12 lg:items-center">
        {/* Left Side: Brand Commitment & Direct Concierge */}
        <div className="lg:col-span-5">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
            Consultoria Privativa
          </p>
          <h2 className="font-editorial italic text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#FFF6E0]">
            Planeje Sua Próxima Jornada Sob Medida
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-champagne/70">
            Nossos consultores desenham roteiros inteiramente personalizados, com atenção a cada
            preferência de acomodação, gastronomia e transporte executivo.
          </p>

          <div className="mt-10 space-y-5 border-t border-gold/15 pt-8 text-sm text-champagne/80">
            {/* Direct WhatsApp VIP Concierge */}
            <div>
              <a
                href="https://wa.me/message/X25KJIEIT4L3F1"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition-all duration-300 hover:bg-gold hover:text-navy-950 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
              >
                <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Atendimento VIP via WhatsApp</span>
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-champagne/60 pt-2">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span>Confidencialidade estrita e proteção total de dados.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Luxury Form Container */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-gold/20 bg-navy-900/80 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-10">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-editorial text-3xl font-light text-champagne">
                  Solicitação Recebida com Sucesso
                </h3>
                <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-champagne/70">
                  Obrigado por nos confiar seu planejamento. Nosso concierge entrará em contato em
                  até 24 horas úteis com uma primeira proposta personalizada.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      destination: '',
                      budget: '',
                      style: '',
                      message: '',
                    })
                  }}
                  className="mt-8 rounded-full border border-gold/40 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-navy-950"
                >
                  Enviar Outra Consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-champagne/60">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Eduardo Silveira"
                      className={INPUT_CLASS}
                      value={formData.name}
                      onChange={handleChange('name')}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-champagne/60">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@dominio.com"
                      className={INPUT_CLASS}
                      value={formData.email}
                      onChange={handleChange('email')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-champagne/60">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+55 11 99999-0000"
                      className={INPUT_CLASS}
                      value={formData.phone}
                      onChange={handleChange('phone')}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-champagne/60">
                      Destino de Interesse
                    </label>
                    <select
                      className={INPUT_CLASS}
                      value={formData.destination}
                      onChange={handleChange('destination')}
                    >
                      <option value="" className="bg-navy-950 text-champagne">
                        Selecione o destino
                      </option>
                      {DESTINATION_OPTIONS.map((dest) => (
                        <option key={dest} value={dest} className="bg-navy-950 text-champagne">
                          {dest}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-champagne/60">
                      Investimento Estimado
                    </label>
                    <select
                      className={INPUT_CLASS}
                      value={formData.budget}
                      onChange={handleChange('budget')}
                    >
                      <option value="" className="bg-navy-950 text-champagne">
                        Selecione a faixa
                      </option>
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-navy-950 text-champagne">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-champagne/60">
                      Estilo de Hospedagem
                    </label>
                    <select
                      className={INPUT_CLASS}
                      value={formData.style}
                      onChange={handleChange('style')}
                    >
                      <option value="" className="bg-navy-950 text-champagne">
                        Selecione o estilo
                      </option>
                      {STYLE_OPTIONS.map((style) => (
                        <option key={style} value={style} className="bg-navy-950 text-champagne">
                          {style}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-champagne/60">
                    Detalhes & Expectativas da Viagem
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Conte-nos sobre a ocasião especial, datas preferidas, quantidade de viajantes ou preferências exclusivas..."
                    className={`${INPUT_CLASS} resize-none`}
                    value={formData.message}
                    onChange={handleChange('message')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-navy-950 shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all duration-300 hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Enviando consulta...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Solicitar Roteiro Sob Medida</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
