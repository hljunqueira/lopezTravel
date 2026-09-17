'use server'

import { revalidatePath } from 'next/cache'
import { Vendor, VendorType } from '@/types/database'
import { mockStore } from '@/lib/data/mock-store'

export async function getVendors(): Promise<Vendor[]> {
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
      const { data, error } = await supabase.from('vendors').select('*').order('name', { ascending: true })
      if (!error && data) return data as Vendor[]
    } catch (e) {
      console.warn('Supabase getVendors fallback to mock:', e)
    }
  }

  return mockStore.getVendors()
}

export async function createVendor(formData: {
  name: string
  type?: VendorType
  contact_name?: string
  email?: string
  phone?: string
  notes?: string
}): Promise<{ success: boolean; data?: Vendor; error?: string }> {
  if (!formData.name) {
    return { success: false, error: 'O nome do fornecedor é obrigatório.' }
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
      const { data, error } = await supabase.from('vendors').insert([{
        name: formData.name,
        type: formData.type || 'Hotel',
        contact_name: formData.contact_name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        notes: formData.notes || '',
      }]).select().single()

      if (!error && data) {
        revalidatePath('/admin')
        return { success: true, data: data as Vendor }
      }
    } catch (e) {
      console.warn('Supabase createVendor fallback to mock:', e)
    }
  }

  const vendor = mockStore.createVendor({
    name: formData.name,
    type: formData.type || 'Hotel',
    contact_name: formData.contact_name || '',
    email: formData.email || '',
    phone: formData.phone || '',
    notes: formData.notes || '',
  })

  revalidatePath('/admin')
  return { success: true, data: vendor }
}

export async function updateVendor(
  id: string,
  data: Partial<Vendor>
): Promise<{ success: boolean; data?: Vendor; error?: string }> {
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
      const { data: updated, error } = await supabase.from('vendors').update(data).eq('id', id).select().single()
      if (!error && updated) {
        revalidatePath('/admin')
        return { success: true, data: updated as Vendor }
      }
    } catch (e) {
      console.warn('Supabase updateVendor fallback to mock:', e)
    }
  }

  const res = mockStore.updateVendor(id, data)
  if (!res) return { success: false, error: 'Fornecedor não encontrado.' }
  revalidatePath('/admin')
  return { success: true, data: res }
}

export async function deleteVendor(id: string): Promise<{ success: boolean; error?: string }> {
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
      const { error } = await supabase.from('vendors').delete().eq('id', id)
      if (!error) {
        revalidatePath('/admin')
        return { success: true }
      }
    } catch (e) {
      console.warn('Supabase deleteVendor fallback to mock:', e)
    }
  }

  const ok = mockStore.deleteVendor(id)
  revalidatePath('/admin')
  return { success: ok }
}
