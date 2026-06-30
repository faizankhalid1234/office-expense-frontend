import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { SectionHeader } from "@/components/dashboard/section-header";
import { requireUser } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";

export default async function DashboardCategoriesPage() {
  await requireUser();
  const stats = await serverApi<{
    categoryData: Array<{ name: string; value: number; color: string }>;
    totals: { month: number };
  }>("/api/dashboard/stats");

  return (
    <div className="space-y-4">
      <SectionHeader title="Categories" description="Where your money went this month" />
      <CategoryBreakdown data={stats.categoryData} total={stats.totals.month} />
    </div>
  );
}
