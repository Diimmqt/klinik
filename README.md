# Klinik — Sistem Antrean Pasien

Aplikasi web manajemen antrean pasien klinik berbasis **Next.js 15** dan **Supabase**.  
Fitur: pendaftaran pasien, generate nomor antrean otomatis, manajemen status antrean secara realtime, dan riwayat kunjungan harian.

---

## ⚙️ Prasyarat

- Node.js ≥ 18
- npm ≥ 9
- Akun [Supabase](https://supabase.com) (gratis)

---

## 🛠️ Cara Instalasi

### 1. Clone repositori

```bash
git clone <url-repositori>
cd klinik
```

### 2. Install dependensi

```bash
npm install
```

### 3. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Masuk ke **SQL Editor** → klik **New Query**
3. Copy-paste isi file [`supabase/setup.sql`](./supabase/setup.sql) → klik **Run**
4. Aktifkan **Realtime** untuk tabel `antrean_pasien`:  
   `Database → Replication → centang tabel antrean_pasien`

### 4. Konfigurasi environment

Buat file `.env.local` di root project:

```bash
cp .env.local.example .env.local
```

Isi dengan kredensial project Supabase Anda (tersedia di **Project Settings → API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 🚀 Cara Menjalankan

### Mode Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Build Production

```bash
npm run build
npm start
```

---

## ☁️ Deploy ke Vercel

1. Push repositori ke GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repositori
3. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy**

---

## 📁 Struktur Proyek

```
klinik/
├── app/
│   ├── layout.tsx          # Root layout + sidebar
│   ├── page.tsx            # Dashboard
│   ├── register/page.tsx   # Form pendaftaran pasien
│   ├── queue/page.tsx      # Dashboard antrean
│   └── history/page.tsx    # Riwayat antrean
├── components/
│   ├── Sidebar.tsx
│   ├── DashboardClient.tsx
│   ├── RegisterForm.tsx
│   ├── QueueDashboard.tsx
│   └── HistoryTable.tsx
├── lib/
│   └── supabase.ts         # Supabase client + types
└── supabase/
    └── setup.sql           # DDL + fungsi Supabase
```

---

## 🏥 Alur Antrean

```
Pasien Datang
  → Admin isi Form (Nama, NIK, No HP)
  → Nomor antrean di-generate otomatis (A-001, A-002, ...)
  → Status: Menunggu
  → Admin tekan "Panggil" → Status: Dipanggil
  → Admin tekan "Layani" → Status: Sedang Dilayani
  → Admin tekan "Selesai" → Status: Selesai
  → Data berpindah ke Riwayat
```
