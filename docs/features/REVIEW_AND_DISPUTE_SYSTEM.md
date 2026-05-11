# Feature: Review & Dispute System

## 1. Check-In Proof (Tutor UI)

### Button Trigger
- **Appearance:** 15 minutes before session start
- **Label:** "I am at the Landmark"
- **Location:** Prominent in active booking card

### Action
- **On Click:** 
  - Capture current timestamp → `Booking.checkInTime`
  - Capture GPS coordinates → `Booking.checkInGeo`
  - Show success: "Check-in recorded! Student has been notified."
- **Timeout:** If not clicked, tutor cannot contest "No-Show" dispute

### Validation
- **Geo-Check:** Optionally verify within 500m of booking's area_slug
- **Grace:** Allow check-in up to 15 mins early

## 2. Student Review Modal

### Trigger
- **Timing:** 4 hours after session end
- **Notification:** Push notification + SMS "Rate your session"

### Fields
- **Rating:** 5-star clickable (1-5)
- **Tags (multi-select):**
  - "Clear Explanations"
  - "Punctual"
  - "Friendly"
  - "Good Materials"
  - "Would Recommend"
- **Comment:** Optional text area (200 char max)

### Submission
- **Button:** "Submit Review"
- **Once submitted:** Cannot be edited

## 3. Dispute Trigger (Student UI)

### Access
- **Window:** 4 hours after session end (same as review window)
- **Link:** "Report a Problem" or "Report No-Show"

### Form Fields
- **Issue Type:** Dropdown
  - "Tutor didn't show up"
  - "Tutor was late"
  - "Quality issue"
- **Questions:**
  - "Did the tutor contact you?" (Yes/No)
  - "How long did you wait?" (Dropdown: <15min, 15-30min, 30+min)
- **Detail:** Text area for description

### Submission
- **Action:** Create `Report` record, set booking status to "disputed"
- **Admin Alert:** Push + SMS to Admin

## 4. Admin Mediation View

### Dashboard
- **List:** All disputed bookings
- **Quick Info:** Student name, Tutor name, Booking time, Issue type

### Evidence Side-by-Side
- **Left:** Tutor's check-in timestamp + location
- **Right:** Student's dispute claim

### Actions
- **Refund to Student:**
  - Set booking status "refunded"
  - Add 100% to student's wallet (platform credit)
  - Increment tutor's `strikes` counter
- **Release to Tutor:**
  - Set booking status "completed"
  - Add funds to tutor's wallet
  - No strike added
- **Strike Threshold:** If strikes >= 2, auto-suspend tutor (`isSuspended = true`)

---

## QA Check - Fixes Applied:
- ✅ Check-in proof required for dispute evidence
- ✅ 4-hour dispute window (was 2hr - fixed)
- ✅ Strike system: 2 strikes = auto-suspend
- ✅ checkInTime/checkInGeo columns added to Booking model