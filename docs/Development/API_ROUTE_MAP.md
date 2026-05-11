# API & Server Action Map: Tutor

## 1. Public Routes (Discovery)
- `GET /api/search` -> PostGIS radius search (Query params: lng, lat, subject, radius).
- `GET /api/providers/[id]` -> Fetch tutor profile, services, and base schedule.
- `GET /api/providers/[id]/slots` -> Call `availability-engine` to return bookable ISO strings for a specific date.

## 2. Authentication (Firebase + NextAuth/Custom)
- `POST /api/auth/otp/send` -> Trigger Firebase OTP to phone number.
- `POST /api/auth/otp/verify` -> Verify code and create/fetch User session.
- `POST /actions/auth/toggle-mode` -> Switch `activeMode` between 'client' and 'tutor'.

## 3. Booking & Payment (The "Tutor" Flow)
- `POST /actions/booking/initiate` -> 
    1. Check/Set Upstash Redis lock.
    2. Create `pending` Booking in DB.
    3. Initialize SSLCommerz session and return `GatewayPageURL`.
- `POST /api/payments/webhook` -> Receive SSLCommerz POST data. Update Booking to `confirmed`, release Redis lock, and trigger GreenWeb SMS.
- `POST /api/payments/fail` -> Handle failed payment, release Redis lock, redirect user to retry.

## 4. Tutor Dashboard (Protected)
- `POST /actions/tutor/update-profile` -> Update bio, area, and service mode.
- `POST /actions/tutor/update-schedule` -> Bulk update `ProviderSchedule` table.
- `POST /actions/tutor/request-payout` -> Atomic transaction: decrement `walletBalance`, create `PayoutRequest`.

## 5. Admin & System
- `GET /api/cron/reconcile` -> Vercel Cron: 
    1. Check `pending` bookings > 10 mins old -> Release locks + cancel.
    2. Check `confirmed` bookings > session_end + 4h -> Mark `completed` + update wallet.
- `POST /actions/admin/verify-tutor` -> Admin approves NID and sets `verificationStatus` to `approved`.