import type { Metadata } from "next";
import HistoryTable from "@/components/HistoryTable";

export const metadata: Metadata = {
  title: "Riwayat Antrean | Klinik",
  description: "Riwayat antrean pasien yang telah selesai dilayani hari ini.",
};

export default function HistoryPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Riwayat Antrean Hari Ini
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Daftar pasien yang telah selesai dilayani
        </p>
      </div>
      <HistoryTable />
    </div>
  );
}
