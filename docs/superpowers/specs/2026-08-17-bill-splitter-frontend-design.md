# Bill Splitter Frontend — Design Spec

## Goal

Build a mobile-first Next.js (App Router) frontend for a bill-splitting app. Users upload a receipt image, review parsed items, create a session, share a link with participants, and track payments.

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Styling:** Linaria (zero-runtime CSS-in-JS, static extraction at build)
- **QR Code:** `qrcode.react` for PayNow QR generation
- **Language:** TypeScript
- **Max width:** 720px centered container
- **Theme:** Light mode only

## Design System

- **Style:** Flat Design — no shadows, no gradients, clean lines
- **Colors:**
  - Primary: `#059669` (green — balance/success)
  - Accent/CTA: `#DC2626` (red — owe/destructive)
  - Background: `#F8FAFC`
  - Foreground: `#0F172A`
  - Card: `#FFFFFF`
  - Muted: `#F0F8F6`
  - Muted Foreground: `#475569`
  - Border: `#E1F2ED`
- **Typography:** Inter (400, 600, 700), base 16px, line-height 1.5
- **Interactions:** 150-200ms ease transitions, no complex animations
- **Icons:** Lucide React (SVG, no emoji)

## Architecture

### Routing

| Route | Purpose | Role |
|-------|---------|------|
| `/` | Upload receipt image | Host |
| `/sessions/new` | Review/edit items, set charges, create session | Host |
| `/sessions/[id]/dashboard` | View payment progress, share link | Host |
| `/sessions/[id]` | View items, claim items, mark paid | Participant |

### State Management

- **ReceiptContext** — React Context provider wrapping the app. Stores parsed receipt data (items list) from the upload step. Used to pass data from `/` to `/sessions/new` without query params.
- If context is empty on `/sessions/new`, redirect to `/` (handles browser refresh).
- After session creation, context is cleared — no longer needed.
- Individual session pages (`/sessions/[id]` and `/sessions/[id]/dashboard`) fetch data directly from the API.

### API Integration

Backend base URL configured via `NEXT_PUBLIC_API_URL` environment variable.

| Endpoint | Frontend Usage |
|----------|---------------|
| `POST /api/receipts/parse` | Upload page — send image, receive parsed items |
| `POST /api/sessions` | Session creation page — submit finalized bill |
| `GET /api/sessions/{id}` | Participant page + Host dashboard — fetch session state |
| `GET /api/sessions/{id}/summary` | Host dashboard — per-participant totals |
| `POST /api/sessions/{id}/claims` | Participant page — claim items |
| `DELETE /api/sessions/{id}/claims` | Participant page — unclaim an item |
| `POST /api/sessions/{id}/payments` | Participant page — mark self as paid |
| `DELETE /api/sessions/{id}/payments` | Participant page — unmark paid |

## Page Designs

### Page 1: Upload Receipt (`/`)

- Centered card with upload area
- Tap/click to select image (accepts camera on mobile)
- Shows file name + thumbnail preview after selection
- "Scan Receipt" button triggers upload
- Loading state with spinner during API call
- On success: store parsed items in ReceiptContext, navigate to `/sessions/new`
- On error: show inline error message, allow retry

### Page 2: Session Creation (`/sessions/new`)

- **Items section:** Editable table/list of parsed items (name, qty, unit price). Each row has edit/delete. "Add Item" button at bottom.
- **Charges section:**
  - Service Charge % — prefilled 10%
  - GST % — prefilled 9%
  - Discount $ — prefilled 0
- **Participants section:**
  - Number of participants (numeric input, min 1)
- **Payment section:**
  - Host mobile number (for PayNow QR) — required
- **Submit button:** Creates session via API, navigates to `/sessions/[id]/dashboard`

### Page 3: Host Dashboard (`/sessions/[id]/dashboard`)

- **Share section:** Shareable link (copy button) pointing to `/sessions/[id]`
- **Summary section:** Grand total, breakdown (subtotal, service charge, GST, discount)
- **Participants table:** Each participant's name, items claimed, amount owed, paid status
- **Unclaimed items:** List of items not yet claimed by anyone
- Auto-refresh or manual refresh button to see latest state

### Page 4: Participant Claim Page (`/sessions/[id]`)

- **Name input:** Participant enters their name (persisted in localStorage for the session)
- **Items list:** All session items with quantity available. Participant selects which items they're paying for and how many units.
- **Submit claims:** Sends claims to API, shows confirmation
- **My share:** After claiming, shows calculated amount owed (from summary API)
- **PayNow QR:** Displays QR code with host's PayNow ID and amount
- **Mark as Paid:** Button to mark their share as paid
- Shows other participants' claims (read-only) so they can see what's taken

## Error Handling

- API errors show inline toast/banner messages
- Form validation: required fields highlighted, prevent submit until valid
- Network errors: retry prompt
- 404 sessions: "Session not found" page

## Accessibility

- All inputs have visible labels (no placeholder-only)
- Min touch target 44x44px
- Focus rings visible for keyboard nav
- Contrast ratio 4.5:1 minimum
- `inputmode="numeric"` for number fields
- `inputmode="tel"` for phone number
