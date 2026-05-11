# Feature: Booking Checkout Wizard

## Step 1: Slot Picker

### Date Scroller
- **Horizontal Scroll:** Next 21 days
- **Format:** "Mon, Jan 15"
- **Selection:** Tap to select, selected state highlighted (orange border)

### Time Chips
- **Sections:** "Morning" (6-12), "Afternoon" (12-5), "Evening" (5-10)
- **Chip States:**
  - Available: Green border, tappable
  - Selected: Solid orange (#f05323)
  - Disabled (Past Lead Time): Gray, not tappable
  - Booked: Strikethrough, muted gray

### Lead Time Rules
- **Online:** Slot must be >= 1 hour from now
- **In-Person:** Slot must be >= 2 hours from now (travel buffer)

### Lock Mechanism (CRITICAL)
- **On Chip Tap:** IMMEDIATELY trigger Redis lock server action
- **Lock Key:** `lock:{providerId}:{slotIso}`
- **TTL:** 300 seconds (5 minutes)
- **Countdown:** Show "Slot reserved for 5:00" with timer
- **Conflict:** If lock exists, show "Someone is booking this slot"
- **Failure:** If lock fails after tap, rollback UI state

## Step 2: Landmark Entry

### Fields
- **Area:** Dropdown (pre-filled from search, changeable)
- **Road/House No:** Text input (optional)
- **Landmark:** Text area (MANDATORY)
- **Validation:** Minimum 10 characters for landmark

### Visual
- **Map Pin:** Show general area on static map (not exact location)
- **Privacy:** Exact address hidden from tutor until confirmed

## Step 3: Summary & Pay

### Itemized List
- Session Rate: ৳[amount]
- Platform Fee (5%): ৳[amount]
- Total: ৳[total]

### Payment Buttons
- "Pay with bKash"
- "Pay with Nagad"
- "Pay with Card"
- All trigger SSLCommerz redirect

### Error Handling
- **Payment Failed:** "Your slot is still reserved for X more minutes. [Retry Payment]"
- **Retry Logic:** ALWAYS re-acquire lock before retry. If lock fails, show "Slot no longer available"

---

## QA Check - Fixes Applied:
- ✅ Lock at slot selection (not payment) - prevents race condition
- ✅ Retry always re-acquires lock (prevents booking lost slot)
- ✅ Lead time: 1hr online, 2hr in-person
- ✅ Landmark min 10 chars validation
- ✅ Idempotency key generated for payment