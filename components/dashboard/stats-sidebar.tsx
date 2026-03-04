"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, BarChart3, Globe2, Layers } from "lucide-react"
import type { DashboardStats } from "@/lib/news/types"

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-primary)",
]

interface StatsSidebarProps {
  stats: DashboardStats | null
  isLoading: boolean
}

export function StatsSidebar({ stats, isLoading }: StatsSidebarProps) {
  if (isLoading || !stats) {
    return (
      <div className="flex flex-col gap-6 p-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
            <Skeleton className="mb-3 h-4 w-24 rounded-full" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  const categoryConfig: ChartConfig = {}
  stats.by_category.forEach((item, i) => {
    categoryConfig[item.category] = {
      label: item.category,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }
  })

  return (
    <aside className="flex flex-col gap-6 border-l border-border bg-card/50 glass p-5">
      {/* Summary stats grid */}
      <section className="animate-slide-up">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Overview
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Total", value: stats.total_articles, color: "text-foreground" },
            { label: "Today", value: stats.articles_today, color: "text-primary" },
            { label: "This Week", value: stats.articles_this_week, color: "text-foreground" },
            { label: "Sources", value: stats.by_source.length, color: "text-chart-2" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="rounded-xl border border-border/40 bg-background/50 p-3 transition-all duration-200 hover:border-border hover:bg-background/80"
            >
              <p className={`text-xl font-bold font-mono ${item.color}`}>
                {item.value}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Distribution */}
      <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="mb-3 flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-chart-4" />
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            By Category
          </h3>
        </div>
        {stats.by_category.length > 0 ? (
          <>
            <ChartContainer config={categoryConfig} className="mx-auto aspect-square max-h-[160px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
                <Pie
                  data={stats.by_category}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={58}
                  strokeWidth={2}
                  stroke="var(--color-card)"
                >
                  {stats.by_category.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-3 flex flex-col gap-1.5">
              {stats.by_category.map((item, i) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="max-w-[120px] truncate text-[11px] text-muted-foreground">
                      {item.category}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No data yet</p>
        )}
      </section>

      {/* Top Companies */}
      <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-chart-1" />
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Top Companies
          </h3>
        </div>
        {stats.top_companies.length > 0 ? (
          <ChartContainer
            config={{ count: { label: "Mentions", color: "var(--color-chart-1)" } }}
            className="aspect-[4/3] max-h-[200px] w-full"
          >
            <BarChart
              data={stats.top_companies.slice(0, 8)}
              layout="vertical"
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="company"
                width={70}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                radius={[0, 6, 6, 0]}
                fill="var(--color-chart-1)"
                maxBarSize={14}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-xs text-muted-foreground">No data yet</p>
        )}
      </section>

      {/* Sources */}
      <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <div className="mb-3 flex items-center gap-2">
          <Globe2 className="h-3.5 w-3.5 text-chart-5" />
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            By Source
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {stats.by_source.map((item, i) => {
            const maxCount = stats.by_source[0]?.count || 1
            const widthPercent = Math.min((item.count / maxCount) * 100, 100)
            return (
              <div key={item.source} className="group flex items-center justify-between">
                <span className="max-w-[110px] truncate text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
                  {item.source}
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-[11px] font-semibold text-foreground">
                    {item.count}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </aside>
  )
}
