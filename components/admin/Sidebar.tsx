'use client'

import React from 'react'
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Plane,
  Building2,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import LopezLogo from '@/components/brand/LopezLogo'

export const NAV_ITEMS = [
  { key: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { key: 'leads', label: 'Leads & Pipeline', icon: KanbanSquare },
  { key: 'clients', label: 'Clientes (CRM)', icon: Users },
  { key: 'trips', label: 'Viagens & Roteiros', icon: Plane },
  { key: 'vendors', label: 'Fornecedores', icon: Building2 },
]

interface SidebarProps {
  active: string
  onSelect: (key: string) => void
  user: { name?: string; email?: string } | null
  onLogout: () => void
}

export default function Sidebar({ active, onSelect, user, onLogout }: SidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col border-r border-gold/15 bg-navy-950 text-champagne">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-gold/10 px-6 py-6">
        <LopezLogo variant="horizontal" size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-6">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/70">
          Módulos Concierge
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = active === item.key
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-medium uppercase tracking-[0.16em] transition-all duration-200 ${
                isActive
                  ? 'border border-gold/30 bg-gold/15 text-gold shadow-[0_2px_15px_rgba(212,175,55,0.15)]'
                  : 'text-champagne/65 hover:bg-navy-900 hover:text-champagne'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Back to Public Site */}
      <div className="px-4 py-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-lg border border-gold/15 bg-navy-900/50 px-3 py-2 text-[11px] text-champagne/60 transition-colors hover:border-gold/40 hover:text-gold"
        >
          <span>Ver Site Público</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* User Footer */}
      <div className="border-t border-gold/15 p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-xs font-semibold text-gold">
            {(user?.name || 'A').charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-champagne">{user?.name || 'Ana Lopez'}</p>
            <p className="truncate text-[10px] text-champagne/50">{user?.email || 'admin@lopeztravel.com'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-champagne/55 transition-colors hover:bg-navy-900 hover:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </div>
  )
}
