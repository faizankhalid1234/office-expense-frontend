"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";
import { CurrencyAmount } from "@/components/currency/currency-amount";
import { formatDate } from "@/lib/utils-format";
import type { CurrencyCode } from "@/lib/currency";
import { PAYMENT_METHODS } from "@/lib/constants";

export interface RecentExpense {
  id: string;
  title: string;
  amount: number;
  currency?: CurrencyCode;
  date: Date | string;
  paymentMethod: string;
  category: { name: string; color: string };
  user: { name: string };
}

function paymentLabel(method: string) {
  return PAYMENT_METHODS.find((p) => p.value === method)?.label ?? method;
}

export function RecentExpenses({ expenses }: { expenses: RecentExpense[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="soft-card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Expenses</h3>
          <p className="text-xs text-muted-foreground">Latest transactions</p>
        </div>
        <Link
          href="/expenses"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Receipt className="mb-2 h-8 w-8 opacity-30" />
          <p className="text-sm">No expenses yet</p>
        </div>
      ) : (
        <div className="divide-y divide-border/30">
          {expenses.map((expense, i) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-muted/30 sm:gap-3 sm:px-5 sm:py-3.5"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold text-white"
                style={{ backgroundColor: expense.category.color }}
              >
                {expense.category.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{expense.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {expense.category.name} · {paymentLabel(expense.paymentMethod)} ·{" "}
                  {formatDate(expense.date)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <CurrencyAmount
                  amount={expense.amount}
                  currency={expense.currency ?? "PKR"}
                  size="sm"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
