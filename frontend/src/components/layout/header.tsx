"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, Menu, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/brand/company-logo";
import { useMounted } from "@/hooks/use-mounted";
import { format } from "date-fns";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useMounted();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const today = mounted ? format(new Date(), "EEEE, MMM d") : "";
  const firstName = session?.user?.name?.split(" ")[0];

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <header
      className="sticky top-0 z-40 border-b border-border/40 bg-white/90 backdrop-blur-2xl dark:bg-background/90"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="safe-px flex h-14 min-h-[56px] items-center justify-between gap-2 sm:h-[64px] md:h-[68px] md:gap-4 lg:px-8">
        {/* Menu button — same sidebar, opens in drawer on small screens */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="touch-target inline-flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/15"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="left"
              showCloseButton
              className="w-[min(100vw-1rem,300px)] max-w-[88vw] border-0 bg-transparent p-0 [&_[data-slot=sheet-close]]:text-white [&_[data-slot=sheet-close]]:hover:bg-white/10"
            >
              <SidebarContent onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0 flex-1">
            <CompanyLogo
              size="sm"
              showText
              subtitle={firstName ? `Hi, ${firstName}` : "Expense Manager"}
              className="max-w-full"
            />
          </div>
        </div>

        <div className="hidden min-w-0 md:block">
          <p className="text-xs text-muted-foreground lg:text-sm">{today}</p>
          <p className="truncate text-sm font-semibold text-foreground lg:text-base">
            Hello, <span className="gradient-text">{firstName}</span> 👋
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="touch-target hidden rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary sm:inline-flex"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="touch-target relative rounded-xl hover:bg-primary/10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted ? (
              <>
                <Sun className="h-4 w-4 rotate-0 scale-100 text-amber-500 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 text-primary transition-all dark:rotate-0 dark:scale-100" />
              </>
            ) : (
              <Sun className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="touch-target rounded-full outline-none ring-2 ring-transparent transition-all hover:ring-primary/30 focus-visible:ring-primary">
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1 py-1">
                    <span className="font-semibold">{session?.user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {session?.user?.email}
                    </span>
                    <Badge className="mt-1 w-fit bg-primary/15 text-primary">
                      {session?.user?.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled className="rounded-xl">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl text-red-600 focus:text-red-600"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
