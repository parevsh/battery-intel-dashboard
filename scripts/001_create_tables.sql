-- Create news_sources table
CREATE TABLE IF NOT EXISTS public.news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  category_hint TEXT,
  enabled BOOLEAN DEFAULT true,
  last_fetched_at TIMESTAMPTZ
);

-- Create news_articles table
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  published_date TIMESTAMPTZ,
  url TEXT NOT NULL UNIQUE,
  summary TEXT,
  companies TEXT[] DEFAULT '{}',
  country TEXT,
  keywords_matched TEXT[] DEFAULT '{}',
  relevance_score INTEGER DEFAULT 0,
  collected_at TIMESTAMPTZ DEFAULT now()
);

-- Create collection_logs table
CREATE TABLE IF NOT EXISTS public.collection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  articles_found INTEGER DEFAULT 0,
  articles_added INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON public.news_articles (published_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.news_articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_source ON public.news_articles (source);
CREATE INDEX IF NOT EXISTS idx_articles_relevance ON public.news_articles (relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_articles_collected_at ON public.news_articles (collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_country ON public.news_articles (country);

-- Disable RLS (public dashboard, writes use service role key)
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read on news_sources" ON public.news_sources FOR SELECT USING (true);
CREATE POLICY "Allow public read on news_articles" ON public.news_articles FOR SELECT USING (true);
CREATE POLICY "Allow public read on collection_logs" ON public.collection_logs FOR SELECT USING (true);
