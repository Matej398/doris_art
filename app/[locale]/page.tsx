"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Navigation } from "@/components/layout/Navigation";
import { StructuredData } from "@/components/seo/StructuredData";
import { BASE_URL, getImageUrl } from "@/lib/seo";

function Card3D({ category, locale }: { category: { id: string; title: string; href: string; image: string }; locale: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  return (
    <Link href={`/${locale}${category.href}`} className="group flex flex-col items-start flex-shrink-0">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 overflow-hidden transition-transform duration-200 ease-out"
        style={{ 
          transform,
          transformStyle: "preserve-3d",
        }}
      >
        <Image
          src={category.image}
          alt={category.title}
          width={288}
          height={288}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <span className="mt-4 text-base md:text-lg lg:text-xl font-semibold text-stone-900 group-hover:text-black transition-colors lowercase relative inline-block">
        {category.title}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
  );
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const categories = [
    {
      id: "poslikave",
      title: t("navigation.wallPaintings"),
      href: "/stenske-poslikave",
      image: "/images/cards/poslikave.png",
    },
    {
      id: "delavnice",
      title: t("navigation.workshops"),
      href: "/delavnice",
      image: "/images/cards/delavnice.png",
    },
    {
      id: "slike",
      title: t("navigation.paintings"),
      href: "/slike",
      image: "/images/cards/slike.png",
    },
    {
      id: "izposoja",
      title: t("navigation.rentals"),
      href: "/izposoja",
      image: "/images/cards/izposoja.jpg",
    },
    {
      id: "fotografija",
      title: t("navigation.photography"),
      href: "/fotografija",
      image: "/images/cards/fotografija.JPG",
    },
  ];

  // Generate structured data for homepage
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Doris Einfalt Art",
    "url": `${BASE_URL}/${locale}`,
    "logo": getImageUrl("/images/cards/delavnice.png"),
    "description": locale === "sl" 
      ? "Ustvarjam edinstvene stenske poslikave, umetniške delavnice za otroke in odrasle, slike po naročilu in izposojo dekoracij."
      : "I create unique wall paintings, art workshops for kids and adults, custom paintings, and rental decorations.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Brežice",
      "addressCountry": "SI"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+386-31-596-756",
      "contactType": "customer service",
      "email": "info@doriseinfalt.art"
    },
    "sameAs": [
      "https://instagram.com/doriseinfalt",
      "https://facebook.com/doriseinfalt"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Doris Einfalt Art",
    "url": `${BASE_URL}/${locale}`,
    "description": locale === "sl"
      ? "Stenske poslikave, umetniške delavnice, slike po naročilu in izposoja dekoracij."
      : "Wall paintings, art workshops, custom paintings, and rental decorations.",
    "inLanguage": locale === "sl" ? "sl-SI" : "en",
    "publisher": {
      "@type": "Organization",
      "name": "Doris Einfalt Art"
    }
  };

  return (
    <>
      <StructuredData data={[organizationSchema, websiteSchema]} />
      <div className="min-h-screen bg-cream flex flex-col">
      {/* Navigation - Fixed position top right (same as subpage header) */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 py-6 md:py-8 px-8 md:px-16 lg:px-20 flex justify-end items-center transition-all duration-1000 pointer-events-none ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Invisible logo spacer to match height */}
        <span 
          className="text-3xl md:text-4xl lg:text-5xl invisible"
          style={{ fontFamily: 'var(--font-quentin)' }}
          aria-hidden="true"
        >
          doris einfalt
        </span>
        <div className="pointer-events-auto">
          <Navigation />
        </div>
      </div>

      {/* Header with logo */}
      <header className="pt-20 md:pt-24 pb-0 md:pb-1">
        {/* Logo - Centered */}
        <div className="flex justify-center">
          <Link
            href={`/${locale}`}
            className="inline-block"
          >
            <span 
              className="text-[3.5rem] md:text-6xl lg:text-7xl text-stone-900 inline-flex"
              style={{ fontFamily: 'var(--font-quentin)' }}
            >
              {"doris einfalt".split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block"
                  style={{
                    animation: `letterReveal 0.8s ease-out ${index * 0.1}s forwards`,
                    opacity: 0,
                    filter: 'blur(10px)',
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <style jsx>{`
              @keyframes letterReveal {
                0% {
                  opacity: 0;
                  filter: blur(10px);
                }
                100% {
                  opacity: 1;
                  filter: blur(0px);
                }
              }
            `}</style>
          </Link>
        </div>
      </header>

      {/* Main - Category Grid */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-12 pt-0 pb-6">
        <div className="w-full max-w-fit">
          <h2 
            className={`text-center text-lg md:text-xl lg:text-2xl font-normal italic text-stone-400 mt-0 mb-28 transition-all duration-1000 delay-100 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {t("home.tagline")}<br />{t("home.taglineSub")}
          </h2>
          <div
            className={`flex flex-wrap justify-center gap-5 md:gap-6 lg:gap-7 transition-all duration-1000 delay-200 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {categories.map((category) => (
              <Card3D key={category.id} category={category} locale={locale} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-10">
        {/* Social Section - Centered */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-stone-900 hover:text-accent transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-stone-900 hover:text-accent transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <p className="text-center text-xs font-medium text-stone-400">© {new Date().getFullYear()} doriseinfalt.art</p>
      </footer>
      </div>
    </>
  );
}

