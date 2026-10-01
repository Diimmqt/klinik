"use client";

import { Users, Hash } from "lucide-react";

interface WeeklyCount {
  day: string;
  count: number;
}

interface Props {
  total: number;
  nextQueue: string;
  weekly: WeeklyCount[];
}

export default function DashboardClient({ total, nextQueue, weekly }: Props) {
  // Simple sparkline — no chart library needed
  const max = Math.max(...weekly.map((w) => w.count), 1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Selamat datang di Sistem Antrean Klinik
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-5 mb-8 max-w-lg">
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 shadow-lg shadow-violet-900/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <span className="text-violet-200 text-xs font-medium">
              Pasien Hari Ini
            </span>
          </div>
          <p className="text-4xl font-black text-white">{total}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 shadow-lg shadow-amber-900/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Hash size={16} className="text-white" />
            </div>
            <span className="text-amber-100 text-xs font-medium">
              Antrian Berikutnya
            </span>
          </div>
          <p className="text-4xl font-black text-white tracking-wide">
            {nextQueue}
          </p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-2xl">
        <h2 className="text-sm font-semibold text-slate-300 mb-5">
          Pasien 7 Hari Terakhir
        </h2>

        {weekly.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">
            Belum ada data mingguan
          </p>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {weekly.map((w) => (
              <div key={w.day} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className="w-full bg-emerald-500/80 rounded-t-md transition-all duration-500 hover:bg-emerald-400 min-h-[4px]"
                  style={{ height: `${(w.count / max) * 100}%` }}
                  title={`${w.count} pasien`}
                />
                <span className="text-xs text-slate-500 truncate w-full text-center">
                  {new Date(w.day).toLocaleDateString("id-ID", {
                    weekday: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-4 mt-6 max-w-2xl">
        {[
          {
            href: "/queue",
            label: "Kelola Antrean",
            desc: "Lihat dan update status pasien",
            color: "from-emerald-600 to-teal-700",
            shadow: "shadow-emerald-900/30",
          },
          {
            href: "/register",
            label: "Daftar Pasien",
            desc: "Tambahkan pasien baru ke antrean",
            color: "from-sky-600 to-blue-700",
            shadow: "shadow-sky-900/30",
          },
          {
            href: "/history",
            label: "Riwayat Hari Ini",
            desc: "Lihat pasien yang sudah selesai",
            color: "from-amber-600 to-orange-700",
            shadow: "shadow-amber-900/30",
          },
        ].map(({ href, label, desc, color, shadow }) => (
          <a
            key={href}
            href={href}
            className={`bg-gradient-to-br ${color} rounded-2xl p-5 shadow-lg ${shadow} hover:scale-105 transition-transform duration-200 block`}
          >
            <p className="font-bold text-white text-sm mb-1">{label}</p>
            <p className="text-white/70 text-xs leading-snug">{desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
