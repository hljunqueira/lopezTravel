'use server'

import { revalidatePath } from 'next/cache'
import { Client } from '@/types/database'
import { mockStore } from '@/lib/data/mock-store'

export async function getClients(): Promise<Client[]> {
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
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
      if (!error && data) return data as Client[]
    } catch (e) {
      console.warn('Supabase getClients fallback to mock:', e)
    }
  }

  return mockStore.getClients()
}

export async function createClient(formData: {
  name: string
  email?: string
  phone?: string
  travel_preferences?: string
  passport_expiry?: string | null
  notes?: string
}): Promise<{ success: boolean; data?: Client; error?: string }> {
  if (!formData.name) {
    return { success: false, error: 'O nome do cliente é obrigatório.' }
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
      const { data, error } = await supabase.from('clients').insert([{
        name: formData.name,
        email: formData.email || '',
        phone: formData.phone || '',
        travel_preferences: formData.travel_preferences || '',
        passport_expiry: formData.passport_expiry || null,
        notes: formData.notes || '',
      }]).select().single()

      if (!error && data) {
        revalidatePath('/admin')
        return { success: true, data: data as Client }
      }
    } catch (e) {
      console.warn('Supabase createClient fallback to mock:', e)
    }
  }

  const client = mockStore.createClient({
    name: formData.name,
    email: formData.email || '',
    phone: formData.phone || '',
    travel_preferences: formData.travel_preferences || '',
    passport_expiry: formData.passport_expiry || null,
    notes: formData.notes || '',
  })

  revalidatePath('/admin')
  return { success: true, data: client }
}

export async function updateClient(
  id: string,
  data: Partial<Client>
): Promise<{ success: boolean; data?: Client; error?: string }> {
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
      const { data: updated, error } = await supabase.from('clients').update(data).eq('id', id).select().single()
      if (!error && updated) {
        revalidatePath('/admin')
        return { success: true, data: updated as Client }
      }
    } catch (e) {
      console.warn('Supabase updateClient fallback to mock:', e)
    }
  }

  const res = mockStore.updateClient(id, data)
  if (!res) return { success: false, error: 'Cliente não encontrado.' }
  revalidatePath('/admin')
  return { success: true, data: res }
}

export async function deleteClient(id: string): Promise<{ success: boolean; error?: string }> {
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
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (!error) {
        revalidatePath('/admin')
        return { success: true }
      }
    } catch (e) {
      console.warn('Supabase deleteClient fallback to mock:', e)
    }
  }

  const ok = mockStore.deleteClient(id)
  revalidatePath('/admin')
  return { success: ok }
}
