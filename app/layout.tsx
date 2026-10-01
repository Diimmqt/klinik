import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Klinik - Sistem Antrean Pasien",
  description:
    "Sistem manajemen antrean pasien klinik berbasis digital. Daftarkan pasien, pantau antrean, dan kelola riwayat kunjungan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
