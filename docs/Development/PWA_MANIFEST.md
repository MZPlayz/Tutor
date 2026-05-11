# PWA Configuration

## 1. manifest.json

Create `public/manifest.json`:

```json
{
  "name": "Tutor - Home & Online Tutoring",
  "short_name": "Tutor",
  "description": "Find verified tutors in Narayanganj & Dhaka",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fde3c1",
  "theme_color": "#f05323",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["education", "business"],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/search.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Find a Tutor",
      "short_name": "Search",
      "description": "Search for tutors in your area",
      "url": "/search",
      "icons": [{ "src": "/icons/search-shortcut.png", "sizes": "96x96" }]
    },
    {
      "name": "My Bookings",
      "short_name": "Bookings",
      "description": "View your upcoming sessions",
      "url": "/bookings",
      "icons": [{ "src": "/icons/bookings-shortcut.png", "sizes": "96x96" }]
    }
  ]
}
```

## 2. Service Worker

Create `public/sw.js`:

```javascript
const CACHE_NAME = 'tutor-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API calls - always network
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request);
      })
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});
```

## 3. Register Service Worker

In `src/app/layout.tsx`:

```typescript
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered:', registration);
    }).catch((error) => {
      console.log('SW registration failed:', error);
    });
  }
}, []);
```

## 4. PWA Install Prompt

Create `src/components/PWAInstallPrompt.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    const prompt = deferredPrompt as any;
    prompt.prompt();
    
    const { outcome } = await prompt.userChoice;
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg border">
      <p className="text-sm">Install Tutor for quick access</p>
      <div className="flex gap-2 mt-2">
        <button onClick={handleInstall} className="px-4 py-2 bg-primary text-white rounded-lg">
          Install
        </button>
        <button onClick={() => setShowPrompt(false)} className="px-4 py-2 text-gray-600">
          Not now
        </button>
      </div>
    </div>
  );
}
```

---

## QA Check - Fixes Applied:
- ✅ Caching for offline access (per OFFLINE_RESILIENCE_MAP.md)
- ✅ Search and Bookings shortcuts for quick access
- ✅ Install prompt for home screen addition
- ✅ Manifest follows PWA best practices