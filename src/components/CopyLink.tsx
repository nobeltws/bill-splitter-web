"use client";

import { useState } from "react";
import { styled } from "@linaria/react";
import { Copy, Check } from "lucide-react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--color-muted);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: var(--color-border);
  }
`;

const LinkText = styled.span`
  font-size: 14px;
  color: var(--color-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

interface CopyLinkProps {
  url: string;
}

export function CopyLink({ url }: CopyLinkProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Wrapper onClick={handleCopy}>
      <LinkText>{url}</LinkText>
      {copied ? (
        <Check size={18} color="var(--color-primary)" />
      ) : (
        <Copy size={18} color="var(--color-muted-foreground)" />
      )}
    </Wrapper>
  );
}
