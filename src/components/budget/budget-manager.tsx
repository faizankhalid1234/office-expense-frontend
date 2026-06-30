"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Wallet, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { CurrencyAmount } from "@/components/currency/currency-amount";
import { CurrencySelect } from "@/components/currency/currency-select";
import { useInputCurrency } from "@/components/currency/currency-provider";
import { apiFetch } from "@/lib/api-client";

interface BudgetData {
  month: number;
  year: number;
  amount: number;
  used: number;
  remaining: number;
  percentage: number;
}

interface BudgetHistory {
  id: string;
  month: number;
  year: number;
  amount: number;
  currency?: "PKR" | "CLP";
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function BudgetManager({
  current,
  history,
  readOnly = false,
}: {
  current: BudgetData;
  history: BudgetHistory[];
  readOnly?: boolean;
}) {
  const router = useRouter();
  const { inputCurrency, setInputCurrency } = useInputCurrency();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    month: current.month,
    year: current.year,
    amount: current.amount > 0 ? current.amount.toString() : "",
    currency: inputCurrency,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await apiFetch("/api/budget", {
        method: "POST",
        body: JSON.stringify({
          month: form.month,
          year: form.year,
          amount: parseFloat(form.amount),
          currency: form.currency,
        }),
      });

      if (!result.ok) throw new Error(result.error);

      toast.success("Budget saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        {current.amount > 0 ? (
          <BudgetProgress
            amount={current.amount}
            used={current.used}
            remaining={current.remaining}
            percentage={current.percentage}
          />
        ) : (
          <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mb-3 opacity-50" />
              <p>No budget set for this month</p>
            </CardContent>
          </Card>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">
                {readOnly ? "Company Budget" : "Set Monthly Budget"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {readOnly ? (
                <p className="text-sm text-muted-foreground">
                  Monthly budget is set by admin from the admin panel. Updates here automatically
                  when the admin saves a new amount.
                </p>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select
                      value={form.month.toString()}
                      onValueChange={(v) => v && setForm({ ...form, month: parseInt(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => (
                          <SelectItem key={m} value={(i + 1).toString()}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                      min={2020}
                      max={2100}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <CurrencySelect
                    value={form.currency}
                    onChange={(c) => {
                      setForm({ ...form, currency: c });
                      setInputCurrency(c);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Budget Amount ({form.currency === "CLP" ? "CLP" : "PKR"})
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="500000"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Budget"}
                </Button>
              </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base">Budget History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Budget</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No budget history
                  </TableCell>
                </TableRow>
              ) : (
                history.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      {MONTHS[b.month - 1]} {b.year}
                    </TableCell>
                    <TableCell className="text-right">
                      <CurrencyAmount
                        amount={b.amount}
                        currency={b.currency ?? "PKR"}
                        size="sm"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
