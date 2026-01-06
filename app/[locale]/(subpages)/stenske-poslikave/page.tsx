"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Image3D } from "@/components/ui/Image3D";
import { Lightbox } from "@/components/ui/Lightbox";

// Placeholder gallery images - replace with actual images
const galleryImages = [
  { id: 1, src: "/images/cards/poslikave.png" },
  // Add more images as they become available
];

export default function StenskePoslikavePage() {
  const t = useTranslations("wallPaintings");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const processSteps = [
    { key: "consultation", icon: "💬" },
    { key: "design", icon: "✏️" },
    { key: "approval", icon: "✓" },
    { key: "painting", icon: "🎨" },
    { key: "finishing", icon: "✨" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="px-6 md:px-10 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-quentin)" }}
          >
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-500 italic">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Description Section */}
      <section className="px-6 md:px-10 py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-12">
            {t("description")}
          </p>

          {/* What I Offer */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
              {t("whatIOffer")}
            </h2>
            <p className="text-stone-600 leading-relaxed">
              {t("offerText")}
            </p>
          </div>

          {/* Process */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-8">
              {t("process")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {processSteps.map((step, index) => (
                <div key={step.key} className="relative">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 text-2xl">
                      {step.icon}
                    </div>
                    <span className="text-sm text-stone-500 mb-1">{index + 1}.</span>
                    <p className="text-sm font-medium text-stone-700">
                      {t(`processSteps.${step.key}`)}
                    </p>
                  </div>
                  {/* Arrow connector */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-6 md:px-10 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-8 text-center">
            {t("gallery")}
          </h2>
          
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <Image3D
                  key={image.id}
                  src={image.src}
                  alt={`${t("galleryImageAlt")} ${index + 1}`}
                  className="aspect-square"
                  onClick={() => setLightboxImage({ src: image.src, alt: `${t("galleryImageAlt")} ${index + 1}` })}
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

      {/* Contact CTA */}
      <section className="px-6 md:px-10 py-12 md:py-16 bg-accent/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-stone-600 mb-8">
            {t("ctaDescription")}
          </p>
          <a
            href="mailto:info@doriseinfalt.art"
            className="inline-block px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            <span style={{ marginTop: '2pt', display: 'block' }}>{t("ctaButton")}</span>
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}

