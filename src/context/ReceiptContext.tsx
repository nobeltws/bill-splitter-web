"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ParsedItem } from "@/lib/api";

interface ReceiptContextValue {
  items: ParsedItem[];
  hydrated: boolean;
  setItems: (items: ParsedItem[]) => void;
  clear: () => void;
}

const STORAGE_KEY = "receipt_items";

const ReceiptContext = createContext<ReceiptContextValue | null>(null);

export function ReceiptProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<ParsedItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setItemsState(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  const setItems = useCallback((newItems: ParsedItem[]) => {
    setItemsState(newItems);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  }, []);

  const clear = useCallback(() => {
    setItemsState([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ReceiptContext.Provider value={{ items, hydrated, setItems, clear }}>
      {children}
    </ReceiptContext.Provider>
  );
}

export function useReceipt(): ReceiptContextValue {
  const ctx = useContext(ReceiptContext);
  if (!ctx) {
    throw new Error("useReceipt must be used within ReceiptProvider");
  }
  return ctx;
}
