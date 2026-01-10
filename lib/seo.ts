import type { Locale } from "@/i18n/config";

export const BASE_URL = "https://doriseinfalt.art";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbList(items: BreadcrumbItem[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${BASE_URL}/${locale}${item.url}`,
    })),
  };
}

export function getLocalizedUrl(path: string, locale: Locale): string {
  return `${BASE_URL}/${locale}${path}`;
}

export function getImageUrl(imagePath: string): string {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${BASE_URL}${imagePath}`;
}
