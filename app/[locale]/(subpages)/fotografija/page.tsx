"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Image3D } from "@/components/ui/Image3D";
import { Lightbox } from "@/components/ui/Lightbox";

// Import photography data directly for client component
import photographyData from "@/data/photography.json";

export default function FotografijaPage() {
  const t = useTranslations("photography");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = photographyData.images;

  return (
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
      <section className="px-4 md:px-6 pt-6 md:pt-10 pb-12 md:pb-20">
        <div className="max-w-[95rem] mx-auto">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {images.map((image, index) => (
                <Image3D
                  key={image.id}
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={400}
                  className="aspect-square"
                  onClick={() => setLightboxIndex(index)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-400">
              <p>{t("galleryComingSoon")}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-10 py-16 md:py-20 bg-accent/5">
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

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images.map(img => ({ src: img.src, alt: img.alt }))}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}
    </div>
  );
}
