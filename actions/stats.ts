'use server'

import { DashboardStats, LeadStatus } from '@/types/database'
import { getLeads } from './leads'
import { getClients } from './clients'
import { getTrips } from './trips'
import { getVendors } from './vendors'

export async function getDashboardStats(): Promise<DashboardStats> {
  const [leads, clients, trips, vendors] = await Promise.all([
    getLeads(),
    getClients(),
    getTrips(),
    getVendors(),
  ])

  const leadsByStatus: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    proposal: 0,
    confirmed: 0,
  }

  leads.forEach((l) => {
    if (leadsByStatus[l.status] !== undefined) {
      leadsByStatus[l.status] += 1
    }
  })

  const revenue = trips
    .filter((t) => t.reservation_status === 'confirmed' || t.reservation_status === 'completed')
    .reduce((acc, t) => acc + (Number(t.total_value) || 0), 0)

  const pipeline = trips.reduce((acc, t) => acc + (Number(t.total_value) || 0), 0)

  const recentLeads = [...leads].slice(0, 6)
  const upcomingTrips = [...trips]
    .filter((t) => t.departure_date)
    .sort((a, b) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime())
    .slice(0, 5)

  return {
    totals: {
      leads: leads.length,
      clients: clients.length,
      trips: trips.length,
      vendors: vendors.length,
      revenue,
      pipeline,
    },
    leadsByStatus,
    recentLeads,
    upcomingTrips,
  }
}
