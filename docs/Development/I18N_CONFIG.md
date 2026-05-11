# Internationalization (i18n) - Bengali + English

## 1. Architecture

Use `next-intl` for SSR and client-side translations:

```
src/
  messages/
    en.json      # English (default)
    bn.json      # Bengali (বাংলা)
  app/
    [locale]/
      page.tsx
      layout.tsx
  i18n.ts        # Configuration
```

## 2. File Structure

### src/i18n.ts
```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

### src/middleware.ts
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'bn'],
  defaultLocale: 'en',
  localePrefix: 'always', // /en/search, /bn/search
});
```

## 3. English Keys (en.json)

```json
{
  "common": {
    "appName": "Tutor",
    "search": "Search",
    "filter": "Filter",
    "save": "Save",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "loading": "Loading..."
  },
  "auth": {
    "phonePlaceholder": "01X XXX XXXX",
    "sendOtp": "Send OTP",
    "resendOtp": "Resend OTP",
    "enterName": "Enter your name",
    "switchToTutor": "Switch to Tutor",
    "switchToStudent": "Switch to Student"
  },
  "search": {
    "placeholder": "Search subjects...",
    "noResults": "No tutors found",
    "areaSelect": "Select Area",
    "verifiedOnly": "Verified only"
  },
  "booking": {
    "selectSlot": "Select a time",
    "landmarkRequired": "Enter a landmark",
    "landmarkHint": "e.g., Near Chasara Bus Stand",
    "payNow": "Pay Now",
    "slotReserved": "Slot reserved for {minutes} minutes"
  },
  "tutor": {
    "verified": "Verified",
    "rating": "{rating} stars",
    "perHour": "৳{rate}/hr"
  },
  "wallet": {
    "available": "Available",
    "pending": "Pending",
    "withdraw": "Withdraw",
    "minAmount": "Minimum ৳500"
  },
  "dispute": {
    "reportProblem": "Report a Problem",
    "noShow": "Tutor didn't show up",
    "refund": "Request Refund"
  }
}
```

## 4. Bengali Keys (bn.json)

```json
{
  "common": {
    "appName": "টিউটর",
    "search": "খুঁজুন",
    "filter": "ফিল্টার",
    "save": "সংরক্ষণ",
    "cancel": "বাতিল",
    "confirm": "নিশ্চিত",
    "loading": "লোড হচ্ছে..."
  },
  "auth": {
    "phonePlaceholder": "০১X XXX XXXX",
    "sendOtp": "OTP পাঠান",
    "resendOtp": "পুনরায় পাঠান",
    "enterName": "আপনার নাম লিখুন",
    "switchToTutor": "টিউটর মোড",
    "switchToStudent": "শিক্ষার্থী মোড"
  },
  "search": {
    "placeholder": "বিষয় খুঁজুন...",
    "noResults": "কোনো টিউটর পাওয়া যায়নি",
    "areaSelect": "এলাকা নির্বাচন",
    "verifiedOnly": "যাচাইকৃত"
  },
  "booking": {
    "selectSlot": "সময় নির্বাচন",
    "landmarkRequired": "ল্যান্ডমার্ক লিখুন",
    "landmarkHint": "যেমন: চসার বাস স্ট্যান্ডের পাশে",
    "payNow": "এখন পেমেন্ট",
    "slotReserved": "{minutes} মিনিটের জন্য স্লট সংরক্ষিত"
  },
  "tutor": {
    "verified": "যাচাইকৃত",
    "rating": "{rating} স্টার",
    "perHour": "৳{rate}/ঘণ্টা"
  },
  "wallet": {
    "available": "উপলব্ধ",
    "pending": "অপেক্ষমাণ",
    "withdraw": "উত্তোলন",
    "minAmount": "ন্যূনতম ৳৫০০"
  },
  "dispute": {
    "reportProblem": "সমস্যা জানান",
    "noShow": "টিউটর আসেননি",
    "refund": "ফান্ড চান"
  }
}
```

## 5. Language Switcher Component

```tsx
// src/components/LanguageSwitcher.tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('common');
  const router = useRouter();

  const toggle = () => {
    const newLocale = locale === 'en' ? 'bn' : 'en';
    router.push(`/${newLocale}${router.asPath.replace(`/${locale}`, '')}`);
  };

  return (
    <button 
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
    >
      <GlobeIcon />
      <span>{locale === 'en' ? 'বাংলা' : 'English'}</span>
    </button>
  );
}
```

## 6. UI Font for Bengali

In `layout.tsx`:
```typescript
import { Noto_Sans_Bengali } from 'next/font/google';

const bengali = Noto_Sans_Bengali({ 
  subsets: ['bengali'],
  variable: '--font-bengali',
});

export default function RootLayout({ children }) {
  return (
    <html lang={locale} className={`${inter.variable} ${bengali.variable}`}>
      <body className={locale === 'bn' ? 'font-bengali' : 'font-sans'}>
        {children}
      </body>
    </html>
  );
}
```

---

## QA Check - Fixes Applied:
- ✅ Full Bengali translations for all user-facing strings
- ✅ Language switcher in UI
- ✅ Noto Sans Bengali font for proper rendering
- ✅ Locale-based routing (/en/search, /bn/search)