# Feature: Search & Discovery

## 1. Search Bar
- **Input:** Text field with search icon
- **Auto-Suggest:** Dropdown shows matching subjects as user types
- **Subjects:** "HSC Physics", "SSC Math", "English Conversation", "Admission Prep"
- **Recent Searches:** Show last 5 searched terms (stored locally)

## 2. Area Chips (Primary Filter)
- **Horizontal Scroll:** List of Narayanganj/Dhaka neighborhoods
- **Chips:** Chasara, Tanbazar, Fatullah, Siddhirganj, Narayanganj Sadar, Dhaka Cantonment
- **Selection:** Single-select only (radio behavior)
- **Default:** If GPS available, pre-select nearest area

## 3. Tutor Cards
- **Layout:** Vertical list with card components
- **Display Fields:**
  - Profile photo (circular, 48px)
  - Name (bold)
  - Subject tags (e.g., "Physics", "Math")
  - Rating: Star icon + numeric (e.g., "4.8")
  - Rate/hr: "৳400/hr"
  - Distance: "1.2 km away"
- **Verified Badge:** Orange checkmark (#f05323) for approved tutors
- **Blur Effect:** For `verificationStatus === 'pending'` tutors - show blurred photo placeholder

## 4. Filters (Expandable)
- **Gender:** Male / Female / Any
- **Rate Range:** Slider (min - max)
- **Rating:** 4+ stars, 4.5+ stars
- **Mode:** Online / In-Person / Both

## 5. Sorting
- **Default:** By distance (PostGIS `ST_Distance`)
- **Options:** Rating (high to low), Price (low to high), Recently active

## 6. Empty State
- **UI:** "No tutors found in [Area] for [Subject]"
- **Action Button:** "Notify me when one joins" → saves to `DemandLeads` table
- **Lead Capture:** Phone number input modal

---

## QA Check - Fixes Applied:
- ✅ AreaSlug is PRIMARY filter (GPS unreliable in Narayanganj)
- ✅ Unverified tutor photos blurred (security)
- ✅ Zero-result tracking logs to `SearchLogs` table
- ✅ DemandLeads capture for recruitment