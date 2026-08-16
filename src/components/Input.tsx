"use client";

import { styled } from "@linaria/react";

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-foreground);
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 16px;
  font-family: inherit;
  background: var(--color-card);
  color: var(--color-foreground);
  min-height: 44px;
  transition: border-color 150ms ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.15);
  }

  &::placeholder {
    color: var(--color-muted-foreground);
  }
`;
