"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@linaria/react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { useReceipt } from "@/context/ReceiptContext";
import { parseReceipt } from "@/lib/api";
import { Loader2, Receipt } from "lucide-react";

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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setItems } = useReceipt();
  const router = useRouter();

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
    </Wrapper>
  );
}
