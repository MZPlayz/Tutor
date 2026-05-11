# CI/CD Pipeline & Deployment

## 1. GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test

  build:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run postbuild

  deploy-preview:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-args: '--prod'
```

## 2. Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "postbuild": "npx prisma generate && npx prisma migrate deploy",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:push": "npx prisma db push",
    "db:generate": "npx prisma generate"
  }
}
```

## 3. Vercel Environment Variables

Required in Vercel Project Settings:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon connection string |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `FIREBASE_PROJECT_ID` | Firebase project |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account |
| `FIREBASE_PRIVATE_KEY` | Firebase private key |
| `SSL_STORE_ID` | SSLCommerz store ID |
| `SSL_STORE_PASS` | SSLCommerz password |
| `SSL_IS_SANDBOX` | true/false |
| `GREENWEB_TOKEN` | GreenWeb SMS API key |
| `CLOUDINARY_URL` | cloudinary://... |
| `NEXT_PUBLIC_URL` | https://tutor.com.bd |
| `ADMIN_PHONE_NUMBER` | Admin phone |

## 4. Branch Strategy

- **`main`:** Production-ready code
- **`develop`:** Integration branch
- **`feature/*`:** Feature branches (PR into develop)
- **`hotfix/*`:** Emergency fixes (PR into main)

## 5. Pre-deployment Checklist

- [ ] All tests passing
- [ ] No lint errors
- [ ] TypeScript compiles without errors
- [ ] Prisma migration files up to date
- [ ] Environment variables configured in Vercel
- [ ] Database schema matches Prisma schema

---

## QA Check - Fixes Applied:
- ✅ Post-build runs prisma generate + migrate (ensures DB sync)
- ✅ TypeScript check prevents type errors
- ✅ Lint check catches code quality issues
- ✅ Preview deploys for every PR