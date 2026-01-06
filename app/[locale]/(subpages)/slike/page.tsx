"use client";

import { useTranslations } from "next-intl";

export default function SlikePage() {
  const t = useTranslations("navigation");

  return (
    <div className="min-h-screen bg-cream px-6 md:px-10 py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-6"
          style={{ fontFamily: "var(--font-dalton)" }}
        >
          {t("paintings")}
        </h1>
        <p className="text-lg text-stone-500">
          Stran v pripravi / Page coming soon
        </p>
      </div>
    </div>
  );
}

