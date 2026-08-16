# Task 9: Final Polish and Testing

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add not-found page, update .gitignore, and verify the full app works end-to-end.

**Architecture:** Static not-found page, final configuration cleanup.

**Tech Stack:** Next.js, TypeScript

---

**Files:**
- Create: `src/app/not-found.tsx`
- Modify: `.gitignore`

- [ ] **Step 1: Create not-found page**

Create `src/app/not-found.tsx`:

```tsx
import { styled } from "@linaria/react";

const Wrapper = styled.div`
  text-align: center;
  padding: 64px 16px;
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Message = styled.p`
  font-size: 14px;
  color: var(--color-muted-foreground);
`;

export default function NotFound() {
  return (
    <Wrapper>
      <Heading>Page Not Found</Heading>
      <Message>The session you&apos;re looking for doesn&apos;t exist.</Message>
    </Wrapper>
  );
}
```

- [ ] **Step 2: Update .gitignore**

Ensure `.gitignore` includes:

```
.env.local
.env*.local
```

- [ ] **Step 3: Run type check**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 4: Run the full app and test flows**

```bash
npm run dev
```

Manual test checklist:
1. Homepage loads, upload area clickable
2. Selecting image shows filename preview
3. After parsing, redirected to `/sessions/new` with prefilled items
4. Can edit/add/delete items
5. Service charge and GST prefilled at 10% and 9%
6. Submitting creates session, redirects to dashboard
7. Dashboard shows share link, summary, and participants
8. Copy link works
9. Participant page prompts for name
10. Participant can claim items and submit
11. PayNow QR displays with correct amount
12. Mark as Paid toggles payment status
13. Host dashboard reflects updated claims/payments on refresh

- [ ] **Step 5: Commit**

```bash
git add src/app/not-found.tsx .gitignore
git commit -m "feat: add not-found page and finalize app polish"
```
