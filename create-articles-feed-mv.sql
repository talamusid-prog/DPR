-- Materialized view for lightweight article feed listings

-- Base view definition with minimal columns for lists
CREATE MATERIALIZED VIEW IF NOT EXISTS public.articles_feed AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.excerpt,
  a.thumbnail_url,
  a.author_id,
  up.name AS author_name,
  a.published_at,
  a.created_at,
  a.updated_at,
  COALESCE(cat.categories, '{}') AS categories, -- array of category slugs
  COALESCE(tag.tags, '{}') AS tags               -- array of tag slugs
FROM public.articles a
LEFT JOIN public.user_public_profiles up ON up.id = a.author_id
LEFT JOIN (
  SELECT ac.article_id, array_agg(DISTINCT c.slug ORDER BY c.slug) AS categories
  FROM public.article_categories ac
  JOIN public.categories c ON c.id = ac.category_id
  GROUP BY ac.article_id
) AS cat ON cat.article_id = a.id
LEFT JOIN (
  SELECT at.article_id, array_agg(DISTINCT t.slug ORDER BY t.slug) AS tags
  FROM public.article_tags at
  JOIN public.tags t ON t.id = at.tag_id
  GROUP BY at.article_id
) AS tag ON tag.article_id = a.id
WHERE a.status = 'published';

-- Unique index required for CONCURRENT refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_feed_unique
  ON public.articles_feed (id);

-- Helpful sort index
CREATE INDEX IF NOT EXISTS idx_articles_feed_published_at
  ON public.articles_feed (published_at DESC);

-- Refresh function (use in cron/scheduler)
CREATE OR REPLACE FUNCTION public.refresh_articles_feed()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.articles_feed;
END;
$$ LANGUAGE plpgsql;

-- Example: schedule via pg_cron or Supabase Scheduler
-- SELECT cron.schedule('refresh_articles_feed_every_5m', '*/5 * * * *', $$SELECT public.refresh_articles_feed();$$);


