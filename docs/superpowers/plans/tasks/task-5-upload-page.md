# Task 5: Upload Receipt Page

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the home page where users upload a receipt image. On success, store parsed items in context and navigate to the session creation page.

**Architecture:** Client component with file input (supports camera on mobile). Calls `POST /api/receipts/parse` with the image. Stores result in ReceiptContext, navigates to `/sessions/new`.

**Tech Stack:** React, Linaria, Lucide icons, ReceiptContext

---

**Files:**
- Create: `src/components/FileUpload.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create FileUpload component**

Create `src/components/FileUpload.tsx`:

```tsx
"use client";

import { styled } from "@linaria/react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";

const UploadArea = styled.div`
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;
  background: var(--color-card);

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-muted);
  }
`;

const UploadLabel = styled.p`
  font-size: 16px;
  color: var(--color-muted-foreground);
  margin-top: 12px;
`;

const Preview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-muted);
  border-radius: var(--radius);
  margin-top: 16px;
`;

const FileName = styled.span`
  font-size: 14px;
  color: var(--color-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export function FileUpload({ file, onFileSelect }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  }

  return (
    <div>
      <UploadArea onClick={handleClick}>
        <Upload size={32} color="var(--color-muted-foreground)" />
        <UploadLabel>Tap to upload receipt image</UploadLabel>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </UploadArea>
      {file && (
        <Preview>
          <ImageIcon size={20} color="var(--color-primary)" />
          <FileName>{file.name}</FileName>
        </Preview>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the upload page**

Replace `src/app/page.tsx`:

```tsx
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
```

- [ ] **Step 3: Verify upload page renders**

```bash
npm run dev
```

Expected: Homepage shows title, subtitle, upload area, and disabled button. Selecting a file enables the button and shows the filename.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/FileUpload.tsx
git commit -m "feat: add receipt upload page with file selection and API call"
```
