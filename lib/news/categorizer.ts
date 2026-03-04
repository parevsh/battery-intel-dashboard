const CATEGORY_RULES: { category: string; patterns: string[] }[] = [
  {
    category: "EV 2-Wheeler",
    patterns: [
      "electric scooter",
      "e-scooter",
      "electric motorcycle",
      "two wheeler",
      "two-wheeler",
      "2-wheeler",
      "e-bike",
      "electric bike",
      "electric moped",
      "ola electric",
      "ather",
      "hero electric",
      "tvs iqube",
    ],
  },
  {
    category: "EV 4-Wheeler",
    patterns: [
      "electric car",
      "electric suv",
      "electric truck",
      "electric pickup",
      "ev sales",
      "ev adoption",
      "ev market",
      "tesla model",
      "rivian",
      "lucid",
      "nio",
      "xpeng",
      "li auto",
      "byd seal",
      "byd dolphin",
      "byd atto",
      "ev registrations",
      "plug-in hybrid",
      "phev",
    ],
  },
  {
    category: "Energy Storage / BESS",
    patterns: [
      "bess",
      "grid storage",
      "utility scale",
      "utility-scale",
      "energy storage system",
      "megapack",
      "powerwall",
      "grid-scale",
      "grid scale",
      "battery storage project",
      "stationary storage",
      "peak shaving",
      "load shifting",
      "frequency regulation",
      "fluence",
    ],
  },
  {
    category: "Strategic Move / Acquisition",
    patterns: [
      "acquisition",
      "acquired",
      "acquires",
      "merger",
      "merged",
      "investment",
      "invests",
      "invested",
      "strategic partnership",
      "joint venture",
      "partnership",
      "stake",
      "ipo",
      "funding round",
      "series a",
      "series b",
      "series c",
      "supply agreement",
      "offtake",
      "memorandum",
      "mou",
      "deal",
      "valuation",
    ],
  },
  {
    category: "Battery Manufacturing",
    patterns: [
      "gigafactory",
      "cell manufacturing",
      "factory expansion",
      "production line",
      "production capacity",
      "assembly plant",
      "manufacturing plant",
      "battery plant",
      "cell production",
      "gwh capacity",
      "production ramp",
      "mass production",
      "pilot line",
    ],
  },
  {
    category: "Battery Technology",
    patterns: [
      "battery cell",
      "lithium-ion",
      "lithium ion",
      "li-ion",
      "solid state",
      "solid-state",
      "cathode",
      "anode",
      "electrolyte",
      "separator",
      "lfp",
      "nmc",
      "nca",
      "sodium-ion",
      "sodium ion",
      "energy density",
      "cycle life",
      "battery chemistry",
      "cell-to-pack",
      "cell to pack",
      "dry electrode",
      "silicon anode",
      "battery management",
      "bms",
      "thermal management",
      "battery recycling",
      "lithium mining",
    ],
  },
]

export function categorizeArticle(
  title: string,
  description: string,
  sourceHint?: string | null
): string {
  const text = `${title} ${description}`.toLowerCase()

  // Score each category
  const scores: { category: string; score: number }[] = CATEGORY_RULES.map(
    (rule) => {
      let score = 0
      for (const pattern of rule.patterns) {
        if (text.includes(pattern)) {
          score++
        }
      }
      return { category: rule.category, score }
    }
  )

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score)

  // Return highest scoring category, or use source hint, or default
  if (scores[0].score > 0) {
    return scores[0].category
  }

  if (sourceHint) {
    return sourceHint
  }

  return "Battery Technology"
}
