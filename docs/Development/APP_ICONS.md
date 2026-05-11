# App Icons & Splash Screen

## 1. Icon Specifications

Create all required sizes for PWA and app stores:

### Favicon (Browser Tab)
| Size | File | Use |
|------|------|-----|
| 16x16 | favicon-16x16.png | Browser tab |
| 32x32 | favicon-32x32.png | Browser tab |
| 48x48 | favicon-48x48.png | Browser favicon fallback |

### PWA Icons
| Size | File | Use |
|------|------|-----|
| 72x72 | icon-72x72.png | PWA splash, low-res Android |
| 96x96 | icon-96x96.png | PWA |
| 128x128 | icon-128x128.png | PWA |
| 144x144 | icon-144x144.png | Android play store |
| 152x152 | icon-152x152.png | iOS home screen |
| 192x192 | icon-192x192.png | Android home screen, PWA |
| 384x384 | icon-384x384.png | PWA large |
| 512x512 | icon-512x512.png | PWA, app stores |

### Design Guidelines

**Icon Design:**
- Background: Orange #f05323
- Foreground: White "T" letter (or "টু" for Bengali)
- Corner radius: 20% of size
- Safe zone: Keep important elements within inner 80%

**Splash Screen:**
- Background: Cream #fde3c1
- Logo: Centered, 50% of width
- Background color: #fde3c1

## 2. Generate Icons

Use a tool like [favicon-generator](https://www.favicon-generator.org/) or create programmatically:

```bash
# Using ImageMagick (if installed)
convert -size 512x512 xc:#f05323 -fill white -pointsize 256 -gravity center -annotate 0 "T" icon-512x512.png
convert -resize 192x192 icon-512x512.png icon-192x192.png
```

Or use online tool: [SVG to PNG converter](https://cloudconvert.com/svg-to-png)

## 3. HTML Head References

In `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};
```

## 4. Place Required Files in Public Folder

```
public/
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── badge-72x72.png      # For push notification badge
│   ├── search-shortcut.png  # PWA shortcut icon
│   └── bookings-shortcut.png
├── screenshots/
│   ├── home.png            # 1280x720 for PWA screenshots
│   └── search.png
└── sw.js                   # Service worker
```

## 5. Android Adaptive Icons

Create `android/icon-foreground.xml` and `android/icon-background.xml`:

```xml
<!-- icon-background.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#f05323"/>
</shape>

<!-- icon-foreground.xml -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M54,30 L54,78 M36,54 L72,54"
        android:strokeWidth="8"
        android:strokeColor="#FFFFFF"/>
    <!-- Replace with "T" letter vector -->
</vector>
```

## 6. Testing Icons

Test in browser:
- Chrome DevTools → Application → Manifest
- Should show all icons loading without errors

Test PWA install:
- Chrome → Three dots → "Install Tutor"
- Should show app icon on home screen

---

## QA Check - Fixes Applied:
- ✅ All PWA icon sizes covered
- ✅ Splash screen defined
- ✅ HTML references in layout.tsx
- ✅ App store ready (Play Store needs 512x512)