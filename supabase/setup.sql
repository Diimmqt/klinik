-- Jalankan SQL ini di Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste > Run

-- 1. Tabel utama antrean pasien
CREATE TABLE IF NOT EXISTS antrean_pasien (
  id                 SERIAL PRIMARY KEY,
  nomor_antrean      VARCHAR(10)  NOT NULL,
  nik                VARCHAR(16)  NOT NULL,
  nama_pasien        VARCHAR(255) NOT NULL,
  nomor_hp           VARCHAR(20)  NOT NULL,
  waktu_pendaftaran  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  status             VARCHAR(20)  NOT NULL DEFAULT 'Menunggu'
    CHECK (status IN ('Menunggu', 'Dipanggil', 'Sedang Dilayani', 'Selesai'))
);

-- 2. Index untuk query hari ini yang sering dipakai
CREATE INDEX IF NOT EXISTS idx_waktu_pendaftaran
  ON antrean_pasien (waktu_pendaftaran DESC);

CREATE INDEX IF NOT EXISTS idx_status
  ON antrean_pasien (status);

-- 3. Fungsi helper: jumlah pasien per hari (7 hari terakhir) untuk chart dashboard
CREATE OR REPLACE FUNCTION get_weekly_counts()
RETURNS TABLE(day DATE, count BIGINT)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    DATE(waktu_pendaftaran AT TIME ZONE 'Asia/Jakarta') AS day,
    COUNT(*)                                             AS count
  FROM antrean_pasien
  WHERE waktu_pendaftaran >= NOW() - INTERVAL '7 days'
  GROUP BY 1
  ORDER BY 1;
$$;

-- 4. Enable Realtime untuk tabel antrean_pasien
-- (lakukan di Dashboard: Database > Replication > lalu centang antrean_pasien)
-- Atau jalankan:
ALTER TABLE antrean_pasien REPLICA IDENTITY FULL;