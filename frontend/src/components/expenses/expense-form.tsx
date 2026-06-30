"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import { apiPath, resolveUploadUrl } from "@/lib/api-config";
import { getSession } from "next-auth/react";
import { CurrencySelect } from "@/components/currency/currency-select";
import { useInputCurrency } from "@/components/currency/currency-provider";
import type { CurrencyCode } from "@/lib/currency";
import { PAYMENT_METHODS } from "@/lib/constants";
import { format } from "date-fns";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface ExpenseFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    title: string;
    amount: number;
    date: string;
    paymentMethod: string;
    description?: string | null;
    categoryId: string;
    currency?: CurrencyCode;
    receiptUrl?: string | null;
    receiptName?: string | null;
  };
}

export function ExpenseForm({ categories, initialData }: ExpenseFormProps) {
  const router = useRouter();
  const { inputCurrency, setInputCurrency } = useInputCurrency();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [receipt, setReceipt] = useState<{ url: string; name: string } | null>(
    initialData?.receiptUrl
      ? { url: initialData.receiptUrl, name: initialData.receiptName ?? "Receipt" }
      : null
  );

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    amount: initialData?.amount?.toString() ?? "",
    date: initialData?.date
      ? format(new Date(initialData.date), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
    paymentMethod: initialData?.paymentMethod ?? "CASH",
    description: initialData?.description ?? "",
    categoryId: initialData?.categoryId ?? "",
    currency: (initialData?.currency ?? inputCurrency) as CurrencyCode,
  });

  const activeCurrency = form.currency;
  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const paymentMethodsForCategory =
    selectedCategory?.name?.trim().toLowerCase() === "petrol"
      ? PAYMENT_METHODS.filter(
          (pm) => pm.value !== "EASYPAISA" && pm.value !== "JAZZCASH"
        )
      : PAYMENT_METHODS;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const session = await getSession();
      const res = await fetch(apiPath("/api/upload"), {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.accessToken ?? ""}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReceipt({ url: data.url, name: data.name });
      toast.success("Receipt uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const path = initialData ? `/api/expenses/${initialData.id}` : "/api/expenses";
      const method = initialData ? "PUT" : "POST";

      const result = await apiFetch(path, {
        method,
        body: JSON.stringify({
          ...form,
          currency: form.currency,
          receiptUrl: receipt?.url,
          receiptName: receipt?.name,
        }),
      });

      if (!result.ok) throw new Error(result.error);

      toast.success(initialData ? "Expense updated" : "Expense added");
      router.push("/expenses");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4 sm:space-y-6">
      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardContent className="space-y-5 p-4 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Office tea supplies"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount ({activeCurrency === "CLP" ? "Chilean Peso" : "PKR"}) *
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => v && setForm({ ...form, categoryId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={form.paymentMethod}
                onValueChange={(v) => v && setForm({ ...form, paymentMethod: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodsForCategory.map((pm) => (
                    <SelectItem key={pm.value} value={pm.value}>
                      {pm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional notes..."
                rows={3}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Receipt</Label>
              {receipt ? (
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3">
                  {receipt.url.endsWith(".pdf") ? (
                    <FileText className="h-8 w-8 text-red-500" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-blue-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{receipt.name}</p>
                    <a
                      href={resolveUploadUrl(receipt.url) ?? receipt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Preview
                    </a>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setReceipt(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-background/30 p-6 transition-colors hover:border-primary/50 hover:bg-background/50">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {uploading ? "Uploading..." : "Click to upload receipt (Image/PDF, max 5MB)"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
            <Button type="submit" disabled={loading || !form.categoryId} className="min-h-11 w-full sm:w-auto">
              {loading ? "Saving..." : initialData ? "Update Expense" : "Add Expense"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="min-h-11 w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
