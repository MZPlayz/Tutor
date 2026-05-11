# Analytics Events Specification

## 1. Event Tracking Architecture

Use **Posthog** or **Google Analytics 4** with these events:

```typescript
type AnalyticsEvent = {
  name: string;
  properties: Record<string, string | number | boolean>;
  timestamp: Date;
};
```

## 2. User Events

| Event | Trigger | Properties |
|-------|---------|-------------|
| `otp_sent` | User requests OTP | `{ phone_last_4: string }` |
| `otp_verified` | OTP successfully verified | `{ user_id: string }` |
| `signup_complete` | New user completes onboarding | `{ source: 'organic' \| 'referral' }` |
| `role_toggled` | User switches mode | `{ new_mode: 'client' \| 'tutor' }` |

## 3. Search Events

| Event | Trigger | Properties |
|-------|---------|-------------|
| `search_performed` | User submits search | `{ area: string, subject: string, results_count: number }` |
| `search_no_results` | Search returns 0 tutors | `{ area: string, subject: string }` |
| `demand_lead_created` | User requests notification | `{ area: string, subject: string, phone_provided: boolean }` |
| `filter_applied` | User changes filters | `{ filter_type: string, value: string }` |

## 4. Booking Events

| Event | Trigger | Properties |
|-------|---------|-------------|
| `slot_selected` | User taps a slot | `{ provider_id: string, date: string, slot_time: string }` |
| `slot_locked` | Redis lock acquired | `{ provider_id: string, slot: string, lock_ttl: 300 }` |
| `slot_lock_failed` | Lock attempt failed | `{ provider_id: string, reason: 'already_locked' }` |
| `checkout_started` | User reaches checkout | `{ provider_id: string, amount: number }` |
| `payment_initiated` | Redirect to SSLCommerz | `{ booking_id: string, amount: number, method: 'bkash' \| 'nagad' \| 'card' }` |
| `payment_success` | Webhook confirms payment | `{ booking_id: string, amount: number }` |
| `payment_failed` | Payment fails/cancels | `{ booking_id: string, failure_reason: string }` |
| `retry_payment` | User retries failed payment | `{ booking_id: string }` |

## 5. Tutor Events

| Event | Trigger | Properties |
|-------|---------|-------------|
| `verification_submitted` | Tutor uploads NID | `{ provider_id: string }` |
| `verification_approved` | Admin approves | `{ provider_id: string }` |
| `verification_rejected` | Admin rejects | `{ provider_id: string, reason: string }` |
| `schedule_updated` | Tutor saves schedule | `{ provider_id: string, days_affected: number }` |
| `payout_requested` | Tutor requests withdrawal | `{ provider_id: string, amount: number }` |
| `check_in_recorded` | Tutor clicks "at landmark" | `{ booking_id: string, geo_accuracy: number }` |

## 6. Dispute Events

| Event | Trigger | Properties |
|-------|---------|-------------|
| `dispute_filed` | Student reports issue | `{ booking_id: string, issue_type: string }` |
| `dispute_resolved` | Admin resolves | `{ booking_id: string, outcome: 'refund' \| 'release', reason: string }` |

## 7. Revenue Events (Important for You)

| Event | Trigger | Properties |
|-------|---------|-------------|
| `session_completed` | Cron marks completed | `{ booking_id: string, tutor_earns: number, platform_fee: number }` |
| `payout_processed` | Admin marks paid | `{ provider_id: string, amount: number }` |

## 8. Dashboard Metrics to Track

### Key Metrics (Show in Admin Panel)
- **GMV (Gross Merchandise Value):** Total payments processed
- **Platform Revenue:** Sum of platform fees
- **Active Tutors:** Tutors with 1+ confirmed booking this month
- **Active Students:** Students with 1+ booking this month
- **No-Show Rate:** Disputes / Total bookings
- **Search Zero-Rate:** Searches with 0 results / Total searches

---

## QA Check - Fixes Applied:
- ✅ `slot_lock_failed` tracks race condition occurrences
- ✅ `search_no_results` feeds the Heatmap (from ANALYTICS_DEMAND_LOGGING.md)
- ✅ `check_in_recorded` ensures dispute proof working
- ✅ Revenue events track platform fee accurately