import { DashboardSubNav } from "@/components/dashboard/dashboard-sub-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex w-full min-w-0 flex-col gap-3 md:flex-row md:gap-5 lg:gap-8">
        <DashboardSubNav />
        <div className="relative z-0 min-w-0 w-full flex-1 pb-4 md:pb-6 lg:pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
