"use client";

import { motion } from "framer-motion";
import { Award, ArrowUpRight, ArrowDownRight, Hash, Wallet } from "lucide-react";
import { formatDualCurrency } from "@/lib/utils-format";
import { cn } from "@/lib/utils";

interface InsightCardsProps {
  monthCount: number;
  highestCategory: { name: string; value: number; color: string } | null;
  monthTotal: number;
  lastMonthTotal: number;
  budgetRemaining: number | null;
}

export function InsightCards({
  monthCount,
  highestCategory,
  monthTotal,
  lastMonthTotal,
  budgetRemaining,
}: InsightCardsProps) {
  const comparison =
    lastMonthTotal > 0 ? ((monthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;
  const isUp = comparison >= 0;

  const items = [
    {
      label: "Transactions",
      value: monthCount.toString(),
      icon: Hash,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      label: "Top Category",
      value: highestCategory?.name ?? "—",
      sub: highestCategory ? formatDualCurrency(highestCategory.value, "PKR") : null,
      icon: Award,
      iconBg: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400",
      dot: highestCategory?.color,
    },
    {
      label: "vs Last Month",
      value: `${isUp ? "+" : ""}${comparison.toFixed(1)}%`,
      icon: isUp ? ArrowUpRight : ArrowDownRight,
      iconBg: isUp
        ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    },
    {
      label: "Budget Left",
      value: budgetRemaining !== null ? formatDualCurrency(budgetRemaining, "PKR") : "Not set",
      icon: Wallet,
      iconBg: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
    },
  ];

  return (
    <div className="soft-card divide-y divide-border/40">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/30"
        >
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              item.iconBg
            )}
          >
            <item.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="flex items-center gap-1.5 truncate text-base font-semibold text-foreground md:text-lg">
              {"dot" in item && item.dot && (
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.dot }}
                />
              )}
              {item.value}
            </p>
            {"sub" in item && item.sub && (
              <p className="text-sm text-muted-foreground">{item.sub}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
