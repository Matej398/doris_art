"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import type { Workshop } from "@/lib/workshops";
import { getNextSchedule, getAvailableSpots, formatDateSl, formatDateEn } from "@/lib/workshops";

interface WorkshopCardProps {
  workshop: Workshop;
  onBookClick: (workshop: Workshop) => void;
}

export function WorkshopCard({ workshop, onBookClick }: WorkshopCardProps) {
  const t = useTranslations("workshops.card");
  const locale = useLocale();
  
  const nextSchedule = getNextSchedule(workshop);
  const availableSpots = nextSchedule ? getAvailableSpots(nextSchedule) : 0;
  
  // Get localized content
  const title = locale === "en" && workshop.titleEn ? workshop.titleEn : workshop.title;
  const technique = locale === "en" && workshop.techniqueEn ? workshop.techniqueEn : workshop.technique;
  const duration = locale === "en" && workshop.durationEn ? workshop.durationEn : workshop.duration;
  const ageRange = locale === "en" && workshop.ageRangeEn ? workshop.ageRangeEn : workshop.ageRange;
  const description = locale === "en" && workshop.descriptionEn ? workshop.descriptionEn : workshop.description;

  // Format the next date
  const nextDateFormatted = nextSchedule 
    ? (locale === "en" ? formatDateEn(nextSchedule.date) : formatDateSl(nextSchedule.date))
    : null;

  // Vacancy status
  const getVacancyStatus = () => {
    if (!nextSchedule) return { text: t("noUpcoming"), color: "text-stone-400" };
    if (availableSpots <= 0) return { text: t("full"), color: "text-red-500" };
    if (availableSpots === 1) return { text: t("onlyOneSpot"), color: "text-pink-500" };
    if (availableSpots <= 2) return { text: `${availableSpots} ${t("spotsLeft")}`, color: "text-orange-500" };
    return { text: `${availableSpots} ${t("spotsAvailable")}`, color: "text-accent" };
  };

  const vacancy = getVacancyStatus();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={workshop.image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {/* Technique badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-stone-700">
          <span style={{ marginTop: '2pt', display: 'block' }}>{technique}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-semibold text-stone-900 mb-2">{title}</h3>
        
        {/* Description */}
        <p className="text-stone-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Details row */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-stone-500">
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ marginTop: '1pt' }}>{duration}</span>
          </span>
          {ageRange && (
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span style={{ marginTop: '1pt' }}>{ageRange}</span>
            </span>
          )}
        </div>

        {/* Schedule info */}
        {nextSchedule && (
          <div className="flex items-center justify-between mb-4 p-3 bg-stone-50 rounded-lg">
            <div>
              <p className="text-sm text-stone-500">{t("nextDate")}</p>
              <p className="font-medium text-stone-900">
                {nextDateFormatted} {t("at")} {nextSchedule.time}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${vacancy.color}`}>
                {vacancy.text}
              </p>
            </div>
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div>
            <span className="text-2xl font-bold text-stone-900">{workshop.price}</span>
            <span className="text-stone-500 ml-1">{workshop.currency}</span>
          </div>
          <button
            onClick={() => onBookClick(workshop)}
            disabled={!nextSchedule || availableSpots <= 0}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              nextSchedule && availableSpots > 0
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {t("book")}
          </button>
        </div>
      </div>
    </div>
  );
}

