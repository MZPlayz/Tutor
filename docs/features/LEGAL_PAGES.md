# Legal Pages & Policies

## 1. Terms of Service (src/app/terms/page.tsx)

**Key Sections:**

### 1.1 Acceptance of Terms
By using Tutor, you agree to these terms. If you disagree, do not use the platform.

### 1.2 User Roles
- **Students:** Must be 18+ or have guardian permission
- **Tutors:** Must be 16+ and provide valid ID for verification

### 1.3 Platform Rules
- No harassment or discrimination
- No exchange of contact info outside platform (see Anti-Cheat)
- No fake reviews or ratings manipulation

### 1.4 Booking & Payment
- All bookings are final unless disputed within 4 hours
- Platform fee is 5% (tutor) + gateway fee (~2%)
- Refunds only via Admin-approved disputes

### 1.5 Tutor Verification
- All tutors must complete NID/Student ID verification
- Unverified tutors cannot receive bookings
- Tutor can be suspended after 2 strikes

### 1.6 Limitation of Liability
Tutor is a platform connecting students and tutors. We are not responsible for:
- Quality of tutoring
- Tutor no-shows (handled via disputes)
- Damage or injury during sessions

### 1.7 Termination
We may suspend or ban users who violate these terms.

---

## 2. Privacy Policy (src/app/privacy/page.tsx)

**Key Sections:**

### 2.1 Data We Collect
- **Account:** Phone number, name, profile photo
- **Tutor Data:** NID/Student ID (stored in Cloudinary), bio, schedule
- **Booking Data:** Location, session history, payment records
- **Device:** IP address, device type (for fraud detection)

### 2.2 How We Use Data
- Provide tutoring services
- Process payments
- Send notifications (SMS + Push)
- Verify tutor identity
- Prevent fraud

### 2.3 Data Sharing
- **With Tutors:** Only when a booking is confirmed (student location)
- **With Students:** Only confirmed booking (tutor name, subject)
- **With Providers:** SSLCommerz (payments), GreenWeb (SMS), Cloudinary (images)
- **Legal:** When required by law

### 2.4 Data Security
- NID documents in private Cloudinary folder
- Firebase Auth for secure login
- Database encryption at rest (Neon)
- Row-level security on sensitive data

### 2.5 User Rights
- Delete account → Remove all personal data
- Export data → Download your data
- Opt-out of SMS → Update notification preferences

---

## 3. Refund Policy (src/app/refund/page.tsx)

### 3.1 When Refunds Are Issued

| Scenario | Refund Amount | Action |
|----------|---------------|--------|
| Tutor No-Show | 100% to Student | Student wins dispute |
| Tutor Late (>15m) | 50% to Student | Admin decision |
| Student No-Show | 0% | Tutor wins dispute |
| Tutor Cancelled (<2h before) | 100% to Student | Auto-refund |
| Platform Error | 100% to Student | Manual review |

### 3.2 How Refunds Work
1. Student files dispute within 4-hour window
2. Admin reviews evidence (check-in timestamp)
3. If student wins: Funds added as "Platform Credit" to student wallet
4. Refunds are NOT sent to bKash/Nagad (credit only)

### 3.3 What Is NOT Refundable
- Student simply changing mind (after session)
- Partial session completion (handled case-by-case)
- Disputed ratings (not refund-related)

### 3.4 Dispute Timeline
- **Filing Window:** 4 hours after session end
- **Admin Response:** Within 24 hours
- **Resolution:** Funds released or held

---

## 4. Required Footer Links

Add to app footer:
```
[Home] [Search] [Become a Tutor]
[Terms of Service] [Privacy Policy] [Refund Policy] [Contact]
© 2026 Tutor Bangladesh
```

---

## QA Check - Fixes Applied:
- ✅ Dispute window (4hr) matches ENGINE_LOGIC.md
- ✅ Strike system documented
- ✅ Platform leakage consequences explained
- ✅ Anti-Cheat mentioned in ToS