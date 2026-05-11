# Tutor Journey: The "Tutor" Protocol

## Phase 1: Verification (The Barrier)
1. **Registration:** Tutor creates account + uploads NID/Student ID.
2. **Invisible State:** `verificationStatus` is `pending`.
   - **Logic:** Search API excludes `pending` tutors. They cannot earn until Admin clicks "Approve."
   - **Photo:** Unverified tutors show blurred photo in search.

## Phase 2: Availability & Anti-Jam
1. **Schedule Setup:** Tutor sets weekly recurring slots (e.g., Mon 4 PM - 6 PM).
2. **Constraint:** Tutors cannot set overlapping slots.
3. **Travel Gap:** System blocks 1 hour around any "In-Person" booking automatically.

## Phase 3: The Arrival (Cheat-Proofing)
1. **The Lead-Up:** Tutor gets SMS 30 mins before session. `landmark` is revealed.
2. **The Check-In (Crucial):** 
   - Tutor reaches location. 
   - **Action:** Click "I am at the Landmark."
   - **System:** Capture `check_in_timestamp` and `check_in_geo`.
   - **IF** Tutor fails to click this: They lose all rights to contest a "No-Show" dispute.

## Phase 4: Earnings & Payout
1. **The Wallet:** Funds appear in `pending_balance` after session.
2. **The Release:** Funds move to `available_balance` 4 hours after `slot_end` (dispute window).
3. **The Withdrawal:**
    - Tutor requests payout.
    - **Check:** `IF available_balance < 500`: Reject.
    - **Check:** `IF strikes >= 2`: Block payout (tutor is suspended), require Admin review.