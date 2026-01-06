import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delavnice | doriseinfalt.art",
  description: "Umetniške delavnice za otroke in odrasle v Brežicah. Slikanje na platno, akvarel, pastel. Organiziram tudi delavnice za rojstne dneve, dekliščine in teambuilding.",
  keywords: [
    "umetniške delavnice",
    "slikarske delavnice",
    "delavnice za otroke",
    "delavnice za odrasle",
    "slikanje na platno",
    "akvarel delavnica",
    "teambuilding delavnice",
    "rojstni dan delavnica",
    "dekliščina aktivnosti",
    "Brežice",
    "art workshops Slovenia"
  ],
  openGraph: {
    title: "Umetniške delavnice | doriseinfalt.art",
    description: "Kreativne delavnice za vse starosti. Slikanje, risanje, ustvarjanje. Pridruži se!",
    type: "website",
    locale: "sl_SI",
    alternateLocale: "en_US",
  },
  alternates: {
    languages: {
      "sl": "/sl/delavnice",
      "en": "/en/delavnice",
    },
  },
};

export default function DelavniceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

