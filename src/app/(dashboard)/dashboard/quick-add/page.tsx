import { QuickExpenseWrapper } from "@/components/dashboard/quick-expense-wrapper";
import { SectionHeader } from "@/components/dashboard/section-header";

export default function DashboardQuickAddPage() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Quick Add"
        description="Record fuel in seconds"
      />
      <QuickExpenseWrapper />
    </div>
  );
}
