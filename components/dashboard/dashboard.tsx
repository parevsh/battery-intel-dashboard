"use client"

import { useState, useCallback, useEffect } from "react"
import useSWR, { mutate } from "swr"
import { Header } from "./header"
import { Filters } from "./filters"
import { NewsFeed } from "./news-feed"
import { StatsSidebar } from "./stats-sidebar"
import type { DashboardStats, NewsArticle } from "@/lib/news/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

const KNOWN_COUNTRIES = [
  "India", "China", "United States", "Germany", "South Korea",
  "Japan", "United Kingdom", "Australia", "Canada", "Sweden",
  "Norway", "France", "Indonesia", "Thailand",
]

export function Dashboard() {
  const [category, setCategory] = useState("all")
  const [keyword, setKeyword] = useState("")
  const [company, setCompany] = useState("")
  const [country, setCountry] = useState("")
  const [source, setSource] = useState("")
  const [page, setPage] = useState(1)
  const [isCollecting, setIsCollecting] = useState(false)

  const debouncedKeyword = useDebounce(keyword, 300)

  const newsParams = new URLSearchParams()
  newsParams.set("page", String(page))
  newsParams.set("limit", "20")
  if (category !== "all") newsParams.set("category", category)
  if (debouncedKeyword) newsParams.set("keyword", debouncedKeyword)
  if (company) newsParams.set("company", company)
  if (country) newsParams.set("country", country)
  if (source) newsParams.set("source", source)

  const newsUrl = `/api/news?${newsParams.toString()}`

  const { data: newsData, isLoading: newsLoading } = useSWR<{
    articles: NewsArticle[]
    pagination: { page: number; limit: number; total: number; total_pages: number }
  }>(newsUrl, fetcher, { refreshInterval: 60000 })

  const { data: statsData, isLoading: statsLoading } = useSWR<DashboardStats>(
    "/api/news/stats",
    fetcher,
    { refreshInterval: 60000 }
  )

  useEffect(() => {
    setPage(1)
  }, [category, debouncedKeyword, company, country, source])

  const availableCompanies = statsData?.top_companies.map((c) => c.company) || []
  const availableSources = statsData?.by_source.map((s) => s.source) || []

  const handleCollect = useCallback(async () => {
    setIsCollecting(true)
    try {
      await fetch("/api/collect", { method: "POST" })
      mutate(newsUrl)
      mutate("/api/news/stats")
    } catch {
      // Silent fail
    } finally {
      setIsCollecting(false)
    }
  }, [newsUrl])

  return (
    <div className="flex h-screen flex-col bg-background transition-colors duration-300">
      <Header
        stats={statsData ?? null}
        onCollect={handleCollect}
        isCollecting={isCollecting}
      />
      <Filters
        category={category}
        keyword={keyword}
        company={company}
        country={country}
        source={source}
        onCategoryChange={setCategory}
        onKeywordChange={setKeyword}
        onCompanyChange={setCompany}
        onCountryChange={setCountry}
        onSourceChange={setSource}
        availableCompanies={availableCompanies}
        availableCountries={KNOWN_COUNTRIES}
        availableSources={availableSources}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main news feed */}
        <main className="flex-1 overflow-y-auto">
          <NewsFeed
            articles={newsData?.articles || []}
            isLoading={newsLoading}
            page={page}
            totalPages={newsData?.pagination.total_pages || 0}
            total={newsData?.pagination.total || 0}
            onPageChange={setPage}
          />
        </main>

        {/* Stats sidebar - hidden below xl */}
        <div className="hidden w-[280px] overflow-y-auto xl:block">
          <StatsSidebar stats={statsData ?? null} isLoading={statsLoading} />
        </div>
      </div>
    </div>
  )
}
