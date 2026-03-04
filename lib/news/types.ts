export interface RawFeedItem {
  title?: string
  link?: string
  pubDate?: string
  isoDate?: string
  content?: string
  contentSnippet?: string
  summary?: string
  description?: string
  creator?: string
  categories?: string[]
}

export interface ProcessedArticle {
  title: string
  source: string
  category: string
  published_date: string
  url: string
  summary: string
  companies: string[]
  country: string | null
  keywords_matched: string[]
  relevance_score: number
}

export interface NewsSource {
  id: string
  name: string
  url: string
  feed_url: string
  category_hint: string | null
  enabled: boolean
  last_fetched_at: string | null
}

export interface CollectionResult {
  source: string
  articles_found: number
  articles_added: number
  errors: string[]
}

export interface NewsArticle {
  id: string
  title: string
  source: string
  category: string
  published_date: string
  url: string
  summary: string
  companies: string[]
  country: string | null
  keywords_matched: string[]
  relevance_score: number
  collected_at: string
}

export interface DashboardStats {
  total_articles: number
  articles_today: number
  articles_this_week: number
  by_category: { category: string; count: number }[]
  by_source: { source: string; count: number }[]
  top_companies: { company: string; count: number }[]
  last_collection: string | null
}
