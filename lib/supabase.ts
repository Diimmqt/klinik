import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
