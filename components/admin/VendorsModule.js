'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import ConfirmDialog from './ConfirmDialog'

const TYPES = ['Hotel', 'DMC', 'Companhia Aérea', 'Transporte', 'Experiências', 'Seguro']
const EMPTY = { name: '', type: 'Hotel', contact_name: '', email: '', phone: '', notes: '' }

export default function VendorsModule() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const load = async () => {
    try { setItems(await api.get('/vendors')) }
    catch (e) { toast.error('Erro ao carregar fornecedores.') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true) }
  const openEdit = (v) => { setEditing(v); setForm({ ...EMPTY, ...v }); setOpen(true) }

  const save = async () => {
    if (!form.name) { toast.error('Informe o nome do fornecedor.'); return }
    try {
      if (editing) await api.put(`/vendors/${editing.id}`, form)
      else await api.post('/vendors', form)
      toast.success(editing ? 'Fornecedor atualizado.' : 'Fornecedor criado.')
      setOpen(false); load()
    } catch (e) { toast.error(e.message) }
  }
  const remove = async (v) => {
    try { await api.del(`/vendors/${v.id}`); toast.success('Fornecedor removido.'); load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Fornecedores</h1>
          <p className="text-sm text-muted-foreground">Hotéis, DMCs, companhias aéreas e parceiros.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Novo fornecedor</Button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{v.name}</p>
                    {v.notes && <p className="max-w-xs truncate text-xs text-muted-foreground">{v.notes}</p>}
                  </TableCell>
                  <TableCell><Badge variant="outline" className="border-gold/40 text-gold">{v.type}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm text-foreground">{v.contact_name || '—'}</p>
                    <p className="text-xs text-muted-foreground">{v.email}</p>
                    <p className="text-xs text-muted-foreground">{v.phone}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil className="h-4 w-4" /></Button>
                      <ConfirmDialog
                        title="Remover fornecedor?"
                        description={`Deseja remover ${v.name}?`}
                        onConfirm={() => remove(v)}
                        trigger={<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Nenhum fornecedor cadastrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Editar fornecedor' : 'Novo fornecedor'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Nome *</Label><Input value={form.name} onChange={update('name')} /></div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Nome do contato</Label><Input value={form.contact_name} onChange={update('contact_name')} /></div>
            <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone} onChange={update('phone')} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={update('email')} /></div>
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
