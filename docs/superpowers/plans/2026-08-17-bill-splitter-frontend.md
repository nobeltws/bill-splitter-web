# Bill Splitter Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Next.js frontend for bill splitting — upload receipt, create session, share with participants, track payments.

**Architecture:** Next.js App Router with Linaria for zero-runtime CSS-in-JS. React Context for passing parsed receipt data between upload and session creation pages. All session pages fetch directly from the backend API. Max width 720px, light mode only.

**Tech Stack:** Next.js 14+, TypeScript, Linaria, qrcode.react, Lucide React icons

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`
- Create: `.env.local`

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest . --typescript --app --src-dir --no-tailwind --no-eslint --import-alias "@/*"
```

Select defaults when prompted. This creates the base Next.js App Router project.

- [ ] **Step 2: Install dependencies**

```bash
npm install @linaria/core @linaria/react qrcode.react lucide-react
npm install -D @wyw-in-style/webpack-loader @wyw-in-style/babel-preset
```

- [ ] **Step 3: Configure Linaria with Next.js**

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(tsx|ts|js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "@wyw-in-style/webpack-loader",
          options: {
            sourceMap: process.env.NODE_ENV !== "production",
            babelOptions: {
              presets: ["@wyw-in-style/babel-preset"],
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
```

- [ ] **Step 4: Create environment file**

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- [ ] **Step 5: Set up global styles**

Replace `src/app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

:root {
  --color-primary: #059669;
  --color-accent: #DC2626;
  --color-background: #F8FAFC;
  --color-foreground: #0F172A;
  --color-card: #FFFFFF;
  --color-muted: #F0F8F6;
  --color-muted-foreground: #475569;
  --color-border: #E1F2ED;
  --color-success: #059669;
  --color-error: #DC2626;
  --radius: 8px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-foreground);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 6: Create root layout**

Replace `src/app/layout.tsx`:

```tsx
import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Verify the app runs**

```bash
npm run dev
```

Expected: App starts on http://localhost:3000 without errors.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js project with Linaria and design tokens"
```

---

### Task 2: Shared Layout and Container Component

**Files:**
- Create: `src/components/Container.tsx`
- Create: `src/components/Button.tsx`
- Create: `src/components/Input.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Container component**

Create `src/components/Container.tsx`:

```tsx
"use client";

import { styled } from "@linaria/react";

export const Container = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100dvh;
`;
```

- [ ] **Step 2: Create Button component**

Create `src/components/Button.tsx`:

```tsx
"use client";

import { styled } from "@linaria/react";

export const Button = styled.button<{ variant?: "primary" | "secondary" | "danger" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 150ms ease;
  min-height: 44px;
  min-width: 44px;
  width: 100%;

  background-color: ${(props) =>
    props.variant === "danger"
      ? "var(--color-error)"
      : props.variant === "secondary"
      ? "var(--color-muted)"
      : "var(--color-primary)"};

  color: ${(props) =>
    props.variant === "secondary"
      ? "var(--color-foreground)"
      : "#FFFFFF"};

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

- [ ] **Step 3: Create Input component**

Create `src/components/Input.tsx`:

```tsx
"use client";

import { styled } from "@linaria/react";

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-foreground);
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 16px;
  font-family: inherit;
  background: var(--color-card);
  color: var(--color-foreground);
  min-height: 44px;
  transition: border-color 150ms ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.15);
  }

  &::placeholder {
    color: var(--color-muted-foreground);
  }
`;
```

- [ ] **Step 4: Update root layout to use Container**

Update `src/app/layout.tsx` body content:

```tsx
import "./globals.css";
import type { Metadata } from "next";
import { Container } from "@/components/Container";

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
        <Container>{children}</Container>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify components render**

```bash
npm run dev
```

Expected: App renders with centered container, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Container.tsx src/components/Button.tsx src/components/Input.tsx src/app/layout.tsx
git commit -m "feat: add shared Container, Button, and Input components"
```

---

### Task 3: API Client Module

**Files:**
- Create: `src/lib/api.ts`
- Create: `src/lib/types.ts`

- [ ] **Step 1: Define TypeScript types from the API schema**

Create `src/lib/types.ts`:

