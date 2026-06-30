"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Fuel, Calculator } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PAYMENT_METHODS } from "@/lib/constants";
import { apiFetch } from "@/lib/api-client";
import { CurrencySelect } from "@/components/currency/currency-select";
import { CurrencyAmount } from "@/components/currency/currency-amount";
import { FuelPriceTable } from "@/components/expenses/fuel-price-table";
import { useInputCurrency } from "@/components/currency/currency-provider";
import {
  DEFAULT_FUEL_TYPE,
  fuelRateForCurrency,
  type FuelType,
} from "@/lib/fuel-prices";
import type { CurrencyCode } from "@/lib/currency";
import {
  FUEL_QUICK_ADD,
  buildFuelTitle,
  buildFuelDescription,
  calcFuelTotal,
} from "@/lib/quick-expense";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface QuickExpenseProps {
  categories: Category[];
  compact?: boolean;
}

export function QuickExpense({ categories, compact = false }: QuickExpenseProps) {
  const router = useRouter();
  const { inputCurrency, setInputCurrency } = useInputCurrency();
  const [fuelOpen, setFuelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fuel, setFuel] = useState({
    fuelType: DEFAULT_FUEL_TYPE as FuelType,
    liters: "",
    ratePerLiter: "",
    totalAmount: "",
    note: "",
    paymentMethod: "CASH",
    date: format(new Date(), "yyyy-MM-dd"),
    currency: inputCurrency,
  });

  function fuelRateString(type: FuelType, currency: CurrencyCode) {
    return String(fuelRateForCurrency(type, currency));
  }

  function getCategoryId(name: string) {
    return categories.find((c) => c.name === name)?.id ?? "";
  }

  async function submitExpense(data: {
    title: string;
    amount: number;
    currency: CurrencyCode;
    categoryId: string;
    description?: string;
    paymentMethod: string;
    date: string;
  }) {
    setLoading(true);
    try {
      const result = await apiFetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!result.ok) throw new Error(result.error);
      toast.success("Fuel expense added!");
      setFuelOpen(false);
      resetFuelForm();
      router.refresh();
      if (!compact) router.push("/expenses");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  function resetFuelForm() {
    const today = format(new Date(), "yyyy-MM-dd");
    setFuel({
      fuelType: DEFAULT_FUEL_TYPE,
      liters: "",
      ratePerLiter: fuelRateString(DEFAULT_FUEL_TYPE, inputCurrency),
      totalAmount: "",
      note: "",
      paymentMethod: "CASH",
      date: today,
      currency: inputCurrency,
    });
  }

  function openFuelDialog() {
    setFuel((prev) => ({
      ...prev,
      fuelType: prev.fuelType || DEFAULT_FUEL_TYPE,
      currency: inputCurrency,
      ratePerLiter: fuelRateString(prev.fuelType || DEFAULT_FUEL_TYPE, inputCurrency),
    }));
    setFuelOpen(true);
  }

  async function handleFuelSubmit(e: React.FormEvent) {
    e.preventDefault();
    const categoryId = getCategoryId(FUEL_QUICK_ADD.categoryName);
    if (!categoryId) return toast.error("Petrol category not found");
    const amount = parseFloat(fuel.totalAmount);
    if (!amount || amount <= 0) return toast.error("Total amount is required");

    await submitExpense({
      title: buildFuelTitle(fuel.fuelType, fuel.liters, fuel.totalAmount, fuel.currency),
      amount,
      currency: fuel.currency,
      categoryId,
      description: buildFuelDescription(
        fuel.fuelType,
        fuel.liters,
        fuel.ratePerLiter,
        fuel.note,
        fuel.currency
      ),
      paymentMethod: fuel.paymentMethod,
      date: fuel.date,
    });
  }

  const fuelCalc =
    fuel.liters && fuel.ratePerLiter
      ? parseFloat(calcFuelTotal(fuel.liters, fuel.ratePerLiter) || "0")
      : 0;

  return (
    <>
      <div className={cn(compact ? "soft-card p-4" : "soft-card p-5 md:p-6")}>
        {!compact && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Add Fuel</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Record petrol, diesel, or kerosene
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={openFuelDialog}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl border border-border/40 bg-muted/20 p-4 text-left transition",
            "hover:border-red-300/50 hover:bg-red-50/50 dark:hover:bg-red-500/10",
            compact && "min-h-[72px]"
          )}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{ backgroundColor: FUEL_QUICK_ADD.color }}
          >
            <Fuel className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{FUEL_QUICK_ADD.label}</p>
            <p className="text-xs text-muted-foreground">{FUEL_QUICK_ADD.subtitle}</p>
          </div>
        </button>
      </div>

      <Dialog open={fuelOpen} onOpenChange={setFuelOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border/40 px-4 py-3 sm:px-5">
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <Fuel className="h-4 w-4 text-red-500" />
              Add Fuel Expense
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFuelSubmit} className="space-y-3 px-4 py-3 text-xs sm:px-5 sm:py-4">
            <FuelPriceTable
              selectedType={fuel.fuelType}
              onSelect={(type) => {
                setFuel({
                  ...fuel,
                  fuelType: type,
                  ratePerLiter: fuelRateString(type, fuel.currency),
                });
              }}
            />

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Currency
                </Label>
                <CurrencySelect
                  value={fuel.currency}
                  className="h-9 text-xs"
                  onChange={(c) => {
                    setInputCurrency(c);
                    setFuel({
                      ...fuel,
                      currency: c,
                      ratePerLiter: fuelRateString(fuel.fuelType, c),
                    });
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Fuel type
                </Label>
                <Select
                  value={fuel.fuelType}
                  onValueChange={(v) => {
                    if (!v) return;
                    const ft = v as FuelType;
                    setFuel({
                      ...fuel,
                      fuelType: ft,
                      ratePerLiter: fuelRateString(ft, fuel.currency),
                    });
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasoline" className="text-xs">Super / Gasoline</SelectItem>
                    <SelectItem value="diesel" className="text-xs">Diesel</SelectItem>
                    <SelectItem value="kerosene" className="text-xs">Kerosene</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Liters
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 20"
                  className="h-9 text-xs"
                  value={fuel.liters}
                  onChange={(e) => setFuel({ ...fuel, liters: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Rate / L ({fuel.currency})
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={fuelRateString(fuel.fuelType, fuel.currency)}
                  className="h-9 text-xs"
                  value={fuel.ratePerLiter}
                  onChange={(e) => setFuel({ ...fuel, ratePerLiter: e.target.value })}
                />
              </div>
            </div>

            {fuelCalc > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-[11px] text-red-700 dark:text-red-400">
                <Calculator className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 flex-1">
                  Auto total:{" "}
                  <CurrencyAmount amount={fuelCalc} currency={fuel.currency} size="sm" />
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 px-2 text-[10px]"
                  onClick={() => setFuel({ ...fuel, totalAmount: fuelCalc.toString() })}
                >
                  Use this
                </Button>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Total ({fuel.currency}) *
              </Label>
              <Input
                type="number"
                min="1"
                required
                placeholder="Total fuel cost"
                className="h-9 text-xs"
                value={fuel.totalAmount}
                onChange={(e) => setFuel({ ...fuel, totalAmount: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Date
                </Label>
                <Input
                  type="date"
                  className="h-9 text-xs"
                  value={fuel.date}
                  onChange={(e) => setFuel({ ...fuel, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Payment
                </Label>
                <Select
                  value={fuel.paymentMethod}
                  onValueChange={(v) => v && setFuel({ ...fuel, paymentMethod: v })}
                >
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((p) => (
                      <SelectItem key={p.value} value={p.value} className="text-xs">
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Note (optional)
              </Label>
              <Textarea
                placeholder="Vehicle number, pump name..."
                className="min-h-[64px] text-xs"
                value={fuel.note}
                onChange={(e) => setFuel({ ...fuel, note: e.target.value })}
                rows={2}
              />
            </div>

            <Button type="submit" className="h-9 w-full text-xs font-semibold" disabled={loading}>
              {loading ? "Saving..." : "Add Fuel Expense"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
