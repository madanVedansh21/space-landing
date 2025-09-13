export type EventItem = {
  id: string;
  year: number;
  type: "Gamma Burst" | "Neutrino" | "Gravitational Wave" | "Radio";
  confidence: number; // 0..1
  lat: number; // -90..90
  lng: number; // -180..180
  description: string;
  source: string;
  event: string;
  angular_distance_deg: number;
  spatial_distance_mly: number;
};

interface CorrelatedEvent {
  _id: string;
  gw_time: string;
  gw_event_id: string;
  grb_event_id: string;
  confidence_score: number;
  gw_dec: number;
  gw_ra: number;
  angular_sep_deg: number;
  spatial_distance_mly: number;
}

interface ApiResponse {
  success: boolean;
  data: CorrelatedEvent[];
}

// This function now fetches and processes real data from the backend.
export async function getEventsForYear(year: number): Promise<EventItem[]> {
  try {
    const response = await fetch('http://localhost:3000/api/correlated');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json() as ApiResponse;

    if (result.success && Array.isArray(result.data)) {
      const allEvents = result.data;

      const filteredEvents = allEvents.filter((event: CorrelatedEvent) => {
        const eventYear = new Date(event.gw_time).getFullYear();
        return eventYear === year;
      });

      const sortedEvents = filteredEvents.sort((a, b) => b.confidence_score - a.confidence_score);

      return sortedEvents.map((event: CorrelatedEvent) => ({
        id: event._id,
        year: new Date(event.gw_time).getFullYear(),
        type: event.gw_event_id.startsWith('GW') ? "Gravitational Wave" : "Gamma Burst",
        confidence: event.confidence_score,
        lat: event.gw_dec,
        lng: event.gw_ra,
        description: `Correlation between ${event.gw_event_id} and ${event.grb_event_id}.`,
        source: 'Correlated',
        event: `${event.gw_event_id} + ${event.grb_event_id}`,
        angular_distance_deg: Number(event.angular_sep_deg),
        spatial_distance_mly: Number(event.spatial_distance_mly),
      }));
    }
    return [];
    
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}