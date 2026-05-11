# Feature: Tutor Profile Management

## 1. NID Upload (Verification Gate)
- **Trigger:** First-time tutor accessing "Become a Tutor" flow
- **Options:** Camera capture or Gallery upload
- **Accepted:** Photo of NID card or Student ID
- **Progress Bar:** Show upload progress (0-100%)
- **Storage:** Upload to Cloudinary (private folder)
- **Admin Review:** Store `documentUrl` for Admin verification

## 2. Service List (Subjects & Rates)
- **Add Button:** "Add Subject" with plus icon
- **Per Subject Fields:**
  - Subject Name: "HSC Physics", "SSC Math", "English"
  - Rate per Hour: Number input (৳)
  - Class Levels: "HSC", "SSC", "Admission" (multi-select)
- **Edit/Delete:** Swipe to delete, tap to edit
- **Min/Max:** Rate must be between ৳200 - ৳2000

## 3. Bio Editor
- **Input:** Multi-line text area
- **Character Limit:** 500 characters max
- **Markdown Support:** Bold, italic (UI buttons)
- **Phone Number Blocking:**
  - Regex: `/(?:01[3-9]\s?\d{2}\s?\d{6})|(?:\+8801[3-9]\s?\d{2}\s?\d{6})/g`
  - Normalize: Strip zero-width spaces before scan
  - On save: If detected, show error "Phone numbers not allowed in bio"
- **Facebook/WhatsApp Blocking:**
  - Regex: `/(?:whatsapp|fb|facebook|messenger)/gi`

## 4. Profile Photo
- **Upload:** Camera or Gallery
- **Crop Tool:** Square (1:1) aspect ratio
- **Preview:** Show cropped result before save
- **Storage:** Cloudinary (public folder for approved, private for pending)
- **Default:** Placeholder avatar if none uploaded

## 5. Profile Strength Indicator
- **Calculation:**
  - 30%: Profile photo uploaded
  - 30%: Bio completed (>50 chars)
  - 20%: At least one service added
  - 20%: Schedule set (at least one shift)
- **Display:** Progress bar (0-100%)
- **Search Impact:** Below 70% = deprioritized in search results

## 6. Verification Status Display
- **Pending:** Yellow badge "Verification in Progress"
- **Approved:** Orange checkmark "Verified"
- **Rejected:** Red badge with reason (e.g., "ID unclear - please re-upload")

---

## QA Check - Fixes Applied:
- ✅ Phone number regex blocks platform leakage in bio
- ✅ Zero-width space stripping prevents bypass
- ✅ Profile strength formula implemented
- ✅ Unverified photo visibility controlled