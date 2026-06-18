"use client";

import { cn } from "@/lib/utils";
import {
  CHILE_FUEL_PRICES,
  FUEL_PRICES_LAST_UPDATED,
  FUEL_TYPES,
  pakistanFuelPricePKR,
  PAKISTAN_FUEL_PRICES,
  type FuelType,
} from "@/lib/fuel-prices";

interface FuelPriceTableProps {
  selectedType: FuelType;
  onSelect: (type: FuelType) => void;
}

export function FuelPriceTable({ selectedType, onSelect }: FuelPriceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/15">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Latest fuel rates / liter
        </p>
        <p className="text-[10px] text-muted-foreground">Updated {FUEL_PRICES_LAST_UPDATED}</p>
      </div>

      <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-x-2 border-b border-border/30 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span>Product</span>
        <span className="text-right">Chile (CLP)</span>
        <span className="text-right">Pakistan (Rs)</span>
      </div>

      {FUEL_TYPES.map((type) => {
        const chile = CHILE_FUEL_PRICES[type];
        const pakistan = PAKISTAN_FUEL_PRICES[type];
        const pkrOfficial = pakistanFuelPricePKR(type);
        const active = selectedType === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={cn(
              "grid w-full grid-cols-[1.3fr_1fr_1fr] gap-x-2 border-b border-border/20 px-3 py-2 text-left transition last:border-0",
              active
                ? "bg-red-500/10 ring-1 ring-inset ring-red-400/30"
                : "hover:bg-muted/40"
            )}
          >
            <span className="truncate text-xs font-medium text-foreground">
              {pakistan ? pakistan.label : chile.label}
              {chile.usdPerLiter != null && (
                <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                  ${chile.usdPerLiter}
                </span>
              )}
            </span>
            <span className="text-right text-xs font-semibold tabular-nums text-foreground">
              {chile.clpPerLiter.toLocaleString("en-US")}
            </span>
            <span className="text-right text-xs font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              {pakistan
                ? pkrOfficial.toFixed(2)
                : `${pkrOfficial.toLocaleString("en-US")}*`}
            </span>
          </button>
        );
      })}

      <p className="px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
        Tap a row to apply rate. PK currency uses Pakistan official prices; CLP uses Chile
        prices. *Kerosene PKR estimated from CLP conversion.
      </p>
    </div>
  );
}
