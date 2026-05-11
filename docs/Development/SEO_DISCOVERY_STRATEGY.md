# SEO & Discovery Strategy: Tutor

## 1. Dynamic Page Structure
Next.js will generate static pages for high-traffic keywords to ensure 100ms load times for Google crawlers.
- **Tutor Profiles:** `/tutors/[id]` (Slugified: `/tutor/rakib-ahmed-physics`)
- **Subject/Area Hubs:** `/tutors/[subject]-in-[area]` (e.g., `/tutors/hsc-math-in-tanbazar`)

## 2. Metadata Logic
Every tutor profile page must dynamically generate:
- **Title:** `[Name] - [Subject] Tutor in [Area] | Tutor`
- **Description:** `Book [Name] for [Subject] in [Area]. Verified teacher, ৳[Rate]/hr. Rated 4.8/5 by students in Narayanganj.`

## 3. Local Business Schema (JSON-LD)
Inject structured data into the `<head>` so Google shows "Stars" and "Price" in search results:
- **Type:** `LocalBusiness` / `ProfessionalService`
- **AreaServed:** `Dhaka`, `Narayanganj`
- **PriceRange:** `৳৳`

## 4. Keyword Focus (Dhaka Market)
Primary keywords to bake into the `PRD` and content:
- "Home tutor in Narayanganj"
- "HSC Physics teacher Dhaka"
- "Female tutor for English Chasara"
- "Admission test coaching Narayanganj"

## 5. Performance for SEO
- **Images:** All profile photos served via Cloudinary with `f_auto, q_auto` (Auto-format, Auto-quality).
- **Core Web Vitals:** Maintain LCP (Largest Contentful Paint) < 2.5s by using Server Components for the initial tutor list.