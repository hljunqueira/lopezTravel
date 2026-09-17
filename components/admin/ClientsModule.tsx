'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search, Loader2, AlertCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Client } from '@/types/database'
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from '@/actions/clients'
import ConfirmDialog from './ConfirmDialog'

const EMPTY_CLIENT = {
  name: '',
  email: '',
  phone: '',
  travel_preferences: '',
  passport_expiry: '',
  notes: '',
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (isNaN(d.getTime())) return String(value)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return String(value)
  }
}

function isPassportExpiringSoon(dateStr?: string | null) {
  if (!dateStr) return false
  const exp = new Date(dateStr).getTime()
  const sixMonths = Date.now() + 180 * 86400000
  return exp < sixMonths
}

export default function ClientsModule() {
  const [items, setItems] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState(EMPTY_CLIENT)

  const loadData = async () => {
    try {
      const data = await getClients()
      setItems(data)
    } catch {
      toast.error('Erro ao carregar os clientes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenNew = () => {
    setEditing(null)
    setForm(EMPTY_CLIENT)
    setDialogOpen(true)
  }

  const handleOpenEdit = (client: Client) => {
    setEditing(client)
    setForm({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      travel_preferences: client.travel_preferences || '',
      passport_expiry: client.passport_expiry ? client.passport_expiry.slice(0, 10) : '',
      notes: client.notes || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Informe o nome do cliente.')
      return
    }

    try {
      if (editing) {
        const res = await updateClient(editing.id, form)
        if (res.success) {
          toast.success('Cliente atualizado com sucesso.')
          setDialogOpen(false)
          loadData()
        } else {
          toast.error(res.error || 'Erro ao atualizar.')
        }
      } else {
        const res = await createClient(form)
        if (res.success) {
          toast.success('Cliente cadastrado com sucesso.')
          setDialogOpen(false)
          loadData()
        } else {
          toast.error(res.error || 'Erro ao cadastrar.')
        }
      }
    } catch {
      toast.error('Ocorreu uma falha ao salvar.')
    }
  }

  const handleDelete = async (client: Client) => {
    try {
      const res = await deleteClient(client.id)
      if (res.success) {
        toast.success('Cliente excluído com sucesso.')
        loadData()
      } else {
        toast.error('Erro ao remover cliente.')
      }
    } catch {
      toast.error('Erro ao remover.')
    }
  }

  const filtered = items.filter((c) =>
    [c.name, c.email, c.phone, c.travel_preferences].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-light text-champagne">
            Base de Clientes (CRM VIP)
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wider text-champagne/50">
            Histórico, preferências exclusivas e monitoramento de passaportes.
          </p>
        </div>
        <Button
          onClick={handleOpenNew}
          className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-5 text-xs font-semibold uppercase tracking-wider text-navy-950 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne/40" />
        <Input
          placeholder="Buscar por nome, e-mail, telefone..."
          className="rounded-xl border-gold/20 bg-navy-900/60 pl-10 text-xs text-champagne placeholder:text-champagne/30 focus:border-gold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-gold/15 bg-navy-900/40 backdrop-blur-md">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-gold">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader className="border-b border-gold/15 bg-navy-950/60">
              <TableRow className="border-gold/15 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-champagne/60">Cliente</TableHead>
                <TableHead className="hidden text-xs uppercase tracking-wider text-champagne/60 md:table-cell">Contato</TableHead>
                <TableHead className="hidden text-xs uppercase tracking-wider text-champagne/60 lg:table-cell">Preferências</TableHead>
                <TableHead className="hidden text-xs uppercase tracking-wider text-champagne/60 md:table-cell">Passaporte</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-champagne/60">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => {
                const expiringSoon = isPassportExpiringSoon(client.passport_expiry)
                return (
                  <TableRow
                    key={client.id}
                    className="border-gold/10 transition-colors hover:bg-navy-900/70"
                  >
                    <TableCell>
                      <p className="font-serif text-base font-normal text-champagne">{client.name}</p>
                      <p className="text-[11px] text-champagne/50 md:hidden">{client.email || client.phone}</p>
                      {client.notes && (
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-gold/70">{client.notes}</p>
                      )}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <p className="text-xs text-champagne">{client.email || '—'}</p>
                      <p className="text-[11px] text-champagne/50">{client.phone || '—'}</p>
                    </TableCell>

                    <TableCell className="hidden max-w-xs lg:table-cell">
                      <p className="truncate text-xs font-light text-champagne/70">
                        {client.travel_preferences || 'Sem preferências anotadas'}
                      </p>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-champagne">
                        <Calendar className="h-3.5 w-3.5 text-gold/70" />
                        <span>{formatDate(client.passport_expiry)}</span>
                      </div>
                      {expiringSoon && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[9px] font-medium text-amber-400">
                          <AlertCircle className="h-2.5 w-2.5" />
                          Renovar em breve
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(client)}
                          className="h-8 w-8 text-champagne/60 hover:bg-navy-900 hover:text-gold"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <ConfirmDialog
                          title="Excluir cliente?"
                          description={`Deseja remover ${client.name} da base de clientes? Esta ação é irreversível.`}
                          onConfirm={() => handleDelete(client)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-champagne/60 hover:bg-navy-900 hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-xs text-champagne/50">
                    Nenhum cliente encontrado com os critérios digitados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-gold/20 bg-navy-950 text-champagne sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-light text-champagne">
              {editing ? 'Editar Ficha do Cliente' : 'Novo Cliente VIP'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Nome Completo *</Label>
              <Input
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Roberto Castro Mendes"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">E-mail</Label>
              <Input
                type="email"
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="cliente@exemplo.com"
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

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Validade do Passaporte</Label>
              <Input
                type="date"
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.passport_expiry}
                onChange={(e) => setForm((prev) => ({ ...prev, passport_expiry: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Preferências Exclusivas de Viagem</Label>
              <Textarea
                rows={2}
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.travel_preferences}
                onChange={(e) => setForm((prev) => ({ ...prev, travel_preferences: e.target.value }))}
                placeholder="Ex: Prefere voos em First Class, hotéis boutique com vista mar, sem frutos do mar..."
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Anotações Internas & Perfil Concierge</Label>
              <Textarea
                rows={2}
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Ex: Aniversário de casamento em novembro, vinho favorito Brunello di Montalcino..."
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
              {editing ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
