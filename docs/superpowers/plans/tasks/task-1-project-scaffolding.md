# Task 1: Project Scaffolding

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a Next.js App Router project with Linaria for zero-runtime CSS-in-JS, configure design tokens, and verify the app runs.

**Architecture:** Next.js 14+ with App Router, TypeScript, Linaria via wyw-in-style webpack loader. Mobile-first layout capped at 720px, light mode only.

**Tech Stack:** Next.js, TypeScript, Linaria, @wyw-in-style/webpack-loader

---

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `.env.local`

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest . --typescript --app --src-dir --no-tailwind --no-eslint --import-alias "@/*"
```

Select defaults when prompted. This creates the base Next.js App Router project.

- [ ] **Step 2: Install dependencies**

```bash
npm install @linaria/core @linaria/react qrcode.react lucide-react
npm install -D @wyw-in-style/webpack-loader @wyw-in-style/babel-preset
```

- [ ] **Step 3: Configure Linaria with Next.js**

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(tsx|ts|js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "@wyw-in-style/webpack-loader",
          options: {
            sourceMap: process.env.NODE_ENV !== "production",
            babelOptions: {
              presets: ["@wyw-in-style/babel-preset"],
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
```

- [ ] **Step 4: Create environment file**

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- [ ] **Step 5: Set up global styles**

Replace `src/app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

:root {
  --color-primary: #059669;
  --color-accent: #DC2626;
  --color-background: #F8FAFC;
  --color-foreground: #0F172A;
  --color-card: #FFFFFF;
  --color-muted: #F0F8F6;
  --color-muted-foreground: #475569;
  --color-border: #E1F2ED;
  --color-success: #059669;
  --color-error: #DC2626;
  --radius: 8px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-foreground);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}
```

- [ ] **Step 6: Create root layout**

Replace `src/app/layout.tsx`:

```tsx
import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder home page**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return <h1>Bill Splitter</h1>;
}
```

- [ ] **Step 8: Verify the app runs**

```bash
npm run dev
```

Expected: App starts on http://localhost:3000 without errors. Page shows "Bill Splitter" heading.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js project with Linaria and design tokens"
```
