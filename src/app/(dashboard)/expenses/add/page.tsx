import { ExpenseForm } from "@/components/expenses/expense-form";
import { QuickExpense } from "@/components/expenses/quick-expense";
import { serverApiPublic } from "@/lib/server-api";
import { Separator } from "@/components/ui/separator";

export default async function AddExpensePage() {
  const categories = await serverApiPublic<Array<{ id: string; name: string; color: string }>>(
    "/api/categories"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Expense</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Quickly add fuel or any other expense
        </p>
      </div>

      <QuickExpense categories={categories} />

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or use detailed form</span>
        <Separator className="flex-1" />
      </div>

      <ExpenseForm categories={categories} />
    </div>
  );
}
