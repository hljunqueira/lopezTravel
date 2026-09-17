'use server'

import { revalidatePath } from 'next/cache'
import { Lead, LeadStatus } from '@/types/database'
import { mockStore } from '@/lib/data/mock-store'

export async function getLeads(): Promise<Lead[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const { createServerClient } = await import('@supabase/ssr')
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        },
      })
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      if (!error && data) return data as Lead[]
    } catch (e) {
      console.warn('Supabase getLeads fallback to mock:', e)
    }
  }

  return mockStore.getLeads()
}

export async function createLead(formData: {
  name: string
  email: string
  phone?: string
  destination?: string
  budget?: string
  message?: string
  source?: string
}): Promise<{ success: boolean; data?: Lead; error?: string }> {
  if (!formData.name || !formData.email) {
    return { success: false, error: 'Nome e e-mail são obrigatórios.' }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const { createServerClient } = await import('@supabase/ssr')
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        },
      })
      const { data, error } = await supabase.from('leads').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        destination: formData.destination || '',
        budget: formData.budget || '',
        message: formData.message || '',
        status: 'new',
        source: formData.source || 'website',
      }]).select().single()

      if (!error && data) {
        revalidatePath('/admin')
        return { success: true, data: data as Lead }
      }
    } catch (e) {
      console.warn('Supabase createLead fallback to mock:', e)
    }
  }

  const newLead = mockStore.createLead({
    name: formData.name,
    email: formData.email,
    phone: formData.phone || '',
    destination: formData.destination || '',
    budget: formData.budget || '',
    message: formData.message || '',
    status: 'new',
    source: formData.source || 'website',
  })

  revalidatePath('/admin')
  return { success: true, data: newLead }
}

export async function updateLead(
  id: string,
  data: Partial<Lead>
): Promise<{ success: boolean; data?: Lead; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const { createServerClient } = await import('@supabase/ssr')
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        },
      })
      const { data: updated, error } = await supabase.from('leads').update(data).eq('id', id).select().single()
      if (!error && updated) {
        revalidatePath('/admin')
        return { success: true, data: updated as Lead }
      }
    } catch (e) {
      console.warn('Supabase updateLead fallback to mock:', e)
    }
  }

  const res = mockStore.updateLead(id, data)
  if (!res) return { success: false, error: 'Lead não encontrado.' }
  revalidatePath('/admin')
  return { success: true, data: res }
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<{ success: boolean; error?: string }> {
  return updateLead(id, { status })
}

export async function deleteLead(id: string): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const { createServerClient } = await import('@supabase/ssr')
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        },
      })
      const { error } = await supabase.from('leads').delete().eq('id', id)
      if (!error) {
        revalidatePath('/admin')
        return { success: true }
      }
    } catch (e) {
      console.warn('Supabase deleteLead fallback to mock:', e)
    }
  }

  const ok = mockStore.deleteLead(id)
  revalidatePath('/admin')
  return { success: ok }
}
