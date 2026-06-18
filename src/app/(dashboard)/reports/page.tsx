import { ReportsView } from "@/components/reports/reports-view";
import { requireUser } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";

type ReportData = {
  month: number;
  year: number;
  total: number;
  breakdown: { name: string; color?: string; total: number }[];
  highest: { name: string; total: number } | null;
  prevMonthTotal: number;
  comparison: number;
  expenses: Array<{
    id: string;
    title: string;
    amount: number;
    currency?: "PKR" | "CLP";
    date: string;
    paymentMethod: string;
    category: { name: string };
  }>;
};

export default async function ReportsPage() {
  await requireUser();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [report, trendData] = await Promise.all([
    serverApi<ReportData>(`/api/reports?month=${month}&year=${year}`),
    serverApi<Array<{ date: string; amount: number }>>("/api/dashboard/trends"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monthly expense reports and analytics
        </p>
      </div>
      <ReportsView
        initialReport={report}
        trendData={trendData}
        initialMonth={month}
        initialYear={year}
      />
    </div>
  );
}
