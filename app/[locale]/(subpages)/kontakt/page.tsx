"use client";

import { useTranslations } from "next-intl";
import { GeneralContactForm } from "@/components/contact/GeneralContactForm";

export default function KontaktPage() {
  const t = useTranslations("contact");

  return (
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
      <section className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
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
        </div>
      </section>
    </div>
  );
}

