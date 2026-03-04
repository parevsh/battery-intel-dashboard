import { ExternalLink, Clock, Building2, MapPin, TrendingUp } from "lucide-react"
import type { NewsArticle } from "@/lib/news/types"

const CATEGORY_STYLES: Record<string, { badge: string; accent: string }> = {
  "Battery Technology": {
    badge: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    accent: "group-hover:shadow-chart-1/10",
  },
  "EV 2-Wheeler": {
    badge: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    accent: "group-hover:shadow-chart-2/10",
  },
  "EV 4-Wheeler": {
    badge: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    accent: "group-hover:shadow-chart-3/10",
  },
  "Energy Storage / BESS": {
    badge: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    accent: "group-hover:shadow-chart-4/10",
  },
  "Strategic Move / Acquisition": {
    badge: "bg-chart-5/10 text-chart-5 border-chart-5/20",
    accent: "group-hover:shadow-chart-5/10",
  },
  "Battery Manufacturing": {
    badge: "bg-primary/10 text-primary border-primary/20",
    accent: "group-hover:shadow-primary/10",
  },
}

const CATEGORY_IMAGES: Record<string, string> = {
  "EV 2-Wheeler": "/images/category-ev.jpg",
  "EV 4-Wheeler": "/images/category-ev.jpg",
  "Energy Storage / BESS": "/images/category-storage.jpg",
  "Battery Manufacturing": "/images/category-manufacturing.jpg",
  "Battery Technology": "/images/category-manufacturing.jpg",
  "Strategic Move / Acquisition": "/images/hero-battery.jpg",
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffHours < 48) return "Yesterday"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getRelevanceColor(score: number): string {
  if (score >= 50) return "text-primary"
  if (score >= 30) return "text-chart-3"
  return "text-muted-foreground"
}

function getRelevanceBg(score: number): string {
  if (score >= 50) return "bg-primary/10"
  if (score >= 30) return "bg-chart-3/10"
  return "bg-secondary"
}

interface NewsCardProps {
  article: NewsArticle
  index: number
}

export function NewsCard({ article, index }: NewsCardProps) {
  const style = CATEGORY_STYLES[article.category] || {
    badge: "bg-secondary text-secondary-foreground border-border",
    accent: "",
  }
  const categoryImage = CATEGORY_IMAGES[article.category]
  const showImage = index < 3 && categoryImage

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 ${style.accent}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex">
        {/* Optional category thumbnail for top articles */}
        {showImage && (
          <div className="relative hidden w-32 shrink-0 overflow-hidden sm:block">
            <img
              src={categoryImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card" />
          </div>
        )}

        <div className="flex-1 p-4">
          {/* Header: category + source + date */}
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${style.badge}`}>
              {article.category}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {article.source}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(article.published_date)}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-1.5 text-sm font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary text-pretty">
            {article.title}
          </h3>

          {/* Summary */}
          {article.summary && (
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {article.summary}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {article.companies.slice(0, 3).map((comp) => (
              <span
                key={comp}
                className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground transition-colors group-hover:bg-secondary"
              >
                <Building2 className="h-2.5 w-2.5" />
                {comp}
              </span>
            ))}
            {article.companies.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{article.companies.length - 3}
              </span>
            )}
            {article.country && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                <MapPin className="h-2.5 w-2.5" />
                {article.country}
              </span>
            )}

            {/* Relevance score */}
            <span className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${getRelevanceColor(article.relevance_score)} ${getRelevanceBg(article.relevance_score)}`}>
              <TrendingUp className="h-2.5 w-2.5" />
              {article.relevance_score}
            </span>
          </div>
        </div>

        {/* External link icon */}
        <div className="flex items-start p-4">
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  )
}
