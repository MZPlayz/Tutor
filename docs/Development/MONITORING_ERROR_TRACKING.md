# Monitoring & Error Tracking (Sentry)

## 1. Setup

Install:
```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  
  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Session replay (optional, costs more)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Filter out expected errors
  beforeSend(event) {
    // Filter out 404s on static assets
    if (event.request?.url?.includes('/_next/static/')) {
      return null;
    }
    return event;
  },
});
```

## 2. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=your_auth_token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

## 3. Capture Custom Events

```typescript
// In Server Actions
import { captureException } from '@sentry/nextjs';

export async function createBooking(data: BookingData) {
  try {
    // Booking logic...
  } catch (error) {
    // Add context before sending
    captureException(error, {
      extra: {
        providerId: data.providerId,
        slotTime: data.slotStart,
        userId: data.userId,
      },
    });
    throw error;
  }
}
```

## 4. Frontend Error Boundary

```tsx
// src/components/ErrorBoundary.tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="text-muted">We're working on fixing this.</p>
      <button 
        onClick={reset}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
}
```

Wrap in `layout.tsx`:
```typescript
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

## 5. API Route Monitoring

```typescript
// src/app/api/search/route.ts
import { withSentry } from '@sentry/nextjs';

export const GET = withSentry(async (request) => {
  // Your route logic...
});
```

## 6. Sentry Dashboard Metrics

Track in Sentry:
- **Error Rate:** Errors per minute
- **Apdex Score:** User satisfaction
- **Top Errors:** Most frequent issues
- **Release Health:** Crash-free users

## 7. Custom Alerts

In Sentry UI:
- Error > 10/min → Email Admin
-特定错误 (e.g., payment failure) → SMS to Admin

---

## QA Check - Fixes Applied:
- ✅ Production errors captured automatically
- ✅ Booking failures include context (providerId, userId)
- ✅ Error boundary prevents full app crash
- ✅ Alert on critical errors (payment, disputes)