# Payment Flow & Reconciliation: Tutor

## 1. The Booking Handshake (SSLCommerz)
1. **Initiate:** Student clicks "Confirm & Pay".
2. **Lock:** Server Action sets Redis `lock:{providerId}:{slotIso}` (TTL 5m).
3. **Create:** Database creates a `Booking` record with:
   - `status: "pending"`
   - `idempotencyKey: UUID()` (unique per payment attempt)
4. **Redirect:** App sends student to SSLCommerz `GatewayPageURL`.
5. **Return:** 
   - **Success:** SSLCommerz POSTs to `/api/payments/webhook`.
   - **Fail/Cancel:** User is sent back to `/checkout?error=failed`.

## 2. Webhook (IPN) Logic
When SSLCommerz sends a `VALID` status to our webhook:
1. **Idempotency Check:** First check if `Booking.idempotencyKey` was already processed.
   - If `status !== "pending"`: Ignore duplicate webhook (prevents double-charge).
2. **Verify:** Call SSLCommerz validation API to confirm the `amount` and `tran_id`.
3. **Update:** Change `Booking.status` to `"confirmed"`. Mark idempotencyKey as used.
4. **Release:** Delete the Redis lock immediately.
5. **Notify:** Trigger Push Notification (FCM) + SMS to Tutor and Student via `Messaging Matrix`.

## 3. The Self-Healing Cron (Vercel Cron)
To prevent "Ghost Locks" (slots being stuck because a payment failed silently), the Cron runs every 5 minutes:
- **Task A (Cleanup):** 
    - Find `pending` bookings created > 10 minutes old.
    - Delete their associated Redis locks.
    - Update `Booking.status` to `"cancelled"`.
- **Task B (Escrow Release):** 
    - Find `confirmed` bookings where `slotEnd` was more than 4 hours ago.
    - Check for active `Reports` (Disputes).
    - If no dispute: Update status to `"completed"`, increment tutor `User.walletBalance`.

## 4. Manual Refund Policy
- No automated bKash refunds.
- If a dispute is won by a student, the Admin manually updates the `User.walletBalance` for the student (Platform Credit).

## 5. Retry Payment (Edge Case)
- On retry, generate **new** idempotencyKey (don't reuse - prevents confusion).
- Re-acquire Redis lock. If fails, show error and redirect to search.