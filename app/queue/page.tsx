import type { Metadata } from "next";
import QueueDashboard from "@/components/QueueDashboard";

export const metadata: Metadata = {
  title: "Antrean | Klinik",
  description: "Kelola daftar antrean pasien hari ini secara real-time.",
};

export default function QueuePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Antrean</h1>
        <p className="text-slate-500 text-sm mt-1">
          Pantau dan kelola status antrean pasien hari ini
        </p>
      </div>
      <QueueDashboard />
    </div>
  );
}
