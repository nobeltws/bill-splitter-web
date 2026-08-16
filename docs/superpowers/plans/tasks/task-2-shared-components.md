# Task 2: Shared Layout and Container Components

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create reusable Container, Button, and Input components with Linaria styling. Wrap the app layout in a max-720px centered container.

**Architecture:** Client components using Linaria's `styled` API. Container enforces max-width constraint globally via the root layout.

**Tech Stack:** Linaria, React, TypeScript

---

**Files:**
- Create: `src/components/Container.tsx`
- Create: `src/components/Button.tsx`
- Create: `src/components/Input.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Container component**

Create `src/components/Container.tsx`:

```tsx
"use client";

import { styled } from "@linaria/react";

export const Container = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100dvh;
`;
```

- [ ] **Step 2: Create Button component**

Create `src/components/Button.tsx`:

```tsx
"use client";

import { styled } from "@linaria/react";

export const Button = styled.button<{ variant?: "primary" | "secondary" | "danger" }>`
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

  background-color: ${(props) =>
    props.variant === "danger"
      ? "var(--color-error)"
      : props.variant === "secondary"
      ? "var(--color-muted)"
      : "var(--color-primary)"};

  color: ${(props) =>
    props.variant === "secondary"
      ? "var(--color-foreground)"
      : "#FFFFFF"};

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

- [ ] **Step 3: Create Input component**

Create `src/components/Input.tsx`:

```tsx
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
```

- [ ] **Step 4: Update root layout to use Container**

Update `src/app/layout.tsx`:

```tsx
import "./globals.css";
import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Bill Splitter",
  description: "Split bills easily with friends",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Container>{children}</Container>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify components render**

```bash
npm run dev
```

Expected: App renders with centered container (max 720px), no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Container.tsx src/components/Button.tsx src/components/Input.tsx src/app/layout.tsx
git commit -m "feat: add shared Container, Button, and Input components"
```
