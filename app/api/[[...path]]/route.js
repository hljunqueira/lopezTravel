import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// MongoDB connection (singleton) + one-time idempotent seed
// ---------------------------------------------------------------------------
let client
let db
let seeded = false

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  if (!seeded) {
    seeded = true
    try {
      await ensureSeed(db)
    } catch (e) {
      console.error('Seed error:', e)
    }
  }
  return db
}

const RESOURCES = ['leads', 'clients', 'trips', 'vendors']

function clean(doc) {
  if (!doc) return doc
  const { _id, ...rest } = doc
  return rest
}

function buildDefaults(resource, body) {
  if (resource === 'leads') {
    return { status: body.status || 'new' }
  }
  if (resource === 'trips') {
    return {
      reservation_status: body.reservation_status || 'pending',
      itinerary: Array.isArray(body.itinerary) ? body.itinerary : [],
    }
  }
  return {}
}

// ---------------------------------------------------------------------------
// CORS helpers
// ---------------------------------------------------------------------------
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

function json(data, status = 200) {
  return handleCORS(NextResponse.json(data, { status }))
}

// ---------------------------------------------------------------------------
// Main route handler
// ---------------------------------------------------------------------------
async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Health / root
    if ((route === '/' || route === '/root') && method === 'GET') {
      return json({ message: 'Lopez Travel API', status: 'ok' })
    }

    // ----- Auth: simple built-in login -----
    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const email = (body.email || '').toLowerCase().trim()
      const user = await db.collection('users').findOne({ email })
      if (!user || user.password !== body.password) {
        return json({ error: 'E-mail ou senha inválidos.' }, 401)
      }
      return json({
        token: uuidv4(),
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      })
    }

    // ----- Dashboard stats -----
    if (route === '/stats' && method === 'GET') {
      const leads = await db.collection('leads').find({}).toArray()
      const trips = await db.collection('trips').find({}).toArray()
      const clientsCount = await db.collection('clients').countDocuments()
      const vendorsCount = await db.collection('vendors').countDocuments()

      const statusCounts = { new: 0, contacted: 0, proposal: 0, confirmed: 0 }
      leads.forEach((l) => {
        if (statusCounts[l.status] !== undefined) statusCounts[l.status] += 1
      })

      const revenue = trips
        .filter((t) => t.reservation_status === 'confirmed' || t.reservation_status === 'completed')
        .reduce((s, t) => s + (Number(t.total_value) || 0), 0)
      const pipeline = trips.reduce((s, t) => s + (Number(t.total_value) || 0), 0)

      const recentLeads = [...leads]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6)
        .map(clean)

      const upcomingTrips = [...trips]
        .filter((t) => t.departure_date)
        .sort((a, b) => new Date(a.departure_date) - new Date(b.departure_date))
        .slice(0, 5)
        .map(clean)

      return json({
        totals: {
          leads: leads.length,
          clients: clientsCount,
          trips: trips.length,
          vendors: vendorsCount,
          revenue,
          pipeline,
        },
        leadsByStatus: statusCounts,
        recentLeads,
        upcomingTrips,
      })
    }

    // ----- Generic CRUD for resources -----
    const resource = path[0]
    const id = path[1]
    if (RESOURCES.includes(resource)) {
      const coll = db.collection(resource)

      if (method === 'GET' && !id) {
        const docs = await coll.find({}).sort({ created_at: -1 }).limit(2000).toArray()
        return json(docs.map(clean))
      }

      if (method === 'GET' && id) {
        const doc = await coll.findOne({ id })
        if (!doc) return json({ error: 'Registro não encontrado' }, 404)
        return json(clean(doc))
      }

      if (method === 'POST' && !id) {
        const body = await request.json()
        const { id: _ignoreId, _id, created_at, ...rest } = body
        const doc = {
          id: uuidv4(),
          ...rest,
          ...buildDefaults(resource, body),
          created_at: new Date(),
          updated_at: new Date(),
        }
        await coll.insertOne(doc)
        return json(clean(doc), 201)
      }

      if (method === 'PUT' && id) {
        const body = await request.json()
        const { id: _ignoreId, _id, created_at, ...rest } = body
        await coll.updateOne({ id }, { $set: { ...rest, updated_at: new Date() } })
        const updated = await coll.findOne({ id })
        if (!updated) return json({ error: 'Registro não encontrado' }, 404)
        return json(clean(updated))
      }

      if (method === 'DELETE' && id) {
        await coll.deleteOne({ id })
        return json({ success: true })
      }
    }

    return json({ error: `Rota ${route} não encontrada` }, 404)
  } catch (error) {
    console.error('API Error:', error)
    return json({ error: 'Erro interno do servidor' }, 500)
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute

// ---------------------------------------------------------------------------
// Seed: admin user + demo data (idempotent)
// ---------------------------------------------------------------------------
async function ensureSeed(db) {
  // Admin user
  const users = db.collection('users')
  const admin = await users.findOne({ email: 'admin@lopeztravel.com' })
  if (!admin) {
    await users.insertOne({
      id: uuidv4(),
      email: 'admin@lopeztravel.com',
      password: 'lopez2025',
      name: 'Ana Lopez',
      role: 'admin',
      created_at: new Date(),
    })
  }

  const now = Date.now()
  const daysAgo = (d) => new Date(now - d * 86400000)
  const daysAhead = (d) => new Date(now + d * 86400000).toISOString().slice(0, 10)

  // Clients
  const clientsCol = db.collection('clients')
  let clientDocs = []
  if ((await clientsCol.countDocuments()) === 0) {
    clientDocs = [
      { name: 'Ricardo Almeida', email: 'ricardo.almeida@email.com', phone: '+55 11 99999-1010', travel_preferences: 'Resorts 5 estrelas, praias exclusivas, viagens em família', passport_expiry: '2029-05-12', notes: 'Cliente VIP desde 2020. Prefere voos executivos.' },
      { name: 'Marina Costa', email: 'marina.costa@email.com', phone: '+55 21 98888-2020', travel_preferences: 'Cultura, gastronomia, Europa clássica', passport_expiry: '2028-11-03', notes: 'Comemoração de aniversário de casamento.' },
      { name: 'Felipe Souza', email: 'felipe.souza@email.com', phone: '+55 31 97777-3030', travel_preferences: 'Aventura, safáris, natureza', passport_expiry: '2027-02-18', notes: '' },
      { name: 'Beatriz Lima', email: 'beatriz.lima@email.com', phone: '+55 41 96666-4040', travel_preferences: 'Wellness, retiros, Ásia', passport_expiry: '2030-08-25', notes: 'Interesse em Maldivas e Bali.' },
      { name: 'Carlos Mendes', email: 'carlos.mendes@email.com', phone: '+55 51 95555-5050', travel_preferences: 'Cidades, negócios, luxo urbano', passport_expiry: '2026-12-01', notes: 'Viagens frequentes de negócios.' },
    ].map((c) => ({ id: uuidv4(), ...c, created_at: daysAgo(Math.floor(Math.random() * 90) + 5), updated_at: new Date() }))
    await clientsCol.insertMany(clientDocs)
  } else {
    clientDocs = await clientsCol.find({}).limit(5).toArray()
  }

  // Leads
  const leadsCol = db.collection('leads')
  if ((await leadsCol.countDocuments()) === 0) {
    const leads = [
      { name: 'Juliana Ferreira', email: 'juliana.f@email.com', phone: '+55 11 91234-5678', destination: 'Maldivas', budget: 'R$ 50k - R$ 80k', message: 'Lua de mel em novembro, 10 dias.', source: 'website', status: 'new', createdOffset: 1 },
      { name: 'Roberto Nunes', email: 'roberto.n@email.com', phone: '+55 21 92345-6789', destination: 'Japão', budget: 'R$ 80k+', message: 'Viagem em família para o Japão na primavera.', source: 'indicação', status: 'new', createdOffset: 2 },
      { name: 'Camila Rocha', email: 'camila.r@email.com', phone: '+55 31 93456-7890', destination: 'Santorini', budget: 'R$ 30k - R$ 50k', message: 'Aniversário de 30 anos com amigas.', source: 'instagram', status: 'contacted', createdOffset: 5 },
      { name: 'Anderson Dias', email: 'anderson.d@email.com', phone: '+55 41 94567-8901', destination: 'Dubai', budget: 'R$ 50k - R$ 80k', message: 'Réveillon em Dubai.', source: 'website', status: 'contacted', createdOffset: 6 },
      { name: 'Patrícia Gomes', email: 'patricia.g@email.com', phone: '+55 51 95678-9012', destination: 'Paris', budget: 'R$ 30k - R$ 50k', message: 'Semana de compras e cultura em Paris.', source: 'website', status: 'proposal', createdOffset: 9 },
      { name: 'Eduardo Barros', email: 'eduardo.b@email.com', phone: '+55 11 96789-0123', destination: 'Toscana', budget: 'R$ 80k+', message: 'Tour de vinícolas na Itália.', source: 'indicação', status: 'proposal', createdOffset: 11 },
      { name: 'Fernanda Alves', email: 'fernanda.a@email.com', phone: '+55 21 97890-1234', destination: 'Maldivas', budget: 'R$ 80k+', message: 'Pacote fechado, aguardando pagamento.', source: 'website', status: 'confirmed', createdOffset: 15 },
      { name: 'Marcelo Pinto', email: 'marcelo.p@email.com', phone: '+55 31 98901-2345', destination: 'Suíça', budget: 'R$ 50k - R$ 80k', message: 'Alpes suíços no inverno.', source: 'instagram', status: 'confirmed', createdOffset: 20 },
    ].map(({ createdOffset, ...l }) => ({ id: uuidv4(), ...l, created_at: daysAgo(createdOffset), updated_at: new Date() }))
    await leadsCol.insertMany(leads)
  }

  // Vendors
  const vendorsCol = db.collection('vendors')
  if ((await vendorsCol.countDocuments()) === 0) {
    const vendors = [
      { name: 'Four Seasons Hotels & Resorts', type: 'Hotel', contact_name: 'Sofia Marchetti', email: 'partners@fourseasons.com', phone: '+1 416 449-1750', notes: 'Tarifas preferenciais para agências premium.' },
      { name: 'Aman Resorts', type: 'Hotel', contact_name: 'Kenji Watanabe', email: 'travel@aman.com', phone: '+41 22 555-1000', notes: 'Upgrades e amenities para clientes VIP.' },
      { name: 'Abercrombie & Kent', type: 'DMC', contact_name: 'James Holloway', email: 'trade@abercrombiekent.com', phone: '+44 20 7590-0610', notes: 'DMC global, safáris e experiências privadas.' },
      { name: 'Emirates Airlines', type: 'Companhia Aérea', contact_name: 'Layla Hassan', email: 'agencies@emirates.com', phone: '+971 4 214-4444', notes: 'First & Business Class corporativa.' },
      { name: 'Ker & Downey', type: 'Experiências', contact_name: 'Grace Miller', email: 'reservations@kerdowney.com', phone: '+1 800 423-4236', notes: 'Roteiros sob medida e guias privativos.' },
      { name: 'April Seguros Viagem', type: 'Seguro', contact_name: 'Bruno Teixeira', email: 'corporativo@april.com.br', phone: '+55 11 3040-3040', notes: 'Cobertura premium internacional.' },
    ].map((v) => ({ id: uuidv4(), ...v, created_at: daysAgo(Math.floor(Math.random() * 120) + 10), updated_at: new Date() }))
    await vendorsCol.insertMany(vendors)
  }

  // Trips (reference seeded clients when available)
  const tripsCol = db.collection('trips')
  if ((await tripsCol.countDocuments()) === 0 && clientDocs.length) {
    const c = clientDocs
    const trips = [
      {
        client_id: c[0].id, client_name: c[0].name, destination: 'Maldivas — Soneva Jani',
        departure_date: daysAhead(25), return_date: daysAhead(35), reservation_status: 'confirmed', total_value: 92000,
        itinerary: [
          { day: 1, title: 'Chegada em Malé', description: 'Recepção VIP e traslado de hidroavião ao resort.' },
          { day: 2, title: 'Overwater Villa', description: 'Check-in em vila sobre a água com escorregador privativo.' },
          { day: 4, title: 'Snorkel & Jantar sob as estrelas', description: 'Experiência gastronômica privativa na praia.' },
        ],
      },
      {
        client_id: c[1].id, client_name: c[1].name, destination: 'Paris & Toscana',
        departure_date: daysAhead(48), return_date: daysAhead(60), reservation_status: 'pending', total_value: 68000,
        itinerary: [
          { day: 1, title: 'Paris — Le Bristol', description: 'Suíte com vista para a Torre Eiffel.' },
          { day: 3, title: 'Tour privativo pelo Louvre', description: 'Acesso antecipado com curador de arte.' },
        ],
      },
      {
        client_id: c[3].id, client_name: c[3].name, destination: 'Bali — Wellness Retreat',
        departure_date: daysAhead(80), return_date: daysAhead(92), reservation_status: 'pending', total_value: 54000,
        itinerary: [
          { day: 1, title: 'Ubud — COMO Shambhala', description: 'Retiro de bem-estar e ioga.' },
        ],
      },
      {
        client_id: c[4].id, client_name: c[4].name, destination: 'Dubai — Réveillon',
        departure_date: daysAhead(-15), return_date: daysAhead(-8), reservation_status: 'completed', total_value: 47000,
        itinerary: [
          { day: 1, title: 'Burj Al Arab', description: 'Suíte panorâmica e transfer Rolls-Royce.' },
        ],
      },
    ].map((t) => ({ id: uuidv4(), ...t, created_at: daysAgo(Math.floor(Math.random() * 30) + 1), updated_at: new Date() }))
    await tripsCol.insertMany(trips)
  }
}
