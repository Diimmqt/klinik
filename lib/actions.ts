"use server";

import { pool, type AntreanPasien, type StatusAntrean } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

/** Mengambil statistik dashboard: total pasien hari ini, antrean berikutnya, dan riwayat mingguan */
export async function getDashboardStats() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, status, waktu_pendaftaran, nomor_antrean 
     FROM antrean_pasien 
     WHERE waktu_pendaftaran >= CURDATE() AND waktu_pendaftaran < CURDATE() + INTERVAL 1 DAY 
     ORDER BY waktu_pendaftaran ASC`
  );

  const total = rows.length;
  const nextQueue = rows.find((r) => r.status === "Menunggu");

  const [weeklyRows] = await pool.query<RowDataPacket[]>(
    `SELECT DATE_FORMAT(waktu_pendaftaran, '%Y-%m-%d') as day, COUNT(*) as count 
     FROM antrean_pasien 
     WHERE waktu_pendaftaran >= CURDATE() - INTERVAL 6 DAY 
     GROUP BY DATE_FORMAT(waktu_pendaftaran, '%Y-%m-%d') 
     ORDER BY day ASC`
  );

  const weeklyMap = new Map<string, number>();
  weeklyRows.forEach((r) => weeklyMap.set(String(r.day), Number(r.count)));

  const weekly: { day: string; count: number }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dateNum = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${dateNum}`;
    weekly.push({
      day: dateStr,
      count: weeklyMap.get(dateStr) ?? 0,
    });
  }

  return {
    total,
    nextQueue: nextQueue ? (nextQueue.nomor_antrean as string) : "-",
    weekly,
  };
}

/** Mengambil daftar antrean aktif hari ini (selain status Selesai) */
export async function getActiveQueue(): Promise<AntreanPasien[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, nomor_antrean, nik, nama_pasien, nomor_hp, waktu_pendaftaran, status 
     FROM antrean_pasien 
     WHERE waktu_pendaftaran >= CURDATE() AND waktu_pendaftaran < CURDATE() + INTERVAL 1 DAY 
       AND status IN ('Menunggu', 'Dipanggil', 'Sedang Dilayani') 
     ORDER BY waktu_pendaftaran ASC`
  );
  return rows as AntreanPasien[];
}

/** Mengambil daftar riwayat antrean hari ini yang sudah berstatus Selesai */
export async function getHistoryQueue(): Promise<AntreanPasien[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, nomor_antrean, nik, nama_pasien, nomor_hp, waktu_pendaftaran, status 
     FROM antrean_pasien 
     WHERE waktu_pendaftaran >= CURDATE() AND waktu_pendaftaran < CURDATE() + INTERVAL 1 DAY 
       AND status = 'Selesai' 
     ORDER BY waktu_pendaftaran DESC`
  );
  return rows as AntreanPasien[];
}

/** Mendaftarkan pasien baru dan meng-generate nomor antrean otomatis (A-00X) */
export async function registerPatient(data: {
  nama_pasien: string;
  nik: string;
  nomor_hp: string;
}) {
  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as count 
     FROM antrean_pasien 
     WHERE waktu_pendaftaran >= CURDATE() AND waktu_pendaftaran < CURDATE() + INTERVAL 1 DAY`
  );
  const count = Number(countRows[0]?.count ?? 0);
  const nomor_antrean = `A-${String(count + 1).padStart(3, "0")}`;

  await pool.query<ResultSetHeader>(
    `INSERT INTO antrean_pasien (nomor_antrean, nik, nama_pasien, nomor_hp, status, waktu_pendaftaran) 
     VALUES (?, ?, ?, ?, 'Menunggu', NOW())`,
    [nomor_antrean, data.nik, data.nama_pasien, data.nomor_hp]
  );

  return { success: true, nomor_antrean };
}

/** Mengubah status antrean pasien (Menunggu -> Dipanggil -> Dilayani -> Selesai) */
export async function updateQueueStatus(id: number, status: StatusAntrean) {
  await pool.query<ResultSetHeader>(
    `UPDATE antrean_pasien SET status = ? WHERE id = ?`,
    [status, id]
  );
  return { success: true };
}

/** Menghapus data pasien dari daftar antrean */
export async function deleteQueueItem(id: number) {
  await pool.query<ResultSetHeader>(
    `DELETE FROM antrean_pasien WHERE id = ?`,
    [id]
  );
  return { success: true };
}
