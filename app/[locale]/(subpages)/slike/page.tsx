"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { PaintingCard } from "@/components/ui/PaintingCard";
import { PaintingDetailModal } from "@/components/ui/PaintingDetailModal";
import type { Painting } from "@/lib/paintings";
import { StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BASE_URL, getImageUrl, getLocalizedUrl } from "@/lib/seo";

// Import paintings data directly for client component
import paintingsData from "@/data/paintings.json";

export default function SlikePage() {
  const t = useTranslations("paintings");
  const tSeo = useTranslations("seo");
  const locale = useLocale();
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);

  const paintings = paintingsData.paintings as Painting[];

  // Generate structured data
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t("title"),
    "description": t("cta.description"),
    "url": getLocalizedUrl("/slike", locale as "sl" | "en"),
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": paintings.map((painting, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "name": painting.title,
          "image": painting.images?.[0] ? getImageUrl(painting.images[0].src) : undefined,
        }
      }))
    }
  };

  const breadcrumbs = [
    { name: tSeo("breadcrumbs.home"), url: "/" },
    { name: t("title"), url: "/slike" },
  ];

  return (
    <>
      <StructuredData data={collectionPageSchema} />
      <Breadcrumbs items={breadcrumbs} locale={locale as "sl" | "en"} />
      <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl text-stone-900 mb-4"
            style={{ fontFamily: "var(--font-quentin)" }}
          >
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-500 italic">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-8 md:px-16 lg:px-20 pt-6 md:pt-10 pb-12 md:pb-20">
        <div className="w-full mx-auto">
          {paintings.length > 0 ? (
            <div 
              className="columns-1 md:columns-2 gap-6 md:gap-8 lg:gap-10 xl:gap-12"
              style={{ columnFill: 'balance' }}
            >
              {paintings.map((painting) => (
                <div key={painting.id} className="break-inside-avoid mb-6 md:mb-8 lg:mb-10 xl:mb-12">
                  <PaintingCard
                    painting={painting}
                    onClick={() => setSelectedPainting(painting)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-400">
              <p>{t("noResults")}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA - Custom Paintings */}
      <section className="px-6 md:px-10 py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-3xl mx-auto">
            {t("cta.description")}
          </p>
          <a
            href="mailto:info@doriseinfalt.art"
            className="inline-block px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            <span style={{ marginTop: '2pt', display: 'block' }}>{t("cta.button")}</span>
          </a>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedPainting && (
        <PaintingDetailModal
          painting={selectedPainting}
          onClose={() => setSelectedPainting(null)}
        />
      )}
      </div>
    </>
  );
}
