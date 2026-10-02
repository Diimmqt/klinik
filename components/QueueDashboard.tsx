"use client";

import { useEffect, useState, useCallback } from "react";
import { type AntreanPasien, type StatusAntrean } from "@/lib/db";
import { getActiveQueue, updateQueueStatus, deleteQueueItem } from "@/lib/actions";
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
  Menunggu: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Dipanggil: "bg-blue-50 text-blue-700 border border-blue-200",
  "Sedang Dilayani": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Selesai: "bg-slate-100 text-slate-500 border border-slate-200",
};

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

/** Komponen interaktif untuk menampilkan dan mengelola tabel antrean pasien hari ini */
export default function QueueDashboard() {
  const [queue, setQueue] = useState<AntreanPasien[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const data = await getActiveQueue();
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  async function updateStatus(id: number, currentStatus: StatusAntrean) {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    setActionLoading(id);
    try {
      await updateQueueStatus(id, next);
      await fetchQueue();
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteAntrean(id: number) {
    if (!confirm("Hapus pasien ini dari antrean?")) return;
    setActionLoading(id);
    try {
      await deleteQueueItem(id);
      await fetchQueue();
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            {queue.length} pasien aktif hari ini
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchQueue}
            id="btn-refresh-queue"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <Link
            href="/register"
            id="btn-add-patient"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-100"
          >
            <Plus size={14} />
            Tambah Pasien
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-sm">
            <Loader2 size={18} className="animate-spin text-blue-500" />
            Memuat antrean...
          </div>
        ) : queue.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">Belum ada antrean aktif hari ini</p>
            <Link
              href="/register"
              className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Daftarkan pasien pertama
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-left">
                {["No. Antrean", "Nama Pasien", "NIK", "No HP", "Waktu Daftar", "Status", "Aksi"].map(
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
              {queue.map((p) => {
                const ActionIcon = ACTION_ICON[p.status];
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-blue-600">
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
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all disabled:opacity-50"
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50"
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
