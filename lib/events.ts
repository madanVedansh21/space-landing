export type EventItem = {
  id: string
  year: number
  type: "Gamma Burst" | "Neutrino" | "Gravitational Wave" | "Radio"
  confidence: number // 0..1
  lat: number // -90..90
  lng: number // -180..180
  description: string
  source: string
  event: string
  angular_distance_deg: number
  time_diff_hours: number | null
}

interface CorrelatedEvent {
  _id: string
  gw_time: string
  gw_event_id: string
  grb_event_id: string
  confidence_score: number
  gw_dec: number
  gw_ra: number
  angular_sep_deg: number
  time_diff_hours: number | null
}

interface ApiResponse {
  success: boolean
  data: CorrelatedEvent[]
}

// Fetches and processes real data from the backend.
export async function getEventsForYear(year: number): Promise<EventItem[]> {
  try {
    const response = await fetch("/api/correlated")
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const result = (await response.json()) as ApiResponse

    if (result.success && Array.isArray(result.data)) {
      const allEvents = result.data

      // Filter by year
      const filteredEvents = allEvents.filter((event: CorrelatedEvent) => {
        const eventYear = new Date(event.gw_time).getFullYear()
        return eventYear === year
      })

      // Sort by confidence
      const sortedEvents = filteredEvents.sort(
        (a, b) => b.confidence_score - a.confidence_score
      )

      // Map into EventItem[]
      return sortedEvents.map((event: CorrelatedEvent) => ({
        id: event._id,
        year: new Date(event.gw_time).getFullYear(),
        type: event.gw_event_id.startsWith("GW")
          ? "Gravitational Wave"
          : "Gamma Burst",
        confidence: event.confidence_score,
        lat: event.gw_dec,
        lng: event.gw_ra,
        description: `Correlation detected between ${event.gw_event_id} and ${event.grb_event_id}.`,
        source: "Correlated",
        event: `${event.gw_event_id} ↔ ${event.grb_event_id}`,
        angular_distance_deg: Number(event.angular_sep_deg),
        time_diff_hours:
          typeof event.time_diff_hours === "number"
            ? event.time_diff_hours
            : null,
      }))
    }
    return []
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return []
  }
}
