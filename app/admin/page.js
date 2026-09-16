'use client'

import React, { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import LoginScreen from '@/components/admin/LoginScreen'
import Sidebar, { NAV } from '@/components/admin/Sidebar'
import Overview from '@/components/admin/Overview'
import LeadsKanban from '@/components/admin/LeadsKanban'
import ClientsModule from '@/components/admin/ClientsModule'
import TripsModule from '@/components/admin/TripsModule'
import VendorsModule from '@/components/admin/VendorsModule'

const STORAGE = 'lopez_admin'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [view, setView] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE)
      if (s) {
        const parsed = JSON.parse(s)
        if (parsed?.user) setUser(parsed.user)
      }
    } catch {}
    setReady(true)
  }, [])

  const login = (u, token) => {
    localStorage.setItem(STORAGE, JSON.stringify({ user: u, token }))
    setUser(u)
  }
  const logout = () => {
    localStorage.removeItem(STORAGE)
    setUser(null)
  }

  if (!ready) return <div className="dark min-h-screen bg-navy" />

  if (!user) {
    return (
      <div className="dark">
        <LoginScreen onLogin={login} />
      </div>
    )
  }

  const views = {
    overview: <Overview />,
    leads: <LeadsKanban />,
    clients: <ClientsModule />,
    trips: <TripsModule />,
    vendors: <VendorsModule />,
  }

  const select = (key) => { setView(key); setMobileOpen(false) }
  const activeLabel = NAV.find((n) => n.key === view)?.label || ''

  return (
    <div className="dark">
      <div className="flex min-h-screen bg-background text-foreground">
        <aside className="sticky top-0 hidden h-screen md:block">
          <Sidebar active={view} onSelect={select} user={user} onLogout={logout} />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          {/* Mobile top bar */}
          <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="text-foreground"><Menu className="h-6 w-6" /></button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-border bg-card p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Sidebar active={view} onSelect={select} user={user} onLogout={logout} />
              </SheetContent>
            </Sheet>
            <span className="font-display text-lg text-foreground">{activeLabel}</span>
          </div>

          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{views[view]}</main>
        </div>
      </div>
    </div>
  )
}