```typescript
export interface ParsedItem {
  name: string;
  quantity: number;
  unitPrice: number;
  confidence: number | null;
}

export interface ParsedReceipt {
  items: ParsedItem[];
  tax: number;
  serviceCharge: number;
  rawText: string;
}

export interface SessionItemRequest {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSessionRequest {
  hostPaynowId: string;
  items: SessionItemRequest[];
  taxRate: number;
  serviceChargeRate: number;
  discount: number;
  participantCount: number;
}

export interface CreateSessionResponse {
  sessionId: string;
  createdAt: string;
}

export interface SessionItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface SessionClaim {
  participantName: string;
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface SessionPayment {
  participantName: string;
  paidAt: string;
}

export interface GetSessionResponse {
  sessionId: string;
  hostPaynowId: string;
  items: SessionItem[];
  taxRate: number;
  serviceChargeRate: number;
  discount: number;
  participantCount: number;
  claims: SessionClaim[];
  payments: SessionPayment[];
  createdAt: string;
}

export interface ParticipantSummary {
  name: string;
  itemsSubtotal: number;
  proportionalTax: number;
  proportionalServiceCharge: number;
  proportionalDiscount: number;
  totalOwed: number;
}

export interface UnclaimedItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface SessionSummaryResponse {
  rawSubtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  grandTotal: number;
  taxRate: number;
  serviceChargeRate: number;
  participants: ParticipantSummary[];
  unclaimed: {
    items: UnclaimedItem[];
    subtotal: number;
  };
}

export interface ClaimItemRequest {
  itemId: string;
  quantity: number;
}

export interface CreateClaimsRequest {
  participantName: string;
  claims: ClaimItemRequest[];
}

export interface CreateClaimsResponse {
  participantName: string;
  claims: { itemId: string; itemName: string; quantity: number }[];
}

export interface PaymentRequest {
  participantName: string;
}

export interface PaymentResponse {
  participantName: string;
  paid: boolean;
  paidAt: string | null;
}
```

- [ ] **Step 2: Create API client**

Create `src/lib/api.ts`:

```typescript
import type {
  ParsedReceipt,
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionResponse,
  SessionSummaryResponse,
  CreateClaimsRequest,
  CreateClaimsResponse,
  PaymentRequest,
  PaymentResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail?.[0]?.msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function parseReceipt(image: File): Promise<ParsedReceipt> {
  const formData = new FormData();
  formData.append("image", image);
  return request<ParsedReceipt>("/api/receipts/parse", {
    method: "POST",
    body: formData,
  });
}

export async function createSession(
  data: CreateSessionRequest
): Promise<CreateSessionResponse> {
  return request<CreateSessionResponse>("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getSession(
  sessionId: string
): Promise<GetSessionResponse> {
  return request<GetSessionResponse>(`/api/sessions/${sessionId}`);
}

export async function getSessionSummary(
  sessionId: string
): Promise<SessionSummaryResponse> {
  return request<SessionSummaryResponse>(
    `/api/sessions/${sessionId}/summary`
  );
}

export async function createClaims(
  sessionId: string,
  data: CreateClaimsRequest
): Promise<CreateClaimsResponse> {
  return request<CreateClaimsResponse>(
    `/api/sessions/${sessionId}/claims`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
}

export async function deleteClaim(
  sessionId: string,
  participantName: string,
  itemId: string
): Promise<void> {
  await request(`/api/sessions/${sessionId}/claims`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participantName, itemId }),
  });
}

export async function markPaid(
  sessionId: string,
  data: PaymentRequest
): Promise<PaymentResponse> {
  return request<PaymentResponse>(
    `/api/sessions/${sessionId}/payments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
}

export async function unmarkPaid(
  sessionId: string,
  data: PaymentRequest
): Promise<PaymentResponse> {
  return request<PaymentResponse>(
    `/api/sessions/${sessionId}/payments`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts src/lib/api.ts
git commit -m "feat: add TypeScript types and API client module"
```

---

### Task 4: Receipt Context Provider

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

Update `src/app/layout.tsx`:

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

---

### Task 5: Upload Receipt Page (`/`)

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/FileUpload.tsx`

- [ ] **Step 1: Create FileUpload component**

Create `src/components/FileUpload.tsx`:

```tsx
"use client";

import { styled } from "@linaria/react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";

const UploadArea = styled.div`
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;
  background: var(--color-card);

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-muted);
  }
