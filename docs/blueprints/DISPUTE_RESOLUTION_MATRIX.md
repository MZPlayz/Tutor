# Dispute Resolution Matrix

| Scenario | Evidence Check | Default Winner | Action |
| :--- | :--- | :--- | :--- |
| Tutor No-Show | Check `Booking.checkInTime`. If NULL or >15m late from slotStart. | Student | 100% Refund to Student Wallet. **Tutor Strike +1**. If strikes >= 2: Auto-suspend tutor. |
| Student No-Show | Tutor clicked "I am at landmark" on time (checkInTime exists). Student didn't cancel. | Tutor | 100% Payout to Tutor. No refund. |
| Late Cancellation | Cancellation < 2 hours before start. | The Other Party | 50% Penalty Fee applied to the cancelling party. |
| Bad Quality | Review text vs. Tutor history. | Admin Audit | Manual mediation. Usually 50% credit if first time. |
| Harassment | Chat logs / Phone logs. | Victim | Permanent Ban of aggressor + NID Blacklist. |

## Strike System
- **Threshold:** 2 strikes = Auto-suspend (`Provider.isSuspended = true`).
- **Appeal:** Suspended tutor can request Admin review. Admin manually reactivates.
- **Tracking:** `Provider.strikes` column tracks all resolved disputes where tutor was at fault.