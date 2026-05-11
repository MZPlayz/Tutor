Goal: Tell you exactly where the money is waiting so you can recruit the right tutors.
The "Zero-Result" Tracker:
IF SearchAPI returns 0 results:
Log the subject, area_slug, and timestamp to SearchLogs table.
The Admin "Heatmap":
Admin dashboard shows: "15 parents searched for 'HSC Chemistry' in 'Siddhirganj' this week, but we have 0 tutors there."
The "Lead" Collector:
If no results found, show: "Want us to find a tutor for you? Enter your phone number."
Action: Save to DemandLeads table. You now have a list of guaranteed customers to call once you find a tutor.