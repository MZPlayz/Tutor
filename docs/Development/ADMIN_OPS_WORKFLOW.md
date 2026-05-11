# Admin Operations Workflow: Tutor

## 1. Tutor Verification (The Trust Gate)
*Goal: Ensure every 'Verified' tutor is a real person with valid credentials.*
1.  **Notification:** Admin receives an alert/check in the dashboard for a new `pending` verification.
2.  **Review:** 
    - Open the Cloudinary `documentUrl` (NID or Student ID).
    - Match the name on the ID with the `User.name`.
    - Check if the `areaSlug` matches a realistic neighborhood in Dhaka/Narayanganj.
3.  **Action:** 
    - **Approve:** Run `verify-tutor` action. SMS is sent to tutor: "Congratulations! You are now a Verified Tutor."
    - **Reject:** Provide reason (e.g., "ID blurry"). SMS sent: "Verification failed. Please re-upload a clear photo of your ID."

## 2. Payout Processing (Manual bKash)
*Goal: Pay tutors accurately while keeping platform fees.*
1.  **Notification:** Admin sees a new `pending` PayoutRequest.
2.  **Verify:** 
    - Check the `User.walletBalance` vs. `PayoutRequest.amount`.
    - Ensure the tutor has no active/unresolved disputes.
3.  **Payment:** 
    - Open bKash/Nagad app on your phone.
    - Send the exact `amount` to the provided `bkashNumber`.
    - Note the Transaction ID from bKash.
4.  **Action:** Update `PayoutRequest.status` to `paid`, add `paidAt` timestamp, and save the bKash TrxID in the `admin_note`.

## 3. Dispute Resolution (The Judge)
*Goal: Fair outcomes for no-shows.*
1.  **Notification:** Admin alerted of a `disputed` booking.
2.  **Investigation:**
    - Call the Student: Ask what happened.
    - Call the Tutor: Ask why they didn't show up.
3.  **Resolution:**
    - **Tutor at fault:** Change status to `refunded`. Add 100% amount as Platform Credit to Student's `walletBalance`. Add a "Strike" to the Tutor.
    - **Student false claim:** Change status to `completed`. Release funds to Tutor wallet.