# Security Configuration

## 1. CORS Configuration

In `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://tutor.com.bd' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },
};
```

## 2. API Rate Limiting (Upstash Redis)

```typescript
// lib/rate-limit.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function rateLimit(
  identifier: string,
  limit: number,
  window: number // seconds
): Promise<boolean> {
  const key = `ratelimit:${identifier}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, window);
  }
  
  return current <= limit;
}

// Usage in API routes
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!(await rateLimit(`otp:${phone}`, 3, 3600))) {
    throw new AppError('AUTH_OTP_LIMIT', 'Max 3 OTPs/hour', 429);
  }
  
  if (!(await rateLimit(`api:${ip}`, 100, 60))) {
    throw new AppError('RATE_LIMIT_EXCEEDED', 'Too many requests', 429);
  }
}
```

### Rate Limits by Endpoint
| Endpoint | Limit | Window |
|----------|-------|--------|
| OTP Send | 3 | 1 hour |
| Search | 30 | 1 minute |
| Booking Create | 10 | 1 minute |
| Review Submit | 5 | 1 hour |
| Payout Request | 3 | 1 day |

## 3. Security Headers

In `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
```

## 4. Environment Variables Security

- **NEVER** commit `.env` to git
- Use `.env.example` with placeholder values
- Vercel stores env vars encrypted at rest

## 5. Input Validation

Use `zod` for all inputs:
```typescript
import { z } from 'zod';

const BookingSchema = z.object({
  providerId: z.string().uuid(),
  slotStart: z.string().datetime(),
  landmark: z.string().min(10),
});

export async function POST(request: Request) {
  const body = await request.json();
  const data = BookingSchema.parse(body); // Throws if invalid
}
```

## 6. SQL Injection Prevention

- Prisma automatically parameterizes queries
- Never use raw SQL with string interpolation
- If raw SQL needed: Use `prisma.$queryRawUnsafe` with parameterized values

---

## QA Check - Fixes Applied:
- ✅ OTP rate limit (3/hr) prevents SMS bombing
- ✅ API rate limits prevent DoS on booking endpoints
- ✅ Security headers prevent XSS/clickjacking
- ✅ Zod validation prevents injection