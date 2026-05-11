# Feature: Wallet & Payouts

## 1. Balance Dashboard

### Display
- **Pending Balance:** 
  - Label: "Pending" (amber color)
  - Shows: Funds from sessions completed in last 4 hours
  - Note: "Clears in X hours/minutes"
- **Available Balance:**
  - Label: "Available" (green color)
  - Shows: Funds cleared and ready to withdraw
  - Large: Display as main balance

### Visual
- **Card Design:** Cream background, orange accents
- **Hide/Show:** Eye icon to toggle balance visibility

## 2. Withdrawal Form

### Input Fields
- **Amount:** Number input
  - Min: ৳500
  - Max: Available balance
  - Validation: "Minimum withdrawal is ৳500"
- **Method:** Radio buttons
  - bKash
  - Nagad
- **Mobile Number:** Input field
  - Validation: Bangladesh format `01X XXX XXXX`
  - Format: Auto-format as user types

### Submit
- **Button:** "Request Withdrawal"
- **Loading:** Show spinner during API call
- **Atomic Transaction:**
  - Deduct from `User.walletBalance` immediately
  - Create `PayoutRequest` in "pending" status
  - If fails: Rollback (use DB transaction)

## 3. Transaction History

### List View
- **Columns:** Date, Student Name, Subject, Amount, Status
- **Status Types:**
  - "Earned" (green) - Session completed, funds added
  - "Pending" (amber) - In escrow (4hr window)
  - "Withdrawn" (gray) - Successfully paid out
  - "Disputed" (red) - Under review

### Detail View
- **On Click:** Expand to show:
  - Booking ID
  - Session date/time
  - Student phone (masked)
  - bKash Transaction ID (once Admin settles)

## 4. Earnings Chart (Optional Enhancement)
- **Visual:** Bar chart showing daily/weekly earnings
- **Period:** Last 7 days, Last 30 days

---

## QA Check - Fixes Applied:
- ✅ Atomic payout transaction with rollback
- ✅ 4-hour escrow window (was 2hr - fixed)
- ✅ Min ৳500 withdrawal threshold
- ✅ Payout blocked if tutor has 2+ strikes (suspended)