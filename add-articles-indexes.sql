-- Performance indexes for article-related queries

-- Articles
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug_unique_ci
  ON public.articles (LOWER(slug));

CREATE INDEX IF NOT EXISTS idx_articles_published_at
  ON public.articles (published_at DESC);

CREATE INDEX IF NOT EXISTS idx_articles_status_published_published_at
  ON public.articles (published_at DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_articles_status
  ON public.articles (status);

CREATE INDEX IF NOT EXISTS idx_articles_author
  ON public.articles (author_id);

CREATE INDEX IF NOT EXISTS idx_articles_created_at
  ON public.articles (created_at DESC);

-- Categories
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_unique_ci
  ON public.categories (LOWER(slug));

CREATE INDEX IF NOT EXISTS idx_categories_name_ci
  ON public.categories (LOWER(name));

-- Tags
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_slug_unique_ci
  ON public.tags (LOWER(slug));

CREATE INDEX IF NOT EXISTS idx_tags_name_ci
  ON public.tags (LOWER(name));

-- Junction tables
CREATE INDEX IF NOT EXISTS idx_article_categories_article
  ON public.article_categories (article_id);

CREATE INDEX IF NOT EXISTS idx_article_categories_category
  ON public.article_categories (category_id);

CREATE INDEX IF NOT EXISTS idx_article_tags_article
  ON public.article_tags (article_id);

CREATE INDEX IF NOT EXISTS idx_article_tags_tag
  ON public.article_tags (tag_id);


