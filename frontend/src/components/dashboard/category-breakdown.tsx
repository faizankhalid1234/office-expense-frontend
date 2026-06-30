"use client";

import { motion } from "framer-motion";
import { CurrencyAmount } from "@/components/currency/currency-amount";

interface CategoryItem {
  name: string;
  value: number;
  color: string;
}

export function CategoryBreakdown({ data, total }: { data: CategoryItem[]; total: number }) {
  if (!data.length) {
    return (
      <div className="soft-card flex h-40 items-center justify-center text-sm text-muted-foreground">
        No expenses this month
      </div>
    );
  }

  return (
    <div className="soft-card overflow-hidden">
      <div className="border-b border-border/40 px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Category Breakdown</h3>
        <p className="text-xs text-muted-foreground">Where your money went</p>
      </div>
      <div className="space-y-1 p-3">
        {data.map((cat, i) => {
          const pct = total > 0 ? (cat.value / total) * 100 : 0;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl px-3 py-2.5 transition-colors hover:bg-muted/40"
            >
              <div className="mb-1.5 flex items-start justify-between gap-2 sm:items-center">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate text-sm font-medium text-foreground">{cat.name}</span>
                </div>
                <div className="shrink-0 text-right">
                  <CurrencyAmount amount={cat.value} currency="PKR" size="sm" responsiveStack />
                  <span className="mt-0.5 block text-[10px] text-muted-foreground sm:mt-0 sm:inline sm:ml-1 sm:text-xs">
                    {pct.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
