"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@linaria/react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useReceipt } from "@/context/ReceiptContext";
import { parseReceipt, listSessions } from "@/lib/api";
import type { SessionListItem } from "@/lib/api";
import { Loader2, Receipt, Search, ChevronRight } from "lucide-react";

const Wrapper = styled.div`
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

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: var(--color-muted-foreground);
  margin-bottom: 32px;
  max-width: 280px;
`;

const ContentArea = styled.div`
  width: 100%;
  text-align: left;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 14px;
  margin-top: 12px;
  text-align: center;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 32px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }
`;

const DividerText = styled.span`
  font-size: 13px;
  color: var(--color-muted-foreground);
  font-weight: 500;
`;

const SessionsSection = styled.div`
  width: 100%;
  text-align: left;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 8px;
`;

const SearchInput = styled(Input)`
  flex: 1;
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  min-height: 48px;
  border-radius: var(--radius-sm, 8px);
  border: none;
  background: var(--color-primary);
  color: #ffffff;
  cursor: pointer;

  &:hover {
    background: #047857;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SessionList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 12px;
`;

const SessionItem = styled.li`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm, 8px);
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: var(--color-muted);
  }
`;

const SessionLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  text-decoration: none;
  color: inherit;
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SessionName = styled.span`
  font-size: 15px;
  font-weight: 500;
`;

const SessionDate = styled.span`
  font-size: 13px;
  color: var(--color-muted-foreground);
`;

const EmptyState = styled.p`
  font-size: 14px;
  color: var(--color-muted-foreground);
  text-align: center;
  padding: 16px 0;
`;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setItems } = useReceipt();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [sessions, setSessions] = useState<SessionListItem[] | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

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

  async function handleSearchSessions() {
    if (!phoneNumber.trim()) return;
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const result = await listSessions(phoneNumber.trim());
      setSessions(result.sessions);
    } catch (err) {
      setSessionsError(
        err instanceof Error ? err.message : "Failed to fetch sessions"
      );
    } finally {
      setSessionsLoading(false);
    }
  }

  return (
    <Wrapper>
      <IconCircle>
        <Receipt size={28} color="var(--color-primary)" />
      </IconCircle>
      <Title>Bill Splitter</Title>
      <Subtitle>Upload a photo of your receipt and we'll split it for you</Subtitle>
      <ContentArea>
        <FileUpload file={file} onFileSelect={setFile} onFileRemove={() => setFile(null)} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button
          onClick={handleSubmit}
          disabled={!file || loading}
          style={{ marginTop: 24 }}
        >
          {loading ? <Loader2 size={20} className="spin" /> : null}
          {loading ? "Scanning..." : "Scan Receipt"}
        </Button>
      </ContentArea>

      <Divider>
        <DividerText>or</DividerText>
      </Divider>

      <SessionsSection>
        <SectionTitle>Find Your Sessions</SectionTitle>
        <SearchRow>
          <SearchInput
            type="tel"
            inputMode="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhoneNumber(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") handleSearchSessions();
            }}
          />
          <SearchButton
            onClick={handleSearchSessions}
            disabled={!phoneNumber.trim() || sessionsLoading}
            aria-label="Search sessions"
          >
            {sessionsLoading ? (
              <Loader2 size={20} className="spin" />
            ) : (
              <Search size={20} />
            )}
          </SearchButton>
        </SearchRow>

        {sessionsError && <ErrorMessage>{sessionsError}</ErrorMessage>}

        {sessions !== null && (
          <SessionList>
            {sessions.length === 0 ? (
              <EmptyState>No sessions found for this number.</EmptyState>
            ) : (
              sessions.map((session) => (
                <SessionItem key={session.sessionId}>
                  <SessionLink
                    href={`/sessions/${session.sessionId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/sessions/${session.sessionId}`);
                    }}
                  >
                    <SessionInfo>
                      <SessionName>{session.name}</SessionName>
                      <SessionDate>
                        {new Date(session.createdAt).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </SessionDate>
                    </SessionInfo>
                    <ChevronRight
                      size={18}
                      color="var(--color-muted-foreground)"
                    />
                  </SessionLink>
                </SessionItem>
              ))
            )}
          </SessionList>
        )}
      </SessionsSection>
    </Wrapper>
  );
}
