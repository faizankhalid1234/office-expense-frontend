import { BudgetManager } from "@/components/budget/budget-manager";
import { requireUser } from "@/lib/require-user";
import { serverApi } from "@/lib/server-api";

export default async function BudgetPage() {
  await requireUser();
  const now = new Date();

  const [budgetData, history] = await Promise.all([
    serverApi<{
      budget: { amount: number; currency: string } | null;
      used: number;
      remaining: number;
      percentage: number;
      month: number;
      year: number;
    }>("/api/budget"),
    serverApi<
      Array<{ id: string; month: number; year: number; amount: number; currency: string }>
    >("/api/budget/history"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Budget</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Company monthly budget set by admin
        </p>
      </div>
      <BudgetManager
        readOnly
        current={{
          month: budgetData.month,
          year: budgetData.year,
          amount: budgetData.budget?.amount ?? 0,
          used: budgetData.used,
          remaining: budgetData.remaining,
          percentage: budgetData.percentage,
        }}
        history={history.map((b) => ({
          ...b,
          currency: b.currency as "PKR" | "CLP",
        }))}
      />
    </div>
  );
}
