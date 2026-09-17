import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { mockStore } from '@/lib/data/mock-store'
import { Lead, Client, Trip, Vendor } from '@/types/database'

function handleCORS(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

function json(data: any, status = 200) {
  return handleCORS(NextResponse.json(data, { status }))
}

export const dynamic = 'force-dynamic'

async function getJsonBody(request: Request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

async function handleRoute(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    // Health check
    if ((route === '/' || route === '/root') && method === 'GET') {
      return json({ message: 'Lopez Travel API (TypeScript & Supabase)', status: 'ok' })
    }

    // Auth
    if (route === '/auth/login' && method === 'POST') {
      const body = await getJsonBody(request)
      const email = (body.email || '').toLowerCase().trim()
      if (email === 'admin@lopeztravel.com' && body.password === 'lopez2025') {
        return json({
          token: uuidv4(),
          user: {
            id: 'u-admin-1',
            email: 'admin@lopeztravel.com',
            name: 'Ana Lopez',
            role: 'admin',
          },
        })
      }
      return json({ error: 'E-mail ou senha inválidos.' }, 401)
    }

    // Stats
    if (route === '/stats' && method === 'GET') {
      const leads = mockStore.getLeads()
      const clients = mockStore.getClients()
      const trips = mockStore.getTrips()
      const vendors = mockStore.getVendors()

      const statusCounts = { new: 0, contacted: 0, proposal: 0, confirmed: 0 }
      leads.forEach((l) => {
        if (statusCounts[l.status] !== undefined) statusCounts[l.status] += 1
      })

      const revenue = trips
        .filter((t) => t.reservation_status === 'confirmed' || t.reservation_status === 'completed')
        .reduce((s, t) => s + (Number(t.total_value) || 0), 0)

      return json({
        totals: {
          leads: leads.length,
          clients: clients.length,
          trips: trips.length,
          vendors: vendors.length,
          revenue,
          pipeline: trips.reduce((s, t) => s + (Number(t.total_value) || 0), 0),
        },
        leadsByStatus: statusCounts,
        recentLeads: leads.slice(0, 6),
        upcomingTrips: trips.slice(0, 5),
      })
    }

    // Resources: leads, clients, trips, vendors
    const resource = path[0]
    const id = path[1]

    if (resource === 'leads') {
      if (method === 'GET' && !id) return json(mockStore.getLeads())
      if (method === 'POST' && !id) {
        const body = await getJsonBody(request)
        const created = mockStore.createLead(body)
        return json(created, 201)
      }
      if (method === 'PUT' && id) {
        const body = await getJsonBody(request)
        const updated = mockStore.updateLead(id, body)
        return json(updated)
      }
      if (method === 'DELETE' && id) {
        mockStore.deleteLead(id)
        return json({ success: true })
      }
    }

    if (resource === 'clients') {
      if (method === 'GET' && !id) return json(mockStore.getClients())
      if (method === 'POST' && !id) {
        const body = await getJsonBody(request)
        const created = mockStore.createClient(body)
        return json(created, 201)
      }
      if (method === 'PUT' && id) {
        const body = await getJsonBody(request)
        const updated = mockStore.updateClient(id, body)
        return json(updated)
      }
      if (method === 'DELETE' && id) {
        mockStore.deleteClient(id)
        return json({ success: true })
      }
    }

    if (resource === 'trips') {
      if (method === 'GET' && !id) return json(mockStore.getTrips())
      if (method === 'POST' && !id) {
        const body = await getJsonBody(request)
        const created = mockStore.createTrip(body)
        return json(created, 201)
      }
      if (method === 'PUT' && id) {
        const body = await getJsonBody(request)
        const updated = mockStore.updateTrip(id, body)
        return json(updated)
      }
      if (method === 'DELETE' && id) {
        mockStore.deleteTrip(id)
        return json({ success: true })
      }
    }

    if (resource === 'vendors') {
      if (method === 'GET' && !id) return json(mockStore.getVendors())
      if (method === 'POST' && !id) {
        const body = await getJsonBody(request)
        const created = mockStore.createVendor(body)
        return json(created, 201)
      }
      if (method === 'PUT' && id) {
        const body = await getJsonBody(request)
        const updated = mockStore.updateVendor(id, body)
        return json(updated)
      }
      if (method === 'DELETE' && id) {
        mockStore.deleteVendor(id)
        return json({ success: true })
      }
    }

    return json({ error: `Rota ${route} não encontrada.` }, 404)
  } catch (error) {
    console.error('API Error:', error)
    return json({ error: 'Erro interno do servidor.' }, 500)
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
