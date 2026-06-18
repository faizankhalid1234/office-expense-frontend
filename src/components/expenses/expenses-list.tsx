"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Pencil, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils-format";
import { CurrencyAmount } from "@/components/currency/currency-amount";
import type { CurrencyCode } from "@/lib/currency";
import { PAYMENT_METHODS } from "@/lib/constants";
import { apiFetch } from "@/lib/api-client";

interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  date: string | Date;
  paymentMethod: string;
  description?: string | null;
  receiptUrl?: string | null;
  category: { name: string; color: string };
  user: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export function ExpensesList({
  expenses: initialExpenses,
  categories,
}: {
  expenses: Expense[];
  categories: Category[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = initialExpenses.filter((e) => {
    const matchesSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      categories.find((c) => c.id === categoryFilter)?.name === e.category.name;
    return matchesSearch && matchesCategory;
  });

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await apiFetch(`/api/expenses/${deleteId}`, { method: "DELETE" });
      if (!result.ok) throw new Error("Failed to delete");
      toast.success("Expense deleted");
      setDeleteId(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  }

  const paymentLabel = (method: string) =>
    PAYMENT_METHODS.find((p) => p.value === method)?.label ?? method;

  return (
    <>
      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Title
                  </TableHead>
                  <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Category
                  </TableHead>
                  <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Payment
                  </TableHead>
                  <TableHead className="h-8 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Amount
                  </TableHead>
                  <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Receipt
                  </TableHead>
                  <TableHead className="h-8 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((expense) => (
                    <TableRow key={expense.id} className="text-xs">
                      <TableCell className="py-2.5">
                        <div>
                          <p className="text-xs font-medium leading-snug">{expense.title}</p>
                          <p className="text-[10px] text-muted-foreground">{expense.user.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: expense.category.color }}
                          />
                          {expense.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 text-[11px] text-muted-foreground">
                        {formatDate(expense.date)}
                      </TableCell>
                      <TableCell className="py-2.5 text-[11px] text-muted-foreground">
                        {paymentLabel(expense.paymentMethod)}
                      </TableCell>
                      <TableCell className="py-2.5 text-right">
                        <CurrencyAmount
                          amount={expense.amount}
                          currency={expense.currency ?? "PKR"}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell className="py-2.5">
                        {expense.receiptUrl ? (
                          <a
                            href={expense.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:underline text-xs"
                          >
                            {expense.receiptUrl.endsWith(".pdf") ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <ImageIcon className="h-4 w-4" />
                            )}
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-[10px]">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-2.5 text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/expenses/${expense.id}/edit`}
                            className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(expense.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 py-12 text-center text-sm text-muted-foreground">
                No expenses found
              </div>
            ) : (
              filtered.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-2xl border border-border/50 bg-card/80 p-4 shadow-sm transition-colors active:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground leading-tight">{expense.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{expense.user.name}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <CurrencyAmount
                        amount={expense.amount}
                        currency={expense.currency ?? "PKR"}
                        size="sm"
                        responsiveStack
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: expense.category.color }}
                      />
                      {expense.category.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(expense.date)}</span>
                    <span className="text-xs text-muted-foreground">
                      {paymentLabel(expense.paymentMethod)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
                    <div>
                      {expense.receiptUrl ? (
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary"
                        >
                          {expense.receiptUrl.endsWith(".pdf") ? (
                            <FileText className="h-3.5 w-3.5" />
                          ) : (
                            <ImageIcon className="h-3.5 w-3.5" />
                          )}
                          View receipt
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">No receipt</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Link
                        href={`/expenses/${expense.id}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => setDeleteId(expense.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The expense will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