`;

const UploadLabel = styled.p`
  font-size: 16px;
  color: var(--color-muted-foreground);
  margin-top: 12px;
`;

const Preview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-muted);
  border-radius: var(--radius);
  margin-top: 16px;
`;

const FileName = styled.span`
  font-size: 14px;
  color: var(--color-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export function FileUpload({ file, onFileSelect }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  }

  return (
    <div>
      <UploadArea onClick={handleClick}>
        <Upload size={32} color="var(--color-muted-foreground)" />
        <UploadLabel>Tap to upload receipt image</UploadLabel>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </UploadArea>
      {file && (
        <Preview>
          <ImageIcon size={20} color="var(--color-primary)" />
          <FileName>{file.name}</FileName>
        </Preview>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the upload page**

Replace `src/app/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@linaria/react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { useReceipt } from "@/context/ReceiptContext";
import { parseReceipt } from "@/lib/api";
import { Loader2 } from "lucide-react";

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: var(--color-muted-foreground);
  margin-bottom: 32px;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 14px;
  margin-top: 12px;
`;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setItems } = useReceipt();
  const router = useRouter();

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await parseReceipt(file);
      setItems(result.items);
      router.push("/sessions/new");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse receipt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Title>Bill Splitter</Title>
      <Subtitle>Upload your receipt to get started</Subtitle>
      <FileUpload file={file} onFileSelect={setFile} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button
        onClick={handleSubmit}
        disabled={!file || loading}
        style={{ marginTop: 24 }}
      >
        {loading ? <Loader2 size={20} className="spin" /> : null}
        {loading ? "Scanning..." : "Scan Receipt"}
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Add spin animation to globals.css**

Append to `src/app/globals.css`:

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}
```

- [ ] **Step 4: Verify upload page renders**

```bash
npm run dev
```

Expected: Homepage shows title, upload area, and disabled button. Selecting a file enables the button and shows the filename.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/FileUpload.tsx src/app/globals.css
git commit -m "feat: add receipt upload page with file selection and API call"
```

---

### Task 6: Session Creation Page (`/sessions/new`)

**Files:**
- Create: `src/app/sessions/new/page.tsx`
- Create: `src/components/ItemRow.tsx`

- [ ] **Step 1: Create ItemRow component**

Create `src/components/ItemRow.tsx`:

```tsx
"use client";

import { styled } from "@linaria/react";
import { Trash2 } from "lucide-react";

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 60px 80px 40px;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
`;

const ItemInput = styled.input`
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 14px;
  font-family: inherit;
  background: var(--color-card);
  min-height: 40px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-muted-foreground);
  min-width: 40px;
  min-height: 40px;

  &:hover {
    color: var(--color-error);
  }
`;

interface ItemRowProps {
  name: string;
  quantity: number;
  unitPrice: number;
  onChange: (field: "name" | "quantity" | "unitPrice", value: string) => void;
  onDelete: () => void;
}

export function ItemRow({
  name,
  quantity,
  unitPrice,
  onChange,
  onDelete,
}: ItemRowProps) {
  return (
    <Row>
      <ItemInput
        value={name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Item name"
      />
      <ItemInput
        type="number"
        inputMode="numeric"
        value={quantity}
        onChange={(e) => onChange("quantity", e.target.value)}
        min={1}
      />
      <ItemInput
        type="number"
        inputMode="decimal"
        value={unitPrice}
        onChange={(e) => onChange("unitPrice", e.target.value)}
        min={0}
        step={0.01}
      />
      <DeleteButton onClick={onDelete} aria-label="Delete item">
        <Trash2 size={18} />
      </DeleteButton>
    </Row>
  );
}
```

- [ ] **Step 2: Create session creation page**

