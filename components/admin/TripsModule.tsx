'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Loader2,
  X,
  Compass,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trip, TripStatus, Client, ItineraryDay } from '@/types/database'
import { getTrips, createTrip, updateTrip, deleteTrip } from '@/actions/trips'
import { getClients } from '@/actions/clients'
import ConfirmDialog from './ConfirmDialog'

const STATUS_CONFIG: Record<TripStatus, { label: string; badgeCls: string }> = {
  pending: { label: 'Pendente', badgeCls: 'border-amber-500/40 bg-amber-500/10 text-amber-400' },
  confirmed: { label: 'Confirmada', badgeCls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
  completed: { label: 'Concluída', badgeCls: 'border-sky-500/40 bg-sky-500/10 text-sky-400' },
  cancelled: { label: 'Cancelada', badgeCls: 'border-rose-500/40 bg-rose-500/10 text-rose-400' },
}

const EMPTY_TRIP = {
  client_id: '',
  client_name: '',
  destination: '',
  departure_date: '',
  return_date: '',
  reservation_status: 'pending' as TripStatus,
  total_value: 0,
  itinerary: [] as ItineraryDay[],
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

export default function TripsModule() {
  const [items, setItems] = useState<Trip[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Trip | null>(null)
  const [form, setForm] = useState(EMPTY_TRIP)

  const loadData = async () => {
    try {
      const [tripsData, clientsData] = await Promise.all([getTrips(), getClients()])
      setItems(tripsData)
      setClients(clientsData)
    } catch {
      toast.error('Erro ao carregar roteiros e clientes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenNew = () => {
    setEditing(null)
    setForm(EMPTY_TRIP)
    setDialogOpen(true)
  }

  const handleOpenEdit = (trip: Trip) => {
    setEditing(trip)
    setForm({
      client_id: trip.client_id || '',
      client_name: trip.client_name || '',
      destination: trip.destination,
      departure_date: trip.departure_date ? trip.departure_date.slice(0, 10) : '',
      return_date: trip.return_date ? trip.return_date.slice(0, 10) : '',
      reservation_status: trip.reservation_status,
      total_value: trip.total_value || 0,
      itinerary: trip.itinerary ? [...trip.itinerary] : [],
    })
    setDialogOpen(true)
  }

  const handleClientSelect = (clientId: string) => {
    const selected = clients.find((c) => c.id === clientId)
    setForm((prev) => ({
      ...prev,
      client_id: clientId,
      client_name: selected ? selected.name : '',
    }))
  }

  const handleAddDay = () => {
    setForm((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: '',
          description: '',
        },
      ],
    }))
  }

  const handleUpdateDay = (index: number, field: 'title' | 'description' | 'day', val: any) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((d, i) => (i === index ? { ...d, [field]: val } : d)),
    }))
  }

  const handleRemoveDay = (index: number) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, day: i + 1 })),
    }))
  }

  const handleSave = async () => {
    if (!form.destination.trim()) {
      toast.error('Informe o destino do roteiro.')
      return
    }

    try {
      if (editing) {
        const res = await updateTrip(editing.id, form)
        if (res.success) {
          toast.success('Roteiro atualizado com sucesso.')
          setDialogOpen(false)
          loadData()
        } else {
          toast.error(res.error || 'Erro ao atualizar roteiro.')
        }
      } else {
        const res = await createTrip(form)
        if (res.success) {
          toast.success('Novo roteiro criado com sucesso.')
          setDialogOpen(false)
          loadData()
        } else {
          toast.error(res.error || 'Erro ao criar roteiro.')
        }
      }
    } catch {
      toast.error('Falha na comunicação com o servidor.')
    }
  }

  const handleDelete = async (trip: Trip) => {
    try {
      const res = await deleteTrip(trip.id)
      if (res.success) {
        toast.success('Roteiro excluído com sucesso.')
        loadData()
      } else {
        toast.error('Erro ao remover.')
      }
    } catch {
      toast.error('Erro ao excluir.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-light text-champagne">
            Roteiros & Construtor de Itinerários
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wider text-champagne/50">
            Vincule clientes a experiências personalizadas e gerencie o cronograma dia-a-dia.
          </p>
        </div>
        <Button
          onClick={handleOpenNew}
          className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-5 text-xs font-semibold uppercase tracking-wider text-navy-950 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Criar Roteiro
        </Button>
      </div>

      {loading ? (
        <div className="flex h-72 items-center justify-center text-gold">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {items.map((trip) => {
            const statusConfig = STATUS_CONFIG[trip.reservation_status] || STATUS_CONFIG.pending
            return (
              <div
                key={trip.id}
                className="flex flex-col justify-between rounded-2xl border border-gold/15 bg-navy-900/60 p-6 backdrop-blur-md transition-all duration-200 hover:border-gold/40"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-light text-champagne">
                        {trip.destination}
                      </h3>
                      <p className="mt-0.5 text-xs text-champagne/60">
                        {trip.client_name ? `Viajante: ${trip.client_name}` : 'Sem cliente vinculado'}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusConfig.badgeCls}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-champagne/70">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gold" />
                      {formatDate(trip.departure_date)} → {formatDate(trip.return_date)}
                    </span>
                    <span className="font-mono text-sm font-medium text-gold">
                      {formatBRL(trip.total_value)}
                    </span>
                  </div>

                  {/* Daily Itinerary summary */}
                  {trip.itinerary && trip.itinerary.length > 0 && (
                    <div className="mt-5 space-y-2 border-t border-gold/10 pt-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold/80">
                        Itinerário Resumido ({trip.itinerary.length} dias)
                      </p>
                      {trip.itinerary.slice(0, 3).map((day, idx) => (
                        <div key={idx} className="flex gap-2 text-xs">
                          <span className="shrink-0 font-mono font-medium text-gold">
                            Dia {day.day}:
                          </span>
                          <span className="truncate text-champagne/75">
                            <span className="text-champagne font-medium">{day.title}</span>
                            {day.description && ` — ${day.description}`}
                          </span>
                        </div>
                      ))}
                      {trip.itinerary.length > 3 && (
                        <p className="text-[10px] text-champagne/40">
                          + {trip.itinerary.length - 3} dia(s) no itinerário completo
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-gold/10 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(trip)}
                    className="border-gold/30 text-xs text-champagne hover:bg-navy-900 hover:text-gold"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar Roteiro
                  </Button>
                  <ConfirmDialog
                    title="Excluir roteiro?"
                    description={`Deseja remover a viagem para ${trip.destination}?`}
                    onConfirm={() => handleDelete(trip)}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gold/20 text-champagne/60 hover:bg-navy-900 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                </div>
              </div>
            )
          })}

          {items.length === 0 && (
            <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed border-gold/15 text-xs text-champagne/50">
              Nenhum roteiro cadastrado no momento.
            </div>
          )}
        </div>
      )}

      {/* Modal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto thin-scroll border-gold/20 bg-navy-950 text-champagne sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-light text-champagne">
              {editing ? 'Editar Roteiro & Itinerário' : 'Novo Roteiro Personalizado'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Vincular Cliente VIP</Label>
              <select
                className="w-full rounded-md border border-gold/20 bg-navy-900 px-3 py-2 text-sm text-champagne outline-none focus:border-gold"
                value={form.client_id}
                onChange={(e) => handleClientSelect(e.target.value)}
              >
                <option value="">Selecione o cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Destino Principal *</Label>
              <Input
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.destination}
                onChange={(e) => setForm((prev) => ({ ...prev, destination: e.target.value }))}
                placeholder="Ex: Maldivas — Soneva Jani"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Data de Partida</Label>
              <Input
                type="date"
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.departure_date}
                onChange={(e) => setForm((prev) => ({ ...prev, departure_date: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Data de Retorno</Label>
              <Input
                type="date"
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.return_date}
                onChange={(e) => setForm((prev) => ({ ...prev, return_date: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Status da Reserva</Label>
              <select
                className="w-full rounded-md border border-gold/20 bg-navy-900 px-3 py-2 text-sm text-champagne outline-none focus:border-gold"
                value={form.reservation_status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, reservation_status: e.target.value as TripStatus }))
                }
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Valor Total do Pacote (R$)</Label>
              <Input
                type="number"
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.total_value}
                onChange={(e) => setForm((prev) => ({ ...prev, total_value: Number(e.target.value) || 0 }))}
                placeholder="120000"
              />
            </div>
          </div>

          {/* Daily Itinerary Builder */}
          <div className="mt-4 border-t border-gold/15 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-light text-champagne">
                  Cronograma Diário (Itinerary Builder)
                </h4>
                <p className="text-xs text-champagne/50">
                  Descreva traslados, suítes, experiências gastronômicas e passeios.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDay}
                className="border-gold/30 text-xs text-gold hover:bg-navy-900"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar Dia
              </Button>
            </div>

            {form.itinerary.length === 0 ? (
              <p className="py-6 text-center text-xs text-champagne/40">
                Nenhum dia detalhado no momento. Clique em &quot;Adicionar Dia&quot; para iniciar o cronograma.
              </p>
            ) : (
              <div className="space-y-4">
                {form.itinerary.map((day, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gold/15 bg-navy-900/50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-gold">
                        Dia {day.day}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDay(idx)}
                        className="text-champagne/40 hover:text-destructive"
                        title="Remover dia"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <Input
                      className="mb-2 border-gold/20 bg-navy-900 text-xs text-champagne focus:border-gold"
                      placeholder="Título do Dia (ex: Chegada em Malé & Voo Panorâmico)"
                      value={day.title}
                      onChange={(e) => handleUpdateDay(idx, 'title', e.target.value)}
                    />
                    <Textarea
                      rows={2}
                      className="border-gold/20 bg-navy-900 text-xs text-champagne focus:border-gold"
                      placeholder="Descrição dos serviços, horários, reservas de restaurantes..."
                      value={day.description}
                      onChange={(e) => handleUpdateDay(idx, 'description', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gold/30 text-champagne hover:bg-navy-900"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gold text-navy-950 hover:bg-gold-light"
            >
              {editing ? 'Salvar Roteiro' : 'Criar Roteiro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
