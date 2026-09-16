'use client'

import { LayoutDashboard, KanbanSquare, Users, Plane, Building2, LogOut } from 'lucide-react'

export const NAV = [
  { key: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { key: 'leads', label: 'Leads', icon: KanbanSquare },
  { key: 'clients', label: 'Clientes', icon: Users },
  { key: 'trips', label: 'Viagens', icon: Plane },
  { key: 'vendors', label: 'Fornecedores', icon: Building2 },
]

export default function Sidebar({ active, onSelect, user, onLogout }) {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex items-baseline gap-2 px-6 py-6">
        <span className="font-display text-2xl font-semibold tracking-wide text-foreground">LOPEZ</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold">Travel</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = active === item.key
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/15 text-gold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-gold">
            {(user?.name || 'A').charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  )
}
