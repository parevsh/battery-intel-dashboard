import { NextResponse } from "next/server"
import { collectAllNews } from "@/lib/news/collector"

export const maxDuration = 60

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { results, totalFound, totalAdded } = await collectAllNews()

    return NextResponse.json({
      success: true,
      summary: {
        total_found: totalFound,
        total_added: totalAdded,
        sources_processed: results.length,
      },
      details: results,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Collection failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { results, totalFound, totalAdded } = await collectAllNews()

    return NextResponse.json({
      success: true,
      summary: {
        total_found: totalFound,
        total_added: totalAdded,
        sources_processed: results.length,
      },
      details: results,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Collection failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}