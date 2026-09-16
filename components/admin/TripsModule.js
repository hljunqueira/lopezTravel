'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, MapPin, Calendar, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api, formatBRL, formatDate } from '@/lib/api'
import ConfirmDialog from './ConfirmDialog'

const STATUS = {
  pending: { label: 'Pendente', cls: 'border-amber-500/40 text-amber-400' },
  confirmed: { label: 'Confirmada', cls: 'border-emerald-500/40 text-emerald-400' },
  completed: { label: 'Concluída', cls: 'border-sky-500/40 text-sky-400' },
  cancelled: { label: 'Cancelada', cls: 'border-red-500/40 text-red-400' },
}

const EMPTY = {
  client_id: '', client_name: '', destination: '', departure_date: '', return_date: '',
  reservation_status: 'pending', total_value: '', itinerary: [],
}

export default function TripsModule() {
  const [items, setItems] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const load = async () => {
    try {
      const [t, c] = await Promise.all([api.get('/trips'), api.get('/clients')])
      setItems(t); setClients(c)
    } catch (e) { toast.error('Erro ao carregar viagens.') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true) }
  const openEdit = (t) => { setEditing(t); setForm({ ...EMPTY, ...t, itinerary: t.itinerary || [] }); setOpen(true) }

  const onClientChange = (id) => {
    const c = clients.find((x) => x.id === id)
    setForm((f) => ({ ...f, client_id: id, client_name: c ? c.name : '' }))
  }

  const addDay = () => setForm((f) => ({ ...f, itinerary: [...f.itinerary, { day: f.itinerary.length + 1, title: '', description: '' }] }))
  const updateDay = (i, k, v) => setForm((f) => ({ ...f, itinerary: f.itinerary.map((d, idx) => (idx === i ? { ...d, [k]: v } : d)) }))
  const removeDay = (i) => setForm((f) => ({ ...f, itinerary: f.itinerary.filter((_, idx) => idx !== i) }))

  const save = async () => {
    if (!form.destination) { toast.error('Informe o destino.'); return }
    const payload = { ...form, total_value: Number(form.total_value) || 0 }
    try {
      if (editing) await api.put(`/trips/${editing.id}`, payload)
      else await api.post('/trips', payload)
      toast.success(editing ? 'Viagem atualizada.' : 'Viagem criada.')
      setOpen(false); load()
    } catch (e) { toast.error(e.message) }
  }
  const remove = async (t) => {
    try { await api.del(`/trips/${t.id}`); toast.success('Viagem removida.'); load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Viagens & Roteiros</h1>
          <p className="text-sm text-muted-foreground">Construa e gerencie os itinerários dos clientes.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Nova viagem</Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((t) => {
            const st = STATUS[t.reservation_status] || STATUS.pending
            return (
              <Card key={t.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg text-foreground">{t.destination}</h3>
                      <p className="text-sm text-muted-foreground">{t.client_name || 'Sem cliente'}</p>
                    </div>
                    <Badge variant="outline" className={st.cls}>{st.label}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-gold" /> {formatDate(t.departure_date)} → {formatDate(t.return_date)}</span>
                    <span className="font-medium text-gold">{formatBRL(t.total_value)}</span>
                  </div>
                  {t.itinerary?.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-border pt-4">
                      {t.itinerary.slice(0, 3).map((d, i) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <span className="shrink-0 font-semibold text-gold">Dia {d.day}</span>
                          <span className="text-muted-foreground"><span className="text-foreground">{d.title}</span>{d.description ? ` — ${d.description}` : ''}</span>
                        </div>
                      ))}
                      {t.itinerary.length > 3 && <p className="text-xs text-muted-foreground/70">+ {t.itinerary.length - 3} dia(s)</p>}
                    </div>
                  )}
                  <div className="mt-5 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(t)}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar</Button>
                    <ConfirmDialog
                      title="Remover viagem?"
                      description={`Deseja remover a viagem para ${t.destination}?`}
                      onConfirm={() => remove(t)}
                      trigger={<Button variant="outline" size="sm" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {items.length === 0 && (
            <div className="col-span-full flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">Nenhuma viagem cadastrada.</div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto thin-scroll sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Editar viagem' : 'Nova viagem'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={form.client_id} onValueChange={onClientChange}>
                <SelectTrigger><SelectValue placeholder="Selecionar cliente" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Destino *</Label><Input value={form.destination} onChange={update('destination')} /></div>
            <div className="space-y-2"><Label>Ida</Label><Input type="date" value={form.departure_date || ''} onChange={update('departure_date')} /></div>
            <div className="space-y-2"><Label>Volta</Label><Input type="date" value={form.return_date || ''} onChange={update('return_date')} /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.reservation_status} onValueChange={(v) => setForm((f) => ({ ...f, reservation_status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS).map(([k, v]) => (<SelectItem key={k} value={k}>{v.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Valor total (R$)</Label><Input type="number" value={form.total_value} onChange={update('total_value')} /></div>
          </div>

          <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Itinerário</Label>
              <Button type="button" variant="outline" size="sm" onClick={addDay}><Plus className="mr-1.5 h-3.5 w-3.5" /> Adicionar dia</Button>
            </div>
            {form.itinerary.length === 0 && <p className="text-xs text-muted-foreground">Nenhum dia adicionado.</p>}
            <div className="space-y-3">
              {form.itinerary.map((d, i) => (
                <div key={i} className="rounded-lg border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gold">Dia</span>
                      <Input type="number" className="h-8 w-16" value={d.day} onChange={(e) => updateDay(i, 'day', Number(e.target.value))} />
                    </div>
                    <button type="button" onClick={() => removeDay(i)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                  </div>
                  <Input className="mb-2" placeholder="Título do dia" value={d.title} onChange={(e) => updateDay(i, 'title', e.target.value)} />
                  <Textarea placeholder="Descrição" value={d.description} onChange={(e) => updateDay(i, 'description', e.target.value)} />
                </div>
              ))}
            </div>
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
