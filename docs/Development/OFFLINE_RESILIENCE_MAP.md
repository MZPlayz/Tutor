# Offline Resilience & Connectivity: Tutor

## 1. PWA Capabilities (next-pwa)
- **Caching:** Cache the `search` results and `tutor profiles` locally using service workers.
- **Cache TTL:** Maximum 30 seconds for slot/search data. Always show "Last updated X seconds ago" warning.
- **Offline View:** If offline, show a "Currently Offline" banner but allow tutors to view their *already loaded* schedule for the day.

## 2. Optimistic UI Updates
- **Search:** Show skeleton loaders immediately.
- **Slot Selection:** When a student taps a slot, highlight it instantly in the UI before the server responds (rollback if the lock fails).

## 3. Payment Interruption Handling
- **The "Lost Redirect" Scenario:** If the user loses internet during the SSLCommerz redirect, the **Self-Healing Cron** (Doc 5) is the primary fallback.
- **Retry Logic:** If the payment gateway fails to load, provide a "Retry Payment" button on the `My Bookings` page.
- **CRITICAL:** On retry, ALWAYS re-acquire the Redis lock. If lock fails (slot taken), show "Slot no longer available" and redirect to search.
- **Idempotency:** Use the same `idempotencyKey` on retry to prevent double-charging.

## 4. Background Sync
- If a tutor updates their schedule while in a "dead zone" (e.g., an elevator or basement), queue the update and push it to Neon as soon as the connection returns.
- Use `navigator.onLine` listener to trigger sync when connection returns.