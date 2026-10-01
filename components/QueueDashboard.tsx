"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, type AntreanPasien, type StatusAntrean } from "@/lib/supabase";
import {
  Phone,
  Stethoscope,
  CheckCircle2,
  Trash2,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

const STATUS_BADGE: Record<StatusAntrean, string> = {
  Menunggu: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Dipanggil: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "Sedang Dilayani": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Selesai: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

// Only show active (non-completed) queues on this page
const ACTIVE_STATUSES: StatusAntrean[] = ["Menunggu", "Dipanggil", "Sedang Dilayani"];

// Status flow: Menunggu → Dipanggil → Sedang Dilayani → Selesai
const NEXT_STATUS: Partial<Record<StatusAntrean, StatusAntrean>> = {
  Menunggu: "Dipanggil",
  Dipanggil: "Sedang Dilayani",
  "Sedang Dilayani": "Selesai",
};

const ACTION_LABEL: Partial<Record<StatusAntrean, string>> = {
  Menunggu: "Panggil",
  Dipanggil: "Layani",
  "Sedang Dilayani": "Selesai",
};

const ACTION_ICON: Partial<Record<StatusAntrean, typeof Phone>> = {
  Menunggu: Phone,
  Dipanggil: Stethoscope,
  "Sedang Dilayani": CheckCircle2,
};

export default function QueueDashboard() {
  const [queue, setQueue] = useState<AntreanPasien[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchQueue = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("antrean_pasien")
      .select("*")
      .gte("waktu_pendaftaran", `${today}T00:00:00`)
      .lte("waktu_pendaftaran", `${today}T23:59:59`)
      .in("status", ACTIVE_STATUSES)
      .order("waktu_pendaftaran", { ascending: true });
    setQueue(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQueue();

    // Realtime subscription
    const channel = supabase
      .channel("antrean-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "antrean_pasien" },
        () => fetchQueue()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchQueue]);

  async function updateStatus(id: number, currentStatus: StatusAntrean) {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    setActionLoading(id);
    await supabase.from("antrean_pasien").update({ status: next }).eq("id", id);
    setActionLoading(null);
    // Realtime will refresh, but also fetch manually as fallback
    fetchQueue();
  }

  async function deleteAntrean(id: number) {
    if (!confirm("Hapus pasien ini dari antrean?")) return;
    setActionLoading(id);
    await supabase.from("antrean_pasien").delete().eq("id", id);
    setActionLoading(null);
    fetchQueue();
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            {queue.length} pasien aktif hari ini
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchQueue}
            id="btn-refresh-queue"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <Link
            href="/register"
            id="btn-add-patient"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-lg shadow-emerald-900/30"
          >
            <Plus size={14} />
            Tambah Pasien
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
            <Loader2 size={20} className="animate-spin" />
            Memuat antrean...
          </div>
        ) : queue.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-sm">Belum ada antrean aktif hari ini</p>
            <Link
              href="/register"
              className="inline-block mt-3 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              + Daftarkan pasien pertama
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                {["No. Antrean", "Nama Pasien", "NIK", "No HP", "Waktu Daftar", "Status", "Aksi"].map(
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
              {queue.map((p) => {
                const ActionIcon = ACTION_ICON[p.status];
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-800/40 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-emerald-400">
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
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_BADGE[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {NEXT_STATUS[p.status] && (
                          <button
                            onClick={() => updateStatus(p.id, p.status)}
                            disabled={actionLoading === p.id}
                            id={`btn-action-${p.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all disabled:opacity-50"
                          >
                            {actionLoading === p.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : ActionIcon ? (
                              <ActionIcon size={12} />
                            ) : null}
                            {ACTION_LABEL[p.status]}
                          </button>
                        )}
                        <button
                          onClick={() => deleteAntrean(p.id)}
                          disabled={actionLoading === p.id}
                          id={`btn-delete-${p.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all disabled:opacity-50"
                        >
                          <Trash2 size={12} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
