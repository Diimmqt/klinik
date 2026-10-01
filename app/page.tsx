import { getDashboardStats } from "@/lib/actions";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { total, nextQueue, weekly } = await getDashboardStats();

  return <DashboardClient total={total} nextQueue={nextQueue} weekly={weekly} />;
}
