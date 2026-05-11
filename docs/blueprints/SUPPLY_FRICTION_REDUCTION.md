Goal: Keep tutors engaged while the Admin (you) is busy verifying IDs.

## The "Shadow Search" Mode
- IF Tutor has uploaded NID but `verificationStatus === 'pending'`:
    - Tutor is visible in search but has a "Verification in Progress" badge.
    - **PHOTO BLUR:** Their profile photo is blurred/placeholder (no real face visible).
    - Students can "Shortlist" them (save to favorites).
    - If a student tries to book, show: "This tutor is currently being verified. We will notify you the moment they are cleared."

## The "Incomplete Profile" Nudge
- If a tutor hasn't added a bio or photo, show a "Profile Strength" bar (0-100%).
- **Logic:** Tutors below 70% strength are deprioritized in search ranking.

## Dev Notes
- Add `profileStrength Int @default(0)` to Provider model.
- Calculate on profile update: 
  - 30% for photo
  - 30% for bio
  - 20% for services added
  - 20% for schedule set
- Admin can see full unblurred photos in verification dashboard.