Create `src/app/sessions/new/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@linaria/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/Button";
import { Input, InputGroup, Label } from "@/components/Input";
import { ItemRow } from "@/components/ItemRow";
import { useReceipt } from "@/context/ReceiptContext";
import { createSession } from "@/lib/api";
import type { SessionItemRequest } from "@/lib/types";

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const Section = styled.section`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 60px 80px 40px;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted-foreground);
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-primary);
  width: 100%;
  justify-content: center;
  min-height: 44px;
  margin-top: 8px;

  &:hover {
    background: var(--color-muted);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 14px;
  margin-bottom: 12px;
`;

interface EditableItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function SessionNewPage() {
  const { items: parsedItems, clear } = useReceipt();
  const router = useRouter();

  const [items, setItems] = useState<EditableItem[]>([]);
  const [serviceCharge, setServiceCharge] = useState("10");
  const [gst, setGst] = useState("9");
  const [discount, setDiscount] = useState("0");
  const [participantCount, setParticipantCount] = useState("1");
  const [paynowId, setPaynowId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parsedItems.length === 0) {
      router.replace("/");
      return;
    }
    setItems(
      parsedItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }))
    );
  }, [parsedItems, router]);

  function updateItem(
    index: number,
    field: "name" | "quantity" | "unitPrice",
    value: string
  ) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === "name" ? value : Number(value) || 0,
            }
          : item
      )
    );
  }

  function deleteItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addItem() {
    setItems((prev) => [...prev, { name: "", quantity: 1, unitPrice: 0 }]);
  }

  async function handleSubmit() {
    const validItems = items.filter(
      (item) => item.name.trim() && item.quantity > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      setError("Add at least one valid item");
      return;
    }
    if (!paynowId.trim()) {
      setError("Enter your mobile number for PayNow");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createSession({
        hostPaynowId: paynowId.trim(),
        items: validItems as SessionItemRequest[],
        taxRate: Number(gst) / 100,
        serviceChargeRate: Number(serviceCharge) / 100,
        discount: Number(discount) || 0,
        participantCount: Number(participantCount) || 1,
      });
      clear();
      router.push(`/sessions/${response.sessionId}/dashboard`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create session"
      );
    } finally {
      setLoading(false);
    }
  }

  if (parsedItems.length === 0) return null;

  return (
    <div>
      <Title>Review Your Bill</Title>

      <Section>
        <SectionTitle>Items</SectionTitle>
        <HeaderRow>
          <span>Name</span>
          <span>Qty</span>
          <span>Price</span>
          <span></span>
        </HeaderRow>
        {items.map((item, index) => (
          <ItemRow
            key={index}
            name={item.name}
            quantity={item.quantity}
            unitPrice={item.unitPrice}
            onChange={(field, value) => updateItem(index, field, value)}
            onDelete={() => deleteItem(index)}
          />
        ))}
        <AddButton onClick={addItem}>
          <Plus size={16} /> Add Item
        </AddButton>
      </Section>

      <Section>
        <SectionTitle>Charges</SectionTitle>
        <Row>
          <InputGroup>
            <Label htmlFor="serviceCharge">Service Charge %</Label>
            <Input
              id="serviceCharge"
              type="number"
              inputMode="decimal"
              value={serviceCharge}
              onChange={(e) => setServiceCharge(e.target.value)}
              min={0}
              max={100}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="gst">GST %</Label>
            <Input
              id="gst"
              type="number"
              inputMode="decimal"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              min={0}
              max={100}
            />
          </InputGroup>
        </Row>
        <InputGroup style={{ marginTop: 12 }}>
          <Label htmlFor="discount">Discount ($)</Label>
          <Input
            id="discount"
            type="number"
            inputMode="decimal"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            min={0}
            step={0.01}
          />
        </InputGroup>
      </Section>

      <Section>
        <SectionTitle>Participants</SectionTitle>
        <InputGroup>
          <Label htmlFor="participantCount">Number of participants</Label>
          <Input
            id="participantCount"
            type="number"
            inputMode="numeric"
            value={participantCount}
            onChange={(e) => setParticipantCount(e.target.value)}
            min={1}
          />
        </InputGroup>
      </Section>

      <Section>
        <SectionTitle>Your PayNow</SectionTitle>
        <InputGroup>
          <Label htmlFor="paynowId">Mobile number</Label>
          <Input
            id="paynowId"
            type="tel"
            inputMode="tel"
            value={paynowId}
            onChange={(e) => setPaynowId(e.target.value)}
            placeholder="91234567"
          />
        </InputGroup>
      </Section>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Session"}
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Verify the page**

```bash
npm run dev
```

Navigate to `/sessions/new` directly — should redirect to `/` since context is empty. Upload a receipt (with backend running) to test the full flow.

- [ ] **Step 4: Commit**

```bash
git add src/app/sessions/new/page.tsx src/components/ItemRow.tsx
git commit -m "feat: add session creation page with editable items and charges"
```

---

### Task 7: Host Dashboard Page (`/sessions/[id]/dashboard`)

**Files:**
- Create: `src/app/sessions/[id]/dashboard/page.tsx`
- Create: `src/components/CopyLink.tsx`

- [ ] **Step 1: Create CopyLink component**

Create `src/components/CopyLink.tsx`:

```tsx
"use client";

import { useState } from "react";
import { styled } from "@linaria/react";
import { Copy, Check } from "lucide-react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--color-muted);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: var(--color-border);
  }
