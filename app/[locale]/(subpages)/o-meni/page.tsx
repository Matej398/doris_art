"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";

interface AboutData {
  biography: {
    sl: string[];
    en: string[];
  };
  image: string;
}

// JSON-LD structured data for Person schema
function PersonJsonLd({ locale }: { locale: string }) {
  const baseUrl = "https://doriseinfalt.art";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Doris Einfalt",
    "jobTitle": locale === "sl" ? "Slovenska umetnica" : "Slovenian artist",
    "description": locale === "sl" 
      ? "Slovenska umetnica, specializirana za umetnost za otroke - stenske poslikave, ilustracije otroških slikanic in umetniške delavnice."
      : "Slovenian artist specializing in art for children - wall paintings, children's book illustrations, and art workshops.",
    "url": `${baseUrl}/${locale}/o-meni`,
    "image": `${baseUrl}/images/author/doris.jpeg`,
    "sameAs": [
      "https://instagram.com/doriseinfalt",
      "https://facebook.com/doriseinfalt"
    ],
    "knowsAbout": [
      locale === "sl" ? "Stenske poslikave" : "Wall paintings",
      locale === "sl" ? "Ilustracije knjig" : "Book illustrations",
      locale === "sl" ? "Umetniške delavnice" : "Art workshops",
      locale === "sl" ? "Umetnost za otroke" : "Art for children"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Brežice",
      "addressCountry": "SI"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    }
    fetchData();
  }, []);

  const biographyParagraphs = aboutData?.biography?.[locale as 'sl' | 'en'] || [];
  const profileImage = aboutData?.image || '/images/author/doris.jpeg';

  return (
    <>
      {/* SEO JSON-LD Structured Data */}
      <PersonJsonLd locale={locale} />
      
      <div className="bg-cream">
      {/* Hero Section */}
      <section className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl text-stone-900"
            style={{ fontFamily: "var(--font-quentin)" }}
          >
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Author Section */}
      <section className="px-6 md:px-10 pt-4 md:pt-6 pb-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-12 md:gap-16">
            {/* Circular Author Image */}
            <div className="flex-shrink-0 relative">
              {/* Decorative background image */}
              <div className="absolute top-1/2 -left-32 md:-left-40 lg:-left-48 -translate-y-1/3 z-0">
                <div className="relative w-[12rem] h-[12rem] md:w-[16rem] md:h-[16rem] lg:w-[20rem] lg:h-[20rem]">
                  <img
                    src="/images/wall-paintings-hero/flower-1.png"
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-contain opacity-70"
                    style={{ border: 'none', outline: 'none', display: 'block' }}
                    onError={(e) => {
                      const container = (e.target as HTMLImageElement).parentElement?.parentElement;
                      if (container) {
                        container.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
              {/* Circular author image on top */}
              <div className="relative w-96 h-96 md:w-[32rem] md:h-[32rem] rounded-full overflow-hidden bg-stone-200 z-10">
                <Image
                  src={profileImage}
                  alt={t("imageAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 384px, 512px"
                />
              </div>
            </div>

            {/* Biography Text */}
            <div className="flex-1 text-center">
              <div className="prose prose-stone max-w-none">
                {biographyParagraphs.length > 0 ? (
                  biographyParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`text-lg md:text-xl text-stone-700 leading-relaxed ${
                        index < biographyParagraphs.length - 1 ? 'mb-6' : ''
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-6">
                      {t("biography.p1")}
                    </p>
                    <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-6">
                      {t("biography.p2")}
                    </p>
                    <p className="text-lg md:text-xl text-stone-700 leading-relaxed">
                      {t("biography.p3")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Links Section */}
      <section className="px-6 md:px-10 py-12 md:py-16 bg-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-6 text-center">
            {t("interviews.title")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.bibaleze.si/novice/doris-einfalt-umetnica-ki-slika-za-otroke.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-100 transition-colors text-center"
            >
              <span style={{ marginTop: '2pt', display: 'block' }}>
                {t("interviews.bibaleze")}
              </span>
            </a>
            <a
              href="https://www.mcdd.si/objave/patriot/pogled-v-pravljicni-svet/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-100 transition-colors text-center"
            >
              <span style={{ marginTop: '2pt', display: 'block' }}>
                {t("interviews.mcdd")}
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
