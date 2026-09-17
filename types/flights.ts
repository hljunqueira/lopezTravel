export interface FlightAvailability {
  id: string
  airline: string
  flightNumber: string
  aircraft: string
  originCode: string
  originCity: string
  destinationCode: string
  destinationCity: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: string
  cabinClass: string
  availabilityStatus: string
  seatsAvailable: number
  conciergeBookingUrl: string
}

export interface FlightSearchParams {
  origin: string
  destination: string
  date: string
  cabinClass: string
}
