'use server'

import { FlightAvailability, FlightSearchParams } from '@/types/flights'
import { CURATED_FLIGHT_ROUTES, DESTINATION_IATA_MAP } from '@/lib/data/flights'

export type { FlightAvailability, FlightSearchParams }

/**
 * Searches flight availability with zero monetary prices/values.
 * Connects to Amadeus API if credentials exist, with a high-fidelity luxury route database fallback.
 */
export async function searchFlightAvailability(params: FlightSearchParams): Promise<{
  success: boolean
  data: FlightAvailability[]
  source: 'amadeus_live_api' | 'curated_schedule_database'
  searchedDestination: string
}> {
  try {
    const destKey = (params.destination || 'paris').toLowerCase().trim()

    // 1. Check if Amadeus API credentials are present in environment
    const amadeusKey = process.env.AMADEUS_CLIENT_ID
    const amadeusSecret = process.env.AMADEUS_CLIENT_SECRET

    if (amadeusKey && amadeusSecret) {
      try {
        // Authenticate with Amadeus OAuth2 Token endpoint
        const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=client_credentials&client_id=${amadeusKey}&client_secret=${amadeusSecret}`,
          cache: 'no-store',
        })

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json()
          const accessToken = tokenData.access_token

          const targetIata = DESTINATION_IATA_MAP[destKey] || 'CDG'
          const originIata = params.origin.includes('GRU') ? 'GRU' : params.origin.includes('GIG') ? 'GIG' : 'GRU'

          const searchUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originIata}&destinationLocationCode=${targetIata}&departureDate=${params.date || '2026-11-20'}&adults=1&travelClass=BUSINESS&max=5`

          const flightRes = await fetch(searchUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: 'no-store',
          })

          if (flightRes.ok) {
            const flightData = await flightRes.json()
            if (flightData?.data && Array.isArray(flightData.data) && flightData.data.length > 0) {
              // Convert Amadeus response without ANY price fields
              const parsedFlights: FlightAvailability[] = flightData.data.slice(0, 4).map((offer: any, idx: number) => {
                const seg = offer.itineraries?.[0]?.segments?.[0]
                const lastSeg = offer.itineraries?.[0]?.segments?.[offer.itineraries?.[0]?.segments?.length - 1]
                const carrier = seg?.carrierCode || 'EK'
                const flNumber = `${carrier} ${seg?.number || '101'}`
                const depTime = seg?.departure?.at ? seg.departure.at.substring(11, 16) : '18:30'
                const arrTime = lastSeg?.arrival?.at ? lastSeg.arrival.at.substring(11, 16) : '10:45'
                const seats = offer.numberOfBookableSeats || 4

                return {
                  id: `amadeus-${offer.id || idx}`,
                  airline: carrier === 'AF' ? 'Air France' : carrier === 'EK' ? 'Emirates' : carrier === 'QR' ? 'Qatar Airways' : carrier === 'LA' ? 'LATAM' : `Linha Aérea ${carrier}`,
                  flightNumber: flNumber,
                  aircraft: seg?.aircraft?.code ? `Aeronave ${seg.aircraft.code}` : 'Boeing / Airbus Widebody',
                  originCode: seg?.departure?.iataCode || originIata,
                  originCity: params.origin,
                  destinationCode: lastSeg?.arrival?.iataCode || targetIata,
                  destinationCity: params.destination,
                  departureTime: depTime,
                  arrivalTime: arrTime,
                  duration: offer.itineraries?.[0]?.duration?.replace('PT', '')?.toLowerCase() || '12h',
                  stops: offer.itineraries?.[0]?.segments?.length > 1 ? `${offer.itineraries[0].segments.length - 1} Escala VIP` : 'Voo Direto',
                  cabinClass: params.cabinClass || 'Classe Executiva',
                  availabilityStatus: `${seats} Assentos Disponíveis na Cabine`,
                  seatsAvailable: seats,
                  conciergeBookingUrl: `https://wa.me/message/X25KJIEIT4L3F1?text=Ol%C3%A1%2C%20desejo%20reservar%20o%20voo%20${encodeURIComponent(flNumber)}%20com%20o%20Concierge%20Lopez%20Travel.`,
                }
              })

              return {
                success: true,
                data: parsedFlights,
                source: 'amadeus_live_api',
                searchedDestination: params.destination,
              }
            }
          }
        }
      } catch {
        // Fallback gracefully on network/auth issue
      }
    }

    // 2. High-Fidelity Resilient Fallback
    const baseRoutes = CURATED_FLIGHT_ROUTES[destKey] || CURATED_FLIGHT_ROUTES['paris']
    const formatted: FlightAvailability[] = baseRoutes.map((route, i) => ({
      ...route,
      id: `curated-${destKey}-${i}`,
      originCode: params.origin.match(/\(([^)]+)\)/)?.[1] || 'GRU',
      destinationCode: DESTINATION_IATA_MAP[destKey] || 'CDG',
      originCity: params.origin,
      destinationCity: route.destinationCity,
      cabinClass: params.cabinClass || route.cabinClass,
    }))

    return {
      success: true,
      data: formatted,
      source: 'curated_schedule_database',
      searchedDestination: params.destination,
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      source: 'curated_schedule_database',
      searchedDestination: params.destination,
    }
  }
}
