# Klinik — Sistem Antrean Pasien

Aplikasi web manajemen antrean pasien klinik berbasis **Next.js 15** dan **MySQL**.  
Fitur: pendaftaran pasien, generate nomor antrean otomatis, manajemen status antrean, dan riwayat kunjungan harian.

---

## ⚙️ Prasyarat

- Node.js ≥ 18
- npm ≥ 9
- MySQL / MariaDB (lokal via XAMPP, Laragon, Docker, atau cloud)

---

## 🛠️ Cara Instalasi & Setup

### 1. Install dependensi

```bash
npm install
```

### 2. Setup Database MySQL

1. Buat database dan tabel menggunakan file [`setup.sql`](./setup.sql):
   - Lewat phpMyAdmin / MySQL CLI / DBeaver / Navicat: Import file `setup.sql` atau copy-paste isinya dan jalankan.
   - Atau via terminal:
     ```bash
     mysql -u root -p < setup.sql
     ```

### 3. Konfigurasi Environment

Edit file `.env` di root project:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=klinik
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

## 📁 Struktur Proyek

```
klinik/
├── app/
│   ├── actions.ts          # Server actions (query & mutasi MySQL)
│   ├── layout.tsx          # Root layout + sidebar
│   ├── page.tsx            # Dashboard statistik
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
│   └── db.ts               # MySQL connection pool + types
└── setup.sql               # Skrip DDL MySQL
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

---

## ??? Tech Stack & Fungsinya

- **Next.js 15**: Framework React untuk membangun UI, routing (App Router), dan Server Actions (backend logic).
- **React 18**: Library utama untuk membangun komponen antarmuka pengguna interaktif.
- **Tailwind CSS**: Framework CSS utility-first untuk styling komponen secara cepat dan responsif.
- **MySQL (via mysql2)**: Database relasional untuk menyimpan data pasien dan riwayat antrean. mysql2 digunakan sebagai driver penghubung.
- **Lucide React**: Kumpulan ikon SVG ringan yang digunakan di berbagai komponen UI (misal: ikon sidebar, tombol).

---

## ??? Database & Schema

Proyek ini menggunakan **MySQL** dengan satu tabel utama, yaitu \ntrean_pasien\.

**Schema Tabel \ntrean_pasien\**:
- \id\ (INT, PK, Auto Increment): Identifier unik tiap record.
- \
omor_antrean\ (VARCHAR): Nomor antrean yang digenerate otomatis (contoh: A-001).
- \
ik\ (VARCHAR): Nomor Induk Kependudukan pasien.
- \
ama_pasien\ (VARCHAR): Nama lengkap pasien.
- \
omor_hp\ (VARCHAR): Kontak yang bisa dihubungi.
- \waktu_pendaftaran\ (DATETIME): Timestamp kapan pasien mendaftar (default CURRENT_TIMESTAMP).
- \status\ (ENUM): Status antrean saat ini ('Menunggu', 'Dipanggil', 'Sedang Dilayani', 'Selesai').

*(Lihat setup.sql untuk detail DDL)*
