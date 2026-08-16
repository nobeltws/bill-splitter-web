"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import { Users } from "lucide-react";
import type {
  GetSessionResponse,
  SessionSummaryResponse,
} from "@/lib/api";

const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 64px);
  text-align: center;
`;

const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const WelcomeTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 15px;
  color: var(--color-muted-foreground);
  margin-bottom: 32px;
  max-width: 260px;
`;

const FormArea = styled.div`
  width: 100%;
  text-align: left;
`;

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

  const topRef = useRef<HTMLDivElement>(null);
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
      .filter((c) => c.itemId === itemId && c.participantName.toLowerCase() !== name.toLowerCase())
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
      topRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <CenteredWrapper>
        <IconCircle>
          <Users size={28} color="var(--color-primary)" />
        </IconCircle>
        <WelcomeTitle>Join Bill Split</WelcomeTitle>
        <WelcomeSubtitle>Enter your name to claim your items</WelcomeSubtitle>
        <FormArea>
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
        </FormArea>
      </CenteredWrapper>
    );
  }

  const myParticipant = summary?.participants.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  const isPaid = session.payments.some(
    (p) => p.participantName.toLowerCase() === name.toLowerCase()
  );
  const myClaims = session.claims.filter(
    (c) => c.participantName.toLowerCase() === name.toLowerCase()
  );

  return (
    <div ref={topRef}>
      <Title>Hi, {name}</Title>

      {myParticipant && (
        <Section>
          <MyShareCard>
            <ShareAmount>${myParticipant.totalOwed.toFixed(2)}</ShareAmount>
            <ShareLabel>Your share (incl. GST &amp; service charge)</ShareLabel>
          </MyShareCard>

          <PayNowQR
            paynowId={session.hostPaynowId}
            amount={myParticipant.totalOwed}
          />

          <Button
            onClick={handleTogglePaid}
            data-variant={isPaid ? "secondary" : undefined}
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
