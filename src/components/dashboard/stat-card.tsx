"use client";

import { motion } from "framer-motion";
import { Calendar, TrendingUp, Wallet, Receipt, LucideIcon } from "lucide-react";
import { CurrencyAmount } from "@/components/currency/currency-amount";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  calendar: Calendar,
  trending: TrendingUp,
  wallet: Wallet,
  receipt: Receipt,
};

const STYLES: Record<string, { bg: string; icon: string; accent: string }> = {
  calendar: {
    bg: "bg-sky-50 dark:bg-sky-500/10",
    icon: "bg-sky-500 text-white",
    accent: "border-sky-200 dark:border-sky-500/20",
  },
  trending: {
    bg: "bg-teal-50 dark:bg-teal-500/10",
    icon: "bg-teal-600 text-white",
    accent: "border-teal-200 dark:border-teal-500/20",
  },
  wallet: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    icon: "bg-emerald-500 text-white",
    accent: "border-emerald-200 dark:border-emerald-500/20",
  },
  receipt: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    icon: "bg-amber-500 text-white",
    accent: "border-amber-200 dark:border-amber-500/20",
  },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof ICONS;
  trend?: string;
  index?: number;
}

export function StatCard({ title, value, icon, trend, index = 0 }: StatCardProps) {
  const Icon = ICONS[icon];
  const style = STYLES[icon];

  const iconBox = (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl shadow-sm",
        "h-9 w-9 sm:h-11 sm:w-11",
        style.icon
      )}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
    </div>
  );

  const trendBadge = trend && (
    <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 sm:px-2.5 sm:py-1 sm:text-xs">
      {trend}
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className={cn("soft-card border p-3 sm:p-4 lg:p-5", style.accent, style.bg)}
    >
      {/* Mobile — compact row */}
      <div className="flex items-center gap-2.5 sm:hidden">
        {iconBox}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
            {trendBadge}
          </div>
          <CurrencyAmount amount={value} currency="PKR" size="sm" stacked />
        </div>
      </div>

      {/* Desktop — card layout */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {iconBox}
          {trendBadge}
        </div>
        <p className="mt-3 text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
        <div className="mt-1">
          <CurrencyAmount amount={value} currency="PKR" size="sm" />
        </div>
      </div>
    </motion.div>
  );
}
