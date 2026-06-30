"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { CompanyLogo } from "@/components/brand/company-logo";
import { navItems } from "@/lib/nav-items";
import { dashboardNavItems } from "@/lib/dashboard-nav-items";

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isDashboardSubActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname === href || pathname.startsWith(`${href}/`);
}

/** Shared sidebar content — same on desktop & mobile drawer */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const filteredItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="sidebar-gradient flex h-full min-h-full flex-col text-white">
      <div className="shrink-0 px-4 py-4 sm:px-5">
        <CompanyLogo size="md" subtitle="Expense Manager" variant="light" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(pathname, item.href);
          const showDashboardSub = item.href === "/dashboard";

          return (
            <div key={item.href} className="space-y-0.5">
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all sm:text-base",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-white/70 hover:bg-white/8 hover:text-white",
                  item.highlight && !active && "border border-dashed border-primary/40"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>

              {showDashboardSub && (
                <div className="space-y-0.5 pl-3 md:hidden">
                  {dashboardNavItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const subActive = isDashboardSubActive(pathname, sub.href);

                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                          subActive
                            ? "bg-primary text-primary-foreground"
                            : "text-white/60 hover:bg-white/8 hover:text-white"
                        )}
                      >
                        <SubIcon className="h-3.5 w-3.5 shrink-0" />
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="truncate text-xs font-medium text-white">{session?.user?.name ?? "User"}</p>
          <p className="mt-0.5 truncate text-[10px] text-white/50">{session?.user?.email}</p>
          <span className="mt-2 inline-block rounded-full bg-primary/30 px-2 py-0.5 text-[10px] font-semibold text-white/90">
            {session?.user?.role ?? "EMPLOYEE"}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Desktop sidebar — visible md and up */
export function Sidebar() {
  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-white/10 md:flex lg:w-[260px] xl:w-[270px]">
      <SidebarContent />
    </aside>
  );
}
