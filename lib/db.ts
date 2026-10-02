import mysql from "mysql2/promise";

/**
 * Menyimpan instance koneksi pool secara global agar tidak terjadi
 * kebocoran memori (memory leak) saat Next.js melakukan hot-reload di development.
 */
const globalForDb = globalThis as unknown as {
  pool: mysql.Pool | undefined;
};

export const pool =
  globalForDb.pool ??
  mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "klinik",
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export type StatusAntrean =
  | "Menunggu"
  | "Dipanggil"
  | "Sedang Dilayani"
  | "Selesai";

export interface AntreanPasien {
  id: number;
  nomor_antrean: string;
  nik: string;
  nama_pasien: string;
  nomor_hp: string;
  waktu_pendaftaran: string;
  status: StatusAntrean;
}
