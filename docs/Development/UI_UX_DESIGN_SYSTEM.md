# UI/UX Design System: Tutor

## 1. Visual Identity
- **Primary Color:** `#f05323` (Tutor Orange) - Use for Primary Buttons, Icons, and Active states.
- **Secondary Color:** `#fde3c1` (Tutor Cream) - Use for Backgrounds, Accents, and Logo text.
- **Typography:** 
    - Headings: **Archive** (Local font, chunky, bold).
    - Body: **Inter** or **System Sans** (for high readability on mobile).
- **Radius:** Large (`16px` to `24px`) for a friendly, modern "App" feel.

## 2. Key Components
- **The "Tutor Card":** 
    - Cream background, Orange border for "Verified" tutors.
    - Prominent "Distance" and "Subject" labels.
- **The "Slot Grid":**
    - Available: Green border/text.
    - Selected: Solid Orange (#f05323) with Cream text.
    - Booked: Strikethrough with muted gray.
- **The "Search Bar":**
    - Floating white card with orange search icon.
    - Landmark "Chips" below the bar for quick filtering.

## 3. UX Principles
- **Landmark-First Checkout:** The address input must prominently ask for a "Landmark" (e.g., Near which mosque/shop?) to assist the tutor.
- **Optimistic Locking:** When a user clicks a slot, show a "Reserving..." state immediately before the API call finishes.
- **PWA-First:** Bottom navigation bar for mobile users (Home, My Bookings, Profile).
- **Single-Tap Auth:** Minimize typing. Phone number input -> Auto-focus OTP fields.

## 4. Status Colors
- **Confirmed:** Emerald Green (`#10b981`)
- **Pending/Alert:** Amber (`#f59e0b`)
- **Error/Dispute:** Crimson (`#e11d48`)