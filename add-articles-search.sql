-- Full-text search setup for articles

-- Add generated tsvector column combining title + content
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'search_tsv'
  ) THEN
    ALTER TABLE public.articles
      ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (
        to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,''))
      ) STORED;
  END IF;
END $$;

-- Index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_articles_search
  ON public.articles USING GIN (search_tsv);

-- Example search query (for reference):
-- SELECT id, title, slug
-- FROM public.articles
-- WHERE search_tsv @@ plainto_tsquery('simple', $1)
--   AND status = 'published'
-- ORDER BY published_at DESC
-- LIMIT 10;


