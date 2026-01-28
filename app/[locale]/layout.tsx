import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { BASE_URL } from "@/lib/seo";
import "../globals.css";

const epilogue = localFont({
  src: [
    {
      path: "../../public/fonts/Epilogue-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epilogue-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epilogue-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epilogue-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epilogue-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epilogue-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epilogue-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epilogue-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epilogue-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-epilogue",
  display: "swap",
});

const daltonWhite = localFont({
  src: "../../public/fonts/Dalton White.otf",
  variable: "--font-dalton",
  display: "swap",
});

const quentin = localFont({
  src: "../../public/fonts/Quentin.otf",
  variable: "--font-quentin",
  display: "swap",
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.home" });
  
  return {
    title: t("title"),
    description: t("description"),
    keywords: "stenske poslikave, delavnice za otroke, slike po naročilu, izposoja dekoracij, Brežice, wall paintings, art workshops",
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "sl" ? "sl_SI" : "en_US",
      type: "website",
      url: `${BASE_URL}/${locale}`,
      siteName: "Doris Einfalt Art",
      images: [
        {
          url: `${BASE_URL}/images/cards/delavnice.png`,
          width: 1200,
          height: 630,
          alt: "Doris Einfalt Art",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${BASE_URL}/images/cards/delavnice.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        "sl-SI": `${BASE_URL}/sl`,
        "en-US": `${BASE_URL}/en`,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${epilogue.variable} ${daltonWhite.variable} ${quentin.variable} ${epilogue.className}`}>
      <body className="min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

