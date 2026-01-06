"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { PaintingCard } from "@/components/ui/PaintingCard";
import { PaintingDetailModal } from "@/components/ui/PaintingDetailModal";
import type { Painting } from "@/lib/paintings";

// Import paintings data directly for client component
import paintingsData from "@/data/paintings.json";

export default function SlikePage() {
  const t = useTranslations("paintings");
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);

  const paintings = paintingsData.paintings as Painting[];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="px-6 md:px-10 py-6 md:py-10">
        <div className="max-w-4xl mx-auto text-center">
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
      <section className="px-6 md:px-10 pt-6 md:pt-10 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto">
          {paintings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {paintings.map((painting) => (
                <PaintingCard
                  key={painting.id}
                  painting={painting}
                  onClick={() => setSelectedPainting(painting)}
                />
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
      <section className="px-6 md:px-10 py-16 md:py-20 bg-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <a
            href="mailto:info@doriseinfalt.art"
            className="inline-block px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            {t("cta.button")}
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
  );
}
