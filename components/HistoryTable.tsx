"use client";

import { useEffect, useState, useCallback } from "react";
import { type AntreanPasien } from "@/lib/db";
import { getHistoryQueue } from "@/lib/actions";
import { Loader2, RefreshCw, ClipboardCheck } from "lucide-react";

export default function HistoryTable() {
  const [history, setHistory] = useState<AntreanPasien[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getHistoryQueue();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-slate-500">
            {history.length} pasien selesai hari ini
          </span>
        </div>
        <button
          onClick={fetchHistory}
          id="btn-refresh-history"
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-all shadow-sm"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-sm">
            <Loader2 size={18} className="animate-spin text-blue-500" />
            Memuat riwayat...
          </div>
        ) : history.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">
              Belum ada pasien yang selesai dilayani hari ini
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-left">
                {["No. Antrean", "Nama Pasien", "NIK", "No HP", "Waktu Daftar", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/70 transition-colors duration-150"
                >
                  <td className="px-5 py-4 font-mono font-bold text-slate-600">
                    {p.nomor_antrean}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {p.nama_pasien}
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-mono text-xs">
                    {p.nik}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{p.nomor_hp}</td>
                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {new Date(p.waktu_pendaftaran).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
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
