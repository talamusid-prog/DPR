-- RLS setup for article ecosystem
-- Safe/idempotent: checks existing policies before creating

-- Enable RLS on core tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Optional: enforce RLS strictly
ALTER TABLE public.articles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.tags FORCE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags FORCE ROW LEVEL SECURITY;
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;

-- Helper: create policy if not exists
CREATE OR REPLACE FUNCTION public._create_policy_if_missing(
  p_policy_name text,
  p_table regclass,
  p_cmd text,
  p_role name,
  p_using text,
  p_check text DEFAULT NULL
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = split_part(p_table::text, '.', 2)
      AND policyname = p_policy_name
  ) THEN
    EXECUTE format(
      'CREATE POLICY %I ON %s FOR %s TO %I USING (%s)%s',
      p_policy_name,
      p_table,
      p_cmd,
      p_role,
      COALESCE(p_using, 'true'),
      CASE WHEN p_check IS NOT NULL THEN format(' WITH CHECK (%s)', p_check) ELSE '' END
    );
  END IF;
END; $$;

-- Articles policies
-- Public/Authenticated can SELECT only published articles
SELECT public._create_policy_if_missing(
  'articles_select_published_anon', 'public.articles', 'SELECT', 'anon',
  'status = ''published''', NULL
);
SELECT public._create_policy_if_missing(
  'articles_select_published_auth', 'public.articles', 'SELECT', 'authenticated',
  'status = ''published''', NULL
);

-- By default, block INSERT/UPDATE/DELETE for anon/authenticated (no policies created)
-- Service role bypasses RLS automatically via Supabase

-- Categories policies (read-only for everyone)
SELECT public._create_policy_if_missing(
  'categories_select_all_anon', 'public.categories', 'SELECT', 'anon', 'true', NULL
);
SELECT public._create_policy_if_missing(
  'categories_select_all_auth', 'public.categories', 'SELECT', 'authenticated', 'true', NULL
);

-- Tags policies (read-only for everyone)
SELECT public._create_policy_if_missing(
  'tags_select_all_anon', 'public.tags', 'SELECT', 'anon', 'true', NULL
);
SELECT public._create_policy_if_missing(
  'tags_select_all_auth', 'public.tags', 'SELECT', 'authenticated', 'true', NULL
);

-- Junction tables: allow reading relations (for filtering/joining)
SELECT public._create_policy_if_missing(
  'article_categories_select_all_anon', 'public.article_categories', 'SELECT', 'anon', 'true', NULL
);
SELECT public._create_policy_if_missing(
  'article_categories_select_all_auth', 'public.article_categories', 'SELECT', 'authenticated', 'true', NULL
);
SELECT public._create_policy_if_missing(
  'article_tags_select_all_anon', 'public.article_tags', 'SELECT', 'anon', 'true', NULL
);
SELECT public._create_policy_if_missing(
  'article_tags_select_all_auth', 'public.article_tags', 'SELECT', 'authenticated', 'true', NULL
);

-- Users table: create a public profile view to avoid exposing emails
CREATE OR REPLACE VIEW public.user_public_profiles AS
SELECT id, name, avatar_url
FROM public.users;

-- RLS on users: block direct access by default (no select policy)
-- But allow selecting from safe view instead
REVOKE ALL ON public.users FROM anon, authenticated;
GRANT SELECT ON public.user_public_profiles TO anon, authenticated;

-- Materialized view: cannot enable RLS; restrict via GRANTs and content filter
-- Ensure MV only contains published rows (already enforced in definition)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_matviews WHERE schemaname = 'public' AND matviewname = 'articles_feed'
  ) THEN
    GRANT SELECT ON public.articles_feed TO anon, authenticated;
  END IF;
END $$;

-- Ensure SELECT privilege is granted so RLS policies can take effect
DO $$ BEGIN
  -- Articles require SELECT for anon/authenticated so RLS policies apply
  PERFORM 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='articles';
  IF FOUND THEN
    GRANT SELECT ON public.articles TO anon, authenticated;
  END IF;
END $$;

-- Optional: tighten default privileges (no-op if already set by Supabase)
-- REVOKE ALL ON public.articles, public.categories, public.tags, public.article_categories, public.article_tags FROM anon, authenticated;
-- GRANT SELECT ON public.categories, public.tags, public.article_categories, public.article_tags TO anon, authenticated;
-- GRANT SELECT ON public.articles TO anon, authenticated; -- RLS still filters rows to published only


