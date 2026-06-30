import { notFound } from "next/navigation";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { requireUser } from "@/lib/require-user";
import { serverApi, serverApiPublic } from "@/lib/server-api";

type Params = { params: Promise<{ id: string }> };

export default async function EditExpensePage({ params }: Params) {
  await requireUser();
  const { id } = await params;

  const [expense, categories] = await Promise.all([
    serverApi<{
      id: string;
      title: string;
      amount: number;
      currency: string;
      date: string;
      paymentMethod: string;
      description?: string | null;
      categoryId: string;
      receiptUrl?: string | null;
      receiptName?: string | null;
    }>(`/api/expenses/${id}`),
    serverApiPublic<Array<{ id: string; name: string; color: string }>>("/api/categories"),
  ]);

  if (!expense) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Expense</h1>
        <p className="text-muted-foreground text-sm mt-1">Update expense details</p>
      </div>
      <ExpenseForm
        categories={categories}
        initialData={{
          id: expense.id,
          title: expense.title,
          amount: expense.amount,
          date: expense.date,
          paymentMethod: expense.paymentMethod,
          description: expense.description,
          categoryId: expense.categoryId,
          currency: expense.currency as "PKR" | "CLP",
          receiptUrl: expense.receiptUrl,
          receiptName: expense.receiptName,
        }}
      />
    </div>
  );
}
