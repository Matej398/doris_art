"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { RentalItem } from "@/lib/rentals";

interface RentalCardProps {
  rental: RentalItem;
}

export function RentalCard({ rental }: RentalCardProps) {
  const t = useTranslations("rentals.card");
  const locale = useLocale();
  
  const title = locale === "en" && rental.titleEn ? rental.titleEn : rental.title;

  return (
    <Link href={`/${locale}/izposoja/${rental.id}`} className="block group">
      <div className="space-y-3">
        {/* Large Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={rental.image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content below image */}
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-base font-medium text-stone-900 line-clamp-1">{title}</h3>
          
          {/* Price and Button */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-stone-900">{rental.pricePerDay}</span>
              <span className="text-sm text-stone-500 ml-1">{rental.currency}/{t("day")}</span>
            </div>
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-accent text-white hover:bg-accent/90">
              {t("selectDate")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

