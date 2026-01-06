"use client";

import { useTranslations } from "next-intl";

export default function OstaloPage() {
  const t = useTranslations("navigation");

  return (
    <div className="min-h-screen bg-cream">
      <section className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-5xl mx-auto text-center">
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl text-stone-900 mb-6"
          style={{ fontFamily: "var(--font-quentin)" }}
        >
          {t("other")}
        </h1>
        <p className="text-lg text-stone-500">
          Stran v pripravi / Page coming soon
        </p>
        </div>
      </section>
    </div>
  );
}

