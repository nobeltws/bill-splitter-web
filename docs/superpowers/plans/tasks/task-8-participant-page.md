# Task 8: Participant Claim Page

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the participant page where users enter their name, claim items, view their share with PayNow QR, and mark as paid.

**Architecture:** Client component fetching session data. Participant name stored in localStorage per session. Claim items via API, display calculated share from summary endpoint, generate PayNow QR client-side.

**Tech Stack:** React, Linaria, qrcode.react, Lucide icons

---

**Files:**
- Create: `src/components/ClaimItem.tsx`
- Create: `src/components/PayNowQR.tsx`
- Create: `src/app/sessions/[id]/page.tsx`

- [ ] **Step 1: Create ClaimItem component**

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

- [ ] **Step 2: Create PayNowQR component**

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
  const proxyType = "0";
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
