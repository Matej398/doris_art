"use client";

import { useTranslations } from "next-intl";
import { RentalCard } from "@/components/rentals/RentalCard";
import type { RentalItem } from "@/lib/rentals";
import { getActiveRentals } from "@/lib/rentals";

// Import data directly for client component
import rentalsData from "@/data/rentals.json";

export default function IzposojaPage() {
  const t = useTranslations("rentals");
  
  const rentals = rentalsData.rentals as RentalItem[];
  const activeRentals = getActiveRentals(rentals);

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
          <p className="text-lg md:text-xl text-stone-500 italic mb-8">
            {t("subtitle")}
          </p>
          <p className="text-lg md:text-xl text-stone-600 max-w-4xl mx-auto">
            {t("description")}
          </p>
        </div>
      </section>

      {/* Rentals Grid */}
      <section className="px-6 md:px-10 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          {activeRentals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-12">
              {activeRentals.map((rental) => (
                <div key={rental.id}>
                  <RentalCard rental={rental} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-400">
              <p>{t("noRentals")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

