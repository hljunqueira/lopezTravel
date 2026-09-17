export type LeadStatus = 'new' | 'contacted' | 'proposal' | 'confirmed'
export type TripStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type VendorType = 'Hotel' | 'DMC' | 'Companhia Aérea' | 'Transporte' | 'Experiências' | 'Seguro'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  travel_preferences: string
  passport_expiry: string | null
  notes: string
  created_at: string
  updated_at?: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  destination: string
  budget: string
  message: string
  status: LeadStatus
  source: string
  created_at: string
  updated_at?: string
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
}

export interface Trip {
  id: string
  client_id: string
  client_name?: string
  destination: string
  departure_date: string
  return_date: string
  reservation_status: TripStatus
  total_value: number
  itinerary: ItineraryDay[]
  created_at: string
  updated_at?: string
}

export interface Vendor {
  id: string
  name: string
  type: VendorType
  contact_name: string
  email: string
  phone: string
  notes: string
  created_at: string
  updated_at?: string
}

export interface DashboardStats {
  totals: {
    leads: number
    clients: number
    trips: number
    vendors: number
    revenue: number
    pipeline: number
  }
  leadsByStatus: Record<LeadStatus, number>
  recentLeads: Lead[]
  upcomingTrips: Trip[]
}
