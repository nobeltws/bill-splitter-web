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
