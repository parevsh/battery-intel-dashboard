"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "Battery Technology", label: "Battery Tech" },
  { value: "EV 2-Wheeler", label: "EV 2-Wheeler" },
  { value: "EV 4-Wheeler", label: "EV 4-Wheeler" },
  { value: "Energy Storage / BESS", label: "Energy Storage" },
  { value: "Strategic Move / Acquisition", label: "Strategic" },
  { value: "Battery Manufacturing", label: "Manufacturing" },
]

interface FiltersProps {
  category: string
  keyword: string
  company: string
  country: string
  source: string
  onCategoryChange: (val: string) => void
  onKeywordChange: (val: string) => void
  onCompanyChange: (val: string) => void
  onCountryChange: (val: string) => void
  onSourceChange: (val: string) => void
  availableCompanies: string[]
  availableCountries: string[]
  availableSources: string[]
}

export function Filters({
  category,
  keyword,
  company,
  country,
  source,
  onCategoryChange,
  onKeywordChange,
  onCompanyChange,
  onCountryChange,
  onSourceChange,
  availableCompanies,
  availableCountries,
  availableSources,
}: FiltersProps) {

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const hasActiveFilters =
    category !== "all" || keyword || company || country || source

  const clearAll = () => {
    onCategoryChange("all")
    onKeywordChange("")
    onCompanyChange("")
    onCountryChange("")
    onSourceChange("")
  }

  return (
    <div className="border-b border-border bg-card/50 glass px-4 py-4 lg:px-8 animate-slide-up">
      
      {/* Category pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
              category === cat.value
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                : "bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:scale-[1.02]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="h-9 rounded-lg border-border/60 bg-background pl-9 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Company */}
        <Select
          value={company || "all"}
          onValueChange={(val) => onCompanyChange(val === "all" ? "" : val)}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-lg border-border/60 bg-background text-xs text-foreground">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {availableCompanies.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Country */}
        <Select
          value={country || "all"}
          onValueChange={(val) => onCountryChange(val === "all" ? "" : val)}
        >
          <SelectTrigger className="h-9 w-[140px] rounded-lg border-border/60 bg-background text-xs text-foreground">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {availableCountries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source */}
        <Select
          value={source || "all"}
          onValueChange={(val) => onSourceChange(val === "all" ? "" : val)}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-lg border-border/60 bg-background text-xs text-foreground">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {availableSources.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-9 gap-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}