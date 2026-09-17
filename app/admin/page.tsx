'use client'

import React, { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import LoginScreen from '@/components/admin/LoginScreen'
import Sidebar, { NAV_ITEMS } from '@/components/admin/Sidebar'
import Overview from '@/components/admin/Overview'
import LeadsKanban from '@/components/admin/LeadsKanban'
import ClientsModule from '@/components/admin/ClientsModule'
import TripsModule from '@/components/admin/TripsModule'
import VendorsModule from '@/components/admin/VendorsModule'

const STORAGE_KEY = 'lopez_admin_session'

export default function AdminPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [ready, setReady] = useState(false)
  const [view, setView] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.user) setUser(parsed.user)
      }
    } catch {}
    setReady(true)
  }, [])

  const handleLogin = (u: { name: string; email: string; role: string }, token: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, token }))
    setUser(u)
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  if (!ready) {
    return <div className="min-h-screen bg-navy-950" />
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const views: Record<string, React.ReactNode> = {
    overview: <Overview />,
    leads: <LeadsKanban />,
    clients: <ClientsModule />,
    trips: <TripsModule />,
    vendors: <VendorsModule />,
  }

  const handleSelect = (key: string) => {
    setView(key)
    setMobileOpen(false)
  }

  const currentLabel = NAV_ITEMS.find((n) => n.key === view)?.label || 'Visão Geral'

  return (
    <div className="flex min-h-screen bg-navy-950 text-champagne">
      {/* Desktop Sticky Sidebar */}
      <aside className="sticky top-0 hidden h-screen md:block">
        <Sidebar active={view} onSelect={handleSelect} user={user} onLogout={handleLogout} />
      </aside>

      {/* Main Area */}
      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        {/* Mobile Header Bar */}
        <div className="flex items-center gap-3 border-b border-gold/15 bg-navy-950 px-5 py-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="text-champagne/80 hover:text-gold" aria-label="Abrir menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-gold/15 bg-navy-950 p-0 text-champagne">
              <SheetTitle className="sr-only">Navegação do Painel</SheetTitle>
              <Sidebar active={view} onSelect={handleSelect} user={user} onLogout={handleLogout} />
            </SheetContent>
          </Sheet>
          <span className="font-serif text-lg font-light text-champagne">{currentLabel}</span>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10">{views[view]}</main>
      </div>
    </div>
  )
}
