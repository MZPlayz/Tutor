# Feature: Availability Scheduler

## 1. Weekly Template (Primary View)
- **Layout:** 7-day grid (Sunday - Saturday)
- **Day Columns:** Each shows tutor's shifts for that day
- **Add Shift Button:** Per day, opens time picker
- **Time Picker:**
  - Start Time: Dropdown (30-min intervals)
  - End Time: Dropdown
  - Example: "4:00 PM - 8:00 PM"
- **Mode Toggle:** Each shift tagged as "In-Person" or "Online"
  - In-Person triggers 60-min travel gap in slot engine

## 2. Conflict Detection
- **Validation:** Cannot overlap shifts on same day
- **Warning:** If new shift overlaps existing, show error

## 3. Date Override (Exam/Vacation Mode)
- **Calendar View:** Current month + next month
- **Click Date Options:**
  - "Mark as Busy" - Blocks entire day (no slots generated)
  - "Add Custom Slot" - Overrides weekly template for just that day
- **Override List:** Show all overrides in a table below calendar

## 4. State Management
- **Draft State:** Changes stored locally (localStorage/React state)
- **Publish Button:** "Save Changes" - Only writes to Neon DB when clicked
- **Loading:** Show spinner during DB write
- **Success:** Toast "Schedule updated!"

## 5. Existing Bookings Protection
- **Check:** Before saving, check if any new time block conflicts with confirmed bookings
- **Warning:** "This schedule change will affect X upcoming bookings. Are you sure?"

---

## QA Check - Fixes Applied:
- ✅ In-Person shifts auto-trigger 60-min travel gap
- ✅ Schedule overrides properly handled (per VACATION_EXAM_OVERRIDES.md)
- ✅ Conflict detection prevents double-booking
- ✅ Existing bookings protected from accidental changes