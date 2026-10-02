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

/** Komponen UI untuk menampilkan metrik dan grafik jumlah pasien mingguan */
export default function DashboardClient({ total, nextQueue, weekly }: Props) {
  const max = Math.max(...weekly.map((w) => w.count), 1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Selamat datang di Sistem Antrean Klinik
        </p>
      </div>

      {/* Stat cards — card 1: static violet, card 2: static BLUE */}
      <div className="grid grid-cols-2 gap-5 mb-8 max-w-lg">
        {/* Card 1: Pasien Hari Ini — static violet */}
        <div className="bg-purple-600 rounded-2xl p-5 shadow-lg shadow-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <span className="text-purple-100 text-xs font-medium">
              Pasien Hari Ini
            </span>
          </div>
          <p className="text-4xl font-black text-white">{total}</p>
        </div>

        {/* Card 2: Antrian Berikutnya — static BLUE */}
        <div className="bg-blue-600 rounded-2xl p-5 shadow-lg shadow-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Hash size={16} className="text-white" />
            </div>
            <span className="text-blue-100 text-xs font-medium">
              Antrian Berikutnya
            </span>
          </div>
          <p className="text-4xl font-black text-white tracking-wide">
            {nextQueue}
          </p>
        </div>
      </div>

      {/* Weekly chart — SVG Line Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Pasien 7 Hari Terakhir
        </h2>

        {weekly.length === 0 ? (
          <p className="text-slate-400 text-sm py-8 text-center">
            Belum ada data mingguan
          </p>
        ) : (() => {
          const width = 500;
          const height = 150;
          const paddingX = 35;
          const paddingTop = 25;
          const paddingBottom = 25;
          const graphHeight = height - paddingTop - paddingBottom;
          const graphWidth = width - paddingX * 2;

          const points = weekly.map((w, i) => {
            const x = paddingX + (i * graphWidth) / Math.max(weekly.length - 1, 1);
            const y = height - paddingBottom - (max > 0 ? (w.count / max) * graphHeight : 0);
            return { x, y, count: w.count, day: w.day };
          });

          const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
          const areaPath = `M ${points[0].x} ${height - paddingBottom} ${linePath.substring(1)} L ${points[points.length - 1].x} ${height - paddingBottom} Z`;

          return (
            <div className="w-full">
              <div className="relative w-full">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full h-auto overflow-visible"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0, 0.5, 1].map((ratio) => {
                    const y = height - paddingBottom - ratio * graphHeight;
                    return (
                      <line
                        key={ratio}
                        x1={paddingX}
                        y1={y}
                        x2={width - paddingX}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Area fill */}
                  <path d={areaPath} fill="url(#chartGradient)" />

                  {/* Line stroke */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points & Count Badges */}
                  {points.map((p) => (
                    <g key={p.day} className="group cursor-pointer">
                      {/* Point Circle */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="5"
                        fill="#2563eb"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="transition-all duration-200 group-hover:r-7 group-hover:fill-blue-700"
                      />

                      {/* Count text above point */}
                      {p.count > 0 && (
                        <text
                          x={p.x}
                          y={p.y - 10}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-slate-700 font-sans"
                        >
                          {p.count}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
              </div>

              {/* Day Labels Row */}
              <div className="flex justify-between px-2 mt-3">
                {weekly.map((w) => {
                  const dateObj = new Date(w.day + "T00:00:00");
                  const dayName = dateObj.toLocaleDateString("id-ID", {
                    weekday: "short",
                  });

                  return (
                    <span
                      key={w.day}
                      className="text-xs text-slate-500 font-medium text-center flex-1"
                    >
                      {dayName}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
