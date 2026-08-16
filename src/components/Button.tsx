"use client";

import { styled } from "@linaria/react";

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 150ms ease;
  min-height: 44px;
  min-width: 44px;
  width: 100%;
  background-color: var(--color-primary);
  color: #ffffff;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &[data-variant="secondary"] {
    background-color: var(--color-muted);
    color: var(--color-foreground);
  }

  &[data-variant="danger"] {
    background-color: var(--color-error);
    color: #ffffff;
  }
`;
