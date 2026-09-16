'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { Users, Plane, KanbanSquare, TrendingUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api, formatBRL, formatDate } from '@/lib/api'

const LEAD_LABELS = { new: 'Novo', contacted: 'Contatado', proposal: 'Proposta', confirmed: 'Confirmado' }
const TRIP_LABELS = { pending: 'Pendente', confirmed: 'Confirmada', completed: 'Concluída', cancelled: 'Cancelada' }

export default function Overview() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/stats').then(setData).catch(() => setData(null))
  }, [])

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const { totals, leadsByStatus, recentLeads, upcomingTrips } = data
  const chartData = [
    { name: 'Novos', value: leadsByStatus.new },
    { name: 'Contatados', value: leadsByStatus.contacted },
    { name: 'Proposta', value: leadsByStatus.proposal },
    { name: 'Confirmados', value: leadsByStatus.confirmed },
  ]

  const cards = [
    { label: 'Leads', value: totals.leads, icon: KanbanSquare },
    { label: 'Clientes', value: totals.clients, icon: Users },
    { label: 'Viagens', value: totals.trips, icon: Plane },
    { label: 'Receita confirmada', value: formatBRL(totals.revenue), icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Visão Geral</h1>
        <p className="text-sm text-muted-foreground">Resumo da operação da agência.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Card key={c.label}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-foreground">{c.value}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Leads por estágio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(247,231,206,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(247,231,206,0.5)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(212,175,55,0.08)' }}
                    contentStyle={{ background: '#111C3D', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: '#F7E7CE' }}
                  />
                  <Bar dataKey="value" fill="#D4AF37" radius={[6, 6, 0, 0]} maxBarSize={64} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Próximas viagens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTrips.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma viagem agendada.</p>}
            {upcomingTrips.map((t) => (
              <div key={t.id} className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{t.destination}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.client_name} · {formatDate(t.departure_date)}</p>
                </div>
                <span className="ml-2 shrink-0 text-xs font-medium text-gold">{formatBRL(t.total_value)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leads recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentLeads.map((l) => (
            <div key={l.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{l.name}</p>
                <p className="truncate text-xs text-muted-foreground">{l.destination || 'Destino não informado'} · {formatDate(l.created_at)}</p>
              </div>
              <Badge variant="outline" className="border-gold/40 text-gold">{LEAD_LABELS[l.status] || l.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
