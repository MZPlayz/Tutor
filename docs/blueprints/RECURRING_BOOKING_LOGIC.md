Goal: Prevent platform leakage by making recurring payments easier than cash.
The "Bundle" Logic:
Student selects a slot (e.g., Mondays at 4 PM).
Option: "Book for 4 weeks (10% Discount)".
IF Student selects Bundle:
System checks availability for the next 4 Mondays.
THEN Creates 4 booking records in pending status.
Total amount = (Rate * 4) - Discount.
The "Auto-Sheduling" Engine:
Once paid, the tutor’s calendar is locked for that specific hour for the next 28 days.
Dev Note: Use a parent_booking_id column in the Bookings table to link the bundle. If one session is disputed, only that session's funds are frozen, not the whole bundle.