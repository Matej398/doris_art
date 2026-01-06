"use client";

import { useTranslations } from "next-intl";
import type { Audience } from "@/lib/workshops";

interface WorkshopTabsProps {
  activeTab: Audience;
  onTabChange: (tab: Audience) => void;
}

export function WorkshopTabs({ activeTab, onTabChange }: WorkshopTabsProps) {
  const t = useTranslations("workshops.tabs");

  return (
    <div className="flex justify-center items-center gap-2 md:gap-4">
      <button
        onClick={() => onTabChange("children")}
        className={`px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium text-base md:text-lg transition-all duration-200 ${
          activeTab === "children"
            ? "bg-accent text-white shadow-md"
            : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
        }`}
      >
        {t("children")}
      </button>
      <button
        onClick={() => onTabChange("adults")}
        className={`px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium text-base md:text-lg transition-all duration-200 ${
          activeTab === "adults"
            ? "bg-accent text-white shadow-md"
            : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
        }`}
      >
        {t("adults")}
      </button>
    </div>
  );
}

