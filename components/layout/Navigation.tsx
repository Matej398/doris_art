"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";

interface NavigationProps {
  isScrolled?: boolean;
}

export function Navigation({ isScrolled }: NavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const services = [
    { id: "wall-paintings", label: t("navigation.wallPaintings"), href: `/${locale}/stenske-poslikave` },
    { id: "workshops", label: t("navigation.workshops"), href: `/${locale}/delavnice` },
    { id: "paintings", label: t("navigation.paintings"), href: `/${locale}/slike` },
    { id: "rentals", label: t("navigation.rentals"), href: `/${locale}/izposoja` },
    { id: "photography", label: t("navigation.photography"), href: `/${locale}/fotografija` },
    { id: "other", label: t("navigation.other"), href: `/${locale}/ostalo` },
  ];

  // Get the path for the other language
  const getOtherLocalePath = () => {
    const otherLocale = locale === "sl" ? "en" : "sl";
    // Replace the current locale with the other locale in the pathname
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
    return newPath || `/${otherLocale}`;
  };

  return (
    <nav className="flex items-center gap-6 md:gap-8">
      {/* Services dropdown - First */}
      <div 
        className="relative" 
        ref={dropdownRef}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button
          className={`flex items-center gap-1 text-sm md:text-base font-medium transition-colors ${
            isScrolled ? "text-stone-700 hover:text-stone-900" : "text-stone-700 hover:text-stone-900"
          }`}
        >
          {t("common.offers")}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 pt-2 z-50">
            <div className="w-48 py-2 bg-white rounded-lg shadow-lg">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm md:text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-accent transition-colors"
                >
                  {service.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery link */}
      <Link
        href={`/${locale}/galerija`}
        className={`text-sm md:text-base font-medium transition-colors ${
          isScrolled ? "text-stone-700 hover:text-stone-900" : "text-stone-700 hover:text-stone-900"
        }`}
      >
        {t("common.gallery")}
      </Link>

      {/* About me link */}
      <Link
        href={`/${locale}/o-meni`}
        className={`text-sm md:text-base font-medium transition-colors ${
          isScrolled ? "text-stone-700 hover:text-stone-900" : "text-stone-700 hover:text-stone-900"
        }`}
      >
        {t("common.about")}
      </Link>

      {/* Contact link */}
      <Link
        href={`/${locale}/kontakt`}
        className={`text-sm md:text-base font-medium transition-colors ${
          isScrolled ? "text-stone-700 hover:text-stone-900" : "text-stone-700 hover:text-stone-900"
        }`}
      >
        {t("common.contact")}
      </Link>

      {/* Language switcher */}
      <Link
        href={getOtherLocalePath()}
        className={`text-sm md:text-base font-medium uppercase transition-colors ${
          isScrolled ? "text-stone-400 hover:text-stone-700" : "text-stone-400 hover:text-stone-700"
        }`}
      >
        {locale === "sl" ? "EN" : "SL"}
      </Link>
    </nav>
  );
}

