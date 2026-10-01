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
