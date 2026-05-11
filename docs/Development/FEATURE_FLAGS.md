# Feature Flags & Gradual Rollout

## 1. Flag Structure

Use Upstash Redis or LaunchDarkly for feature flags:

```typescript
// lib/feature-flags.ts
const flags = {
  // Booking Engine
  booking_enabled: true,
  recurring_booking: false, // New feature - rollout slowly
  
  // Payments  
  bkash_direct: false, // Test with small % first
  nagad_enabled: false,
  
  // UI Features
  new_search_ui: false,
  profile_v2: false,
  
  // Safety
  emergency_button: true,
  auto_suspend_strikes: true,
};

export async function isEnabled(flag: keyof typeof flags): Promise<boolean> {
  const cached = await redis.get(`flag:${flag}`);
  return cached === 'true' || flags[flag];
}
```

## 2. Rollout Strategy

| Feature | Initial % | Ramp Up | Criteria |
|---------|-----------|---------|----------|
| Booking Engine | 100% | - | Core feature |
| Recurring Booking | 5% | 20% → 50% → 100% | 0 errors for 24h |
| bKash Direct | 10% | 50% → 100% | Payment success >95% |
| Emergency Button | 100% | - | Safety critical |
| New Search UI | 20% | 50% → 100% | User feedback positive |

## 3. Percentage-Based Rollout

```typescript
async function shouldShowFeature(userId: string, flag: string): Promise<boolean> {
  const hash = await redis.get(`flag:${flag}:hash`);
  const bucket = parseInt(hash.substring(0, 8), 16) % 100;
  const userBucket = parseInt(userId.substring(0, 8), 16) % 100;
  return userBucket < bucket;
}
```

## 4. Admin Flag Management

Create `/admin/flags` page:
- Toggle switches for each flag
- View current % rollout
- Override for specific users (beta testers)

---

## QA Check - Fixes Applied:
- ✅ `recurring_booking` flag for safe rollout
- ✅ `auto_suspend_strikes` can be disabled if issues arise
- ✅ Allows testing features with small % before full rollout