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
