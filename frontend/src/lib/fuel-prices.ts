import { CLP_TO_PKR, type CurrencyCode } from "@/lib/currency";

/** Update prices here when Chile or Pakistan rates change */
export const FUEL_PRICES_LAST_UPDATED = "2026-06-15";

export type FuelType = "gasoline" | "diesel" | "kerosene";

export type ChileFuelEntry = {
  label: string;
  clpPerLiter: number;
  usdPerLiter?: number;
};

export type PakistanFuelEntry = {
  label: string;
  pkrPerLiter: number;
};

/** Chile — update CLP per liter */
export const CHILE_FUEL_PRICES: Record<FuelType, ChileFuelEntry> = {
  gasoline: {
    label: "Gasoline / Petrol",
    clpPerLiter: 1599,
    usdPerLiter: 1.75,
  },
  diesel: {
    label: "Diesel",
    clpPerLiter: 1438,
    usdPerLiter: 1.57,
  },
  kerosene: {
    label: "Kerosene",
    clpPerLiter: 1242,
  },
};

/** Pakistan — update Rs/Litre (official pump prices) */
export const PAKISTAN_FUEL_PRICES: Partial<Record<FuelType, PakistanFuelEntry>> = {
  gasoline: {
    label: "Super",
    pkrPerLiter: 373.78,
  },
  diesel: {
    label: "Diesel",
    pkrPerLiter: 378.78,
  },
};

export const FUEL_TYPES = Object.keys(CHILE_FUEL_PRICES) as FuelType[];

/** PKR equivalent from Chile CLP (conversion only) */
export function chileFuelPriceInPKR(type: FuelType): number {
  return Math.round(CHILE_FUEL_PRICES[type].clpPerLiter * CLP_TO_PKR);
}

/** Official Pakistan Rs/L — falls back to CLP conversion for types without PK entry */
export function pakistanFuelPricePKR(type: FuelType): number {
  const official = PAKISTAN_FUEL_PRICES[type];
  if (official) return official.pkrPerLiter;
  return chileFuelPriceInPKR(type);
}

/** Rate to use in forms based on selected currency */
export function fuelRateForCurrency(type: FuelType, currency: CurrencyCode): number {
  if (currency === "CLP") return CHILE_FUEL_PRICES[type].clpPerLiter;
  return pakistanFuelPricePKR(type);
}

export function getFuelTypeLabel(type: FuelType): string {
  return CHILE_FUEL_PRICES[type].label;
}

export function getPakistanFuelLabel(type: FuelType): string {
  return PAKISTAN_FUEL_PRICES[type]?.label ?? CHILE_FUEL_PRICES[type].label;
}

export const DEFAULT_FUEL_TYPE: FuelType = "gasoline";

export const PETROL_PRICE_CLP_PER_LITER = CHILE_FUEL_PRICES.gasoline.clpPerLiter;
export const PETROL_PRICE_PKR_PER_LITER = pakistanFuelPricePKR("gasoline");

export function petrolRateForCurrency(currency: CurrencyCode): number {
  return fuelRateForCurrency(DEFAULT_FUEL_TYPE, currency);
}

/** @deprecated Use pakistanFuelPricePKR or chileFuelPriceInPKR */
export function fuelPricePKR(type: FuelType): number {
  return pakistanFuelPricePKR(type);
}
