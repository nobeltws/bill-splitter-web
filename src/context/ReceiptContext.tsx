"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ParsedItem } from "@/lib/api";

interface ReceiptContextValue {
  items: ParsedItem[];
  setItems: (items: ParsedItem[]) => void;
  clear: () => void;
}

const ReceiptContext = createContext<ReceiptContextValue | null>(null);

export function ReceiptProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<ParsedItem[]>([]);

  const setItems = useCallback((newItems: ParsedItem[]) => {
    setItemsState(newItems);
  }, []);

  const clear = useCallback(() => {
    setItemsState([]);
  }, []);

  return (
    <ReceiptContext.Provider value={{ items, setItems, clear }}>
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
