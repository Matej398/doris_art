"use client";

import { Link, usePathname } from "@/i18n/navigation";
import NextLink from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";

interface NavigationProps {
  isScrolled?: boolean;
  variant?: "default" | "homepage";
}

interface PageVisibility {
  workshops?: boolean;
  paintings?: boolean;
  rentals?: boolean;
  gallery?: boolean;
  photography?: boolean;
  wallPaintings?: boolean;
  about?: boolean;
  other?: boolean;
}

// Map service IDs to visibility keys
const visibilityKeyMap: Record<string, keyof PageVisibility> = {
  "wall-paintings": "wallPaintings",
  "workshops": "workshops",
  "paintings": "paintings",
  "rentals": "rentals",
  "photography": "photography",
  "other": "other",
};

export function Navigation({ isScrolled, variant = "default" }: NavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [showNavItems, setShowNavItems] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [visibility, setVisibility] = useState<PageVisibility>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  // Handle mobile menu open/close with proper animation sequencing
  const handleMenuToggle = useCallback(() => {
    if (isMobileMenuOpen) {
      // Closing: first fade out nav items, then slide up
      setIsClosing(true);
      setShowNavItems(false);
      // Wait for nav items to fade out, then close menu
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
        setIsMobileDropdownOpen(false);
      }, 250);
    } else {
      // Opening
      setIsMobileMenuOpen(true);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key and handle nav items animation
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isMobileMenuOpen && !isClosing) {
        handleMenuToggle();
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = "hidden";
      // Show nav items after slide animation completes (300ms)
      const timer = setTimeout(() => setShowNavItems(true), 300);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleEscape);
      };
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen, isClosing, handleMenuToggle]);

  // Close mobile menu on link click with animation
  const handleMobileLinkClick = useCallback(() => {
    setIsClosing(true);
    setShowNavItems(false);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
      setIsMobileDropdownOpen(false);
    }, 250);
  }, []);

  // Fetch visibility settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setVisibility(data.pageVisibility || {});
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    }
    fetchSettings();
  }, []);

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

  const allServices = [
    { id: "wall-paintings", label: t("navigation.wallPaintings"), href: "/stenske-poslikave" as const },
    { id: "workshops", label: t("navigation.workshops"), href: "/delavnice" as const },
    { id: "paintings", label: t("navigation.paintings"), href: "/slike" as const },
    { id: "rentals", label: t("navigation.rentals"), href: "/izposoja" as const },
    { id: "photography", label: t("navigation.photography"), href: "/fotografija" as const },
    { id: "other", label: t("navigation.other"), href: `/${locale}/ostalo` },
  ];

  // Filter services based on visibility settings
  const services = allServices.filter((service) => {
    const visibilityKey = visibilityKeyMap[service.id];
    // If no visibility key exists for this service, always show it (e.g., "other")
    if (!visibilityKey) return true;
    // If visibility is explicitly set to false, hide it; otherwise show it
    return visibility[visibilityKey] !== false;
  });

  // Get the other locale
  const otherLocale = locale === "sl" ? "en" : "sl";

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6 md:gap-8">
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
                  service.id === "other" ? (
                    <NextLink
                      key={service.id}
                      href={service.href}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm md:text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-accent transition-colors"
                    >
                      {service.label}
                    </NextLink>
                  ) : (
                    <Link
                      key={service.id}
                      href={service.href as any}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm md:text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-accent transition-colors"
                    >
                      {service.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gallery link */}
        {visibility.gallery !== false && (
          <Link
            href="/galerija"
            className={`text-sm md:text-base font-medium transition-colors ${
              isScrolled ? "text-stone-700 hover:text-stone-900" : "text-stone-700 hover:text-stone-900"
            }`}
          >
            {t("common.gallery")}
          </Link>
        )}

        {/* About me link */}
        {visibility.about !== false && (
          <Link
            href="/o-meni"
            className={`text-sm md:text-base font-medium transition-colors ${
              isScrolled ? "text-stone-700 hover:text-stone-900" : "text-stone-700 hover:text-stone-900"
            }`}
          >
            {t("common.about")}
          </Link>
        )}

        {/* Contact link */}
        <Link
          href="/kontakt"
          className={`text-sm md:text-base font-medium transition-colors ${
            isScrolled ? "text-stone-700 hover:text-stone-900" : "text-stone-700 hover:text-stone-900"
          }`}
        >
          {t("common.contact")}
        </Link>

        {/* Language switcher */}
        <Link
          href={(pathname as any) || "/"}
          locale={otherLocale}
          className={`text-sm md:text-base font-medium uppercase transition-colors ${
            isScrolled ? "text-stone-400 hover:text-stone-700" : "text-stone-400 hover:text-stone-700"
          }`}
        >
          {locale === "sl" ? "EN" : "SL"}
        </Link>
      </nav>

      {/* Mobile Hamburger/X Button - Always visible, transforms between states */}
      <button
        className="md:hidden relative z-[110] flex flex-col justify-center items-center w-10 h-10"
        onClick={handleMenuToggle}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {/* Top line - rotates to form X */}
        <span
          className={`absolute w-6 h-0.5 rounded-full transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "bg-white rotate-45" : "bg-stone-700 -translate-y-[4px]"
          }`}
        />
        {/* Bottom line - rotates to form X */}
        <span
          className={`absolute w-6 h-0.5 rounded-full transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "bg-white -rotate-45" : "bg-stone-700 translate-y-[4px]"
          }`}
        />
      </button>

      {/* Mobile Menu - Fullscreen slide down */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full z-[100] bg-black transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ minHeight: '100dvh' }}
      >
        {/* Spacer for header height */}
        <div className="h-16" />

        {/* Navigation links - left aligned with staggered fade in/out */}
        <nav className="flex flex-col items-start px-8 pb-8 space-y-4">
          {/* Ponudba/Offers dropdown */}
          <div
            className={`w-full transition-all duration-200 ease-out ${
              showNavItems ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
            style={{ transitionDelay: showNavItems ? "0ms" : "150ms" }}
          >
            <button
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              className="flex items-center gap-2 text-2xl font-medium text-white py-2"
            >
              {t("common.offers")}
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isMobileDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown items */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isMobileDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col items-start space-y-2 pt-2 pb-4 pl-4">
                {services.map((service) => (
                  service.id === "other" ? (
                    <NextLink
                      key={service.id}
                      href={service.href}
                      onClick={handleMobileLinkClick}
                      className="text-xl font-medium text-stone-300 hover:text-white transition-colors py-1"
                    >
                      {service.label}
                    </NextLink>
                  ) : (
                    <Link
                      key={service.id}
                      href={service.href as any}
                      onClick={handleMobileLinkClick}
                      className="text-xl font-medium text-stone-300 hover:text-white transition-colors py-1"
                    >
                      {service.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Gallery link */}
          {visibility.gallery !== false && (
            <Link
              href="/galerija"
              onClick={handleMobileLinkClick}
              className={`text-2xl font-medium text-white hover:text-stone-300 transition-all duration-200 ease-out py-2 ${
                showNavItems ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
              style={{ transitionDelay: showNavItems ? "50ms" : "100ms" }}
            >
              {t("common.gallery")}
            </Link>
          )}

          {/* About me link */}
          {visibility.about !== false && (
            <Link
              href="/o-meni"
              onClick={handleMobileLinkClick}
              className={`text-2xl font-medium text-white hover:text-stone-300 transition-all duration-200 ease-out py-2 ${
                showNavItems ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
              style={{ transitionDelay: showNavItems ? "100ms" : "50ms" }}
            >
              {t("common.about")}
            </Link>
          )}

          {/* Contact link */}
          <Link
            href="/kontakt"
            onClick={handleMobileLinkClick}
            className={`text-2xl font-medium text-white hover:text-stone-300 transition-all duration-200 ease-out py-2 ${
              showNavItems ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
            style={{ transitionDelay: showNavItems ? "150ms" : "25ms" }}
          >
            {t("common.contact")}
          </Link>

          {/* Language switcher */}
          <div
            className={`pt-4 border-t border-stone-700 w-full transition-all duration-200 ease-out ${
              showNavItems ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
            style={{ transitionDelay: showNavItems ? "200ms" : "0ms" }}
          >
            <Link
              href={(pathname as any) || "/"}
              locale={otherLocale}
              onClick={handleMobileLinkClick}
              className="text-xl font-medium uppercase text-stone-500 hover:text-white transition-colors py-2"
            >
              {locale === "sl" ? "EN" : "SL"}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

