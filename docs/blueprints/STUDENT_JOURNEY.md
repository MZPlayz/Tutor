# Student Journey: The "Tutor" Protocol

## Phase 1: Discovery & Entry
1. **Entry:** User lands on Home. 
2. **Area-First Geo-Gate:** 
    - **PRIMARY:** User MUST select an `area_slug` (e.g., Chasara, Tanbazar, Fatullah). Show tutors in that area only.
    - **SECONDARY:** If GPS granted, sort by distance WITHIN the selected area.
    - **Fallback:** If GPS unavailable, area_slug ensures consistent results (no "random" tutors due to GPS drift).
3. **Filter:** Search by Subject + Gender + Rate.
    - **Anti-Cheat:** Results only show `verificationStatus === 'approved'`. New/unverified tutors stay hidden.
    - **Photo Blur:** Unverified tutor photos are blurred in search results.

## Phase 2: Selection & Locking
1. **Profile View:** Student clicks Tutor profile.
2. **Slot Selection:**
    - **IF** serviceMode === 'online' AND CurrentTime + 1 hour > SlotTime: Slot is **Disabled**.
    - **IF** serviceMode === 'in_person' AND CurrentTime + 2 hours > SlotTime: Slot is **Disabled**.
    - **IF** Slot overlaps with `Booking + 60m` (for in-person): Slot is **Disabled** (Travel Buffer Rule).
3. **The Lock:** IMMEDIATELY when student taps/selects a slot (before checkout).
    - **Action:** Call `POST /actions/booking/initiate`.
    - **System:** Check Upstash Redis for `lock:{providerId}:{slotIso}`.
    - **IF** exists: Return "Someone is paying for this slot."
    - **ELSE:** Set Lock (TTL 5 mins). Show "Slot reserved for 5 minutes."

## Phase 3: The Landmark Checkout
1. **Address Requirement:**
    - **MANDATORY:** `road_no`, `house_no`, `landmark`.
    - **IF** `landmark` is < 10 characters: Disable "Pay Now." (Ensures descriptive landmarks like "Near Chasara Bus Stand" or "Beside Islam Bank, Tanbazar").
    - **Validation:** If landmark matches a known landmark (mosque, school, market), show confirmation.
2. **The Handshake:** Redirect to SSLCommerz.
    - **IF** Payment Success: Update status to `confirmed`, delete lock, send Push + SMS.
    - **IF** Payment Fails/Closes: Redis lock auto-deletes in 5 mins; slot becomes free.
    - **Retry:** On retry, ALWAYS re-acquire lock. If fails, show "Slot no longer available."

## Phase 4: Post-Session & Release
1. **Session Completion:** Class ends at `slot_end`.
2. **The Dispute Window:** 
    - **Timer:** `slot_end` + 240 minutes (4 hours).
    - **Student Action:** Can click "Report No-Show."
    - **Evidence Required:** Student must attest: "Tutor did not arrive or did not complete session."
3. **Escrow Release:**
    - **IF** 240 mins pass AND no report: Move funds to Tutor Wallet.
    - **IF** Report filed: Freeze funds, notify Admin. Admin reviews via checkInTime evidence.