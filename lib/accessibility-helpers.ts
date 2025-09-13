// Accessibility and educational helpers for space event visualization

export interface AccessibilityInfo {
  term: string
  definition: string
  analogy?: string
  context?: string
  units?: string
}

export const ACCESSIBILITY_GLOSSARY: Record<string, AccessibilityInfo> = {
  "Angular Distance": {
    term: "Angular Distance",
    definition: "The apparent size of an object in the sky, measured in degrees. Like measuring how wide something looks when you hold your hand at arm's length.",
    analogy: "If you hold your thumb at arm's length, it covers about 1 degree of sky. The Moon is about 0.5 degrees wide.",
    context: "Smaller angular distances mean the event appears more pinpoint in the sky, while larger distances suggest a more spread-out source.",
    units: "degrees (°)"
  },
  "Spatial Distance": {
    term: "Spatial Distance", 
    definition: "How far away the event actually is in space, measured in millions of light-years.",
    analogy: "One light-year is about 6 trillion miles. A million light-years is like traveling from Earth to the Andromeda Galaxy and back 500 times.",
    context: "This tells us how long ago the light we're seeing was emitted. The farther away, the older the event.",
    units: "million light-years (Mly)"
  },
  "Detection Confidence": {
    term: "Detection Confidence",
    definition: "How certain scientists are that this is a real astronomical event, not noise or interference.",
    analogy: "Like a weather forecast saying '80% chance of rain' - it's not 100% certain, but very likely.",
    context: "Higher confidence means multiple detectors saw the same signal or the signal has very clear characteristics.",
    units: "percentage (%)"
  },
  "Gamma Burst": {
    term: "Gamma-Ray Burst",
    definition: "The most energetic explosions in the universe, releasing more energy in seconds than our Sun will in its entire lifetime.",
    analogy: "Like a cosmic supernova on steroids - imagine a star exploding with the power of a billion suns.",
    context: "These are often caused by massive star collapses or neutron star collisions billions of light-years away."
  },
  "Gravitational Wave": {
    term: "Gravitational Wave",
    definition: "Ripples in spacetime itself, created when massive objects like black holes collide.",
    analogy: "Like dropping a stone in a pond, but the pond is space and time itself.",
    context: "These waves travel at the speed of light and stretch and compress space as they pass through."
  },
  "Neutrino": {
    term: "Neutrino",
    definition: "Ghostly particles that barely interact with matter - trillions pass through your body every second.",
    analogy: "Like cosmic ghosts that can pass through entire planets without being stopped.",
    context: "They're produced in nuclear reactions and can tell us about the most extreme environments in the universe."
  },
  "Radio": {
    term: "Radio Signal",
    definition: "Electromagnetic waves at radio frequencies, like cosmic radio stations broadcasting across the universe.",
    analogy: "Like tuning into a distant radio station, but the station is a star or galaxy billions of light-years away.",
    context: "These signals can travel vast distances and tell us about magnetic fields and particle acceleration in space."
  }
}

export const DISTANCE_ANALOGIES: Record<string, string> = {
  "50": "About as far as the Virgo Cluster of galaxies",
  "100": "Roughly the distance to the Coma Cluster",
  "200": "Approaching the edge of our local supercluster",
  "300": "Beyond our local cosmic neighborhood",
  "400": "In the distant universe, light from when Earth was forming",
  "500": "Near the edge of the observable universe"
}

export const ANGULAR_ANALOGIES: Record<string, string> = {
  "0.5": "About the size of the full Moon",
  "1.0": "Twice the width of the full Moon",
  "2.0": "About the width of your thumb at arm's length",
  "5.0": "Roughly the width of your fist at arm's length",
  "10.0": "About the width of your outstretched hand"
}

export function getDistanceAnalogy(distance: number): string {
  const rounded = Math.round(distance / 50) * 50
  return DISTANCE_ANALOGIES[rounded.toString()] || "In the distant universe"
}

export function getAngularAnalogy(angular: number): string {
  if (angular <= 0.5) return ANGULAR_ANALOGIES["0.5"]
  if (angular <= 1.0) return ANGULAR_ANALOGIES["1.0"]
  if (angular <= 2.0) return ANGULAR_ANALOGIES["2.0"]
  if (angular <= 5.0) return ANGULAR_ANALOGIES["5.0"]
  return ANGULAR_ANALOGIES["10.0"]
}

export function getConfidenceDescription(confidence: number): string {
  const percentage = Math.round(confidence * 100)
  if (percentage >= 90) return "Very high confidence - multiple confirmations"
  if (percentage >= 75) return "High confidence - strong signal detected"
  if (percentage >= 60) return "Moderate confidence - likely real event"
  if (percentage >= 40) return "Low confidence - possible detection"
  return "Very low confidence - uncertain signal"
}

export function formatAccessibleText(event: any): string {
  const confidence = getConfidenceDescription(event.confidence)
  const distanceAnalogy = getDistanceAnalogy(event.spatial_distance_mly)
  const angularAnalogy = getAngularAnalogy(event.angular_distance_deg)
  
  return `${event.event}: ${event.description}. This ${event.type.toLowerCase()} was detected with ${confidence}. It appears ${angularAnalogy} in the sky and is located ${distanceAnalogy}, about ${event.spatial_distance_mly} million light-years away.`
}