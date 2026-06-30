import type { CurrencyCode } from "@/lib/currency";
import {
  getFuelTypeLabel,
  getPakistanFuelLabel,
  type FuelType,
} from "@/lib/fuel-prices";

export const FUEL_QUICK_ADD = {
  label: "Fuel / Petrol",
  subtitle: "Record fuel purchase",
  categoryName: "Petrol",
  color: "#ef4444",
} as const;

export function buildFuelTitle(
  fuelType: FuelType,
  liters: string,
  total: string,
  currency: CurrencyCode = "PKR"
) {
  const l = parseFloat(liters);
  const t = parseFloat(total);
  const label = currency === "CLP" ? "CLP" : "Rs.";
  const name =
    currency === "PKR" ? getPakistanFuelLabel(fuelType) : getFuelTypeLabel(fuelType);
  if (l > 0 && t > 0) return `${name} - ${l} L (${label} ${t})`;
  if (l > 0) return `${name} - ${l} L`;
  return name;
}

export function buildFuelDescription(
  fuelType: FuelType,
  liters: string,
  ratePerLiter: string,
  note: string,
  currency: CurrencyCode = "PKR"
) {
  const parts: string[] = [
    currency === "PKR" ? getPakistanFuelLabel(fuelType) : getFuelTypeLabel(fuelType),
  ];
  const l = parseFloat(liters);
  const r = parseFloat(ratePerLiter);
  const label = currency === "CLP" ? "CLP" : "Rs.";
  if (l > 0) parts.push(`${l} liters`);
  if (r > 0) parts.push(`Rate: ${label} ${r}/L`);
  if (note.trim()) parts.push(note.trim());
  return parts.join(" | ");
}

export function calcFuelTotal(liters: string, ratePerLiter: string): string {
  const l = parseFloat(liters);
  const r = parseFloat(ratePerLiter);
  if (l > 0 && r > 0) return (l * r).toFixed(0);
  return "";
}