`;

const LinkText = styled.span`
  font-size: 14px;
  color: var(--color-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

interface CopyLinkProps {
  url: string;
}

export function CopyLink({ url }: CopyLinkProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Wrapper onClick={handleCopy}>
      <LinkText>{url}</LinkText>
      {copied ? (
        <Check size={18} color="var(--color-primary)" />
      ) : (
        <Copy size={18} color="var(--color-muted-foreground)" />
      )}
    </Wrapper>
  );
}
```

- [ ] **Step 2: Create dashboard page**

Create `src/app/sessions/[id]/dashboard/page.tsx`:

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { styled } from "@linaria/react";
import { RefreshCw } from "lucide-react";
import { getSession, getSessionSummary } from "@/lib/api";
import { CopyLink } from "@/components/CopyLink";
import { Button } from "@/components/Button";
import type { GetSessionResponse, SessionSummaryResponse } from "@/lib/types";

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: var(--color-muted-foreground);
  margin-bottom: 24px;
`;

const Section = styled.section`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Card = styled.div`
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
`;

const SummaryLabel = styled.span`
  color: var(--color-muted-foreground);
`;

const SummaryValue = styled.span`
  font-weight: 600;
`;

const GrandTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 18px;
  font-weight: 700;
  border-top: 1px solid var(--color-border);
  margin-top: 8px;
`;

const ParticipantCard = styled.div`
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 12px 16px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ParticipantName = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const ParticipantAmount = styled.span`
  font-size: 14px;
`;

const PaidBadge = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--color-primary);
  color: white;
  margin-left: 8px;
`;

const UnpaidBadge = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--color-muted);
  color: var(--color-muted-foreground);
  margin-left: 8px;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-card);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-muted-foreground);
  min-height: 44px;

  &:hover {
    background: var(--color-muted);
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const UnclaimedItem = styled.div`
  font-size: 14px;
  padding: 4px 0;
  color: var(--color-muted-foreground);
`;

export default function DashboardPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<GetSessionResponse | null>(null);
  const [summary, setSummary] = useState<SessionSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sessionData, summaryData] = await Promise.all([
        getSession(sessionId),
        getSessionSummary(sessionId),
      ]);
      setSession(sessionData);
      setSummary(summaryData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !session) return <p>Loading...</p>;
  if (!session || !summary) return <p>Session not found</p>;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/sessions/${sessionId}`
      : "";

  const paidNames = new Set(session.payments.map((p) => p.participantName));

  return (
    <div>
      <TopBar>
        <div>
          <Title>Dashboard</Title>
          <Subtitle>Share the link below with participants</Subtitle>
        </div>
        <RefreshButton onClick={fetchData}>
          <RefreshCw size={14} /> Refresh
        </RefreshButton>
      </TopBar>

      <Section>
        <SectionTitle>Share Link</SectionTitle>
        <CopyLink url={shareUrl} />
      </Section>

      <Section>
        <SectionTitle>Bill Summary</SectionTitle>
        <Card>
          <SummaryRow>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>${summary.rawSubtotal.toFixed(2)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>
              Service Charge ({(summary.serviceChargeRate * 100).toFixed(0)}%)
            </SummaryLabel>
            <SummaryValue>${summary.serviceCharge.toFixed(2)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>
              GST ({(summary.taxRate * 100).toFixed(0)}%)
            </SummaryLabel>
            <SummaryValue>${summary.tax.toFixed(2)}</SummaryValue>
          </SummaryRow>
          {summary.discount > 0 && (
            <SummaryRow>
              <SummaryLabel>Discount</SummaryLabel>
              <SummaryValue>-${summary.discount.toFixed(2)}</SummaryValue>
            </SummaryRow>
          )}
          <GrandTotal>
            <span>Total</span>
            <span>${summary.grandTotal.toFixed(2)}</span>
          </GrandTotal>
        </Card>
      </Section>

      <Section>
        <SectionTitle>
          Participants ({summary.participants.length})
        </SectionTitle>
        {summary.participants.length === 0 && (
          <p style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>
            No one has claimed items yet
          </p>
        )}
        {summary.participants.map((p) => (
          <ParticipantCard key={p.name}>
            <div>
              <ParticipantName>{p.name}</ParticipantName>
              {paidNames.has(p.name) ? (
                <PaidBadge>Paid</PaidBadge>
              ) : (
                <UnpaidBadge>Unpaid</UnpaidBadge>
              )}
            </div>
            <ParticipantAmount>${p.totalOwed.toFixed(2)}</ParticipantAmount>
          </ParticipantCard>
        ))}
      </Section>

      {summary.unclaimed.items.length > 0 && (
        <Section>
          <SectionTitle>Unclaimed Items</SectionTitle>
          <Card>
            {summary.unclaimed.items.map((item) => (
              <UnclaimedItem key={item.id}>
                {item.name} x{item.quantity} — ${item.unitPrice.toFixed(2)}
              </UnclaimedItem>
            ))}
          </Card>
        </Section>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify the page**

```bash
npm run dev
```

Navigate to `/sessions/<valid-id>/dashboard` — should show session data from the backend.

- [ ] **Step 4: Commit**

```bash
git add src/app/sessions/\[id\]/dashboard/page.tsx src/components/CopyLink.tsx
git commit -m "feat: add host dashboard with summary, participants, and share link"
```

---

### Task 8: Participant Claim Page (`/sessions/[id]`)

**Files:**
- Create: `src/app/sessions/[id]/page.tsx`
- Create: `src/components/ClaimItem.tsx`
- Create: `src/components/PayNowQR.tsx`

- [ ] **Step 1: Create PayNowQR component**

Create `src/components/PayNowQR.tsx`:

```tsx
"use client";

