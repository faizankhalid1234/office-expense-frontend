import { cn } from "@/lib/utils";
import {
  type CurrencyCode,
  formatMoney,
  toCLP,
  toPKR,
} from "@/lib/currency";

interface CurrencyAmountProps {
  amount: number;
  currency?: CurrencyCode;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  size?: "sm" | "md";
  stacked?: boolean;
  /** Stack PKR/CLP on small screens only */
  responsiveStack?: boolean;
}

export function CurrencyAmount({
  amount,
  currency = "PKR",
  className,
  primaryClassName,
  secondaryClassName,
  size = "md",
  stacked = false,
  responsiveStack = false,
}: CurrencyAmountProps) {
  const pkr = toPKR(amount, currency);
  const clp = toCLP(amount, currency);
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const smallText = "text-[10px] leading-tight";

  const primary =
    currency === "CLP"
      ? { value: clp, code: "CLP" as CurrencyCode }
      : { value: pkr, code: "PKR" as CurrencyCode };
  const secondary =
    currency === "CLP"
      ? { value: pkr, code: "PKR" as CurrencyCode }
      : { value: clp, code: "CLP" as CurrencyCode };

  const secondaryFormatted = formatMoney(secondary.value, secondary.code);

  if (stacked) {
    return (
      <span className={cn("flex flex-col gap-0.5 tabular-nums leading-snug", className)}>
        <span className={cn(textSize, "font-semibold text-foreground", primaryClassName)}>
          {formatMoney(primary.value, primary.code)}
        </span>
        <span className={cn(smallText, "text-muted-foreground", secondaryClassName)}>
          {secondaryFormatted}
        </span>
      </span>
    );
  }

  if (responsiveStack) {
    return (
      <span className={cn("tabular-nums leading-snug", className)}>
        <span className={cn(textSize, "block font-semibold text-foreground sm:inline", primaryClassName)}>
          {formatMoney(primary.value, primary.code)}
        </span>
        <span className="hidden text-muted-foreground sm:inline"> · </span>
        <span
          className={cn(
            smallText,
            "block text-muted-foreground sm:inline sm:text-xs",
            secondaryClassName
          )}
        >
          {secondaryFormatted}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("tabular-nums leading-snug", className)}>
      <span className={cn(textSize, "font-semibold text-foreground", primaryClassName)}>
        {formatMoney(primary.value, primary.code)}
      </span>
      <span className={cn(textSize, "text-muted-foreground", secondaryClassName)}>
        {" · "}
        {secondaryFormatted}
      </span>
    </span>
  );
}
