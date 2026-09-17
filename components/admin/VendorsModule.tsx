'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Loader2, Building2, Phone, Mail } from 'lucide-react'
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
import { Vendor, VendorType } from '@/types/database'
import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from '@/actions/vendors'
import ConfirmDialog from './ConfirmDialog'

const VENDOR_TYPES: VendorType[] = [
  'Hotel',
  'DMC',
  'Companhia Aérea',
  'Transporte',
  'Experiências',
  'Seguro',
]

const EMPTY_VENDOR = {
  name: '',
  type: 'Hotel' as VendorType,
  contact_name: '',
  email: '',
  phone: '',
  notes: '',
}

export default function VendorsModule() {
  const [items, setItems] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Vendor | null>(null)
  const [form, setForm] = useState(EMPTY_VENDOR)

  const loadData = async () => {
    try {
      const data = await getVendors()
      setItems(data)
    } catch {
      toast.error('Erro ao carregar parceiros.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenNew = () => {
    setEditing(null)
    setForm(EMPTY_VENDOR)
    setDialogOpen(true)
  }

  const handleOpenEdit = (vendor: Vendor) => {
    setEditing(vendor)
    setForm({
      name: vendor.name,
      type: vendor.type,
      contact_name: vendor.contact_name || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      notes: vendor.notes || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Informe o nome do fornecedor.')
      return
    }

    try {
      if (editing) {
        const res = await updateVendor(editing.id, form)
        if (res.success) {
          toast.success('Fornecedor atualizado com sucesso.')
          setDialogOpen(false)
          loadData()
        } else {
          toast.error(res.error || 'Erro ao atualizar.')
        }
      } else {
        const res = await createVendor(form)
        if (res.success) {
          toast.success('Fornecedor cadastrado com sucesso.')
          setDialogOpen(false)
          loadData()
        } else {
          toast.error(res.error || 'Erro ao cadastrar.')
        }
      }
    } catch {
      toast.error('Erro na comunicação com o servidor.')
    }
  }

  const handleDelete = async (vendor: Vendor) => {
    try {
      const res = await deleteVendor(vendor.id)
      if (res.success) {
        toast.success('Fornecedor removido com sucesso.')
        loadData()
      } else {
        toast.error('Erro ao remover.')
      }
    } catch {
      toast.error('Erro ao excluir parceiro.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-light text-champagne">
            Rede Global de Parceiros & Fornecedores
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wider text-champagne/50">
            Hotéis 5 estrelas, DMCs internacionais, operadores aéreos e serviços de segurança.
          </p>
        </div>
        <Button
          onClick={handleOpenNew}
          className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-5 text-xs font-semibold uppercase tracking-wider text-navy-950 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Novo Fornecedor
        </Button>
      </div>

      {/* Table container */}
      <div className="overflow-hidden rounded-2xl border border-gold/15 bg-navy-900/40 backdrop-blur-md">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-gold">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader className="border-b border-gold/15 bg-navy-950/60">
              <TableRow className="border-gold/15 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-champagne/60">Parceiro</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-champagne/60">Categoria</TableHead>
                <TableHead className="hidden text-xs uppercase tracking-wider text-champagne/60 md:table-cell">Contato Direto</TableHead>
                <TableHead className="hidden text-xs uppercase tracking-wider text-champagne/60 lg:table-cell">Condições & Parceria</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-champagne/60">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  className="border-gold/10 transition-colors hover:bg-navy-900/70"
                >
                  <TableCell>
                    <p className="font-serif text-base font-normal text-champagne">{vendor.name}</p>
                    <p className="text-[11px] text-champagne/50 md:hidden">{vendor.contact_name}</p>
                  </TableCell>

                  <TableCell>
                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
                      {vendor.type}
                    </span>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <p className="text-xs text-champagne">{vendor.contact_name || '—'}</p>
                    <div className="mt-0.5 space-y-0.5 text-[11px] text-champagne/50">
                      {vendor.email && <p className="truncate">{vendor.email}</p>}
                      {vendor.phone && <p>{vendor.phone}</p>}
                    </div>
                  </TableCell>

                  <TableCell className="hidden max-w-xs lg:table-cell">
                    <p className="truncate text-xs font-light text-champagne/70">
                      {vendor.notes || 'Sem observações'}
                    </p>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(vendor)}
                        className="h-8 w-8 text-champagne/60 hover:bg-navy-900 hover:text-gold"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <ConfirmDialog
                        title="Excluir fornecedor?"
                        description={`Deseja remover ${vendor.name} da rede de parceiros?`}
                        onConfirm={() => handleDelete(vendor)}
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
              ))}

              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-xs text-champagne/50">
                    Nenhum fornecedor cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-gold/20 bg-navy-950 text-champagne sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-light text-champagne">
              {editing ? 'Editar Fornecedor' : 'Cadastrar Novo Parceiro'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Nome da Empresa / Hotel / DMC *</Label>
              <Input
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Aman Resorts Global"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Categoria de Fornecimento</Label>
              <select
                className="w-full rounded-md border border-gold/20 bg-navy-900 px-3 py-2 text-sm text-champagne outline-none focus:border-gold"
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as VendorType }))}
              >
                {VENDOR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Nome do Contato</Label>
              <Input
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.contact_name}
                onChange={(e) => setForm((prev) => ({ ...prev, contact_name: e.target.value }))}
                placeholder="Ex: Kenji Watanabe"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-champagne/70">Telefone Direto</Label>
              <Input
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+41 22 555-1000"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">E-mail Corporativo</Label>
              <Input
                type="email"
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="parceiros@aman.com"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-champagne/70">Condições Comerciais & Notas de Contrato</Label>
              <Textarea
                rows={3}
                className="border-gold/20 bg-navy-900 text-champagne focus:border-gold"
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Ex: Descontos especiais de agência, upgrades automáticos, crédito de USD 150 por estada..."
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
              {editing ? 'Salvar Alterações' : 'Cadastrar Parceiro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
