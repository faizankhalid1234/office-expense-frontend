import { RecentExpenses, type RecentExpense } from "@/components/dashboard/recent-expenses";
import { SectionHeader } from "@/components/dashboard/section-header";
import { requireUser } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";

export default async function DashboardRecentPage() {
  await requireUser();
  const stats = await serverApi<{ recentExpenses: RecentExpense[] }>(
    "/api/dashboard/stats"
  );

  return (
    <div className="space-y-4">
      <SectionHeader title="Recent Expenses" description="Your latest transactions" />
      <RecentExpenses expenses={stats.recentExpenses} />
    </div>
  );
}
