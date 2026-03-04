export const COUNTRY_PATTERNS: Record<string, string[]> = {
  "India": ["india", "indian", "delhi", "mumbai", "chennai", "bangalore", "hyderabad", "gujarat"],
  "China": ["china", "chinese", "beijing", "shanghai", "shenzhen", "guangdong"],
  "United States": ["united states", "u.s.", "usa", "american", "california", "texas", "michigan", "nevada", "georgia"],
  "Germany": ["germany", "german", "berlin", "munich", "stuttgart"],
  "South Korea": ["south korea", "korean", "seoul"],
  "Japan": ["japan", "japanese", "tokyo"],
  "United Kingdom": ["united kingdom", "uk", "british", "london"],
  "Australia": ["australia", "australian", "sydney", "melbourne"],
  "Canada": ["canada", "canadian", "ontario", "quebec"],
  "Sweden": ["sweden", "swedish"],
  "Norway": ["norway", "norwegian"],
  "France": ["france", "french", "paris"],
  "Indonesia": ["indonesia", "indonesian", "jakarta"],
  "Thailand": ["thailand", "thai", "bangkok"],
  "Vietnam": ["vietnam", "vietnamese"],
  "Brazil": ["brazil", "brazilian"],
  "Chile": ["chile", "chilean"],
  "Argentina": ["argentina", "argentinian"],
  "Morocco": ["morocco", "moroccan"],
  "Saudi Arabia": ["saudi arabia", "saudi"],
  "UAE": ["uae", "united arab emirates", "dubai", "abu dhabi"],
}

export function extractCountry(text: string): string | null {
  const lower = text.toLowerCase()
  let bestMatch: string | null = null
  let bestIndex = Infinity

  for (const [country, patterns] of Object.entries(COUNTRY_PATTERNS)) {
    for (const pattern of patterns) {
      const idx = lower.indexOf(pattern)
      if (idx !== -1 && idx < bestIndex) {
        bestIndex = idx
        bestMatch = country
        break
      }
    }
  }

  return bestMatch
}
