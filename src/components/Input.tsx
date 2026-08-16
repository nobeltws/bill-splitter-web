"use client";

import { styled } from "@linaria/react";

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-foreground);
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm, 8px);
  font-size: 16px;
  font-family: inherit;
  background: var(--color-card);
  color: var(--color-foreground);
  min-height: 48px;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
  }

  &::placeholder {
    color: var(--color-muted-foreground);
    opacity: 0.6;
  }
`;
