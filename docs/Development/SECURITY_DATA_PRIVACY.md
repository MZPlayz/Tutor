# Security & Data Privacy: Tutor

## 1. NID & Document Protection
- **Storage:** All NID/ID photos must be uploaded to a private folder in **Cloudinary**.
- **Access:** Never expose raw Cloudinary URLs in the frontend. Use **Signed URLs** that expire after 10 minutes, generated only for the Admin session.
- **Privacy:** Tutors cannot see other tutors' IDs. Students can never see tutor IDs.

## 2. API & Rate Limiting (Upstash Redis)
- **OTP Protection:** Limit a single phone number to 3 OTP requests per hour to prevent "SMS Bombing" and balance depletion.
- **Booking Spam:** Limit a user to 5 "Pending" bookings at any time.

## 3. PII (Personally Identifiable Information)
- **Address Masking:** The `landmark`, `houseNo`, and `roadNo` are strictly hidden from the Tutor until the booking status is `confirmed`.
- **Phone Privacy:** Use the app's messaging or masked numbers where possible; do not expose student numbers on public profiles.

## 4. Database Security
- **RLS (Row Level Security):** Even if a user bypasses the UI, the Backend (Server Actions) must verify `userId` against the session before updating any `walletBalance` or `booking`.