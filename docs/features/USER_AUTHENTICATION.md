# Feature: User Authentication

## 1. Phone Login Screen
- **Input Field:** Single text input for 11-digit Bangladesh number
- **Format:** Auto-format as user types: `01X XX XXXX`
- **Validation:** Regex `^01[3-9]\d{8}$`
- **Button:** "Send OTP" - triggers Firebase OTP send
- **Rate Limit:** Max 3 OTP requests per hour per number (Upstash Redis)

## 2. OTP Verification Screen
- **6-Digit Inputs:** Auto-focus first digit, auto-advance on input
- **Timer:** 60-second countdown for "Resend" button
- **Error State:** "Invalid OTP" with shake animation
- **Success:** Redirect to onboarding or home based on user state

## 3. Onboarding (New Users)
- **Forced Field:** Full Name input (required before proceeding)
- **Optional:** Profile photo upload
- **Skip Action:** Not allowed - must enter name to proceed

## 4. Role Toggle
- **Location:** Sidebar / Header toggle button
- **Primary Button:** "Switch to Tutor" / "Switch to Student"
- **Confirmation:** Modal warning if user has active bookings as tutor
- **State:** Stored in `User.activeMode` ('client' | 'tutor')

## 5. Session Persistence
- **Method:** Firebase Auth session cookie (30-day expiry)
- **Refresh:** Auto-refresh on app open if < 7 days remaining
- **Logout:** Clear session + clear local storage

---

## QA Check - Fixes Applied:
- ✅ OTP rate limiting via Redis (prevents SMS bombing)
- ✅ Phone format validation prevents invalid numbers
- ✅ Role toggle handles active bookings warning