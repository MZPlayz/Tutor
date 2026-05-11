Goal: Handle the reality of a university student's life (Midterms, Finals, Eid trips).
The "Exam Mode" Toggle:
A simple switch in the Tutor Dashboard.
IF Active: Set isVisible to false for 7 days.
THEN Hide from all search results, but keep existing bookings active.
The "One-Off" Block:
Tutor views their calendar. Clicks a specific date (e.g., "May 25").
Action: POST /actions/schedule/override.
Adds a row to a ScheduleOverrides table.
Slot Engine Integration:
When generating slots:
Check Weekly Template.
IF Date exists in ScheduleOverrides, delete those slots from the candidate list.
THEN Output final available slots.