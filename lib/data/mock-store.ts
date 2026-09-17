import { Client, Lead, Trip, Vendor } from '@/types/database'
import { v4 as uuidv4 } from 'uuid'

// In-memory store for development/demo when Supabase credentials are not provided
class MockDataStore {
  private clients: Client[] = [
    {
      id: 'c-101',
      name: 'Eduardo Silveira & Família',
      email: 'eduardo.silveira@holding.com.br',
      phone: '+55 11 99881-2233',
      travel_preferences: 'Suítes presidenciais, jatos privados, gastronomia Michelin 3 estrelas.',
      passport_expiry: '2029-08-15',
      notes: 'Cliente Ultra-VIP. Prefere vilas isoladas com mordomo e chef privativo.',
      created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
    },
    {
      id: 'c-102',
      name: 'Marina Albuquerque',
      email: 'marina.albuquerque@artgallery.com',
      phone: '+55 21 98772-4455',
      travel_preferences: 'Curadoria de arte, vinhedos históricos, Toscana e Provence privativo.',
      passport_expiry: '2028-11-20',
      notes: 'Aniversário de 10 anos de casamento planejado para o outono europeu.',
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: 'c-103',
      name: 'Guilherme Sampaio',
      email: 'gsampaio@venturecap.com',
      phone: '+55 31 97663-8899',
      travel_preferences: 'Safáris privados na África do Sul e Botsuana, lodges sustentáveis de luxo.',
      passport_expiry: '2027-03-10',
      notes: 'Adepto de fotografia de natureza e expedições guiadas com biólogos.',
      created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    },
    {
      id: 'c-104',
      name: 'Dra. Beatriz Prado',
      email: 'beatriz.prado@medcenter.com.br',
      phone: '+55 41 96554-1122',
      travel_preferences: 'Wellness de alta tecnologia, Spas médicos na Suíça e retiros em Bali.',
      passport_expiry: '2030-05-18',
      notes: 'Viagens anuais focadas em descompressão e longevidade.',
      created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    {
      id: 'c-105',
      name: 'Roberto Castro Mendes',
      email: 'roberto@castroconsult.com',
      phone: '+55 51 95443-6677',
      travel_preferences: 'Japão na florada das cerejeiras, ryokans privativos com onsen mineral.',
      passport_expiry: '2026-12-05',
      notes: 'Atenção: Passaporte vence em breve. Notificar equipe para renovação.',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ]

  private leads: Lead[] = [
    {
      id: 'l-201',
      name: 'Juliana Ferreira Ramos',
      email: 'juliana.f@ramosinvest.com',
      phone: '+55 11 91234-5678',
      destination: 'Maldivas — Soneva Fushi',
      budget: 'R$ 80k+',
      message: 'Lua de mel em novembro. Buscamos overwater villa com piscina e hidroavião privativo.',
      status: 'new',
      source: 'website',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'l-202',
      name: 'Rodrigo Fontes',
      email: 'rodrigo.fontes@triunfo.com',
      phone: '+55 21 92345-6789',
      destination: 'Japão & Kyoto Tradicional',
      budget: 'R$ 80k+',
      message: 'Roteiro de 14 dias para casal com guia fluente em português e acesso antecipado a templos.',
      status: 'new',
      source: 'indicação',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'l-203',
      name: 'Camila Mendonça',
      email: 'camila.m@mendonca.adv.br',
      phone: '+55 31 93456-7890',
      destination: 'Santorini & Mykonos',
      budget: 'R$ 50k - R$ 80k',
      message: 'Comemoração de aniversário. Queremos iate privativo para navegar pelo mar Egeu.',
      status: 'contacted',
      source: 'website',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'l-204',
      name: 'Henrique Barcellos',
      email: 'hbarcellos@techhold.com',
      phone: '+55 41 94567-8901',
      destination: 'Dubai & Deserto de Al Maha',
      budget: 'R$ 80k+',
      message: 'Experiência no deserto com falcoaria e suíte panorâmica no Burj Al Arab.',
      status: 'contacted',
      source: 'indicação',
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 'l-205',
      name: 'Patrícia Villanova',
      email: 'patricia@villanova.com',
      phone: '+55 51 95678-9012',
      destination: 'Paris & Vale do Loire',
      budget: 'R$ 50k - R$ 80k',
      message: 'Semana de moda de Paris combinada com castelos privados no Loire.',
      status: 'proposal',
      source: 'website',
      created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    },
    {
      id: 'l-206',
      name: 'Eduardo Vasconcelos',
      email: 'eduardo@vasconcelos.org',
      phone: '+55 11 96789-0123',
      destination: 'Toscana & Costa Amalfitana',
      budget: 'R$ 80k+',
      message: 'Tour pelas vinícolas de Bolgheri e Chianti com sommelier dedicado.',
      status: 'proposal',
      source: 'indicação',
      created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    },
    {
      id: 'l-207',
      name: 'Fernanda Diniz',
      email: 'fernanda.diniz@diniz.com.br',
      phone: '+55 21 97890-1234',
      destination: 'Polinésia Francesa — Bora Bora',
      budget: 'R$ 80k+',
      message: 'Roteiro fechado e aprovado. Aguardando emissão dos vouchers das overwater villas.',
      status: 'confirmed',
      source: 'website',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: 'l-208',
      name: 'Marcelo Penteado',
      email: 'marcelo.penteado@apex.com',
      phone: '+55 31 98901-2345',
      destination: 'Alpes Suíços — St. Moritz',
      budget: 'R$ 80k+',
      message: 'Temporada de esqui com instrutor privativo e chalé de montanha exclusivo.',
      status: 'confirmed',
      source: 'instagram',
      created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
    },
  ]

  private trips: Trip[] = [
    {
      id: 't-301',
      client_id: 'c-101',
      client_name: 'Eduardo Silveira & Família',
      destination: 'Maldivas — Soneva Jani & Cheval Blanc',
      departure_date: new Date(Date.now() + 25 * 86400000).toISOString().slice(0, 10),
      return_date: new Date(Date.now() + 37 * 86400000).toISOString().slice(0, 10),
      reservation_status: 'confirmed',
      total_value: 128000,
      itinerary: [
        { day: 1, title: 'Chegada em Malé & Lounge Privativo', description: 'Recepção VIP na pista, alfândega privativa e traslado em hidroavião com champanhe.' },
        { day: 2, title: 'Check-in Water Retreat com Tobogã', description: 'Instalação na villa de 2 andares com teto retrátil para observação das estrelas.' },
        { day: 4, title: 'Cruzeiro de Pôr do Sol com Golfinhos', description: 'Navegação em iate privado de 72 pés com sommelier a bordo.' },
        { day: 7, title: 'Traslado Cheval Blanc Randheli', description: 'Check-in na Island Villa e jantar exclusivo assinado por chef 3 estrelas Michelin.' },
      ],
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: 't-302',
      client_id: 'c-102',
      client_name: 'Marina Albuquerque',
      destination: 'Florença, Toscana & Val d’Orcia',
      departure_date: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
      return_date: new Date(Date.now() + 57 * 86400000).toISOString().slice(0, 10),
      reservation_status: 'pending',
      total_value: 78000,
      itinerary: [
        { day: 1, title: 'Florença — Four Seasons Hotel', description: 'Suíte renascentista com afrescos originais e jardim botânico privado.' },
        { day: 3, title: 'Visita Fechada à Galleria degli Uffizi', description: 'Acesso privativo antes da abertura ao público geral com historiador de arte.' },
        { day: 6, title: 'Resort Rosewood Castiglion del Bosco', description: 'Vila privativa entre vinhedos de Brunello di Montalcino com carro esportivo.' },
      ],
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: 't-303',
      client_id: 'c-103',
      client_name: 'Guilherme Sampaio',
      destination: 'Botsuana & Cataratas Vitória',
      departure_date: new Date(Date.now() + 75 * 86400000).toISOString().slice(0, 10),
      return_date: new Date(Date.now() + 88 * 86400000).toISOString().slice(0, 10),
      reservation_status: 'pending',
      total_value: 96000,
      itinerary: [
        { day: 1, title: 'Delta do Okavango — Wilderness Safaris', description: 'Safári aéreo panorâmico em monomotor sobre as planícies inundadas.' },
        { day: 3, title: 'Mombo Camp no Coração do Delta', description: 'Game drives diários com rastreador mestre e observação de felinos.' },
      ],
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 't-304',
      client_id: 'c-104',
      client_name: 'Dra. Beatriz Prado',
      destination: 'Suíça — Bürgenstock Resort & Clinique La Prairie',
      departure_date: new Date(Date.now() - 20 * 86400000).toISOString().slice(0, 10),
      return_date: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10),
      reservation_status: 'completed',
      total_value: 84000,
      itinerary: [
        { day: 1, title: 'Lucerna & Bürgenstock Alpine Spa', description: 'Suíte panorâmica sobre o Lago Lucerna com tratamentos termais alpinos.' },
      ],
      created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    },
  ]

  private vendors: Vendor[] = [
    {
      id: 'v-401',
      name: 'Aman Resorts Global',
      type: 'Hotel',
      contact_name: 'Kenji Watanabe',
      email: 'partners@aman.com',
      phone: '+41 22 555-1000',
      notes: 'Parceria Tier 1: Upgrades automáticos, early check-in, crédito de spa $150 USD por estada.',
      created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    },
    {
      id: 'v-402',
      name: 'Four Seasons Hotels & Resorts',
      type: 'Hotel',
      contact_name: 'Sofia Marchetti',
      email: 'luxury.affiliates@fourseasons.com',
      phone: '+1 416 449-1750',
      notes: 'Programa Four Seasons Preferred Partner com amenidades de boas-vindas exclusivas.',
      created_at: new Date(Date.now() - 85 * 86400000).toISOString(),
    },
    {
      id: 'v-403',
      name: 'Abercrombie & Kent DMC',
      type: 'DMC',
      contact_name: 'James Holloway',
      email: 'trade@abercrombiekent.com',
      phone: '+44 20 7590-0610',
      notes: 'DMC global com representação em 50+ países. Gestão de experiências em terra de alto luxo.',
      created_at: new Date(Date.now() - 80 * 86400000).toISOString(),
    },
    {
      id: 'v-404',
      name: 'Emirates Private & First Class',
      type: 'Companhia Aérea',
      contact_name: 'Layla Al-Hassan',
      email: 'firstclass.partners@emirates.com',
      phone: '+971 4 214-4444',
      notes: 'Emissão executiva e First Class com limusine no destino e check-in privativo em Dubai.',
      created_at: new Date(Date.now() - 70 * 86400000).toISOString(),
    },
    {
      id: 'v-405',
      name: 'NetJets Private Aviation',
      type: 'Transporte',
      contact_name: 'Arthur Sterling',
      email: 'concierge@netjets.com',
      phone: '+1 877 359-5387',
      notes: 'Fretamento de jatos executivos de longo alcance para rotas continentais.',
      created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: 'v-406',
      name: 'April International Luxury Shield',
      type: 'Seguro',
      contact_name: 'Bruno Teixeira',
      email: 'vip.seguros@april.com.br',
      phone: '+55 11 3040-3040',
      notes: 'Apólice de seguro-viagem com cobertura médica de até 1 milhão de dólares e resgate aéreo.',
      created_at: new Date(Date.now() - 50 * 86400000).toISOString(),
    },
  ]

  // Clients
  getClients(): Client[] {
    return [...this.clients].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  createClient(data: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Client {
    const newClient: Client = {
      id: uuidv4(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.clients.unshift(newClient)
    return newClient
  }

  updateClient(id: string, data: Partial<Client>): Client | null {
    const index = this.clients.findIndex((c) => c.id === id)
    if (index === -1) return null
    this.clients[index] = { ...this.clients[index], ...data, updated_at: new Date().toISOString() }
    return this.clients[index]
  }

  deleteClient(id: string): boolean {
    const prevLen = this.clients.length
    this.clients = this.clients.filter((c) => c.id !== id)
    return this.clients.length < prevLen
  }

  // Leads
  getLeads(): Lead[] {
    return [...this.leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  createLead(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead {
    const newLead: Lead = {
      id: uuidv4(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.leads.unshift(newLead)
    return newLead
  }

  updateLead(id: string, data: Partial<Lead>): Lead | null {
    const index = this.leads.findIndex((l) => l.id === id)
    if (index === -1) return null
    this.leads[index] = { ...this.leads[index], ...data, updated_at: new Date().toISOString() }
    return this.leads[index]
  }

  deleteLead(id: string): boolean {
    const prevLen = this.leads.length
    this.leads = this.leads.filter((l) => l.id !== id)
    return this.leads.length < prevLen
  }

  // Trips
  getTrips(): Trip[] {
    return [...this.trips].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  createTrip(data: Omit<Trip, 'id' | 'created_at' | 'updated_at'>): Trip {
    const newTrip: Trip = {
      id: uuidv4(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.trips.unshift(newTrip)
    return newTrip
  }

  updateTrip(id: string, data: Partial<Trip>): Trip | null {
    const index = this.trips.findIndex((t) => t.id === id)
    if (index === -1) return null
    this.trips[index] = { ...this.trips[index], ...data, updated_at: new Date().toISOString() }
    return this.trips[index]
  }

  deleteTrip(id: string): boolean {
    const prevLen = this.trips.length
    this.trips = this.trips.filter((t) => t.id !== id)
    return this.trips.length < prevLen
  }

  // Vendors
  getVendors(): Vendor[] {
    return [...this.vendors].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  createVendor(data: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>): Vendor {
    const newVendor: Vendor = {
      id: uuidv4(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.vendors.unshift(newVendor)
    return newVendor
  }

  updateVendor(id: string, data: Partial<Vendor>): Vendor | null {
    const index = this.vendors.findIndex((v) => v.id === id)
    if (index === -1) return null
    this.vendors[index] = { ...this.vendors[index], ...data, updated_at: new Date().toISOString() }
    return this.vendors[index]
  }

  deleteVendor(id: string): boolean {
    const prevLen = this.vendors.length
    this.vendors = this.vendors.filter((v) => v.id !== id)
    return this.vendors.length < prevLen
  }
}

// Global singleton instance
const globalForStore = globalThis as unknown as { mockStore: MockDataStore }
export const mockStore = globalForStore.mockStore || new MockDataStore()
if (process.env.NODE_ENV !== 'production') globalForStore.mockStore = mockStore
