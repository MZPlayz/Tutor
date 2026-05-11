# Onboarding Flow - Visual Diagram

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          NEW USER ONBOARDING                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │     LANDING PAGE (/ or /en)   │
                    │                               │
                    │  - Hero: "Find Tutors Nearby" │
                    │  - CTA: "Get Started"         │
                    │  - Footer: "Become a Tutor"  │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    AUTH: Phone Input (OTP)    │
                    │                               │
                    │  1. Enter 11-digit phone     │
                    │  2. Click "Send OTP"         │
                    │  3. Enter 6-digit OTP        │
                    │  4. Verify                   │
                    └───────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                                 │
                    ▼                                 ▼
          ┌─────────────────┐            ┌─────────────────┐
          │  NEW USER       │            │  RETURNING      │
          │                 │            │  USER           │
          │  - Prompt for   │            │                 │
          │    Name input   │            │  - Go to Home   │
          │  - Optional     │            │    /search      │
          │    photo       │            │                 │
          └─────────────────┘            └─────────────────┘
                    │
                    ▼
          ┌─────────────────────────────┐
          │     HOME PAGE (/search)     │
          │                             │
          │  - Area chips (default)     │
          │  - Search bar              │
          │  - Featured tutors         │
          │                             │
          │  [Switch to Tutor] button   │
          │    (if user has role)      │
          └─────────────────────────────┘
```

## Step-by-Step Breakdown

### Step 1: Landing Page
```
User visits tutor.com.bd
    │
    ├── Has existing session?
    │   └── YES → Redirect to /search
    │
    └── NO → Show Landing Page
         │
         ├── Click "Get Started" → Go to Auth
         ├── Click "Become a Tutor" → Go to Auth then Tutor Onboarding
         └── Click "Login" → Go to Auth
```

### Step 2: Phone Authentication
```
Auth Screen (src/app/auth/page.tsx)
    │
    ├── Enter phone number (01X XXX XXXX)
    │   ├── Validate: /^01[3-9]\d{8}$/
    │   └── Check rate limit (3 OTP/hour)
    │
    ├── Click "Send OTP"
    │   ├── Show 60s countdown
    │   └── Send via Firebase
    │
    ├── Enter OTP (6 digits)
    │   ├── Auto-focus each digit
    │   └── Verify via Firebase
    │
    └── On Success
        ├── Check if user exists in DB
        ├── NEW → Prompt for Name
        └── EXISTING → Create session → /search
```

### Step 3: New User Name Entry
```
New User Modal
    │
    ├── Title: "What's your name?"
    ├── Input: Full name (required)
    ├── Optional: Profile photo upload
    │
    └── On Submit
        ├── Create User in DB
        ├── Create session (JWT)
        └── Redirect to /search
```

### Step 4: First Search Experience
```
Home/Search Page (src/app/search/page.tsx)
    │
    ├── Default area selected (based on GPS or prompt)
    ├── Show "Top Tutors" in selected area
    ├── Show area chips for quick switching
    │
    ├── User can:
    │   ├── Search subjects
    │   ├── Apply filters
    │   └── Click tutor card → Profile
    │
    └── User with tutor role:
        └── See "Switch to Tutor" in header
```

## Tutor Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       TUTOR ONBOARDING FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    Become a Tutor (/tutor/    │
                    │         join)                 │
                    │                               │
                    │  - Requirements list         │
                    │  - "Start Verification" btn  │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    NID Upload (Step 1)        │
                    │                               │
                    │  - Camera or Gallery         │
                    │  - Show upload progress      │
                    │  - Store in Cloudinary       │
                    │  - Redirect to profile       │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    Profile Setup (Step 2)     │
                    │                               │
                    │  - Add profile photo         │
                    │  - Write bio                 │
                    │  - Add subjects & rates      │
                    │  - Set weekly schedule       │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    Submit for Review          │
                    │                               │
                    │  - verificationStatus =      │
                    │    "pending"                 │
                    │  - Show "Pending" badge      │
                    │  - Can be searched but       │
                    │    cannot receive bookings   │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    Admin Approval             │
                    │                               │
                    │  Admin reviews NID/Photo     │
                    │    └── APPROVE → Active      │
                    │    └── REJECT → Prompt       │
                    │            to re-upload      │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    Tutor Can Now:             │
                    │                               │
                    │  - Appear in search (verified)│
                    │  - Receive bookings          │
                    │  - Build reputation          │
                    └───────────────────────────────┘
```

## State Management

| Step | URL | Component | Next |
|------|-----|------------|------|
| Landing | `/` | LandingPage | Auth |
| Auth | `/auth` | AuthScreen | Onboarding / Search |
| Onboarding | `/onboarding` | NameInputModal | Search |
| Tutor Join | `/tutor/join` | TutorOnboarding | NID Upload → Profile → Submit → Pending |

---

## QA Check - Fixes Applied:
- ✅ Complete user journey mapped
- ✅ Tutor onboarding detailed
- ✅ State transitions clear
- ✅ Decision points identified