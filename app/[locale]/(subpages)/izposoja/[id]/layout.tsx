import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BASE_URL, getImageUrl } from "@/lib/seo";
import rentalsData from "@/data/rentals.json";
import type { RentalItem } from "@/lib/rentals";
import { getRentalById } from "@/lib/rentals";

export async function generateMetadata({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.rentalDetail" });
  const rentals = rentalsData.rentals as RentalItem[];
  const rentalId = parseInt(id);
  const rental = getRentalById(rentals, rentalId);

  if (!rental || rental.active === false) {
    return {
      title: "Not Found",
    };
  }

  const title = locale === "en" && rental.titleEn ? rental.titleEn : rental.title;
  const pageTitle = t("title", { name: title });
  const pageDescription = t("description", {
    name: title,
    price: rental.pricePerDay,
    deposit: rental.deposit,
  });

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      locale: locale === "sl" ? "sl_SI" : "en_US",
      type: "website",
      url: `${BASE_URL}/${locale}/izposoja/${rentalId}`,
      images: [
        {
          url: getImageUrl(rental.image),
          width: 1200,
          height: 900,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/izposoja/${rentalId}`,
    },
  };
}

export default function RentalDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
