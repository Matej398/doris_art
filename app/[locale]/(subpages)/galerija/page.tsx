"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Image3D } from "@/components/ui/Image3D";
import { Lightbox } from "@/components/ui/Lightbox";
import { StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BASE_URL, getImageUrl, getLocalizedUrl } from "@/lib/seo";

// Import gallery data directly for client component
import galleryData from "@/data/gallery.json";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export default function GalerijaPage() {
  const t = useTranslations("gallery");
  const tSeo = useTranslations("seo");
  const locale = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = galleryData.images as GalleryImage[];

  // Generate structured data
  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": t("title"),
    "description": t("subtitle"),
    "url": getLocalizedUrl("/galerija", locale as "sl" | "en"),
    "image": images.length > 0 ? images.map(img => getImageUrl(img.src)) : undefined,
  };

  const breadcrumbs = [
    { name: tSeo("breadcrumbs.home"), url: "/" },
    { name: t("title"), url: "/galerija" },
  ];

  return (
    <>
      <StructuredData data={imageGallerySchema} />
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
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-4 md:px-6 pt-4 md:pt-6 pb-12 md:pb-20">
        <div className="max-w-[95rem] mx-auto">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
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
    </>
  );
}

