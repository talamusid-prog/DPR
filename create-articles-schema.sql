-- Articles schema: normalized core tables and relations
-- Safe to run multiple times (IF NOT EXISTS guards)

-- Utility: auto-update updated_at on row updates
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users (authors/editors). If you already use auth.users, you can map separately.
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  avatar_url TEXT
);

-- Core articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  thumbnail_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  author_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT articles_status_check CHECK (status IN ('draft','published')),
  CONSTRAINT articles_slug_not_empty CHECK (length(trim(slug)) > 0)
);

-- Ensure updated_at is maintained
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_articles_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_articles_set_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL
);

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL
);

-- Article ↔ Category (many-to-many)
CREATE TABLE IF NOT EXISTS public.article_categories (
  article_id BIGINT REFERENCES public.articles(id) ON DELETE CASCADE,
  category_id BIGINT REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

-- Article ↔ Tag (many-to-many)
CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id BIGINT REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Optional views or constraints can be added in separate migration files


