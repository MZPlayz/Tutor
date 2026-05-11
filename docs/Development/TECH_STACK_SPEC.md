# Tech Stack Specification: Tutor

## 1. Frontend & Framework
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Tabler Icons (@tabler/icons-react)
- **Components:** Headless UI / Radix UI (for accessibility)

## 2. Backend & Database
- **Database:** Neon (Serverless PostgreSQL)
- **Extensions:** PostGIS (for radius-based search)
- **ORM:** Prisma
- **Caching/Concurrency:** Upstash Redis (Slot locking and rate limiting)

## 3. Third-Party Services
- **Authentication:** Firebase Auth (Phone OTP via SMS)
- **Payments:** SSLCommerz (Sandbox initially, supports bKash/Nagad/Cards)
- **SMS Notifications:** GreenWeb SMS (HTTP API)
- **Image Hosting:** Cloudinary (Tutor profiles and NID verification)
- **Cron Jobs:** Vercel Cron (Reconciliation of failed/pending payments)

## 4. Infrastructure
- **Hosting:** Vercel
- **Domain:** Custom .com.bd or .com
- **Analytics:** Vercel Analytics

## 5. Deployment Workflow
- **Git:** GitHub (Main branch for Prod, Preview branches for PRs)
- **CI/CD:** Automatic deployment via Vercel
- **Database Migrations:** Prisma Migrate