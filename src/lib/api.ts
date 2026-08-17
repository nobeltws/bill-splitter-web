import createClient from "openapi-fetch";
import type { paths, components } from "./api-types";

// Re-export commonly used schema types for convenience
export type ParsedReceipt = components["schemas"]["ParsedReceipt"];
export type ParsedItem = components["schemas"]["ParsedItem"];
export type CreateSessionRequest = components["schemas"]["CreateSessionRequest"];
export type CreateSessionResponse = components["schemas"]["CreateSessionResponse"];
export type GetSessionResponse = components["schemas"]["GetSessionResponse"];
export type SessionSummaryResponse = components["schemas"]["SessionSummaryResponse"];
export type CreateClaimsRequest = components["schemas"]["CreateClaimsRequest"];
export type CreateClaimsResponse = components["schemas"]["CreateClaimsResponse"];
export type PaymentRequest = components["schemas"]["PaymentRequest"];
export type PaymentResponse = components["schemas"]["PaymentResponse"];
export type SessionItemRequest = components["schemas"]["SessionItemRequest"];
export type SessionItemResponse = components["schemas"]["SessionItemResponse"];
export type SessionClaimResponse = components["schemas"]["SessionClaimResponse"];
export type SessionPaymentResponse = components["schemas"]["SessionPaymentResponse"];
export type ParticipantSummary = components["schemas"]["ParticipantSummary"];
export type UnclaimedItem = components["schemas"]["UnclaimedItem"];
export type UnclaimedSummary = components["schemas"]["UnclaimedSummary"];
export type ListSessionsResponse = components["schemas"]["ListSessionsResponse"];
export type SessionListItem = components["schemas"]["SessionListItem"];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const client = createClient<paths>({ baseUrl: BASE_URL });

// ---------------------------------------------------------------------------
// Convenience wrapper functions (preserving the existing API surface)
// ---------------------------------------------------------------------------

export async function parseReceipt(image: File): Promise<ParsedReceipt> {
  // openapi-fetch does not handle File objects well for multipart when the
  // generated type is `string`. Use raw fetch with FormData instead.
  const formData = new FormData();
  formData.append("image", image);

  const res = await fetch(`${BASE_URL}/api/receipts/parse`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail?.[0]?.msg || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<ParsedReceipt>;
}

export async function createSession(
  data: CreateSessionRequest
): Promise<CreateSessionResponse> {
  const { data: result, error } = await client.POST("/api/sessions", {
    body: data,
  });

  if (error) {
    const detail = (error as { detail?: { msg: string }[] })?.detail;
    throw new Error(detail?.[0]?.msg || "Request failed");
  }

  return result;
}

export async function getSession(
  sessionId: string
): Promise<GetSessionResponse> {
  const { data: result, error } = await client.GET(
    "/api/sessions/{session_id}",
    { params: { path: { session_id: sessionId } } }
  );

  if (error) {
    const detail = (error as { detail?: { msg: string }[] })?.detail;
    throw new Error(detail?.[0]?.msg || "Request failed");
  }

  return result;
}

export async function getSessionSummary(
  sessionId: string
): Promise<SessionSummaryResponse> {
  const { data: result, error } = await client.GET(
    "/api/sessions/{session_id}/summary",
    { params: { path: { session_id: sessionId } } }
  );

  if (error) {
    const detail = (error as { detail?: { msg: string }[] })?.detail;
    throw new Error(detail?.[0]?.msg || "Request failed");
  }

  return result;
}

export async function createClaims(
  sessionId: string,
  data: CreateClaimsRequest
): Promise<CreateClaimsResponse> {
  const { data: result, error } = await client.POST(
    "/api/sessions/{session_id}/claims",
    {
      params: { path: { session_id: sessionId } },
      body: data,
    }
  );

  if (error) {
    const detail = (error as { detail?: { msg: string }[] })?.detail;
    throw new Error(detail?.[0]?.msg || "Request failed");
  }

  return result;
}

export async function deleteClaim(
  sessionId: string,
  participantName: string,
  itemId: string
): Promise<void> {
  const { error } = await client.DELETE(
    "/api/sessions/{session_id}/claims",
    {
      params: { path: { session_id: sessionId } },
      body: { participantName, itemId },
    }
  );

  if (error) {
    const detail = (error as { detail?: { msg: string }[] })?.detail;
    throw new Error(detail?.[0]?.msg || "Request failed");
  }
}

export async function markPaid(
  sessionId: string,
  data: PaymentRequest
): Promise<PaymentResponse> {
  const { data: result, error } = await client.POST(
    "/api/sessions/{session_id}/payments",
    {
      params: { path: { session_id: sessionId } },
      body: data,
    }
  );

  if (error) {
    const detail = (error as { detail?: { msg: string }[] })?.detail;
    throw new Error(detail?.[0]?.msg || "Request failed");
  }

  return result;
}

export async function unmarkPaid(
  sessionId: string,
  data: PaymentRequest
): Promise<PaymentResponse> {
  const { data: result, error } = await client.DELETE(
    "/api/sessions/{session_id}/payments",
    {
      params: { path: { session_id: sessionId } },
      body: data,
    }
  );

  if (error) {
    const detail = (error as { detail?: { msg: string }[] })?.detail;
    throw new Error(detail?.[0]?.msg || "Request failed");
  }

  return result;
}

export async function listSessions(
  hostPaynowId: string
): Promise<ListSessionsResponse> {
  const { data: result, error } = await client.GET("/api/sessions", {
    params: { query: { hostPaynowId } },
  });

  if (error) {
    const detail = (error as { detail?: { msg: string }[] })?.detail;
    throw new Error(detail?.[0]?.msg || "Request failed");
  }

  return result;
}
