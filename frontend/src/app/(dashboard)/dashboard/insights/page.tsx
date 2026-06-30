import { InsightCards } from "@/components/dashboard/insight-cards";
import { SectionHeader } from "@/components/dashboard/section-header";
import { requireUser } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";

export default async function DashboardInsightsPage() {
  await requireUser();
  const stats = await serverApi<{
    monthCount: number;
    highestCategory: { name: string; value: number; color: string } | null;
    totals: { month: number };
    lastMonthTotal: number;
    budget: { remaining: number } | null;
  }>("/api/dashboard/stats");

  return (
    <div className="space-y-4">
      <SectionHeader title="Insights" description="Key highlights at a glance" />
      <InsightCards
        monthCount={stats.monthCount}
        highestCategory={stats.highestCategory}
        monthTotal={stats.totals.month}
        lastMonthTotal={stats.lastMonthTotal}
        budgetRemaining={stats.budget?.remaining ?? null}
      />
    </div>
  );
}
