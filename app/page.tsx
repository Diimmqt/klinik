import { supabase } from "@/lib/supabase";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

async function getStats() {
  const today = new Date().toISOString().split("T")[0];

  const { data: antreanHariIni } = await supabase
    .from("antrean_pasien")
    .select("id, status, waktu_pendaftaran, nomor_antrean")
    .gte("waktu_pendaftaran", `${today}T00:00:00`)
    .lte("waktu_pendaftaran", `${today}T23:59:59`)
    .order("waktu_pendaftaran", { ascending: true });

  const total = antreanHariIni?.length ?? 0;

  // Next queue number (next Menunggu)
  const nextQueue = antreanHariIni?.find((a) => a.status === "Menunggu");

  // Last 7 days count for mini chart
  const { data: weekly } = await supabase.rpc("get_weekly_counts");

  return { total, nextQueue: nextQueue?.nomor_antrean ?? "-", weekly: weekly ?? [] };
}

export default async function DashboardPage() {
  const { total, nextQueue, weekly } = await getStats();

  return <DashboardClient total={total} nextQueue={nextQueue} weekly={weekly} />;
}
