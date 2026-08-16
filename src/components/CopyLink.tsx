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
    await navigator.clipboard.writeText(url);
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