import { QRCodeSVG } from "qrcode.react";
import { styled } from "@linaria/react";

const QRWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
`;

const QRLabel = styled.p`
  font-size: 14px;
  color: var(--color-muted-foreground);
  text-align: center;
`;

const Amount = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: var(--color-foreground);
`;

interface PayNowQRProps {
  paynowId: string;
  amount: number;
}

export function PayNowQR({ paynowId, amount }: PayNowQRProps) {
  const payloadUrl = generatePayNowPayload(paynowId, amount);

  return (
    <QRWrapper>
      <QRCodeSVG value={payloadUrl} size={200} />
      <Amount>${amount.toFixed(2)}</Amount>
      <QRLabel>Scan to pay via PayNow to {paynowId}</QRLabel>
    </QRWrapper>
  );
}

function generatePayNowPayload(mobile: string, amount: number): string {
  // PayNow QR uses EMVCo standard
  // Simplified: encode as a PayNow-compatible string
  // Format: proxy type (mobile) + proxy value + amount
  const proxyType = "0"; // 0 = mobile
  const proxyValue = `+65${mobile.replace(/\D/g, "").replace(/^65/, "")}`;
  return [
    "00020101021126380009SG.PAYNOW",
    `01${proxyType.length.toString().padStart(2, "0")}${proxyType}`,
    `02${proxyValue.length.toString().padStart(2, "0")}${proxyValue}`,
    `0301${amount > 0 ? "0" : "2"}`,
    `5802SG`,
    `5303702`,
    amount > 0
      ? `54${amount.toFixed(2).length.toString().padStart(2, "0")}${amount.toFixed(2)}`
      : "",
    "6304",
  ]
    .filter(Boolean)
    .join("");
}
```

- [ ] **Step 2: Create ClaimItem component**

Create `src/components/ClaimItem.tsx`:

```tsx
"use client";

import { styled } from "@linaria/react";
import { Minus, Plus } from "lucide-react";

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const ItemMeta = styled.p`
  font-size: 12px;
  color: var(--color-muted-foreground);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QtyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-card);
  cursor: pointer;
  color: var(--color-foreground);

  &:hover {
    background: var(--color-muted);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QtyDisplay = styled.span`
  font-size: 16px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

interface ClaimItemProps {
  name: string;
  unitPrice: number;
  availableQty: number;
  claimedQty: number;
  onQuantityChange: (qty: number) => void;
}

