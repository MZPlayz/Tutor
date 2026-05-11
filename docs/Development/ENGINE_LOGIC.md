# Engine Logic: Tutor

## 1. Slot Generation & Availability
- **Time Block:** All sessions are exactly 1 hour.
- **Lead Time:** 
    - **Online sessions:** 1 hour minimum from now.
    - **In-person sessions:** 2 hours minimum from now (allows travel buffer).
- **Booking Window:** Tutors can be booked up to **21 days** in advance.
- **The Travel Buffer (Dhaka Traffic):**
    - If a tutor's `serviceMode` is `in_person` OR `both`, the engine blocks **60 minutes** before and after every **in-person** confirmed booking.
    - If `serviceMode` is `online`, no travel buffer needed.
    - Logic: `AvailableSlots = Schedule - (InPersonBookings + 60min_Padding)`.

## 2. Geo-Search (PostGIS)
- **Area-First Primary:** `areaSlug` is the PRIMARY filter. Users select their neighborhood (Tanbazar, Chasara, Fatullah) first.
- **Radius Secondary:** Radius (default 3km) is applied WITHIN the selected area to handle edge cases.
- **Sorting:** Results are sorted by `ST_Distance` within the area.
- **Fallback:** If GPS is unavailable or unreliable, area_slug filter ensures consistent results.

## 3. Concurrency (Upstash Redis)
- **Lock at Slot Selection:** Redis lock is set when the student **taps/selects a slot**, NOT when they click "Pay."
- **TTL:** The lock expires in 300 seconds (5 mins).
- **Conflict:** If the key exists, the second student sees "Slot is being booked" immediately.
- **Retry Payment:** When user retries a failed payment, the system ALWAYS re-acquires the lock. If lock fails, show "Slot no longer available."

## 4. Escrow & Completion Window
- **Release Rule:** Funds are eligible for "Completed" status **4 hours** after the session ends.
- **Dispute Window:** Students have exactly 4 hours to file a `Report` for a "No-Show."
- **Auto-Confirm:** If no report is filed within the 4-hour window, the system (via Cron) marks the booking as `completed` and adds the funds to the tutor's `walletBalance`.
- **Proof Required:** Dispute must include either: (a) Tutor's `checkInTime` is null, OR (b) Tutor checked in >15 minutes late.

## 5. Payout Logic
- **Minimum:** ৳500.
- **Atomic Process:** Use database transaction with rollback:
    ```sql
    BEGIN;
    UPDATE "User" SET "walletBalance" = "walletBalance" - :amount WHERE "id" = :userId AND "walletBalance" >= :amount;
    INSERT INTO "PayoutRequest" (...) VALUES (...);
    COMMIT;
    ```
- **Strikes System:** If `Provider.strikes >= 2`, auto-suspend the tutor (set `isSuspended = true`). Admin must review before reactivation.