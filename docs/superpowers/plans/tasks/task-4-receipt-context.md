# Task 4: Receipt Context Provider

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a React Context provider that stores parsed receipt items and shares them between the upload page and session creation page.

**Architecture:** Client-side context wrapping the app in the root layout. If context is empty on the session creation page, redirect to `/`. Context is cleared after session creation.

**Tech Stack:** React Context, TypeScript

---

**Files:**
- Create: `src/context/ReceiptContext.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create ReceiptContext**

Create `src/context/ReceiptContext.tsx`:

```tsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ParsedItem } from "@/lib/types";

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
```

- [ ] **Step 2: Wrap layout with ReceiptProvider**

Update `src/app/layout.tsx` — add the ReceiptProvider inside `<body>`, wrapping `<Container>`:

```tsx
import "./globals.css";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ReceiptProvider } from "@/context/ReceiptContext";

export const metadata: Metadata = {
  title: "Bill Splitter",
  description: "Split bills easily with friends",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReceiptProvider>
          <Container>{children}</Container>
        </ReceiptProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify no errors**

```bash
npm run dev
```

Expected: App loads without errors. No visible change yet.

- [ ] **Step 4: Commit**

```bash
git add src/context/ReceiptContext.tsx src/app/layout.tsx
git commit -m "feat: add ReceiptContext provider for sharing parsed data"
```
