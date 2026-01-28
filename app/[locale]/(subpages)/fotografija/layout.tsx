import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BASE_URL, getImageUrl } from "@/lib/seo";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.photography" });
  
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "sl" ? "sl_SI" : "en_US",
      type: "website",
      url: `${BASE_URL}/${locale}/fotografija`,
      images: [
        {
          url: getImageUrl("/images/cards/fotografija.JPG"),
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/fotografija`,
      languages: {
        "sl-SI": `${BASE_URL}/sl/fotografija`,
        "en-US": `${BASE_URL}/en/fotografija`,
      },
    },
  };
}

export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
