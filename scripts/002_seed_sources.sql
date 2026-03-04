-- Seed news sources
INSERT INTO public.news_sources (name, url, feed_url, category_hint, enabled)
VALUES
  ('Electrek', 'https://electrek.co', 'https://electrek.co/feed/', 'EV 4-Wheeler', true),
  ('InsideEVs', 'https://insideevs.com', 'https://insideevs.com/rss/news/', 'EV 4-Wheeler', true),
  ('CleanTechnica', 'https://cleantechnica.com', 'https://cleantechnica.com/feed/', 'Battery Technology', true),
  ('Energy Storage News', 'https://www.energy-storage.news', 'https://www.energy-storage.news/feed/', 'Energy Storage / BESS', true),
  ('PV Magazine', 'https://www.pv-magazine.com', 'https://www.pv-magazine.com/feed/', 'Energy Storage / BESS', true),
  ('PV Magazine USA', 'https://pv-magazine-usa.com', 'https://pv-magazine-usa.com/feed/', 'Energy Storage / BESS', true),
  ('Reuters Sustainability', 'https://www.reuters.com/sustainability/', 'https://www.reuters.com/sustainability/rss', 'Strategic Move / Acquisition', true),
  ('Bloomberg Battery (via Google News)', 'https://news.google.com', 'https://news.google.com/rss/search?q=bloomberg+battery+lithium+energy+storage&hl=en', 'Battery Technology', true),
  ('Battery Technology News (via Google News)', 'https://news.google.com', 'https://news.google.com/rss/search?q=battery+technology+gigafactory+manufacturing&hl=en', 'Battery Manufacturing', true),
  ('GreenCarReports', 'https://www.greencarreports.com', 'https://www.greencarreports.com/rss', 'EV 4-Wheeler', true)
ON CONFLICT DO NOTHING;
