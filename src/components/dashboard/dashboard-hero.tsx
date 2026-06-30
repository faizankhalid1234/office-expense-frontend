"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, BarChart3 } from "lucide-react";
import { CompanyLogoMark } from "@/components/brand/company-logo";

interface DashboardHeroProps {
  firstName: string;
  today: string;
}

export function DashboardHero({ firstName, today }: DashboardHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="welcome-strip soft-card flex flex-col gap-3 p-4 sm:gap-5 sm:p-5 md:flex-row md:items-center md:justify-between md:p-6 lg:p-7"
    >
      <div className="flex min-w-0 items-center gap-3 sm:items-start sm:gap-4">
        <CompanyLogoMark size="lg" className="h-11 w-11 sm:h-14 sm:w-14" />
        <div className="min-w-0">
          <p className="truncate text-[11px] text-muted-foreground sm:text-sm">{today}</p>
          <h1 className="mt-0.5 text-lg font-bold tracking-tight text-foreground sm:mt-1 sm:text-2xl md:text-3xl lg:text-4xl">
            Hello, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="mt-1 hidden text-xs text-muted-foreground sm:block sm:text-sm md:text-base">
            Tap menu for dashboard sections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-row">
        <Link
          href="/dashboard/quick-add"
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:min-h-11 sm:rounded-full sm:gap-2 sm:px-5 sm:text-sm md:text-base"
        >
          <Plus className="h-4 w-4 shrink-0" />
          Quick Add
        </Link>
        <Link
          href="/reports"
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted/50 sm:min-h-11 sm:rounded-full sm:gap-2 sm:px-5 sm:text-sm md:text-base"
        >
          <BarChart3 className="h-4 w-4 shrink-0 text-primary" />
          Reports
        </Link>
      </div>
    </motion.div>
  );
}
