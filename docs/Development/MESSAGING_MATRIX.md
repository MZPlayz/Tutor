# Messaging Matrix: Tutor

## 1. OTP Verification (Firebase)
- **Trigger:** User enters phone number.
- **Channel:** SMS via GreenWeb (fallback: Firebase Auth email).
- **Copy:** `Your Tutor verification code is: ######. Do not share this with anyone.`

## 2. Booking Confirmed
- **PRIMARY:** FCM Push Notification to both parties.
- **FALLBACK:** SMS via GreenWeb if push fails.
- **To Tutor:** `[Tutor] New Booking! [Subject] at [Time]. Landmark: [Landmark]. Tap to view details.`
- **To Student:** `Payment confirmed! [Tutor Name] will meet you at [Landmark] on [Date] at [Time].`

## 3. Session Reminder (60m & 15m Before)
- **PRIMARY:** FCM Push.
- **FALLBACK:** SMS.
- **To Tutor (60m):** `Reminder: Your class starts in 1 hour at [Landmark]. Tap to view student details.`
- **To Student (15m):** `[Tutor Name] is on the way to [Landmark]. Session starts in 15 mins.`

## 4. Check-In Confirmation
- **To Student:** `[Tutor Name] has arrived at [Landmark]. They are waiting for you!`

## 5. Cancellation Alerts
- **Tutor Cancelled:** `Booking cancelled by [Tutor]. 100% refund added to your wallet.`
- **Student Cancelled:** `[Student] cancelled the [Time] session. Slot is now available.`

## 6. Payout Updates
- **Request Received:** `Withdrawal of ৳[Amount] received. Processing within 24 hours.`
- **Paid:** `Success! ৳[Amount] sent to your bKash. Thank you for teaching with Tutor!`

## 7. Admin Alerts
- **High Priority (Push + SMS):** `URGENT: Dispute filed for Booking #[ID]. Click to review.`
- **Push to Admin dashboard + SMS to Admin phone.**

## 8. Emergency Button
- **Trigger:** Tutor/Student clicks "Help" in active booking.
- **Action:** Send SMS to Admin with GPS link: `EMERGENCY: [Name] needs help. Location: maps.google.com/?q=[lat],[lng]`