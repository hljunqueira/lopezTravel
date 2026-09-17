'use server'

import { revalidatePath } from 'next/cache'
import { Trip, TripStatus, ItineraryDay } from '@/types/database'
import { mockStore } from '@/lib/data/mock-store'

export async function getTrips(): Promise<Trip[]> {
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
      const { data, error } = await supabase.from('trips').select('*').order('departure_date', { ascending: true })
      if (!error && data) return data as Trip[]
    } catch (e) {
      console.warn('Supabase getTrips fallback to mock:', e)
    }
  }

  return mockStore.getTrips()
}

export async function createTrip(formData: {
  client_id?: string
  client_name?: string
  destination: string
  departure_date?: string
  return_date?: string
  reservation_status?: TripStatus
  total_value?: number
  itinerary?: ItineraryDay[]
}): Promise<{ success: boolean; data?: Trip; error?: string }> {
  if (!formData.destination) {
    return { success: false, error: 'O destino da viagem é obrigatório.' }
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
      const { data, error } = await supabase.from('trips').insert([{
        client_id: formData.client_id || null,
        client_name: formData.client_name || '',
        destination: formData.destination,
        departure_date: formData.departure_date || null,
        return_date: formData.return_date || null,
        reservation_status: formData.reservation_status || 'pending',
        total_value: Number(formData.total_value) || 0,
        itinerary: formData.itinerary || [],
      }]).select().single()

      if (!error && data) {
        revalidatePath('/admin')
        return { success: true, data: data as Trip }
      }
    } catch (e) {
      console.warn('Supabase createTrip fallback to mock:', e)
    }
  }

  const trip = mockStore.createTrip({
    client_id: formData.client_id || '',
    client_name: formData.client_name || '',
    destination: formData.destination,
    departure_date: formData.departure_date || '',
    return_date: formData.return_date || '',
    reservation_status: formData.reservation_status || 'pending',
    total_value: Number(formData.total_value) || 0,
    itinerary: formData.itinerary || [],
  })

  revalidatePath('/admin')
  return { success: true, data: trip }
}

export async function updateTrip(
  id: string,
  data: Partial<Trip>
): Promise<{ success: boolean; data?: Trip; error?: string }> {
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
      const { data: updated, error } = await supabase.from('trips').update(data).eq('id', id).select().single()
      if (!error && updated) {
        revalidatePath('/admin')
        return { success: true, data: updated as Trip }
      }
    } catch (e) {
      console.warn('Supabase updateTrip fallback to mock:', e)
    }
  }

  const res = mockStore.updateTrip(id, data)
  if (!res) return { success: false, error: 'Viagem não encontrada.' }
  revalidatePath('/admin')
  return { success: true, data: res }
}

export async function deleteTrip(id: string): Promise<{ success: boolean; error?: string }> {
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
      const { error } = await supabase.from('trips').delete().eq('id', id)
      if (!error) {
        revalidatePath('/admin')
        return { success: true }
      }
    } catch (e) {
      console.warn('Supabase deleteTrip fallback to mock:', e)
    }
  }

  const ok = mockStore.deleteTrip(id)
  revalidatePath('/admin')
  return { success: ok }
}
