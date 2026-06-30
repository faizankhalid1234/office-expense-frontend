import { CategoryPieChart, MonthlyBarChart } from "@/components/dashboard/charts";
import { SectionHeader } from "@/components/dashboard/section-header";
import { requireUser } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import Link from "next/link";

export default async function DashboardAnalyticsPage() {
  await requireUser();
  const stats = await serverApi<{
    monthlyData: Array<{ month: string; amount: number }>;
    categoryData: Array<{ name: string; value: number; color: string }>;
  }>("/api/dashboard/stats");

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics"
        description="Monthly trends and category distribution"
        action={
          <Link href="/reports" className="text-xs font-medium text-primary hover:underline">
            Full Reports →
          </Link>
        }
      />
      <MonthlyBarChart data={stats.monthlyData} />
      <CategoryPieChart data={stats.categoryData} />
    </div>
  );
}
