"use client";

import { styled } from "@linaria/react";

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 150ms ease, transform 100ms ease;
  min-height: 48px;
  min-width: 44px;
  width: 100%;
  background-color: var(--color-primary);
  color: #ffffff;
  box-shadow: var(--shadow-sm);

  &:hover {
    background-color: #047857;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &[data-variant="secondary"] {
    background-color: var(--color-muted);
    color: var(--color-foreground);
    box-shadow: none;

    &:hover {
      background-color: var(--color-border);
    }
  }

  &[data-variant="danger"] {
    background-color: var(--color-error);
    color: #ffffff;

    &:hover {
      background-color: #b91c1c;
    }
  }
`;
