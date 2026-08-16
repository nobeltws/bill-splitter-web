"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { styled } from "@linaria/react";
import { RefreshCw } from "lucide-react";
import { getSession, getSessionSummary } from "@/lib/api";
import { CopyLink } from "@/components/CopyLink";
import type { GetSessionResponse, SessionSummaryResponse } from "@/lib/api";

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
