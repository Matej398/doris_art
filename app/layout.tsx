import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const epilogue = localFont({
  src: [
    {
      path: "../public/fonts/Epilogue-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Epilogue-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Epilogue-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Epilogue-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Epilogue-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Epilogue-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Epilogue-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Epilogue-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Epilogue-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-epilogue",
  display: "swap",
});

const daltonWhite = localFont({
  src: "../public/fonts/Dalton White.otf",
  variable: "--font-dalton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "doriseinfalt.art",
  description: "Stenske poslikave, umetniške delavnice, slike po naročilu in izposoja dekoracij.",
  keywords: "stenske poslikave, delavnice za otroke, slike po naročilu, izposoja dekoracij, Brežice",
  openGraph: {
    title: "doriseinfalt.art",
    description: "Umetnost za posebne trenutke",
    locale: "sl_SI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl" className={`${epilogue.variable} ${daltonWhite.variable} ${epilogue.className}`}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
