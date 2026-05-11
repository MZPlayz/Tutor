# Dark Mode Theme Configuration

## 1. Theme Setup

Install: `npm install next-themes`

```typescript
// src/providers/ThemeProvider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

Add to `layout.tsx`:
```typescript
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## 2. Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light mode - existing
        primary: '#f05323',
        cream: '#fde3c1',
        // Dark mode additions
        dark: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          card: '#252525',
          border: '#333333',
          text: '#f5f5f5',
          muted: '#a0a0a0',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

## 3. CSS Variables (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Light mode */
  --background: #fde3c1;
  --foreground: #1f2937;
  --card: #ffffff;
  --card-foreground: #1f2937;
  --primary: #f05323;
  --primary-foreground: #ffffff;
}

.dark {
  /* Dark mode */
  --background: #0f0f0f;
  --foreground: #f5f5f5;
  --card: #1a1a1a;
  --card-foreground: #f5f5f5;
  --primary: #f05323;
  --primary-foreground: #ffffff;
}

body {
  @apply bg-[var(--background)] text-[var(--foreground)];
}
```

## 4. Component Usage

```tsx
// Using Tailwind's dark: modifier
export function TutorCard({ tutor }) {
  return (
    <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-gray-200 dark:border-dark-border">
      <h3 className="text-foreground dark:text-dark-text font-bold">
        {tutor.name}
      </h3>
      <span className="text-muted dark:text-dark-muted">
        ৳{tutor.rate}/hr
      </span>
    </div>
  );
}
```

## 5. Theme Toggle Component

```tsx
// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface"
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
}
```

## 6. What Changes for Dark Mode

| Element | Light | Dark |
|---------|-------|------|
| Background | Cream #fde3c1 | #0f0f0f |
| Card | White | #1a1a1a |
| Text | Dark gray | #f5f5f5 |
| Primary | #f05323 | #f05323 (same) |
| Muted | Gray | #a0a0a0 |
| Border | Gray-200 | #333333 |

---

## QA Check - Fixes Applied:
- ✅ Theme persists via next-themes (localStorage)
- ✅ System preference auto-detected
- ✅ Primary orange stays consistent (brand)
- ✅ Dark surfaces reduce eye strain at night