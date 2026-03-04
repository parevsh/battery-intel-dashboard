"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Zap,
  Newspaper,
  Database,
  RefreshCw,
  Sun,
  Moon,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DashboardStats } from "@/lib/news/types";

interface HeaderProps {
  stats: DashboardStats | null;
  onCollect: () => void;
  isCollecting: boolean;
}

export function Header({ stats, onCollect, isCollecting }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatLastCollection = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* Hero background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-battery.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/85 dark:bg-background/80" />
        {/* Accent glow */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        <div
          className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-chart-2/10 blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-4 animate-slide-down">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Zap className="h-5 w-5 text-primary-foreground" />
            <div className="absolute -inset-0.5 rounded-xl bg-primary/30 blur-sm -z-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Battery Intel
            </h1>
            <p className="text-xs text-muted-foreground">
              Lithium Battery & EV Industry Intelligence
            </p>
          </div>
        </div>

        {/* Stats + Actions */}
        <div
          className="flex flex-wrap items-center gap-2 animate-slide-down"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="glass flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Newspaper className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground font-mono">
                {stats?.total_articles ?? 0}
              </span>
              <span className="text-xs text-muted-foreground">articles</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-chart-3" />
              <span className="text-xs font-medium text-foreground font-mono">
                {stats?.articles_today ?? 0}
              </span>
              <span className="text-xs text-muted-foreground">today</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-chart-2" />
              <span className="text-xs text-muted-foreground">
                {formatLastCollection(stats?.last_collection ?? null)}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            onClick={onCollect}
            disabled={isCollecting}
            className="gap-1.5 bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isCollecting ? "animate-spin" : ""}`}
            />
            {isCollecting ? "Collecting..." : "Collect Now"}
          </Button>

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-lg border border-border/60 bg-card/60 glass text-foreground hover:bg-card hover:text-primary transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
