import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get("category")
  const company = searchParams.get("company")
  const country = searchParams.get("country")
  const keyword = searchParams.get("keyword")
  const source = searchParams.get("source")
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100)
  const offset = (page - 1) * limit

  const supabase = await createClient()

  let query = supabase
    .from("news_articles")
    .select("*", { count: "exact" })
    .order("published_date", { ascending: false })
    .range(offset, offset + limit - 1)

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  if (company) {
    query = query.contains("companies", [company])
  }

  if (country) {
    query = query.eq("country", country)
  }

  if (source) {
    query = query.ilike("source", `%${source}%`)
  }

  if (keyword) {
    query = query.or(`title.ilike.%${keyword}%,summary.ilike.%${keyword}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    articles: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    },
  })
}
