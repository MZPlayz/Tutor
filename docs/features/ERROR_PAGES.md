# Error Pages Specification

## 1. 404 Not Found Page

`src/app/not-found.tsx`:

```tsx
import Link from 'next/link';
import { HomeIcon, ArrowLeftIcon } from '@tabler/icons-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-cream dark:bg-dark-bg">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        
        <h1 className="text-2xl font-bold text-foreground dark:text-dark-text mb-2">
          Page Not Found
        </h1>
        
        <p className="text-muted dark:text-dark-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <HomeIcon size={20} />
            Go Home
          </Link>
          
          <Link 
            href="/search"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-dark-border rounded-xl"
          >
            <ArrowLeftIcon size={20} />
            Browse Tutors
          </Link>
        </div>
      </div>
    </main>
  );
}
```

## 2. 500 Internal Server Error

`src/app/global-error.tsx` (for Next.js app):

```tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="bg-cream dark:bg-dark-bg">
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl font-bold text-red-500 mb-4">500</div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Something went wrong
            </h1>
            
            <p className="text-muted mb-8">
              We're working on fixing this issue.
            </p>
            
            <button
              onClick={reset}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

## 3. Error Boundary Component

`src/components/ErrorBoundary.tsx`:

```tsx
'use client';

import { Component, ReactNode } from 'react';
import { HomeIcon } from '@tabler/icons-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Optionally send to Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Something went wrong
            </h2>
            <p className="text-muted mb-6">
              Please refresh the page or return home.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl"
            >
              <HomeIcon size={20} />
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 4. Custom Error Page (src/app/error.tsx)

```tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted mb-6">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-primary text-white rounded-xl"
      >
        Try again
      </button>
    </div>
  );
}
```

## 5. Loading States (src/app/loading.tsx)

```tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  );
}
```

## 6. Skeleton Loaders

For each main component:

```tsx
// src/components/SearchSkeleton.tsx
export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search bar skeleton */}
      <div className="h-12 bg-gray-200 dark:bg-dark-surface rounded-xl animate-pulse" />
      
      {/* Area chips skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-dark-surface rounded-full animate-pulse" />
        ))}
      </div>
      
      {/* Tutor cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 bg-card dark:bg-dark-card rounded-xl">
          <div className="w-12 h-12 bg-gray-200 dark:bg-dark-surface rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-dark-surface rounded animate-pulse" />
            <div className="h-3 w-32 bg-gray-200 dark:bg-dark-surface rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-dark-surface rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## QA Check - Fixes Applied:
- ✅ 404 page for invalid routes
- ✅ 500 page with Sentry integration
- ✅ Error boundary prevents full app crash
- ✅ Skeleton loaders for search, cards
- ✅ Loading spinner for actions