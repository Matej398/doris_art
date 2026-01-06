"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Navigation } from "./Navigation";

export function Header() {
  const locale = useLocale();
  const { direction, isScrolled } = useScrollDirection();

  // Determine if header should be visible
  // Show when: not scrolled OR scrolling up
  const isVisible = !isScrolled || direction === "up";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-3 md:py-4" 
          : "bg-transparent py-6 md:py-8"
      }`}
    >
      <div className="w-full px-8 md:px-16 lg:px-20 flex items-center justify-between">
        {/* Logo - smaller and left-aligned when scrolled */}
        <Link
          href={`/${locale}`}
          className="transition-all duration-300"
        >
          <span
            className={`text-stone-900 transition-all duration-300 ${
              isScrolled 
                ? "text-2xl md:text-3xl" 
                : "text-3xl md:text-4xl lg:text-5xl"
            }`}
            style={{ fontFamily: "var(--font-dalton)" }}
          >
            doris einfalt
          </span>
        </Link>

        {/* Navigation - right side */}
        <Navigation isScrolled={isScrolled} />
      </div>
    </header>
  );
}

