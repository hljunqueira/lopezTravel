'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Loader2,
  ArrowRight,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Lead, LeadStatus } from '@/types/database'
import {
  getLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
} from '@/actions/leads'
import ConfirmDialog from './ConfirmDialog'

const COLUMNS: { key: LeadStatus; label: string }[] = [
  { key: 'new', label: 'Novos' },
  { key: 'contacted', label: 'Em Contato' },
  { key: 'proposal', label: 'Proposta' },
  { key: 'confirmed', label: 'Confirmados' },
]

const EMPTY_LEAD = {
  name: '',
  email: '',
  phone: '',
  destination: '',
  budget: '',
  message: '',
  status: 'new' as LeadStatus,
}

function formatDate(value?: string) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (isNaN(d.getTime())) return String(value)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  } catch {
    return String(value)
  }
}

export default function LeadsKanban() {
  const [items, setItems] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [form, setForm] = useState(EMPTY_LEAD)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const data = await getLeads()
      setItems(data)
    } catch {
      toast.error('Erro ao carregar os leads.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenNew = () => {
    setEditing(null)
    setForm(EMPTY_LEAD)
    setDialogOpen(true)
  }

  const handleOpenEdit = (lead: Lead) => {
    setEditing(lead)
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      destination: lead.destination || '',
      budget: lead.budget || '',
      message: lead.message || '',
      status: lead.status,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Informe nome e e-mail do lead.')
      return
    }

    try {
      if (editing) {
        const res = await updateLead(editing.id, form)
        if (res.success) {
          toast.success('Lead atualizado com sucesso.')
          setDialogOpen(false)
          loadData()
        } else {
          toast.error(res.error || 'Erro ao atualizar.')
        }
      } else {
        const res = await createLead(form)
        if (res.success) {
          toast.success('Lead registrado com sucesso.')
          setDialogOpen(false)
          loadData()
        } else {
          toast.error(res.error || 'Erro ao cadastrar lead.')
        }
      }
    } catch {
      toast.error('Ocorreu uma falha ao salvar.')
    }
  }

  const handleDelete = async (lead: Lead) => {
    try {
      const res = await deleteLead(lead.id)
      if (res.success) {
        toast.success('Lead removido com sucesso.')
        loadData()
      } else {
        toast.error('Erro ao remover lead.')
      }
    } catch {
      toast.error('Erro ao remover.')
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDrop = async (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault()
    setDragOverCol(null)
    const id = e.dataTransfer.getData('text/plain')
    const lead = items.find((l) => l.id === id)
    if (!lead || lead.status === status) return

    // Optimistic UI update
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))

    try {
      await updateLeadStatus(id, status)
      toast.success(`Status alterado para "${COLUMNS.find((c) => c.key === status)?.label}".`)
    } catch {
      toast.error('Erro ao atualizar status.')
      loadData()
    }
  }

  const handleMoveToNextStatus = async (lead: Lead) => {
    const currentIndex = COLUMNS.findIndex((c) => c.key === lead.status)
    if (currentIndex < COLUMNS.length - 1) {
      const nextStatus = COLUMNS[currentIndex + 1].key
      setItems((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l)))
      await updateLeadStatus(lead.id, nextStatus)
      toast.success(`Movido para "${COLUMNS[currentIndex + 1].label}".`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-light text-champagne">
            Pipeline de Leads & Oportunidades
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wider text-champagne/50">
            Arraste os cartões entre as colunas para atualizar a fase de negociação.
          </p>
        </div>
        <Button
          onClick={handleOpenNew}
          className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-5 text-xs font-semibold uppercase tracking-wider text-navy-950 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Novo Lead
        </Button>
      </div>

      {loading ? (
        <div className="flex h-72 items-center justify-center text-gold">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const colItems = items.filter((item) => item.status === col.key)
            const isDragOver = dragOverCol === col.key

            return (
              <div
                key={col.key}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverCol(col.key)
                }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={(e) => handleDrop(e, col.key)}
                className={`flex flex-col rounded-2xl border p-4 transition-all duration-200 ${
                  isDragOver
                    ? 'border-gold bg-gold/5 shadow-[0_0_25px_rgba(212,175,55,0.15)]'
                    : 'border-gold/15 bg-navy-900/40 backdrop-blur-md'
                }`}
              >
                {/* Column Title */}
                <div className="mb-4 flex items-center justify-between border-b border-gold/10 pb-3">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-champagne">
                    {col.label}
                  </span>
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11px] font-mono text-gold">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-3">
                  {colItems.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="group cursor-grab rounded-xl border border-gold/15 bg-navy-900/80 p-4 shadow-sm transition-all duration-200 hover:border-gold/40 hover:shadow-md active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-serif text-base font-normal text-champagne">
                          {lead.name}
                        </p>
                        <div className="flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(lead)}
                            className="p-1 text-champagne/60 hover:text-gold"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <ConfirmDialog
                            title="Remover oportunidade?"
                            description={`Deseja excluir o registro de ${lead.name}?`}
                            onConfirm={() => handleDelete(lead)}
                            trigger={
                              <button
                                type="button"
                                className="p-1 text-champagne/60 hover:text-destructive"
                                title="Excluir"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            }
                          />
                        </div>
                      </div>

                      {lead.destination && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gold/90">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{lead.destination}</span>
                        </div>
                      )}

                      {lead.budget && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-champagne/60">
                          <DollarSign className="h-3 w-3 text-gold/60 shrink-0" />
                          <span>{lead.budget}</span>
                        </div>
                      )}

                      <div className="mt-3 space-y-1 border-t border-gold/10 pt-2.5 text-[11px] text-champagne/60">
                        {lead.email && (
                          <p className="flex items-center gap-1.5 truncate">
                            <Mail className="h-3 w-3 text-champagne/40 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </p>
                        )}
                        {lead.phone && (
                          <p className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-champagne/40 shrink-0" />
                            <span>{lead.phone}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-gold/10 pt-2 text-[10px] text-champagne/40">
                        <span>{formatDate(lead.created_at)}</span>
                        {col.key !== 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleMoveToNextStatus(lead)}
                            className="inline-flex items-center gap-1 text-gold/80 hover:text-gold"
                            title="Avançar estágio"
                          >
                            <span>Avançar</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {colItems.length === 0 && (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gold/10 text-[11px] text-champagne/40">
                      Nenhum lead nesta etapa
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-gold/20 bg-navy-950 text-champagne sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-light text-champagne">
              {editing ? 'Editar Lead' : 'Cadastrar Novo Lead'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Nome do Viajante *</Label>
              <Input
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Dra. Beatriz Prado"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">E-mail *</Label>
              <Input
                type="email"
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Telefone / WhatsApp</Label>
              <Input
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+55 11 99999-0000"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Destino de Interesse</Label>
              <Input
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.destination}
                onChange={(e) => setForm((prev) => ({ ...prev, destination: e.target.value }))}
                placeholder="Ex: Maldivas, Japão"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Faixa de Investimento</Label>
              <Input
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.budget}
                onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                placeholder="Ex: R$ 80k - R$ 150k"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Status Atual</Label>
              <select
                className="w-full rounded-md border border-gold/20 bg-navy-900 px-3 py-2 text-sm text-champagne outline-none focus:border-gold"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as LeadStatus }))}
              >
                {COLUMNS.map((col) => (
                  <option key={col.key} value={col.key}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Notas da Viagem & Solicitações</Label>
              <Textarea
                rows={3}
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Detalhes sobre a viagem, ocasiões comemorativas, etc."
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
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
              {editing ? 'Salvar Alterações' : 'Cadastrar Lead'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
