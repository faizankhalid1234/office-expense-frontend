"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardNavItems } from "@/lib/dashboard-nav-items";

function isNavActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

export function DashboardSubNav() {
  const pathname = usePathname();

  return (
    <aside className="relative z-20 hidden w-full shrink-0 md:block md:w-52 lg:w-60 xl:w-64">
      <nav
        className={cn(
          "soft-card flex gap-1.5 overflow-x-auto p-2",
          "snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "md:sticky md:top-[68px] md:flex-col md:gap-0.5 md:overflow-visible md:p-3 lg:top-[72px]"
        )}
      >
        <p className="hidden px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground md:block">
          Menu
        </p>

        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (active) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={cn(
                "flex shrink-0 snap-start cursor-pointer transition-all pointer-events-auto",
                "min-h-[60px] min-w-[72px] flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-2",
                "md:min-h-0 md:min-w-0 md:w-full md:flex-row md:items-start md:gap-2.5 md:rounded-xl md:px-3 md:py-2.5 lg:gap-3 lg:py-3",
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted/30 text-foreground hover:bg-muted/60 md:bg-transparent active:scale-95"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 pointer-events-none md:mt-0.5 md:h-4 md:w-4 lg:h-5 lg:w-5",
                  active ? "text-primary-foreground" : "text-primary"
                )}
              />
              <span className="min-w-0 flex-1 pointer-events-none text-center md:text-left">
                <span
                  className={cn(
                    "block text-[11px] font-semibold whitespace-nowrap md:text-sm lg:text-base",
                    active ? "text-white" : "text-foreground"
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "hidden text-xs text-muted-foreground lg:block lg:text-sm",
                    active && "text-white/80"
                  )}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