export function ClaimItem({
  name,
  unitPrice,
  availableQty,
  claimedQty,
  onQuantityChange,
}: ClaimItemProps) {
  return (
    <Row>
      <ItemInfo>
        <ItemName>{name}</ItemName>
        <ItemMeta>
          ${unitPrice.toFixed(2)} each &middot; {availableQty} available
        </ItemMeta>
      </ItemInfo>
      <Controls>
        <QtyButton
          onClick={() => onQuantityChange(claimedQty - 1)}
          disabled={claimedQty <= 0}
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </QtyButton>
        <QtyDisplay>{claimedQty}</QtyDisplay>
        <QtyButton
          onClick={() => onQuantityChange(claimedQty + 1)}
          disabled={claimedQty >= availableQty}
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </QtyButton>
      </Controls>
    </Row>
  );
}
```

- [ ] **Step 3: Create participant page**

Create `src/app/sessions/[id]/page.tsx`:

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { styled } from "@linaria/react";
import { Button } from "@/components/Button";
import { Input, InputGroup, Label } from "@/components/Input";
import { ClaimItem } from "@/components/ClaimItem";
import { PayNowQR } from "@/components/PayNowQR";
import {
  getSession,
  getSessionSummary,
  createClaims,
  markPaid,
  unmarkPaid,
} from "@/lib/api";
import type {
  GetSessionResponse,
  SessionSummaryResponse,
} from "@/lib/types";

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const Section = styled.section`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 14px;
  margin-bottom: 12px;
`;

const SuccessMessage = styled.p`
  color: var(--color-primary);
  font-size: 14px;
  margin-bottom: 12px;
`;

const MyShareCard = styled.div`
  background: var(--color-muted);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
  margin-bottom: 16px;
`;

const ShareAmount = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: var(--color-foreground);
`;

const ShareLabel = styled.p`
  font-size: 14px;
  color: var(--color-muted-foreground);
  margin-top: 4px;
`;

const STORAGE_KEY_PREFIX = "bill-splitter-name-";

