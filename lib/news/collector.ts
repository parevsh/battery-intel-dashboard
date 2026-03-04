import { createAdminClient } from "@/lib/supabase/admin"
import { parseFeed, extractSummary, normalizeDate } from "./parser"
import { scoreArticle, RELEVANCE_THRESHOLD } from "./keywords"
import { categorizeArticle } from "./categorizer"
import { extractCompanies } from "./companies"
import { extractCountry } from "./countries"
import type { NewsSource, ProcessedArticle, CollectionResult } from "./types"

export async function collectAllNews(): Promise<{
  results: CollectionResult[]
  totalFound: number
  totalAdded: number
}> {
  const supabase = createAdminClient()
  const startedAt = new Date().toISOString()
  const allResults: CollectionResult[] = []
  let totalFound = 0
  let totalAdded = 0
  const allErrors: { source: string; error: string }[] = []

  // 1. Fetch all enabled sources
  const { data: sources, error: sourcesError } = await supabase
    .from("news_sources")
    .select("*")
    .eq("enabled", true)

  if (sourcesError || !sources) {
    throw new Error(`Failed to fetch sources: ${sourcesError?.message}`)
  }

  // 2. Process each source
  for (const source of sources as NewsSource[]) {
    const result = await collectFromSource(supabase, source)
    allResults.push(result)
    totalFound += result.articles_found
    totalAdded += result.articles_added
    if (result.errors.length > 0) {
      for (const err of result.errors) {
        allErrors.push({ source: source.name, error: err })
      }
    }
  }

  // 3. Log collection run
  await supabase.from("collection_logs").insert({
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    articles_found: totalFound,
    articles_added: totalAdded,
    errors: allErrors.length > 0 ? allErrors : null,
  })

  return { results: allResults, totalFound, totalAdded }
}

async function collectFromSource(
  supabase: ReturnType<typeof createAdminClient>,
  source: NewsSource
): Promise<CollectionResult> {
  const result: CollectionResult = {
    source: source.name,
    articles_found: 0,
    articles_added: 0,
    errors: [],
  }

  // Parse RSS feed
  const { items, error: feedError } = await parseFeed(source.feed_url)

  if (feedError) {
    result.errors.push(feedError)
    return result
  }

  result.articles_found = items.length
  const articlesToInsert: ProcessedArticle[] = []

  for (const item of items) {
    if (!item.title || !item.link) continue

    const title = item.title.trim()
    const url = item.link.trim()
    const description = item.contentSnippet || item.summary || item.description || ""

    // Score relevance
    const { score, matched } = scoreArticle(title, description)

    // Skip low-relevance articles
    if (score < RELEVANCE_THRESHOLD) continue

    // Extract metadata
    const companies = extractCompanies(`${title} ${description}`)
    const country = extractCountry(`${title} ${description}`)
    const category = categorizeArticle(title, description, source.category_hint)
    const summary = extractSummary(item)
    const publishedDate = normalizeDate(item)

    articlesToInsert.push({
      title,
      source: source.name,
      category,
      published_date: publishedDate,
      url,
      summary,
      companies,
      country,
      keywords_matched: matched,
      relevance_score: score,
    })
  }

  // Batch insert (upsert to handle duplicates)
  if (articlesToInsert.length > 0) {
    const { error: insertError, data } = await supabase
      .from("news_articles")
      .upsert(articlesToInsert, {
        onConflict: "url",
        ignoreDuplicates: true,
      })
      .select("id")

    if (insertError) {
      result.errors.push(`Insert error: ${insertError.message}`)
    } else {
      result.articles_added = data?.length || 0
    }
  }

  // Update last_fetched_at
  await supabase
    .from("news_sources")
    .update({ last_fetched_at: new Date().toISOString() })
    .eq("id", source.id)

  return result
}
