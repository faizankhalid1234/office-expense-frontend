"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type CurrencyCode } from "@/lib/currency";

const STORAGE_KEY = "hh-expense-input-currency";

type CurrencyContextValue = {
  inputCurrency: CurrencyCode;
  setInputCurrency: (currency: CurrencyCode) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [inputCurrency, setInputCurrencyState] = useState<CurrencyCode>("PKR");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "PKR" || stored === "CLP") {
      setInputCurrencyState(stored);
    }
  }, []);

  const setInputCurrency = useCallback((currency: CurrencyCode) => {
    setInputCurrencyState(currency);
    localStorage.setItem(STORAGE_KEY, currency);
  }, []);

  return (
    <CurrencyContext.Provider value={{ inputCurrency, setInputCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useInputCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useInputCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
