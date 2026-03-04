"use client"

import { NewsCard } from "./news-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react"
import type { NewsArticle } from "@/lib/news/types"

interface NewsFeedProps {
  articles: NewsArticle[]
  isLoading: boolean
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export function NewsFeed({
  articles,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
}: NewsFeedProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4 lg:p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-card p-4 animate-fade-in"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="mb-3 flex gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="mb-2 h-5 w-full rounded-lg" />
            <Skeleton className="mb-3 h-4 w-3/4 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center animate-fade-in">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Inbox className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="absolute -inset-2 rounded-2xl bg-primary/5 blur-xl" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">No articles found</p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
            Try adjusting your filters or click Collect Now to fetch new articles from all sources.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Article count */}
      <div className="px-4 pt-4 lg:px-6 lg:pt-6">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-mono font-medium text-foreground">{(page - 1) * 20 + 1}</span>
          {" - "}
          <span className="font-mono font-medium text-foreground">{Math.min(page * 20, total)}</span>
          {" of "}
          <span className="font-mono font-medium text-foreground">{total}</span>
          {" articles"}
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 p-4 lg:px-6 lg:pb-6">
        {articles.map((article, i) => (
          <div key={article.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
            <NewsCard article={article} index={i} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 border-t border-border px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 gap-1 rounded-lg text-xs text-foreground transition-all duration-200 hover:bg-secondary"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
          </Button>

          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 ${
                    page === pageNum
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="h-8 gap-1 rounded-lg text-xs text-foreground transition-all duration-200 hover:bg-secondary"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
