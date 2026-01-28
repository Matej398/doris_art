"use client";

import { useTranslations, useLocale } from "next-intl";
import { GeneralContactForm } from "@/components/contact/GeneralContactForm";
import { StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BASE_URL, getLocalizedUrl } from "@/lib/seo";

export default function KontaktPage() {
  const t = useTranslations("contact");
  const tSeo = useTranslations("seo");
  const locale = useLocale();

  // Generate structured data
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": t("title"),
    "url": getLocalizedUrl("/kontakt", locale as "sl" | "en"),
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Doris Einfalt s.p.",
    "image": `${BASE_URL}/images/cards/delavnice.png`,
    "telephone": "+386-31-596-756",
    "email": "info@doriseinfalt.art",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gabrovlje 1A",
      "addressLocality": "Slovenske Konjice",
      "postalCode": "3210",
      "addressCountry": "SI"
    },
    "url": `${BASE_URL}/${locale}/kontakt`,
    "priceRange": "€€"
  };

  const breadcrumbs = [
    { name: tSeo("breadcrumbs.home"), url: "/" },
    { name: t("title"), url: "/kontakt" },
  ];

  return (
    <>
      <StructuredData data={[contactPageSchema, localBusinessSchema]} />
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
        </div>
      </section>

      {/* Contact Section - Two Columns */}
      <section className="px-6 md:px-10 py-8 md:py-12 relative overflow-visible">
        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 relative z-10">
            {/* Left Column - Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-6">
                {t("info.title")}
              </h2>
              
              <div className="space-y-4">
                {/* Company */}
                <div>
                  <p className="text-base text-stone-900">
                    Doris Einfalt s.p.
                  </p>
                </div>

                {/* Address */}
                <div>
                  <p className="text-base text-stone-900">
                    Gabrovlje 1A<br />
                    3210 Slovenske Konjice
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-base text-stone-900">
                    info@doriseinfalt.art
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-base text-stone-900">
                    031 596 756
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-6">
                {t("form.title")}
              </h2>
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <GeneralContactForm />
              </div>
            </div>
          </div>
          
          {/* Decorative flower image - positioned in bottom-left quadrant */}
          <div className="absolute bottom-24 md:bottom-32 lg:bottom-40 left-24 md:left-32 lg:left-40 z-0 pointer-events-none">
            <div className="relative w-[20rem] h-[20rem] md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem]">
              <img
                src="/images/wall-paintings-hero/flower-2.png"
                alt=""
                loading="lazy"
                className="w-full h-full object-contain object-bottom opacity-70"
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
        </div>
      </section>
      </div>
    </>
  );
}

