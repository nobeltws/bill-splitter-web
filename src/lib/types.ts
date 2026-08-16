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
