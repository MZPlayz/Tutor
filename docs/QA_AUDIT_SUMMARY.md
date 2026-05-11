# Tutor QA Audit - Plan Summary

## 🔴 CRITICAL FLAWS (5)

### 1. Race Condition: Slot Selection vs Payment Lock
- **Location:** `ENGINE_LOGIC.md:15-19` + `STUDENT_JOURNEY.md:16-21`
- **Problem:** Lock is set only when clicking "Pay", not when selecting a slot. Two students can select the same slot, both click "Pay", and the first one wins. The second gets a confusing error AFTER entering payment details.
- **Fix:** Set Redis lock when user taps the slot (not just when paying).

### 2. Missing `check_in_timestamp` Column
- **Location:** `DATABASE_SCHEMA.prisma` vs `TUTOR_JOURNEY.md:17-19`
- **Problem:** The journey doc says tutor clicks "I am at the landmark" to capture `check_in_timestamp`, but this column doesn't exist in the Booking model. Disputes cannot be proven.
- **Fix:** Add `checkInTime DateTime?` and `checkInGeo geography?` to Booking model.

### 3. Retry Payment Reuses Slot (But Lock Expired)
- **Location:** `OFFLINE_RESILIENCE_MAP.md:13`
- **Problem:** "Retry Payment" restarts SSLCommerz without re-locking. If the 5-min lock already expired (user's internet died), another student could have booked that slot. User pays for an already-taken slot.
- **Fix:** On retry, ALWAYS re-acquire lock. If fails, show "Slot no longer available."

### 4. Double Payment Without Idempotency
- **Location:** `PAYMENT_FLOW_RECONCILIATION.md:4-10`
- **Problem:** If SSLCommerz redirect fails and user retries, there's no idempotency key. A user could be charged 2x for the same slot.
- **Fix:** Add `paymentAttemptId` to Booking and verify uniqueness in webhook.

### 5. Wallet Balance Not Atomic with Payout
- **Location:** `API_ROUTE_MAP.md:24`
- **Problem:** "decrement walletBalance, create PayoutRequest" - if DB fails after decrement, tutor loses money.
- **Fix:** Use database transaction with rollback.

---

## 🔴 BUSINESS RISKS (5)

### 6. Platform Leakage via In-App Chat
- **Location:** `ANTI_CHEAT_LOGIC.md:4-6`
- **Problem:** Regex only scans `bio` field. After booking is confirmed, student and tutor can exchange numbers in the in-app messaging (not defined in docs but implied). They go off-platform for next booking. 5% fee bypassed.
- **Fix:** Disable file/link sharing in chat. Auto-censor phone number patterns in messages.

### 7. Fake Dispute Attack
- **Location:** `DISPUTE_RESOLUTION_MATRIX.md:5`
- **Problem:** A student can file "No-Show" dispute for ANY session (even if they actually received the class). With no check-in proof, Admin must manually mediate EVERY dispute. At scale, this is an Admin nightmare.
- **Fix:** Require photo proof or check-in timestamp as mandatory evidence.

### 8. Tutor No-Show Without Consequence
- **Location:** `DISPUTE_RESOLUTION_MATRIX.md` + `DATABASE_SCHEMA.prisma`
- **Problem:** A tutor can accept a booking, not show up, and face no financial penalty. The student gets a refund, but the tutor's only penalty is a "Strike" (undefined how many strikes = ban). A tutor could do this repeatedly.
- **Fix:** Auto-suspend tutor after 2 strikes. Track in schema.

### 9. Manual Payout Does Not Scale
- **Location:** `ADMIN_OPS_WORKFLOW.md:14-24`
- **Problem:** Admin must manually send bKash/Nagad, then paste Transaction ID. At 100 payouts/day, this is 2-3 hours of daily work. Human error in copying amounts.
- **Fix:** Integrate bKash Payout API or at least batch process.

### 10. Platform Fee Calculated on Gross, Not Net
- **Location:** `DATABASE_SCHEMA.prisma:87` + `REVENUE_PAYOUT_LOGIC.md:3`
- **Problem:** Platform keeps 5% + 2% SSLCommerz fee. If student pays ৳100, SSLCommerz takes ~৳2, you take ৳5, tutor gets ৳93. But you stored `platformFee` as 5% of ৳100 = ৳5. Tutor expects ৳95 (100-5), gets ৳93. Confirmed bookings will have disputes.
- **Fix:** Calculate platform fee on net amount after gateway fee, or clearly communicate "Gross rate" to tutors.

---

## 🔴 LOCAL CONTEXT GAPS (5)

### 11. GPS is Useless in Narayanganj
- **Location:** `ENGINE_LOGIC.md:11-14` + `STUDENT_JOURNEY.md:6-7`
- **Problem:** PostGIS radius search uses lat/lng. But GPS in Narayanganj can be off by 500m-1km. A tutor at "Chasara Bridge" might appear in "Fatullah" search. Both parties are frustrated.
- **Fix:** Make `area_slug` the PRIMARY filter, radius as secondary. Trust local knowledge over GPS.

### 12. 3-Hour Lead Time is Too Long
- **Location:** `ENGINE_LOGIC.md:5`
- **Problem:** "Students cannot book less than 3 hours from now." In Dhaka, parents often need a tutor SAME DAY for exam prep. This rule makes the app useless for urgent needs.
- **Fix:** Reduce to 1-hour lead time for online sessions, 2 hours for in-person.

### 13. No bKash/Nagad Direct Integration
- **Location:** `TECH_STACK_SPEC.md:18`
- **Problem:** SSLCommerz supports bKash/Nagad, but in Bangladesh, users expect "Pay with bKash" to open the bKash app directly (USSD-like). SSLCommerz usually does a checkout page redirect. Users abandon.
- **Fix:** Confirm SSLCommerz wallet integration method. Consider direct bKash Payment API if available.

### 14. GreenWeb SMS Failure = No Notifications
- **Location:** `MESSAGING_MATRIX.md`
- **Problem:** ALL notifications are SMS-based. If GreenWeb is down (common), students and tutors have ZERO info about bookings. No push notification fallback defined.
- **Fix:** Firebase Cloud Messaging (FCM) push notifications as primary, SMS as fallback.

### 15. Landmark Validation is Too Lenient
- **Location:** `LANDMARK_GEO_SYSTEM.md:5-6`
- **Problem:** Only flags "IDK" or "None". A student can write "near shop" or "here" and pass. Tutor arrives at "some shop in Chasara."
- **Fix:** Require landmark to be >= 10 chars AND match against a known landmark database (mosques, schools, markets).

---

## 🔴 EDGE CASES (7)

### 16. Dispute Filed After Escrow Release
- **Location:** `ENGINE_LOGIC.md:23-24`
- **Problem:** "2 hours after session ends" - if student files dispute at 2 hours + 1 minute, funds are already in tutor wallet. Admin must chase tutor for refund. Not defined.
- **Fix:** Extend dispute window to 4 hours. Or, hold funds for 24h and auto-release only if tutor has 5+ verified sessions.

### 17. Emergency Button Sends SMS Without Location
- **Location:** `COMMUNITY_SAFETY_GUIDELINES.md:3`
- **Problem:** "Help" button triggers SMS to Admin. But you have NO idea where the tutor/student is. The SMS just says "Help me." Useless in real emergency.
- **Fix:** Capture GPS on button press. Include Google Maps link in SMS.

### 18. Payout Request Exceeds Balance
- **Location:** `ADMIN_OPS_WORKFLOW.md:17-18`
- **Problem:** Admin verifies walletBalance vs amount. But between viewing the request and clicking "Paid," tutor could have spent the balance. DB inconsistency.
- **Fix:** Atomic check: `UPDATE User SET walletBalance = walletBalance - :amount WHERE walletBalance >= :amount` - fail if insufficient.

### 19. Unverified Tutor Photos Public
- **Location:** `SECURITY_DATA_PRIVACY.md:4-6` + `SUPPLY_FRICTION_REDUCTION.md`
- **Problem:** "Shadow Search" mode shows pending tutors publicly. Their photos are visible before verification.
- **Fix:** Blur photos of unverified tutors. Only show after verification.

### 20. Regex Anti-Cheat Bypass: Zero-Width Space
- **Location:** `ANTI_CHEAT_LOGIC.md:5-6`
- **Problem:** User types phone number with hidden chars: `0` + zero-width-space + `1`. Regex fails. They put number in bio. Platform leakage succeeds.
- **Fix:** Normalize strings (strip invisible chars) before regex.

### 21. Search Results Cached = Stale Slots
- **Location:** `OFFLINE_RESILIENCE_MAP.md:4`
- **Problem:** "Cache search results locally" - if user goes offline and comes back, they see slots that were booked while offline. Click "Pay" → fails.
- **Fix:** Cache with 30-second TTL. Show "Last updated X seconds ago" warning.

### 22. Recurring Booking: Missing Parent ID
- **Location:** `RECURRING_BOOKING_LOGIC.md:10-11`
- **Problem:** Dev note says "If one session is disputed, only that session's funds are frozen" - but there's NO `parent_booking_id` column in schema.
- **Fix:** Add `parentBookingId String?` to Booking model. Implement logic.

---

## 📊 SUMMARY

| Category | Count |
|----------|-------|
| Critical Flaws | 5 |
| Business Risks | 5 |
| Local Context Gaps | 5 |
| Edge Cases | 7 |
| **TOTAL** | **22** |

---

## 📁 NEW: Feature Specifications Added

Created `docs/features/` folder with 7 files:

| File | Contents |
|------|-----------|
| `USER_AUTHENTICATION.md` | OTP login, role toggle, session persistence |
| `SEARCH_AND_DISCOVERY.md` | Area-first search, tutor cards, filters |
| `TUTOR_PROFILE_MANAGEMENT.md` | NID upload, bio editor, profile strength |
| `AVAILABILITY_SCHEDULER.md` | Weekly template, date overrides |
| `BOOKING_CHECKOUT_WIZARD.md` | Slot picker with lock, landmark entry |
| `WALLET_AND_PAYOUTS.md` | Balance dashboard, withdrawal form |
| `REVIEW_AND_DISPUTE_SYSTEM.md` | Check-in proof, review modal, admin mediation |

### New: Operational Docs Added

| File | Contents |
|------|----------|
| `CI_CD_PIPELINE.md` | GitHub Actions, npm scripts, branch strategy |
| `API_ERROR_HANDLING.md` | Standardized error codes (AUTH_*, BOOKING_*, etc.) |
| `ANALYTICS_EVENTS.md` | Full event tracking spec for all user actions |
| `DATABASE_BACKUP_STRATEGY.md` | Neon backup, migration rollback plan |
| `FEATURE_FLAGS.md` | Gradual rollout system for new features |
| `ACCESSIBILITY_GUIDELINES.md` | WCAG compliance, contrast ratios, ARIA |
| `TESTING_CONFIG.md` | Jest + Playwright, coverage thresholds |
| `LEGAL_PAGES.md` | ToS, Privacy Policy, Refund Policy |
| `ADMIN_DASHBOARD.md` | Stats, dispute resolution, payout processing |
| `PERFORMANCE_OPTIMIZATION.md` | Bundle budgets, Web Vitals targets |
| `SECURITY_CONFIG.md` | CORS, rate limiting, headers |
| `SEO_CONFIG.md` | Sitemap, robots.txt, JSON-LD schema |
| `I18N_CONFIG.md` | Bengali + English, next-intl setup |
| `DARK_MODE_CONFIG.md` | next-themes, dark/light tokens |
| `MONITORING_ERROR_TRACKING.md` | Sentry setup, error boundaries |
| `PWA_MANIFEST.md` | Service worker, install prompt, icons |
| `FCM_PUSH_SETUP.md` | Firebase messaging, token storage |
| `GREENWEB_SMS_SETUP.md` | SMS API integration, templates |
| `CRON_JOB_SCHEDULES.md` | Reconciliation, escrow, reminders |
| `SSL_COMMERZ_IPN_SETUP.md` | Webhook verification, fraud prevention |
| `ADMIN_ROLES_PERMISSIONS.md` | RBAC, audit logs |
| `APP_ICONS.md` | Icon sizes, splash screen |
| `ONBOARDING_FLOW.md` | Visual user journey diagram |
| `ERROR_PAGES.md` | 404, 500, error boundaries, skeletons |
| `LOCAL_DEV_SETUP.md` | Docker compose, local DB/Redis |
| `LINTING_FORMATTING.md` | ESLint, Prettier, Husky |
| `TYPESCRIPT_STRICT.md` | Strict mode, Zod schemas |

---

## 📊 FINAL DOC COUNT: 67

- Development: 20 (was 14)
- Blueprints: 16
- Features: 7
- QA Audit: 1

All planning gaps now filled. Ready for implementation.

---

## 🔧 QA CHECK - Schema & Logic Fixes Applied

### Schema Fixes (from QA Check):
1. ✅ Added `role` field to User model (ADMIN_ROLES_PERMISSIONS.md sync)
2. ✅ Added `fcmToken` field to User model (FCM_PUSH_SETUP.md sync)
3. ✅ Added `profileStrength` field to Provider model (SUPPLY_FRICTION_REDUCTION.md)
4. ✅ Added `location` field to Provider model (PostGIS)
5. ✅ Fixed travel buffer for "both" mode (now applies to in-person bookings)
6. ✅ Added performance indexes (areaSlug, status, slotStart)

---

## 🚀 PRIORITY FIX ORDER - COMPLETED ✅

### Phase 1 (Week 1-2) - Core Booking Integrity ✅
1. ✅ Added `checkInTime`, `checkInGeo`, `idempotencyKey`, `parentBookingId` to Booking model
2. ✅ Implemented Redis lock at slot selection (not payment) - ENGINE_LOGIC.md
3. ✅ Added idempotency key for payments - ANTI_CHEAT_LOGIC.md + PAYMENT_FLOW_RECONCILIATION.md
4. ✅ Added `parentBookingId` for recurring bookings - DATABASE_SCHEMA.prisma
5. ✅ Atomic wallet transactions with rollback - ENGINE_LOGIC.md

### Phase 2 (Week 3-4) - Trust & Safety ✅
6. ✅ Implemented in-app chat phone number blocking - ANTI_CHEAT_LOGIC.md
7. ✅ Added strikes counter to Provider model + auto-suspend after 2 strikes - DATABASE_SCHEMA.prisma + DISPUTE_RESOLUTION_MATRIX.md
8. ✅ FCM push notifications as primary (SMS fallback) - MESSAGING_MATRIX.md
9. ✅ Emergency button with GPS capture - COMMUNITY_SAFETY_GUIDELINES.md
10. ✅ Blur unverified tutor photos - ANTI_CHEAT_LOGIC.md + SUPPLY_FRICTION_REDUCTION.md

### Phase 3 (Week 5-6) - Market适配 ✅
11. ✅ Switch area_slug to primary filter, radius secondary - ENGINE_LOGIC.md + STUDENT_JOURNEY.md
12. ✅ Reduce lead time: 1hr (online), 2hr (in-person) - ENGINE_LOGIC.md
13. ✅ Landmark validation: min 10 chars + landmark list - STUDENT_JOURNEY.md
14. ⏳ Confirm SSLCommerz wallet flow or explore direct API (requires vendor discussion)

### Phase 4 (Week 7+) - Scale
15. ⏳ Integrate bKash Payout API (requires vendor API access)
16. ⏳ Clarify platform fee in tutor onboarding (requires business decision)
17. ✅ Extend dispute window to 4 hours - ENGINE_LOGIC.md + STUDENT_JOURNEY.md
18. ✅ Fix regex with invisible char stripping - ANTI_CHEAT_LOGIC.md
19. ✅ Cache with TTL + "last updated" warning - OFFLINE_RESILIENCE_MAP.md