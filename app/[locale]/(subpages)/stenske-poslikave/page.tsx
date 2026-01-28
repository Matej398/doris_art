"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { Image3D } from "@/components/ui/Image3D";
import { Lightbox } from "@/components/ui/Lightbox";
import { StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BASE_URL, getImageUrl } from "@/lib/seo";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export default function StenskePoslikavePage() {
  const t = useTranslations("wallPaintings");
  const tSeo = useTranslations("seo");
  const locale = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/wall-paintings');
        if (response.ok) {
          const data = await response.json();
          setGalleryImages(data.images || []);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    }
    fetchImages();
  }, []);

  const processSteps = [
    {
      key: "consultation",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      key: "design",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      key: "approval",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: "painting",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      key: "finishing",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  // Hero background images - add your transparent PNG images to public/images/wall-paintings-hero/
  const heroImages = [
    { src: "/images/wall-paintings-hero/decorative-1.png", position: "top-left", size: "w-64 md:w-[24rem] lg:w-[32rem] xl:w-[38rem] 2xl:w-[44rem]" },
    { src: "/images/wall-paintings-hero/decorative-2.png", position: "top-right", size: "w-96 md:w-[36rem] lg:w-[44rem] xl:w-[52rem] 2xl:w-[60rem]" },
  ];

  const getPositionClasses = (position: string) => {
    switch (position) {
      case "top-left":
        // decorative-1: anchored to bottom of beige section
        return "-bottom-16 md:-bottom-24 lg:-bottom-40 left-4 md:left-8 lg:left-16 xl:left-20";
      case "top-right":
        return "-bottom-4 md:-bottom-8 lg:-bottom-12 -right-12 md:-right-24 lg:-right-36 xl:-right-48";
      case "bottom-left":
        return "bottom-0 left-0 md:left-4";
      case "bottom-right":
        return "bottom-0 right-0 md:right-4";
      case "center-left":
        return "bottom-0 left-0 md:left-4";
      default:
        return "";
    }
  };

  // Generate structured data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": locale === "sl" ? "Stenske poslikave" : "Wall Paintings",
    "name": t("title"),
    "description": t("description"),
    "provider": {
      "@type": "Person",
      "name": "Doris Einfalt",
      "url": `${BASE_URL}/${locale}`,
      "image": getImageUrl("/images/author/doris.jpeg"),
    },
    "areaServed": {
      "@type": "Country",
      "name": "Slovenia"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": `${BASE_URL}/${locale}/stenske-poslikave`,
      "servicePhone": "+386-31-596-756",
      "serviceEmail": "info@doriseinfalt.art"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Doris Einfalt Art",
    "image": getImageUrl("/images/cards/poslikave.png"),
    "telephone": "+386-31-596-756",
    "email": "info@doriseinfalt.art",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Brežice",
      "addressCountry": "SI"
    },
    "url": `${BASE_URL}/${locale}/stenske-poslikave`,
    "priceRange": "€€"
  };

  const breadcrumbs = [
    { name: tSeo("breadcrumbs.home"), url: "/" },
    { name: t("title"), url: "/stenske-poslikave" },
  ];

  return (
    <>
      <StructuredData data={[serviceSchema, localBusinessSchema]} />
      <Breadcrumbs items={breadcrumbs} locale={locale as "sl" | "en"} />
      <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="px-6 md:px-10 pt-8 md:pt-12 pb-12 md:pb-20 lg:pb-28 xl:pb-36 2xl:pb-40 relative overflow-visible">
        {/* Background decorative images - anchored to bottom of hero */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
          <style jsx>{`
            @keyframes blurFadeIn {
              0% {
                opacity: 0;
                filter: blur(20px);
              }
              100% {
                opacity: 1;
                filter: blur(0px);
              }
            }
            .liquid-reveal {
              animation: blurFadeIn 2s ease-out forwards;
              opacity: 0;
            }
            .liquid-reveal-delayed {
              animation: blurFadeIn 2s ease-out 0.3s forwards;
              opacity: 0;
            }
          `}</style>
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute ${getPositionClasses(img.position)} ${img.size} liquid-reveal${index > 0 ? '-delayed' : ''}`}
            >
              <img
                src={img.src}
                alt=""
                loading="lazy"
                className="w-full h-full object-contain object-bottom"
                style={{ border: 'none', outline: 'none', display: 'block' }}
                onError={(e) => {
                  // Hide container and image if it doesn't exist
                  const container = (e.target as HTMLImageElement).parentElement;
                  if (container) {
                    container.style.display = 'none';
                  }
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-quentin)" }}
          >
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-500 italic mb-8">
            {t("subtitle")}
          </p>
          <p className="text-lg md:text-xl text-stone-600 max-w-4xl mx-auto mb-8">
            {t("description")}
          </p>
          <a
            href="mailto:info@doriseinfalt.art"
            className="inline-block px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors mt-4"
          >
            <span style={{ marginTop: '2pt', display: 'block' }}>{t("heroCtaButton")}</span>
          </a>
        </div>
      </section>

      {/* What I Offer & Process Section */}
      <section className="px-6 md:px-10 py-12 md:py-16 bg-white relative overflow-visible">
        <div className="max-w-5xl mx-auto text-center">
          {/* What I Offer */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
              {t("whatIOffer")}
            </h2>
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed">
              {t("offerText")}
            </p>
          </div>

          {/* Process */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-8">
              {t("process")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
              {processSteps.map((step, index) => (
                <div key={step.key}>
                  <div className="flex flex-col items-center text-center p-6 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                      {step.icon}
                    </div>
                    <span className="text-lg font-semibold text-accent mb-1">{index + 1}.</span>
                    <p className="text-sm font-medium text-stone-900">
                      {t(`processSteps.${step.key}`)}
                    </p>
                  </div>
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
                        onClick={() => setLightboxIndex(index)}
                        intensity="strong"
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
      <section className="px-6 md:px-10 py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-lg md:text-xl text-stone-600 mb-8">
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
      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages.map((img, idx) => ({ src: img.src, alt: `${t("galleryImageAlt")} ${idx + 1}` }))}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}
      </div>
    </>
  );
}

