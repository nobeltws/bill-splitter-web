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

interface PayNowQRProps {
  paynowId: string;
  amount: number;
}

export function PayNowQR({ paynowId, amount }: PayNowQRProps) {
  const payload = generatePayNowPayload(paynowId, amount);

  return (
    <QRWrapper>
      <QRCodeSVG value={payload} size={200} />
      <QRLabel>Scan to pay via PayNow</QRLabel>
    </QRWrapper>
  );
}

function tlv(tag: string, value: string): string {
  return tag + value.length.toString().padStart(2, "0") + value;
}

function crc16ccitt(data: Uint8Array): number {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i] << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }
  return crc;
}

function generatePayNowPayload(mobile: string, amount: number): string {
  const cleanMobile = mobile.replace(/\D/g, "").replace(/^65/, "");
  const proxyValue = "+65" + cleanMobile;

  const merchantAccountInfo = [
    tlv("00", "SG.PAYNOW"),
    tlv("01", "0"),
    tlv("02", proxyValue),
    tlv("03", "1"),
  ].join("");

  let payload = [
    tlv("00", "01"),
    tlv("01", "11"),
    tlv("26", merchantAccountInfo),
    tlv("52", "0000"),
    tlv("53", "702"),
    tlv("54", amount.toFixed(2)),
    tlv("58", "SG"),
    tlv("59", "NA"),
    tlv("60", "Singapore"),
  ].join("");

  payload += "6304";
  const crc = crc16ccitt(new TextEncoder().encode(payload));
  payload += crc.toString(16).padStart(4, "0").toUpperCase();

  return payload;
}
