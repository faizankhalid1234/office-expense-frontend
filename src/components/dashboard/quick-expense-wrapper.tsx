import { QuickExpense } from "@/components/expenses/quick-expense";
import { serverApiPublic } from "@/lib/server-api";

export async function QuickExpenseWrapper({ compact }: { compact?: boolean }) {
  const categories = await serverApiPublic<Array<{ id: string; name: string; color: string }>>(
    "/api/categories"
  );
  return <QuickExpense categories={categories} compact={compact} />;
}
