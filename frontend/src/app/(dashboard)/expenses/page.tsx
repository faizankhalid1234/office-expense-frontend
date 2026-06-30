import { ExpensesList } from "@/components/expenses/expenses-list";
import { requireUser } from "@/lib/require-user";
import { serverApi, serverApiPublic } from "@/lib/server-api";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ExpensesPage() {
  await requireUser();

  const [expenses, categories] = await Promise.all([
    serverApi<
      Array<{
        id: string;
        title: string;
        amount: number;
        currency: string;
        date: string;
        paymentMethod: string;
        description?: string | null;
        receiptUrl?: string | null;
        receiptName?: string | null;
        categoryId: string;
        category: { id: string; name: string; color: string };
        user: { name: string };
      }>
    >("/api/expenses"),
    serverApiPublic<Array<{ id: string; name: string; color: string }>>("/api/categories"),
  ]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track all office expenses
          </p>
        </div>
        <Link
          href="/expenses/add"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90 sm:w-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Link>
      </div>

      <ExpensesList
        expenses={expenses.map((e) => ({
          ...e,
          currency: e.currency as "PKR" | "CLP",
        }))}
        categories={categories}
      />
    </div>
  );
}
