-- Create kegiatan table
CREATE TABLE IF NOT EXISTS kegiatan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('sidang', 'rapat', 'kunjungan', 'acara', 'lainnya')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('terjadwal', 'berlangsung', 'selesai', 'dibatalkan')),
  participants TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kegiatan_date ON kegiatan(date);
CREATE INDEX IF NOT EXISTS idx_kegiatan_type ON kegiatan(type);
CREATE INDEX IF NOT EXISTS idx_kegiatan_status ON kegiatan(status);
CREATE INDEX IF NOT EXISTS idx_kegiatan_created_at ON kegiatan(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kegiatan_updated_at 
    BEFORE UPDATE ON kegiatan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE kegiatan ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only for public, full access for authenticated users)
CREATE POLICY "Public can view kegiatan" ON kegiatan
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert kegiatan" ON kegiatan
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update kegiatan" ON kegiatan
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete kegiatan" ON kegiatan
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data (optional - remove if you don't want sample data)
INSERT INTO kegiatan (title, description, date, time, location, type, status, participants) VALUES
('Sidang Paripurna DPRD', 'Sidang paripurna membahas RAPBD 2024', '2024-01-15', '09:00:00', 'Gedung DPRD Sulawesi Barat', 'sidang', 'terjadwal', ARRAY['Ketua DPRD', 'Wakil Ketua', 'Sekretaris']),
('Rapat Komisi A', 'Rapat membahas kebijakan pendidikan', '2024-01-16', '14:00:00', 'Ruang Komisi A', 'rapat', 'terjadwal', ARRAY[]::text[]),
('Kunjungan Kerja ke Kabupaten', 'Kunjungan ke kabupaten-kabupaten di Sulawesi Barat', '2024-01-20', '08:00:00', 'Mamuju, Sulawesi Barat', 'kunjungan', 'terjadwal', ARRAY[]::text[]),
('Sosialisasi Program', 'Sosialisasi program pembangunan daerah', '2024-01-25', '10:00:00', 'Aula Pemerintah Daerah', 'acara', 'terjadwal', ARRAY['Bupati', 'Tokoh Masyarakat']),
('Rapat Koordinasi', 'Rapat koordinasi antar komisi', '2024-01-30', '13:00:00', 'Ruang Rapat Utama', 'rapat', 'terjadwal', ARRAY[]::text[]);
