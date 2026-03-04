export const PRIMARY_KEYWORDS = [
  "lithium battery",
  "lithium-ion",
  "lithium ion",
  "li-ion",
  "gigafactory",
  "battery cell manufacturing",
  "battery energy storage",
  "BESS",
  "battery pack",
  "solid state battery",
  "solid-state battery",
  "sodium-ion battery",
  "sodium ion battery",
  "battery management system",
  "BMS",
  "cathode",
  "anode",
  "electrolyte",
  "battery cell",
  "cell-to-pack",
  "cell to pack",
  "LFP",
  "NMC",
  "NCA",
]

export const SECONDARY_KEYWORDS = [
  "electric vehicle",
  "EV sales",
  "EV market",
  "electric scooter",
  "e-scooter",
  "electric car",
  "battery recycling",
  "grid storage",
  "energy storage system",
  "battery swap",
  "charging infrastructure",
  "fast charging",
  "battery supply chain",
  "battery materials",
  "lithium mining",
  "cobalt",
  "nickel supply",
  "graphite",
  "battery cost",
  "kWh",
  "MWh",
  "GWh",
]

export const TERTIARY_KEYWORDS = [
  "acquisition",
  "merger",
  "investment",
  "strategic partnership",
  "joint venture",
  "factory expansion",
  "production capacity",
  "IPO",
  "funding round",
  "supply agreement",
  "offtake agreement",
  "memorandum of understanding",
  "MOU",
  "manufacturing plant",
  "assembly line",
]

export const KEYWORD_WEIGHTS = {
  primary: 15,
  secondary: 8,
  tertiary: 4,
} as const

export const RELEVANCE_THRESHOLD = 8

export function scoreArticle(
  title: string,
  description: string
): { score: number; matched: string[] } {
  const text = `${title} ${description}`.toLowerCase()
  let score = 0
  const matched: string[] = []

  for (const kw of PRIMARY_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) {
      score += KEYWORD_WEIGHTS.primary
      matched.push(kw)
    }
  }

  for (const kw of SECONDARY_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) {
      score += KEYWORD_WEIGHTS.secondary
      matched.push(kw)
    }
  }

  for (const kw of TERTIARY_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) {
      score += KEYWORD_WEIGHTS.tertiary
      matched.push(kw)
    }
  }

  // Cap at 100
  return { score: Math.min(score, 100), matched }
}
