import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { requireUser } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import { format } from "date-fns";

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const stats = await serverApi<{
    totals: { today: number; week: number; month: number; year: number };
    lastMonthTotal: number;
  }>("/api/dashboard/stats");

  const monthChange =
    stats.lastMonthTotal > 0
      ? ((stats.totals.month - stats.lastMonthTotal) / stats.lastMonthTotal) * 100
      : 0;

  const firstName = user.name?.split(" ")[0] ?? "there";
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-5 md:space-y-8">
      <DashboardHero firstName={firstName} today={today} />

      <div className="stat-grid">
        <StatCard title="Today" value={stats.totals.today} icon="calendar" index={0} />
        <StatCard title="This Week" value={stats.totals.week} icon="trending" index={1} />
        <StatCard
          title="This Month"
          value={stats.totals.month}
          icon="wallet"
          trend={`${monthChange >= 0 ? "+" : ""}${monthChange.toFixed(1)}%`}
          index={2}
        />
        <StatCard title="This Year" value={stats.totals.year} icon="receipt" index={3} />
      </div>
    </div>
  );
}
