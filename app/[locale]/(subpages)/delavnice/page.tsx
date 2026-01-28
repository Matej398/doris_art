"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { WorkshopTabs } from "@/components/workshops/WorkshopTabs";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import { ContactForm } from "@/components/workshops/ContactForm";
import { WhatYouGet } from "@/components/workshops/WhatYouGet";
import type { Workshop, Audience } from "@/lib/workshops";
import { filterByAudience, getNextSchedule, isWorkshopActive } from "@/lib/workshops";

// Import data directly for client component
import workshopsData from "@/data/workshops.json";

// JSON-LD structured data component
function WorkshopJsonLd({ workshops, locale }: { workshops: Workshop[]; locale: string }) {
  const baseUrl = "https://doriseinfalt.art";
  
  // Filter to only include active workshops for structured data
  const activeWorkshops = workshops.filter(w => w.active !== false);
  
  // Create Course schema for each workshop
  const courseSchemas = activeWorkshops.map((workshop) => {
    const nextSchedule = getNextSchedule(workshop);
    const title = locale === "en" && workshop.titleEn ? workshop.titleEn : workshop.title;
    const description = locale === "en" && workshop.descriptionEn ? workshop.descriptionEn : workshop.description;
    
    return {
      "@type": "Course",
      "name": title,
      "description": description,
      "provider": {
        "@type": "Person",
        "name": "Doris Einfalt",
        "url": baseUrl
      },
      "offers": {
        "@type": "Offer",
        "price": workshop.price,
        "priceCurrency": workshop.currency,
        "availability": nextSchedule ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      },
      ...(nextSchedule && {
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "startDate": nextSchedule.date,
          "location": {
            "@type": "Place",
            "name": "Brežice, Slovenia"
          }
        }
      })
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": locale === "sl" ? "Umetniške delavnice za otroke in odrasle" : "Art workshops for kids and adults",
        "description": locale === "sl" 
          ? "Kreativne umetniške delavnice za otroke in odrasle v Brežicah. Slikanje na platno, akvarel, pastel in več."
          : "Creative art workshops for kids and adults in Brežice, Slovenia. Canvas painting, watercolor, pastels and more.",
        "url": `${baseUrl}/${locale}/delavnice`,
        "inLanguage": locale === "sl" ? "sl-SI" : "en"
      },
      {
        "@type": "LocalBusiness",
        "name": "Doris Einfalt Art",
        "url": baseUrl,
        "image": `${baseUrl}/images/cards/delavnice.png`,
        "telephone": "+386 40 123 456",
        "email": "info@doriseinfalt.art",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Brežice",
          "addressCountry": "SI"
        },
        "priceRange": "€€"
      },
      ...courseSchemas
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function DelavnicePage() {
  const t = useTranslations("workshops");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Audience>("children");
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const workshops = workshopsData.workshops as Workshop[];
  const eventTypes = workshopsData.eventTypes;

  // Filter to only show active workshops (active !== false)
  const activeWorkshops = workshops.filter(w => w.active !== false);
  
  // Then filter by audience
  const filteredWorkshops = filterByAudience(activeWorkshops, activeTab);

  const handleBookClick = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    // Scroll to form
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* SEO JSON-LD Structured Data */}
      <WorkshopJsonLd workshops={workshops} locale={locale} />
      
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
              {t("intro")}
            </p>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="px-6 md:px-10 pb-10 pt-2">
          <div className="max-w-6xl mx-auto">
            {filteredWorkshops.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                <WorkshopTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            ) : (
              <WorkshopTabs activeTab={activeTab} onTabChange={setActiveTab} />
            )}
          </div>
        </section>

        {/* Workshops Grid */}
        <section className="px-6 md:px-10 pb-16 md:pb-20">
          <div className="max-w-6xl mx-auto">
            {filteredWorkshops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {filteredWorkshops.map((workshop) => (
                  <div key={workshop.id} className="w-full max-w-sm md:max-w-none">
                    <WorkshopCard
                      workshop={workshop}
                      onBookClick={handleBookClick}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400">
                <p>{t("noWorkshops")}</p>
              </div>
            )}
          </div>
        </section>

        {/* What You Get Section */}
        <WhatYouGet />

        {/* Contact Form Section */}
        <section ref={formRef} className="px-6 md:px-10 py-16 md:py-20 bg-stone-50">
          <div className="max-w-2xl mx-auto">
            <ContactForm
              workshops={workshops}
              eventTypes={eventTypes}
              preselectedWorkshop={selectedWorkshop}
            />
          </div>
        </section>

        {/* Direct Contact CTA */}
        <section className="px-6 md:px-10 py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg md:text-xl text-stone-600 mb-8">
              {t("cta.description")}
            </p>
            <div className="flex justify-center">
              <a
                href="mailto:info@doriseinfalt.art"
                className="inline-block px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                <span style={{ marginTop: '2pt', display: 'block' }}>{t("cta.emailButton")}</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
