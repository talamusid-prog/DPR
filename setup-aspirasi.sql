-- Setup table for public aspirations (masukan/aspirasi)
-- Run this in Supabase SQL Editor

-- Create table
CREATE TABLE IF NOT EXISTS public.aspirations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  kategori TEXT NOT NULL,
  aspirasi TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'baru' CHECK (status IN ('baru','diproses','selesai'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_aspirations_created_at ON public.aspirations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_aspirations_status ON public.aspirations(status);

-- RLS
ALTER TABLE public.aspirations ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public can insert aspirations" ON public.aspirations;
DROP POLICY IF EXISTS "Admins can manage aspirations" ON public.aspirations;

-- Allow anyone to insert (public form submissions)
CREATE POLICY "Public can insert aspirations" ON public.aspirations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (admin) to read/update/delete
CREATE POLICY "Admins can manage aspirations" ON public.aspirations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_aspirations_updated_at ON public.aspirations;
CREATE TRIGGER trg_update_aspirations_updated_at
BEFORE UPDATE ON public.aspirations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Done
SELECT 'Aspirations table ready' AS message;


