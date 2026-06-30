import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-bg flex min-h-screen min-h-[100dvh] w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main
          className="safe-px mobile-main-pb flex-1 overflow-x-hidden bg-background/50 py-3 text-foreground sm:py-4 md:px-6 md:py-6 md:pb-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
