'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { api, formatDate } from '@/lib/api'
import ConfirmDialog from './ConfirmDialog'

const COLUMNS = [
  { key: 'new', label: 'Novos' },
  { key: 'contacted', label: 'Contatados' },
  { key: 'proposal', label: 'Proposta' },
  { key: 'confirmed', label: 'Confirmados' },
]

const EMPTY = { name: '', email: '', phone: '', destination: '', budget: '', message: '', status: 'new' }

export default function LeadsKanban() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [dragOver, setDragOver] = useState(null)

  const load = async () => {
    try {
      setItems(await api.get('/leads'))
    } catch (e) {
      toast.error('Erro ao carregar leads.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true) }
  const openEdit = (l) => { setEditing(l); setForm({ ...EMPTY, ...l }); setOpen(true) }

  const save = async () => {
    if (!form.name) { toast.error('Informe o nome do lead.'); return }
    try {
      if (editing) await api.put(`/leads/${editing.id}`, form)
      else await api.post('/leads', form)
      toast.success(editing ? 'Lead atualizado.' : 'Lead criado.')
      setOpen(false)
      load()
    } catch (e) { toast.error(e.message) }
  }

  const remove = async (l) => {
    try { await api.del(`/leads/${l.id}`); toast.success('Lead removido.'); load() }
    catch (e) { toast.error(e.message) }
  }

  const onDrop = async (e, status) => {
    e.preventDefault()
    setDragOver(null)
    const id = e.dataTransfer.getData('text/plain')
    const lead = items.find((l) => l.id === id)
    if (!lead || lead.status === status) return
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    try { await api.put(`/leads/${id}`, { status }) }
    catch (err) { toast.error('Erro ao mover lead.'); load() }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">Arraste os cartões para mover entre estágios.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Novo lead</Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const colItems = items.filter((l) => l.status === col.key)
            return (
              <div
                key={col.key}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col.key) }}
                onDragLeave={() => setDragOver((c) => (c === col.key ? null : c))}
                onDrop={(e) => onDrop(e, col.key)}
                className={`rounded-xl border p-3 transition-colors ${dragOver === col.key ? 'border-gold/60 bg-primary/5' : 'border-border bg-card/40'}`}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-foreground">{col.label}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{colItems.length}</span>
                </div>
                <div className="space-y-3">
                  {colItems.map((l) => (
                    <div
                      key={l.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', l.id)}
                      className="group cursor-grab rounded-lg border border-border bg-card p-4 active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-semibold text-foreground">{l.name}</p>
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={() => openEdit(l)} className="text-muted-foreground hover:text-gold"><Pencil className="h-3.5 w-3.5" /></button>
                          <ConfirmDialog
                            title="Remover lead?"
                            description={`Deseja remover o lead de ${l.name}? Esta ação não pode ser desfeita.`}
                            onConfirm={() => remove(l)}
                            trigger={<button className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>}
                          />
                        </div>
                      </div>
                      {l.destination && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3 text-gold" /> {l.destination}</p>
                      )}
                      {l.budget && <p className="mt-1 text-xs font-medium text-gold">{l.budget}</p>}
                      <div className="mt-3 space-y-1 border-t border-border pt-2 text-xs text-muted-foreground">
                        {l.email && <p className="flex items-center gap-1.5 truncate"><Mail className="h-3 w-3" /> {l.email}</p>}
                        {l.phone && <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {l.phone}</p>}
                      </div>
                      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/70">{formatDate(l.created_at)}</p>
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <p className="px-1 py-6 text-center text-xs text-muted-foreground/60">Sem leads</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar lead' : 'Novo lead'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Nome *</Label><Input value={form.name} onChange={update('name')} /></div>
            <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={update('email')} /></div>
            <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone} onChange={update('phone')} /></div>
            <div className="space-y-2"><Label>Destino</Label><Input value={form.destination} onChange={update('destination')} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Orçamento</Label><Input value={form.budget} onChange={update('budget')} placeholder="Ex: R$ 50k - R$ 80k" /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Mensagem</Label><Textarea value={form.message} onChange={update('message')} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save}>{editing ? 'Salvar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
