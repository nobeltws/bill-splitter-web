"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@linaria/react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { useReceipt } from "@/context/ReceiptContext";
import { parseReceipt } from "@/lib/api";
import { Loader2 } from "lucide-react";

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: var(--color-muted-foreground);
  margin-bottom: 32px;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 14px;
  margin-top: 12px;
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
    <div>
      <Title>Bill Splitter</Title>
      <Subtitle>Upload your receipt to get started</Subtitle>
      <FileUpload file={file} onFileSelect={setFile} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button
        onClick={handleSubmit}
        disabled={!file || loading}
        style={{ marginTop: 24 }}
      >
        {loading ? <Loader2 size={20} className="spin" /> : null}
        {loading ? "Scanning..." : "Scan Receipt"}
      </Button>
    </div>
  );
}
