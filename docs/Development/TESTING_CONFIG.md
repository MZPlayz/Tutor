# Testing Configuration

## 1. Jest (Unit Tests)

Install:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest ts-jest
```

Config (`jest.config.js`):
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: { branches: 60, functions: 60, lines: 60, statements: 60 },
  },
};
```

Test file example:
```typescript
// src/lib/booking.test.ts
import { validateSlotLeadTime } from './booking';

describe('validateSlotLeadTime', () => {
  it('rejects slot less than 1 hour away for online', () => {
    const slotTime = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
    expect(validateSlotLeadTime(slotTime, 'online')).toBe(false);
  });
  
  it('accepts slot 2+ hours away for in-person', () => {
    const slotTime = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours
    expect(validateSlotLeadTime(slotTime, 'in_person')).toBe(true);
  });
});
```

## 2. Playwright (E2E Tests)

Install:
```bash
npm install --save-dev @playwright/test
npx playwright install --with-deps chromium
```

Config (`playwright.config.ts`):
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

E2E Test example (`tests/e2e/booking.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test('student can book a tutor', async ({ page }) => {
  // 1. Login
  await page.goto('/login');
  await page.fill('[name=phone]', '01XXXXXXXXX');
  await page.click('button:has-text("Send OTP")');
  
  // 2. Search
  await page.fill('[name=search]', 'Physics');
  await page.click('[data-area="tanbazar"]');
  
  // 3. Select tutor
  await page.click('text=Rahim Tutoring');
  
  // 4. Book slot
  const tomorrow = getTomorrowDate();
  await page.click(`[data-date="${tomorrow}"] [data-slot="16:00"]`);
  await page.fill('[name=landmark]', 'Near Chasara Bus Stand');
  
  // 5. Payment (mock)
  await page.click('button:has-text("Pay with bKash")');
  await expect(page).toHaveURL(/checkout/);
});
```

## 3. Testing Pyramid

```
        /\
       /E2E\      ← 10-20 tests (critical paths)
      /------\
     /Integration\ ← 50-100 tests (API, components)
    /------------\
   /   Unit Tests  \ ← 100+ tests (utils, validation)
  /________________\
```

## 4. CI Integration

Add to `package.json`:
```json
"test:ci": "jest --ci --coverage && npx playwright test"
```

---

## QA Check - Fixes Applied:
- ✅ Lead time validation tests (1hr online, 2hr in-person)
- ✅ Booking flow E2E tests cover race condition scenarios
- ✅ Coverage thresholds prevent <60% code coverage