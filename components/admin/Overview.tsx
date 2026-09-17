'use client'

import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  Users,
  Plane,
  KanbanSquare,
  TrendingUp,
  Loader2,
  Calendar,
  Building2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardStats } from '@/types/database'
import { getDashboardStats } from '@/actions/stats'

const LEAD_LABELS: Record<string, string> = {
  new: 'Novo',
  contacted: 'Contatado',
  proposal: 'Proposta',
  confirmed: 'Confirmado',
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function formatDate(value?: string) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (isNaN(d.getTime())) return String(value)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return String(value)
  }
}

export default function Overview() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center text-gold">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-champagne/60">
        Não foi possível carregar os indicadores no momento.
      </div>
    )
  }

  const { totals, leadsByStatus, recentLeads, upcomingTrips } = data

  const chartData = [
    { name: 'Novos', value: leadsByStatus.new || 0 },
    { name: 'Contatados', value: leadsByStatus.contacted || 0 },
    { name: 'Em Proposta', value: leadsByStatus.proposal || 0 },
    { name: 'Confirmados', value: leadsByStatus.confirmed || 0 },
  ]

  const cards = [
    { label: 'Oportunidades / Leads', value: totals.leads, icon: KanbanSquare },
    { label: 'Clientes Cadastrados', value: totals.clients, icon: Users },
    { label: 'Viagens Ativas', value: totals.trips, icon: Plane },
    { label: 'Receita Confirmada', value: formatBRL(totals.revenue), icon: TrendingUp },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light text-champagne">
          Visão Geral da Agência
        </h1>
        <p className="mt-1 text-xs uppercase tracking-wider text-champagne/50">
          Métricas consolidadas de vendas, faturamento e operações.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.label}
              className="flex items-center justify-between rounded-2xl border border-gold/15 bg-navy-900/70 p-6 backdrop-blur-md"
            >
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-champagne/50">
                  {c.label}
                </p>
                <p className="mt-2 font-serif text-2xl font-normal text-champagne">
                  {c.value}
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          )
        })}
      </div>

      {/* Graph & Upcoming */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="rounded-2xl border border-gold/15 bg-navy-900/60 p-6 backdrop-blur-md lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-light text-champagne">
                Distribuição de Oportunidades no Pipeline
              </h2>
              <p className="text-xs text-champagne/50">Leads agrupados por estágio de atendimento.</p>
            </div>
            <span className="text-xs font-mono text-gold">
              Total: {totals.leads} leads
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.08)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="rgba(247,231,206,0.4)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(247,231,206,0.4)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(212,175,55,0.06)' }}
                  contentStyle={{
                    background: '#0B132B',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: 12,
                    color: '#F7E7CE',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#D4AF37" radius={[6, 6, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="rounded-2xl border border-gold/15 bg-navy-900/60 p-6 backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl font-light text-champagne">
              Próximos Embarques
            </h2>
            <Plane className="h-4 w-4 text-gold/70" />
          </div>

          <div className="space-y-4">
            {upcomingTrips.length === 0 ? (
              <p className="py-8 text-center text-xs text-champagne/50">
                Nenhum embarque programado nos próximos dias.
              </p>
            ) : (
              upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="border-b border-gold/10 pb-3.5 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-champagne">
                        {trip.destination}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-champagne/50">
                        {trip.client_name || 'Cliente VIP'}
                      </p>
                    </div>
                    <span className="ml-2 shrink-0 font-mono text-xs text-gold">
                      {formatBRL(trip.total_value)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-champagne/60">
                    <Calendar className="h-3 w-3 text-gold/70" />
                    <span>Embarque: {formatDate(trip.departure_date)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="rounded-2xl border border-gold/15 bg-navy-900/60 p-6 backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-light text-champagne">
              Consultas Recentes de Viajantes
            </h2>
            <p className="text-xs text-champagne/50">Últimos pedidos recebidos pelo site e indicações.</p>
          </div>
        </div>

        <div className="space-y-3">
          {recentLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between border-b border-gold/10 pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-champagne">{lead.name}</p>
                <p className="truncate text-[11px] text-champagne/50">
                  {lead.destination || 'Destino a definir'} · {formatDate(lead.created_at)}
                </p>
              </div>
              <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
                {LEAD_LABELS[lead.status] || lead.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
