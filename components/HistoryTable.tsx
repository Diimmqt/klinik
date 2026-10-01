"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, type AntreanPasien } from "@/lib/supabase";
import { Loader2, RefreshCw, ClipboardCheck } from "lucide-react";

export default function HistoryTable() {
  const [history, setHistory] = useState<AntreanPasien[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("antrean_pasien")
      .select("*")
      .gte("waktu_pendaftaran", `${today}T00:00:00`)
      .lte("waktu_pendaftaran", `${today}T23:59:59`)
      .eq("status", "Selesai")
      .order("waktu_pendaftaran", { ascending: false });
    setHistory(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel("history-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "antrean_pasien" },
        () => fetchHistory()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchHistory]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={16} className="text-emerald-400" />
          <span className="text-sm text-slate-400">
            {history.length} pasien selesai hari ini
          </span>
        </div>
        <button
          onClick={fetchHistory}
          id="btn-refresh-history"
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
            <Loader2 size={20} className="animate-spin" />
            Memuat riwayat...
          </div>
        ) : history.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-sm">
              Belum ada pasien yang selesai dilayani hari ini
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                {["No. Antrean", "Nama Pasien", "NIK", "No HP", "Waktu Daftar", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-800/30 transition-colors duration-150"
                >
                  <td className="px-5 py-4 font-mono font-bold text-slate-400">
                    {p.nomor_antrean}
                  </td>
                  <td className="px-5 py-4 font-medium text-white">
                    {p.nama_pasien}
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-mono text-xs">
                    {p.nik}
                  </td>
                  <td className="px-5 py-4 text-slate-300">{p.nomor_hp}</td>
                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {new Date(p.waktu_pendaftaran).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-500/15 text-slate-400 border border-slate-500/30">
                      ✓ Selesai
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
