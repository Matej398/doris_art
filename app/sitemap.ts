import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n/config';
import { BASE_URL } from '@/lib/seo';
import rentalsData from '@/data/rentals.json';
import type { RentalItem } from '@/lib/rentals';
import { getActiveRentals } from '@/lib/rentals';

// Helper to generate locale-aware URLs (no prefix for default locale)
const getLocaleUrl = (locale: string, path: string = '') => {
  if (locale === defaultLocale) {
    return `${BASE_URL}${path}`;
  }
  return `${BASE_URL}/${locale}${path}`;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrls = locales.map((locale) => ({
    url: getLocaleUrl(locale),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((loc) => [loc, getLocaleUrl(loc)])
      ),
    },
  }));

  const staticPages = [
    { path: '/stenske-poslikave', priority: 0.9 },
    { path: '/delavnice', priority: 0.9 },
    { path: '/slike', priority: 0.8 },
    { path: '/izposoja', priority: 0.8 },
    { path: '/fotografija', priority: 0.7 },
    { path: '/galerija', priority: 0.7 },
    { path: '/o-meni', priority: 0.6 },
    { path: '/kontakt', priority: 0.8 },
  ];

  const staticPageUrls = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: getLocaleUrl(locale, page.path),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, getLocaleUrl(loc, page.path)])
        ),
      },
    }))
  );

  // Add rental detail pages
  const rentals = rentalsData.rentals as RentalItem[];
  const activeRentals = getActiveRentals(rentals);
  
  const rentalUrls = locales.flatMap((locale) =>
    activeRentals.map((rental) => ({
      url: getLocaleUrl(locale, `/izposoja/${rental.id}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, getLocaleUrl(loc, `/izposoja/${rental.id}`)])
        ),
      },
    }))
  );

  return [...baseUrls, ...staticPageUrls, ...rentalUrls];
}
