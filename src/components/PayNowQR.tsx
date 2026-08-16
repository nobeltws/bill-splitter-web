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
