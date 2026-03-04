import Parser from "rss-parser"
import type { RawFeedItem } from "./types"

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "BatteryIntel/1.0 (News Aggregator)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  customFields: {
    item: [["media:content", "mediaContent"]],
  },
})

export async function parseFeed(
  feedUrl: string
): Promise<{ items: RawFeedItem[]; error: string | null }> {
  try {
    const feed = await parser.parseURL(feedUrl)
    return {
      items: (feed.items || []) as RawFeedItem[],
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown feed error"
    return { items: [], error: message }
  }
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

export function extractSummary(item: RawFeedItem, maxLength = 250): string {
  const raw =
    item.contentSnippet || item.summary || item.description || item.content || ""
  const clean = stripHtml(raw)

  if (clean.length <= maxLength) return clean
  const truncated = clean.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "..."
}

export function normalizeDate(item: RawFeedItem): string {
  const dateStr = item.isoDate || item.pubDate
  if (!dateStr) return new Date().toISOString()

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return new Date().toISOString()
    return date.toISOString()
  } catch {
    return new Date().toISOString()
  }
}
