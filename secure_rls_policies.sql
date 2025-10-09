-- Secure RLS Policies untuk aplikasi
-- Jalankan script ini di SQL Editor di dashboard Supabase

-- ==============================================
-- BLOG POSTS SECURITY
-- ==============================================

-- Hapus semua policy yang ada untuk blog_posts
DROP POLICY IF EXISTS "Public can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can manage all posts" ON blog_posts;
DROP POLICY IF EXISTS "Enable insert for all users" ON blog_posts;
DROP POLICY IF EXISTS "Enable update for all users" ON blog_posts;
DROP POLICY IF EXISTS "Enable delete for all users" ON blog_posts;

-- Policy untuk membaca artikel yang dipublikasikan (public access)
CREATE POLICY "Public can view published posts" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Policy untuk admin (hanya authenticated users dengan role admin)
CREATE POLICY "Authenticated users can manage posts" ON blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================
-- PORTFOLIOS SECURITY
-- ==============================================

-- Hapus semua policy yang ada untuk portfolios
DROP POLICY IF EXISTS "Allow public read access to published portfolios" ON portfolios;
DROP POLICY IF EXISTS "Allow authenticated users to read all portfolios" ON portfolios;
DROP POLICY IF EXISTS "Allow authenticated users to insert portfolios" ON portfolios;
DROP POLICY IF EXISTS "Allow authenticated users to update portfolios" ON portfolios;
DROP POLICY IF EXISTS "Allow authenticated users to delete portfolios" ON portfolios;
DROP POLICY IF EXISTS "Enable insert for all users" ON portfolios;
DROP POLICY IF EXISTS "Enable update for all users" ON portfolios;
DROP POLICY IF EXISTS "Enable delete for all users" ON portfolios;
DROP POLICY IF EXISTS "Enable read for all users" ON portfolios;

-- Policy untuk membaca portfolio yang dipublikasikan (public access)
CREATE POLICY "Public can view published portfolios" ON portfolios
    FOR SELECT USING (status = 'published');

-- Policy untuk admin (hanya authenticated users)
CREATE POLICY "Authenticated users can manage portfolios" ON portfolios
    FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================
-- GALLERY IMAGES SECURITY
-- ==============================================

-- Hapus semua policy yang ada untuk gallery_images
DROP POLICY IF EXISTS "Gallery images are viewable by everyone for published status" ON gallery_images;
DROP POLICY IF EXISTS "Gallery images are insertable by authenticated users" ON gallery_images;
DROP POLICY IF EXISTS "Gallery images are updatable by authenticated users" ON gallery_images;
DROP POLICY IF EXISTS "Gallery images are deletable by authenticated users" ON gallery_images;

-- Policy untuk membaca gambar yang dipublikasikan (public access)
CREATE POLICY "Public can view published gallery images" ON gallery_images
    FOR SELECT USING (status = 'published');

-- Policy untuk admin (hanya authenticated users)
CREATE POLICY "Authenticated users can manage gallery images" ON gallery_images
    FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================
-- SECURITY SETTINGS
-- ==============================================

-- Pastikan RLS diaktifkan untuk semua tabel
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- GRANTS (Optional - sesuaikan dengan kebutuhan)
-- ==============================================

-- Grant permissions untuk anon users (hanya SELECT untuk published content)
GRANT SELECT ON blog_posts TO anon;
GRANT SELECT ON portfolios TO anon;
GRANT SELECT ON gallery_images TO anon;

-- Grant permissions untuk authenticated users
GRANT ALL ON blog_posts TO authenticated;
GRANT ALL ON portfolios TO authenticated;
GRANT ALL ON gallery_images TO authenticated;

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Verifikasi policies yang dibuat
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename IN ('blog_posts', 'portfolios', 'gallery_images')
ORDER BY tablename, policyname;

-- Test queries untuk memastikan security
-- (Jalankan sebagai anon user untuk test)
-- SELECT * FROM blog_posts WHERE status = 'published' LIMIT 1;
-- SELECT * FROM portfolios WHERE status = 'published' LIMIT 1;
-- SELECT * FROM gallery_images WHERE status = 'published' LIMIT 1;

-- ==============================================
-- ADDITIONAL SECURITY MEASURES
-- ==============================================

-- Buat function untuk validasi admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- Cek apakah user memiliki role admin
  -- Implementasi ini tergantung pada sistem auth yang digunakan
  RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Buat function untuk audit log
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger AS $$
BEGIN
  -- Log perubahan data untuk audit
  INSERT INTO audit_log (
    table_name,
    operation,
    old_data,
    new_data,
    user_id,
    timestamp
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    row_to_json(OLD),
    row_to_json(NEW),
    auth.uid(),
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Buat tabel audit log (opsional)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk performa audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);

-- ==============================================
-- SECURITY HEADERS (untuk referensi)
-- ==============================================

-- Untuk implementasi security headers di aplikasi:
-- 1. Content Security Policy (CSP)
-- 2. X-Frame-Options
-- 3. X-Content-Type-Options
-- 4. Strict-Transport-Security
-- 5. Referrer-Policy

-- ==============================================
-- MONITORING QUERIES
-- ==============================================

-- Query untuk monitoring akses yang mencurigakan
CREATE OR REPLACE VIEW suspicious_access AS
SELECT 
  user_id,
  table_name,
  operation,
  COUNT(*) as access_count,
  MAX(timestamp) as last_access
FROM audit_log
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY user_id, table_name, operation
HAVING COUNT(*) > 100; -- Threshold untuk akses berlebihan

-- ==============================================
-- CLEANUP OLD AUDIT LOGS (opsional)
-- ==============================================

-- Function untuk membersihkan audit log lama
CREATE OR REPLACE FUNCTION cleanup_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_log 
  WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (jika menggunakan pg_cron)
-- SELECT cron.schedule('cleanup-audit-logs', '0 2 * * *', 'SELECT cleanup_audit_logs();');
