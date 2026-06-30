"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, TrendingDown, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { CategoryPieChart, ExpenseTrendChart } from "@/components/dashboard/charts";
import { formatDualCurrency, formatDate } from "@/lib/utils-format";
import { CurrencyAmount } from "@/components/currency/currency-amount";
import type { CurrencyCode } from "@/lib/currency";
import { exportToPDF, exportToExcel } from "@/lib/export";
import { apiFetch } from "@/lib/api-client";

interface ReportData {
  month: number;
  year: number;
  total: number;
  breakdown: { name: string; color?: string; total: number }[];
  highest: { name: string; total: number } | null;
  prevMonthTotal: number;
  comparison: number;
  expenses: {
    id: string;
    title: string;
    amount: number;
    currency?: CurrencyCode;
    date: Date | string;
    paymentMethod: string;
    category: { name: string };
  }[];
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function ReportsView({
  initialReport,
  trendData,
  initialMonth,
  initialYear,
}: {
  initialReport: ReportData;
  trendData: { date: string; amount: number }[];
  initialMonth: number;
  initialYear: number;
}) {
  const [report, setReport] = useState(initialReport);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [loading, setLoading] = useState(false);

  async function fetchReport(m: number, y: number) {
    setLoading(true);
    try {
      const result = await apiFetch<ReportData>(`/api/reports?month=${m}&year=${y}`);
      if (result.ok) setReport(result.data);
    } finally {
      setLoading(false);
    }
  }

  function handlePeriodChange(m: number, y: number) {
    setMonth(m);
    setYear(y);
    fetchReport(m, y);
  }

  const pieData = report.breakdown.map((b, i) => ({
    name: b.name,
    value: b.total,
    color: b.color ?? `hsl(${i * 40}, 70%, 50%)`,
  }));

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <Select
            value={month.toString()}
            onValueChange={(v) => v && handlePeriodChange(parseInt(v), year)}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={year.toString()}
            onValueChange={(v) => v && handlePeriodChange(month, parseInt(v))}
          >
            <SelectTrigger className="w-full sm:w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => exportToPDF(report)}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => exportToExcel(report)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading report...</div>
      ) : (
        <>
          <div className="stat-grid">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-3 sm:p-5">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-sm">Total</p>
                  <div className="mt-1">
                    <CurrencyAmount amount={report.total} currency="PKR" size="sm" responsiveStack />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-3 sm:p-5">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-sm">vs Prev Month</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {report.comparison >= 0 ? (
                      <TrendingUp className="h-4 w-4 shrink-0 text-red-500 sm:h-5 sm:w-5" />
                    ) : (
                      <TrendingDown className="h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />
                    )}
                    <p className="text-lg font-bold sm:text-2xl">
                      {report.comparison >= 0 ? "+" : ""}
                      {report.comparison.toFixed(1)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-3 sm:p-5">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-sm">Top Category</p>
                  <div className="flex items-center gap-1.5 mt-1 min-w-0">
                    <Award className="h-4 w-4 shrink-0 text-yellow-500 sm:h-5 sm:w-5" />
                    <p className="truncate text-sm font-bold sm:text-lg">{report.highest?.name ?? "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-3 sm:p-5">
                  <p className="text-[11px] font-medium text-muted-foreground sm:text-sm">Transactions</p>
                  <p className="text-lg font-bold mt-1 sm:text-2xl">{report.expenses.length}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryPieChart data={pieData} />
            <ExpenseTrendChart data={trendData} />
          </div>

          <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="hidden md:block table-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.breakdown.map((b) => (
                    <TableRow key={b.name}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell className="text-right">
                        <CurrencyAmount amount={b.total} currency="PKR" size="sm" />
                      </TableCell>
                      <TableCell className="text-right">
                        {report.total > 0
                          ? ((b.total / report.total) * 100).toFixed(1)
                          : 0}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              <div className="space-y-2 md:hidden">
                {report.breakdown.map((b) => (
                  <div
                    key={b.name}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5"
                  >
                    <span className="truncate text-sm font-medium">{b.name}</span>
                    <div className="shrink-0 text-right">
                      <CurrencyAmount amount={b.total} currency="PKR" size="sm" responsiveStack />
                      <span className="text-[10px] text-muted-foreground">
                        {report.total > 0 ? ((b.total / report.total) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">All Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="hidden md:block table-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.expenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{formatDate(e.date)}</TableCell>
                      <TableCell>{e.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{e.category.name}</Badge>
                      </TableCell>
                      <TableCell>{e.paymentMethod}</TableCell>
                      <TableCell className="text-right font-semibold">
                        <CurrencyAmount
                          amount={e.amount}
                          currency={e.currency ?? "PKR"}
                          size="sm"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              <div className="space-y-3 md:hidden">
                {report.expenses.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-xl border border-border/40 bg-muted/20 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
                      </div>
                      <CurrencyAmount
                        amount={e.amount}
                        currency={e.currency ?? "PKR"}
                        size="sm"
                        responsiveStack
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">{e.category.name}</Badge>
                      <span className="text-xs text-muted-foreground">{e.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
