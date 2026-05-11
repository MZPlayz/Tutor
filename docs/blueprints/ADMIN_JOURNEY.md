# Admin Journey: The "Tutor" Protocol

## Phase 1: Quality Control
1. **Verification Queue:** 
   - View NID photo vs Profile photo.
   - **IF** Name/Face mismatch: Reject + SMS.
   - **IF** Data clear: Approve + SMS.

## Phase 2: Conflict Mediation (The Judge)
1. **Dispute Alert:** `Booking ID #123` reported as No-Show.
2. **Evidence Check:**
   - **Move 1:** Check `check_in_timestamp`.
   - **Move 2:** If Tutor checked in on time, call Student to verify.
   - **Move 3:** If Tutor never checked in, immediate refund to Student (Platform Credit).
3. **Resolution:** Admin clicks "Refund" or "Release Funds."

## Phase 3: Payout Settlement
1. **Manual Transfer:** 
   - View `pending` PayoutRequests.
   - Send money via bKash App.
   - Paste bKash TrxID into Admin panel.
   - Click "Complete." SMS sent to Tutor.