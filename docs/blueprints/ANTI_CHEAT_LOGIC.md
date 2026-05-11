# Anti-Cheat Bible: Tutor

## 1. Preventing Platform Leakage (Direct Contact)
- **Bio Field:** `User.bio` and `Provider.bio` are regex-scanned.
- **Regex:** `/(?:01[3-9]\s?\d{2}\s?\d{6})|(?:\+8801[3-9]\s?\d{2}\s?\d{6})|(?:whatsapp|fb|facebook|messenger)/gi`.
- **Normalization:** Strip zero-width spaces and invisible unicode chars before scanning.
- **In-App Chat:** 
    - Disable file/link sharing in messaging.
    - Auto-censor phone patterns in chat messages: `/(?:01[3-9]\d{2}[\s-]?\d{6})/g` → Replace with `01X-XXX-XXXX`.
    - Flag users who attempt to share contact info 3+ times for review.

## 2. Preventing Slot Blocking (The "Bad Competitor")
- **Constraint:** A student cannot have more than 3 `pending` bookings at once.
- **Action:** If `count(bookings where status === 'pending' and userId === current) >= 3`: Block `initiateBooking`.

## 3. Preventing Identity Fraud
- **Constraint:** `NID_Number` (if extracted) must be unique in the system.
- **Action:** One NID = One Tutor Account.

## 4. Preventing Rating Fraud
- **Constraint:** IP/Device Fingerprint matching.
- **Action:** If Student and Tutor have the same `fingerprint_id`, the review is hidden from the public and flagged for "Collusion Review."

## 5. Preventing Payment Spoofing
- **Constraint:** Webhook validation + Idempotency.
- **Logic:** 
    - On booking initiate, generate a unique `idempotencyKey` (UUID) and store in DB.
    - `IF callback_received`: First check if `idempotencyKey` was already processed.
    - If already processed: Ignore (prevent double-charge).
    - THEN `POST` to SSLCommerz `validation_api`.
    - `IF` SSL response `amount` !== `DB.booking_amount`: **FLAG AS FRAUD** + Do not confirm.

## 6. Unverified Tutor Photo Protection
- **Constraint:** Pending tutors (`verificationStatus === 'pending'`) must NOT show real photos publicly.
- **Action:** In API response, replace `profileImageUrl` with blurred placeholder for unverified tutors.
- **Exception:** Admin can see full photos for verification purposes.