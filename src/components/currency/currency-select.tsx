"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCY_LABELS, type CurrencyCode } from "@/lib/currency";

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  className?: string;
}

export function CurrencySelect({ value, onChange, className }: CurrencySelectProps) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v as CurrencyCode)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PKR">{CURRENCY_LABELS.PKR}</SelectItem>
        <SelectItem value="CLP">{CURRENCY_LABELS.CLP}</SelectItem>
      </SelectContent>
    </Select>
  );
}
