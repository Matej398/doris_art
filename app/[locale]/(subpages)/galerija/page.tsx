"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Image3D } from "@/components/ui/Image3D";
import { Lightbox } from "@/components/ui/Lightbox";

// Import gallery data directly for client component
import galleryData from "@/data/gallery.json";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export default function GalerijaPage() {
  const t = useTranslations("gallery");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = galleryData.images as GalleryImage[];

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
  );
}