export default function ParticipantPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<GetSessionResponse | null>(null);
  const [summary, setSummary] = useState<SessionSummaryResponse | null>(null);
  const [name, setName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [claims, setClaims] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [sessionData, summaryData] = await Promise.all([
        getSession(sessionId),
        getSessionSummary(sessionId),
      ]);
      setSession(sessionData);
      setSummary(summaryData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const savedName = localStorage.getItem(
      `${STORAGE_KEY_PREFIX}${sessionId}`
    );
    if (savedName) {
      setName(savedName);
      setNameSubmitted(true);
    }
  }, [sessionId]);

  function handleNameSubmit() {
    if (!name.trim()) return;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${sessionId}`, name.trim());
    setNameSubmitted(true);
  }

  function getAvailableQty(itemId: string, totalQty: number): number {
    if (!session) return 0;
    const claimedByOthers = session.claims
      .filter((c) => c.itemId === itemId && c.participantName !== name)
      .reduce((sum, c) => sum + c.quantity, 0);
    return totalQty - claimedByOthers;
  }

  async function handleSubmitClaims() {
    const claimEntries = Object.entries(claims).filter(([, qty]) => qty > 0);
    if (claimEntries.length === 0) {
      setError("Select at least one item");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createClaims(sessionId, {
        participantName: name,
        claims: claimEntries.map(([itemId, quantity]) => ({
          itemId,
          quantity,
        })),
      });
      setSuccess("Items claimed successfully!");
      setClaims({});
      await fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit claims"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePaid() {
    if (!session) return;
    const isPaid = session.payments.some(
      (p) => p.participantName === name
    );
    try {
      if (isPaid) {
        await unmarkPaid(sessionId, { participantName: name });
      } else {
        await markPaid(sessionId, { participantName: name });
      }
      await fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update payment"
      );
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!session) return <p>Session not found</p>;

  if (!nameSubmitted) {
    return (
      <div>
        <Title>Join Bill Split</Title>
        <InputGroup>
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
          />
        </InputGroup>
        <Button onClick={handleNameSubmit} style={{ marginTop: 16 }}>
          Continue
        </Button>
      </div>
    );
  }

  const myParticipant = summary?.participants.find(
    (p) => p.name === name
  );
  const isPaid = session.payments.some((p) => p.participantName === name);
  const myClaims = session.claims.filter(
    (c) => c.participantName === name
  );

  return (
    <div>
      <Title>Hi, {name}</Title>

      {myParticipant && (
        <Section>
          <MyShareCard>
            <ShareAmount>${myParticipant.totalOwed.toFixed(2)}</ShareAmount>
            <ShareLabel>Your share (incl. GST & service charge)</ShareLabel>
          </MyShareCard>

          <PayNowQR
            paynowId={session.hostPaynowId}
            amount={myParticipant.totalOwed}
          />

          <Button
            onClick={handleTogglePaid}
            variant={isPaid ? "secondary" : "primary"}
            style={{ marginTop: 16 }}
          >
            {isPaid ? "Unmark as Paid" : "Mark as Paid"}
          </Button>
        </Section>
      )}

      <Section>
        <SectionTitle>
          {myClaims.length > 0 ? "Claim More Items" : "Select Your Items"}
        </SectionTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {session.items.map((item) => (
          <ClaimItem
            key={item.id}
            name={item.name}
            unitPrice={item.unitPrice}
            availableQty={getAvailableQty(item.id, item.quantity)}
            claimedQty={claims[item.id] || 0}
            onQuantityChange={(qty) =>
              setClaims((prev) => ({ ...prev, [item.id]: qty }))
            }
          />
        ))}

        <Button
          onClick={handleSubmitClaims}
          disabled={submitting}
          style={{ marginTop: 16 }}
        >
          {submitting ? "Submitting..." : "Submit Claims"}
        </Button>
      </Section>

      {myClaims.length > 0 && (
        <Section>
          <SectionTitle>My Claimed Items</SectionTitle>
          {myClaims.map((c) => (
            <p key={`${c.itemId}-${c.participantName}`} style={{ fontSize: 14, padding: "4px 0" }}>
              {c.itemName} x{c.quantity}
            </p>
          ))}
        </Section>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify the page**

```bash
npm run dev
```

Navigate to `/sessions/<valid-id>` — should prompt for name, then show items to claim.

- [ ] **Step 5: Commit**

```bash
git add src/app/sessions/\[id\]/page.tsx src/components/ClaimItem.tsx src/components/PayNowQR.tsx
git commit -m "feat: add participant claim page with item selection and PayNow QR"
```

---

### Task 9: Final Polish and Testing

**Files:**
- Modify: `src/app/globals.css` (ensure all transitions work)
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Create not-found page**

Create `src/app/not-found.tsx`:

```tsx
import { styled } from "@linaria/react";

const Wrapper = styled.div`
  text-align: center;
  padding: 64px 16px;
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Message = styled.p`
  font-size: 14px;
  color: var(--color-muted-foreground);
`;

export default function NotFound() {
  return (
    <Wrapper>
      <Heading>Page Not Found</Heading>
      <Message>The session you&apos;re looking for doesn&apos;t exist.</Message>
    </Wrapper>
  );
}
```

- [ ] **Step 2: Add .env.local to .gitignore**

Append to `.gitignore`:

```
.env.local
```

- [ ] **Step 3: Run the full app and test flows**

```bash
npm run dev
```

Manual test checklist:
1. Homepage loads, upload area clickable
2. Selecting image shows filename preview
3. After parsing, redirected to `/sessions/new` with prefilled items
4. Can edit/add/delete items
5. Service charge and GST prefilled at 10% and 9%
6. Submitting creates session, redirects to dashboard
7. Dashboard shows share link, summary, and participants
8. Copy link works
9. Participant page prompts for name
10. Participant can claim items and submit
11. PayNow QR displays with correct amount
12. Mark as Paid toggles payment status
13. Host dashboard reflects updated claims/payments on refresh

- [ ] **Step 4: Run type check**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/not-found.tsx .gitignore
git commit -m "feat: add not-found page and finalize app polish"
```

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Project scaffolding (Next.js + Linaria) | 10 min |
| 2 | Shared components (Container, Button, Input) | 10 min |
| 3 | API client + TypeScript types | 10 min |
| 4 | ReceiptContext provider | 5 min |
| 5 | Upload receipt page | 15 min |
| 6 | Session creation page | 20 min |
| 7 | Host dashboard page | 20 min |
| 8 | Participant claim page | 25 min |
| 9 | Polish and testing | 15 min |

**Total estimated: ~2 hours**
