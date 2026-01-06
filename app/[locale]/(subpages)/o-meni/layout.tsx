import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O meni | Doris Einfalt - Slovenska umetnica | doriseinfalt.art",
  description: "Doris Einfalt je slovenska umetnica, specializirana za umetnost za otroke - stenske poslikave, ilustracije otroških slikanic in umetniške delavnice. Spoznaj njeno zgodbo in ustvarjalni proces.",
  keywords: [
    "Doris Einfalt",
    "slovenska umetnica",
    "umetnica za otroke",
    "stenske poslikave",
    "ilustracije knjig",
    "umetniške delavnice",
    "Brežice",
    "slovenska ilustratorka",
    "art for children"
  ],
  openGraph: {
    title: "O meni | Doris Einfalt - Slovenska umetnica",
    description: "Spoznaj Doris Einfalt, slovensko umetnico, ki ustvarja umetnost za otroke - od stenskih poslikav do ilustracij in delavnic.",
    type: "profile",
    locale: "sl_SI",
    alternateLocale: "en_US",
  },
  alternates: {
    languages: {
      "sl": "/sl/o-meni",
      "en": "/en/o-meni",
    },
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

