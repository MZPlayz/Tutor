# Testing & QA Protocols: Tutor

## 1. The "Golden Path" Test
1. Student searches for "Math" in "Chasara".
2. Selects a verified tutor.
3. Picks a slot 5 hours from now.
4. Completes bKash payment (Sandbox).
5. Tutor receives SMS.

## 2. The Concurrency Test (The "Race")
1. Open two browsers.
2. Try to book the **exact same slot** for the **same tutor** at the same time.
3. **Success:** Only the first browser gets to the payment page; the second sees "Slot is being booked."

## 3. The Travel Buffer Test
1. Book a tutor for 2:00 PM - 3:00 PM (In-person).
2. Check the tutor's availability again.
3. **Success:** The 1:00 PM slot and 3:00 PM slot should now be invisible (due to the 60m buffer).

## 4. The Admin Verification Test
1. Register as a new Tutor.
2. Upload a sample image.
3. Login as Admin.
4. Approve the tutor.
5. **Success:** Tutor's profile now shows the orange checkmark and appears in search.