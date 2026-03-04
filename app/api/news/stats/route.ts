import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  // Total articles
  const { count: totalArticles } = await supabase
    .from("news_articles")
    .select("*", { count: "exact", head: true })

  // Articles today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count: articlesToday } = await supabase
    .from("news_articles")
    .select("*", { count: "exact", head: true })
    .gte("published_date", today.toISOString())

  // Articles this week
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const { count: articlesThisWeek } = await supabase
    .from("news_articles")
    .select("*", { count: "exact", head: true })
    .gte("published_date", weekAgo.toISOString())

  // By category
  const { data: allArticles } = await supabase
    .from("news_articles")
    .select("category, source, companies")

  const categoryMap = new Map<string, number>()
  const sourceMap = new Map<string, number>()
  const companyMap = new Map<string, number>()

  for (const article of allArticles || []) {
    categoryMap.set(
      article.category,
      (categoryMap.get(article.category) || 0) + 1
    )
    sourceMap.set(article.source, (sourceMap.get(article.source) || 0) + 1)
    if (article.companies) {
      for (const company of article.companies) {
        companyMap.set(company, (companyMap.get(company) || 0) + 1)
      }
    }
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  const bySource = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)

  const topCompanies = Array.from(companyMap.entries())
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  // Last collection
  const { data: lastLog } = await supabase
    .from("collection_logs")
    .select("completed_at")
    .order("completed_at", { ascending: false })
    .limit(1)

  return NextResponse.json({
    total_articles: totalArticles || 0,
    articles_today: articlesToday || 0,
    articles_this_week: articlesThisWeek || 0,
    by_category: byCategory,
    by_source: bySource,
    top_companies: topCompanies,
    last_collection: lastLog?.[0]?.completed_at || null,
  })
}
