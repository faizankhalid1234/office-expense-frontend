import { CategoriesManager } from "@/components/categories/categories-manager";
import { serverApi } from "@/lib/server-api";

export default async function CategoriesPage() {
  const categories = await serverApi<
    Array<{
      id: string;
      name: string;
      color: string;
      description?: string | null;
      isDefault: boolean;
      _count: { expenses: number };
    }>
  >("/api/categories");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage expense categories</p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
