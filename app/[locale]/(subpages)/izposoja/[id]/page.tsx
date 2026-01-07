"use client";

import { useTranslations, useLocale } from "next-intl";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { RentalReservationForm } from "@/components/rentals/RentalReservationForm";
import type { RentalItem } from "@/lib/rentals";
import { getRentalById } from "@/lib/rentals";

// Import data directly for client component
import rentalsData from "@/data/rentals.json";

export default function RentalDetailPage() {
  const t = useTranslations("rentals");
  const locale = useLocale();
  const params = useParams();
  const rentalId = parseInt(params.id as string);

  const rentals = rentalsData.rentals as RentalItem[];
  const rental = getRentalById(rentals, rentalId);

  if (!rental || rental.active === false) {
    notFound();
  }

  const title = locale === "en" && rental.titleEn ? rental.titleEn : rental.title;
  const description = locale === "en" && rental.descriptionEn ? rental.descriptionEn : rental.description;

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl text-stone-900 mb-4"
            style={{ fontFamily: "var(--font-quentin)" }}
          >
            {t("reservation")}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-10 py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Image and Details */}
            <div>
              <div className="relative aspect-[4/3] overflow-hidden mb-6">
                <Image
                  src={rental.image}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                  {t("details")}
                </h2>
                <p className="text-lg text-stone-700 leading-relaxed mb-4">
                  {description}
                </p>
                
                {rental.dimensions && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-stone-600">
                      {t("dimensions")}:{" "}
                    </span>
                    <span className="text-sm text-stone-700">
                      {rental.dimensions}
                    </span>
                  </div>
                )}

                {rental.category && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-stone-600">
                      {t("category")}:{" "}
                    </span>
                    <span className="text-sm text-stone-700">
                      {rental.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Pricing Info */}
              <div className="bg-stone-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-stone-900 mb-4">
                  {t("pricing")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-stone-600">{t("pricePerDay")}:</span>
                    <span className="font-semibold text-stone-900">
                      {rental.pricePerDay} {rental.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">{t("deposit")}:</span>
                    <span className="font-semibold text-stone-900">
                      {rental.deposit} {rental.currency}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-stone-200">
                    <p className="text-sm text-stone-600">
                      {t("depositInfo")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Reservation Form */}
            <div>
              <RentalReservationForm rental={rental} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

