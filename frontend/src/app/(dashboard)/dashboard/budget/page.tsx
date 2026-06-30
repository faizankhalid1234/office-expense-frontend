import { SectionHeader } from "@/components/dashboard/section-header";
import { requireUser } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";
import Link from "next/link";

export default async function DashboardBudgetPage() {
  await requireUser();
  const stats = await serverApi<{
    budget: { amount: number; used: number; remaining: number; percentage: number } | null;
  }>("/api/dashboard/stats");

  const budget = stats.budget;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Budget"
        description="Company spending vs monthly limit"
        action={
          <Link href="/budget" className="text-xs font-medium text-primary hover:underline">
            View Budget →
          </Link>
        }
      />
      {budget ? (
        <div className="admin-stat-card rounded-2xl border border-border/50 bg-card/60 p-6">
          <p className="text-sm text-muted-foreground">Used this month</p>
          <p className="mt-2 text-3xl font-bold">
            Rs {Math.round(budget.used).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            of Rs {Math.round(budget.amount).toLocaleString()} ({budget.percentage.toFixed(1)}%)
          </p>
          <div className="mt-4 h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, budget.percentage)}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No budget set for this month.</p>
      )}
    </div>
  );
}
