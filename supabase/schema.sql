-- ============================================================================
-- LOPEZ TRAVEL — Schema Relacional do Supabase (PostgreSQL)
-- ============================================================================

-- Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE CLIENTES (CRM)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    travel_preferences TEXT DEFAULT '',
    passport_expiry DATE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE LEADS (KANBAN)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    destination TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    message TEXT DEFAULT '',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'proposal', 'confirmed')),
    source TEXT DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE VIAGENS E ROTEIROS (ITINERARY BUILDER)
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name TEXT DEFAULT '',
    destination TEXT NOT NULL,
    departure_date DATE,
    return_date DATE,
    reservation_status TEXT DEFAULT 'pending' CHECK (reservation_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    total_value NUMERIC(12, 2) DEFAULT 0,
    itinerary JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE FORNECEDORES (PARCEIROS GLOBAIS)
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT DEFAULT 'Hotel' CHECK (type IN ('Hotel', 'DMC', 'Companhia Aérea', 'Transporte', 'Experiências', 'Seguro')),
    contact_name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_trips_client_id ON public.trips(client_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(reservation_status);
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients(name);

-- Triggers para atualização automática de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_clients_updated_at ON public.clients;
CREATE TRIGGER tr_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_leads_updated_at ON public.leads;
CREATE TRIGGER tr_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_trips_updated_at ON public.trips;
CREATE TRIGGER tr_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_vendors_updated_at ON public.vendors;
CREATE TRIGGER tr_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (Permissivas para leitura/escrita autenticada e inserção pública de leads)
CREATE POLICY "Permitir inserção pública de leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir acesso completo a clientes" ON public.clients FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo a leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo a viagens" ON public.trips FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo a fornecedores" ON public.vendors FOR ALL USING (true);
