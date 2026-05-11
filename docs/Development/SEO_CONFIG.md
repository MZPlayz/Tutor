# SEO Configuration

## 1. Sitemap (src/app/sitemap.ts)

```typescript
import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tutor.com.bd';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/tutors`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/become-tutor`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
  
  // Dynamic tutor pages (top 100 verified tutors)
  const tutors = await db.provider.findMany({
    where: { verificationStatus: 'approved' },
    take: 100,
    select: { id: true, updatedAt: true },
  });
  
  const tutorPages: MetadataRoute.Sitemap = tutors.map((tutor) => ({
    url: `${baseUrl}/tutors/${tutor.id}`,
    lastModified: tutor.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
  
  return [...staticPages, ...tutorPages];
}
```

## 2. Robots.txt (public/robots.txt)

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /checkout/

Sitemap: https://tutor.com.bd/sitemap.xml
```

## 3. Canonical URLs

In every page layout:
```typescript
// src/app/tutors/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const tutor = await getTutor(params.id);
  
  return {
    title: `${tutor.name} - ${tutor.services[0].subject} Tutor in ${tutor.areaSlug} | Tutor`,
    description: `Book ${tutor.name} for ${tutor.services[0].subject} in ${tutor.areaSlug}. ৳${tutor.services[0].ratePerHour}/hr. Verified tutor.`,
    alternates: {
      canonical: `https://tutor.com.bd/tutors/${tutor.id}`,
    },
    openGraph: {
      title: `${tutor.name} - ${tutor.services[0].subject} in ${tutor.areaSlug}`,
      description: `Verified tutor. ৳${tutor.services[0].ratePerHour}/hour.`,
      images: [tutor.profileImage],
    },
  };
}
```

## 4. Local Business Schema (JSON-LD)

Add to tutor profile page:
```typescript
// In page component
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: tutor.name,
  image: tutor.profileImage,
  address: {
    '@type': 'PostalAddress',
    addressLocality: tutor.areaSlug,
    addressRegion: 'Dhaka',
    addressCountry: 'BD',
  },
  priceRange: '৳৳',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: tutor.rating,
    reviewCount: tutor.reviewCount,
  },
};

return (
  <section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    {/* Page content */}
  </section>
);
```

## 5. Bangladesh-Specific SEO

### Keywords to Target
- "home tutor Narayanganj"
- "HSC Physics tutor Dhaka"
- "best tutor app Bangladesh"
- "private tutor Chasara"
- "একুশে পরীক্ষা প্রস্তুতি"

### Local Directory Listings
- Google My Business (future)
- Bangladesh Yellow Pages
- Facebook Page with SEO optimization

---

## QA Check - Fixes Applied:
- ✅ Sitemap includes verified tutors only (no pending)
- ✅ Disallow /checkout and /api from indexing
- ✅ JSON-LD schema for local business in search results