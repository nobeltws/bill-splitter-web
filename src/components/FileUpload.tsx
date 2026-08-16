"use client";

import { styled } from "@linaria/react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { useRef } from "react";

const UploadArea = styled.div`
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
  background: var(--color-card);
  box-shadow: var(--shadow-sm);

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
    box-shadow: var(--shadow-md);
  }
`;

const UploadLabel = styled.p`
  font-size: 15px;
  color: var(--color-muted-foreground);
  margin-top: 12px;
`;

const UploadHint = styled.p`
  font-size: 13px;
  color: var(--color-muted-foreground);
  opacity: 0.7;
  margin-top: 4px;
`;

const Preview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-primary-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm, 8px);
  margin-top: 16px;
`;

const FileName = styled.span`
  font-size: 14px;
  color: var(--color-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: var(--color-muted);
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: var(--color-error);
    color: white;
  }
`;

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
}

export function FileUpload({ file, onFileSelect, onFileRemove }: FileUploadProps) {
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
        <Upload size={32} color="var(--color-primary)" />
        <UploadLabel>Tap to upload receipt image</UploadLabel>
        <UploadHint>JPG, PNG, or HEIC</UploadHint>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </UploadArea>
      {file && (
        <Preview>
          <ImageIcon size={20} color="var(--color-primary)" />
          <FileName>{file.name}</FileName>
          {onFileRemove && (
            <RemoveButton onClick={onFileRemove} aria-label="Remove file">
              <X size={14} />
            </RemoveButton>
          )}
        </Preview>
      )}
    </div>
  );
}
