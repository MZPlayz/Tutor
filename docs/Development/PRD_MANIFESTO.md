# PRD Manifesto: Tutor

## 1. Executive Summary
**Tutor** is a hyper-local, high-trust marketplace designed specifically for the tutoring ecosystem in Dhaka and Narayanganj. Unlike generic platforms, Tutor addresses the specific pain points of the Bangladesh market: traffic-induced delays, lack of teacher verification, and payment insecurity.

## 2. Target Audience
- **Students/Parents:** Located in Narayanganj (Tanbazar, Fatullah, Chasara, etc.) and Dhaka, looking for reliable home or online tutors.
- **Tutors:** University students or professionals looking for a streamlined way to manage bookings and secure payments.

## 3. Core Value Propositions
- **Verified Trust:** Mandatory NID/Student ID verification for tutors.
- **Traffic-Aware:** Automatic 1-hour travel buffers between in-person sessions.
- **Landmark-First:** Address system based on local landmarks rather than just GPS.
- **Escrow Safety:** Platform holds payment until 4 hours after the session is completed to prevent "ghosting."

## 4. Key Feature Set
- **Radius Search:** Search by proximity, subject, gender, and university.
- **Slot Engine:** Real-time availability with 3-hour lead time and 1-hour travel gaps.
- **Checkout:** Landmark-based location entry with SSLCommerz integration (bKash/Nagad).
- **Wallet System:** Tutors earn into a virtual wallet; withdrawals are processed manually by Admin.
- **Dual-Role:** Users can switch between "Student" and "Tutor" modes using a single account.

## 5. Success Metrics
- **Zero Double-Bookings:** Achieved via Upstash Redis locks.
- **Safety:** 100% of listed tutors must have a "Verified" badge.
- **Retention:** Automated SMS reminders via GreenWeb to reduce no-show rates.

## 6. Tone & Identity
- **Name:** Tutor
- **Font:** Archive (Bold, Chunky, Reliable)
- **Colors:** #f05323 (Action/Orange), #fde3c1 (Soft/Cream)
- **UX Goal:** Speed. A student should be able to book a tutor in under 60 seconds.