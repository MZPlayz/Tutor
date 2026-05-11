# Admin Dashboard Specification

## 1. Dashboard Overview

### Key Metrics Cards (Top Row)
- **Total Revenue (MTD):** ৳XXX,XXX
- **Active Tutors:** XXX
- **Active Students:** XXX
- **Pending Disputes:** X (red if > 0)

### Charts
- **Revenue Chart:** Bar chart - daily/weekly/monthly toggle
- **Bookings Chart:** Line chart - sessions per day
- **Search Heatmap:** Table showing areas with most zero-results

## 2. Sidebar Navigation

```
├── Dashboard (Overview)
├── Tutor Management
│   ├── Verification Queue
│   ├── Active Tutors
│   └── Suspended Tutors
├── Student Management
│   ├── All Students
│   └── Demand Leads
├── Bookings
│   ├── All Bookings
│   ├── Pending Payment
│   └── Completed
├── Disputes
│   ├── Open Disputes
│   └── Resolved
├── Payouts
│   ├── Pending (X)
│   └── Completed
└── Settings
    ├── Flags
    └── SMS Templates
```

## 3. Tutor Verification Queue

### Table Columns
- Photo (blurred)
- Name
- Submitted Date
- Document (view NID)
- Actions: Approve | Reject

### Bulk Actions
- Select multiple → "Approve All Selected"

## 4. Dispute Resolution View

### Split View
- **Left Panel:** Student claim
  - "Did tutor contact you?" (Yes/No)
  - "How long did you wait?"
  - Student comment
- **Right Panel:** Tutor evidence
  - checkInTime (if exists)
  - checkInGeo (if exists)
  - Tutor's scheduled slot time

### Action Buttons
- [Refund to Student] - Red button
- [Release to Tutor] - Green button
- [Need More Info] - Yellow button

## 5. Payout Processing

### Table Columns
- Tutor Name
- Amount (৳)
- Request Date
- Method (bKash/Nagad)
- Number (masked)
- Status
- Action

### Admin Actions
- Click row → Opens detail modal
- [Mark as Paid] → Enter bKash TrxID → Submit
- TrxID saved to `PayoutRequest.admin_note`

## 6. Search Heatmap (Demand Tracker)

### Display
| Area | Subject | Searches (7 days) | Tutors Available | Action |
|------|---------|-------------------|-------------------|--------|
| Siddhirganj | HSC Chemistry | 15 | 0 | Recruit |
| Fatullah | English | 8 | 2 | Monitor |
| Tanbazar | Math | 3 | 5 | - |

### Export
- "Download CSV" button
- Use data for tutor recruitment

---

## QA Check - Fixes Applied:
- ✅ Disputes view shows checkInTime evidence
- ✅ Search heatmap integrated from ANALYTICS_DEMAND_LOGGING.md
- ✅ Strike count visible in tutor profile
- ✅ Payout with atomic balance check