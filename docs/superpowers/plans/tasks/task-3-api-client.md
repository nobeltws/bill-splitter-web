# Task 3: API Client Module

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create TypeScript types matching the backend API schema and a fetch-based API client module.

**Architecture:** Single `api.ts` module with typed functions for each endpoint. Types derived from swagger.json schemas. Uses `NEXT_PUBLIC_API_URL` env var for base URL.

**Tech Stack:** TypeScript, Fetch API

---

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/api.ts`

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
