"use client";

import { useTranslations } from "next-intl";

export default function IzposojaPage() {
  const t = useTranslations("navigation");

  return (
    <div className="min-h-screen bg-cream px-6 md:px-10 py-12 md:py-20">
      <div className="max-w-5xl mx-auto text-center">
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl text-stone-900 mb-6"
          style={{ fontFamily: "var(--font-quentin)" }}
        >
          {t("rentals")}
        </h1>
        <p className="text-lg text-stone-500">
          Stran v pripravi / Page coming soon
        </p>
      </div>
    </div>
  );
}

