"use client";

import { useTranslations, useLocale } from "next-intl";
import { RentalCard } from "@/components/rentals/RentalCard";
import type { RentalItem } from "@/lib/rentals";
import { getActiveRentals } from "@/lib/rentals";
import { StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BASE_URL, getImageUrl, getLocalizedUrl } from "@/lib/seo";

// Import data directly for client component
import rentalsData from "@/data/rentals.json";

export default function IzposojaPage() {
  const t = useTranslations("rentals");
  const tSeo = useTranslations("seo");
  const locale = useLocale();
  
  const rentals = rentalsData.rentals as RentalItem[];
  const activeRentals = getActiveRentals(rentals);

  // Generate structured data
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t("title"),
    "description": t("description"),
    "itemListElement": activeRentals.map((rental, index) => {
      const title = locale === "en" && rental.titleEn ? rental.titleEn : rental.title;
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": title,
          "url": getLocalizedUrl(`/izposoja/${rental.id}`, locale as "sl" | "en"),
          "image": getImageUrl(rental.image),
        }
      };
    }),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": locale === "sl" ? "Izposoja dekoracij" : "Rental Service",
    "name": t("title"),
    "description": t("description"),
    "provider": {
      "@type": "Person",
      "name": "Doris Einfalt",
      "url": `${BASE_URL}/${locale}`,
    },
    "areaServed": {
      "@type": "Country",
      "name": "Slovenia"
    }
  };

  const breadcrumbs = [
    { name: tSeo("breadcrumbs.home"), url: "/" },
    { name: t("title"), url: "/izposoja" },
  ];

  return (
    <>
      <StructuredData data={[itemListSchema, serviceSchema]} />
      <Breadcrumbs items={breadcrumbs} locale={locale as "sl" | "en"} />
      <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-quentin)" }}
          >
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-500 italic mb-8">
            {t("subtitle")}
          </p>
          <p className="text-lg md:text-xl text-stone-600 max-w-4xl mx-auto">
            {t("description")}
          </p>
        </div>
      </section>

      {/* Rentals Grid */}
      <section className="px-6 md:px-10 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          {activeRentals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-12">
              {activeRentals.map((rental) => (
                <div key={rental.id}>
                  <RentalCard rental={rental} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-400">
              <p>{t("noRentals")}</p>
            </div>
          )}
        </div>
      </section>
      </div>
    </>
  );
}

