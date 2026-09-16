'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { api, formatDate } from '@/lib/api'
import ConfirmDialog from './ConfirmDialog'

const EMPTY = { name: '', email: '', phone: '', travel_preferences: '', passport_expiry: '', notes: '' }

export default function ClientsModule() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const load = async () => {
    try { setItems(await api.get('/clients')) }
    catch (e) { toast.error('Erro ao carregar clientes.') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true) }
  const openEdit = (c) => { setEditing(c); setForm({ ...EMPTY, ...c }); setOpen(true) }

  const save = async () => {
    if (!form.name) { toast.error('Informe o nome do cliente.'); return }
    try {
      if (editing) await api.put(`/clients/${editing.id}`, form)
      else await api.post('/clients', form)
      toast.success(editing ? 'Cliente atualizado.' : 'Cliente criado.')
      setOpen(false); load()
    } catch (e) { toast.error(e.message) }
  }
  const remove = async (c) => {
    try { await api.del(`/clients/${c.id}`); toast.success('Cliente removido.'); load() }
    catch (e) { toast.error(e.message) }
  }

  const filtered = items.filter((c) =>
    [c.name, c.email, c.phone].join(' ').toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">Base de clientes da agência.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Novo cliente</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar por nome, e-mail..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Contato</TableHead>
                <TableHead className="hidden lg:table-cell">Preferências</TableHead>
                <TableHead className="hidden lg:table-cell">Passaporte</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground md:hidden">{c.email}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm text-foreground">{c.email}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </TableCell>
                  <TableCell className="hidden max-w-xs lg:table-cell"><p className="truncate text-sm text-muted-foreground">{c.travel_preferences || '—'}</p></TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(c.passport_expiry)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <ConfirmDialog
                        title="Remover cliente?"
                        description={`Deseja remover ${c.name}? Esta ação não pode ser desfeita.`}
                        onConfirm={() => remove(c)}
                        trigger={<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Nenhum cliente encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Editar cliente' : 'Novo cliente'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Nome *</Label><Input value={form.name} onChange={update('name')} /></div>
            <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={update('email')} /></div>
            <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone} onChange={update('phone')} /></div>
            <div className="space-y-2"><Label>Validade do passaporte</Label><Input type="date" value={form.passport_expiry || ''} onChange={update('passport_expiry')} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Preferências de viagem</Label><Textarea value={form.travel_preferences} onChange={update('travel_preferences')} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Observações</Label><Textarea value={form.notes} onChange={update('notes')} /></div>
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
