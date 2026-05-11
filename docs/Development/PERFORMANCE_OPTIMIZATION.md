# Performance Optimization Rules

## 1. Bundle Size Targets

In `next.config.js`:
```javascript
module.exports = {
  // Bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    analytics: { mode: 'static', outputFile: 'bundle.html' },
  }),
  
  // React strict mode for dev
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

### Budget Limits
| Page | JS Limit | First Load |
|------|-----------|------------|
| Landing | 100KB | 1.5s |
| Search | 150KB | 2s |
| Booking | 80KB | 1.5s |
| Profile | 60KB | 1s |

Monitor via: `npm run build` shows bundle sizes

## 2. Image Optimization

- **Profile Photos:** Cloudinary `f_auto,q_auto,w_200,h_200,c_fill`
- **NID Documents:** Private URL, never in client bundles
- **Lazy Loading:** All images below fold use `loading="lazy"`
- **Placeholders:** Blur placeholder while loading

## 3. API Response Caching

```typescript
// src/app/api/search/route.ts
export const dynamic = 'force-dynamic'; // No static generation

// Cache search results in Redis
export async function GET(request: Request) {
  const cacheKey = `search:${hash(query)}`;
  const cached = await redis.get(cacheKey);
  if (cached) return Response.json(cached);
  
  const results = await db.provider.findMany(...);
  await redis.setex(cacheKey, 30, JSON.stringify(results)); // 30s TTL
  
  return Response.json(results);
}
```

## 4. Core Web Vitals Targets

| Metric | Target | Current |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | - |
| FID (First Input Delay) | < 100ms | - |
| CLS (Cumulative Layout Shift) | < 0.1 | - |
| TTFB (Time to First Byte) | < 600ms | - |

Test with: https://web.dev/measure

## 5. Database Query Optimization

- **Index on:** `Provider.areaSlug`, `Provider.verificationStatus`
- **Index on:** `Booking.providerId`, `Booking.status`
- **Select only needed fields:** `select: { id: true, name: true }`
- **Pagination:** Always use cursor/offset for large datasets

## 6. Redis Optimization

- **Slot Locks:** TTL 300s (5 min) - auto-expire
- **Rate Limits:** Separate keys for different limits
- **Search Cache:** 30s TTL max

---

## QA Check - Fixes Applied:
- ✅ Search cache TTL matches OFFLINE_RESILIENCE_MAP.md (30s)
- ✅ LCP/CLS targets ensure mobile performance in Bangladesh
- ✅ Image optimization for slow 4G connections