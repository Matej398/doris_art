"use client";

import { Link } from "@/i18n/navigation";
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
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="w-full h-20 md:h-24 px-8 md:px-16 lg:px-20 flex items-center justify-between">
        {/* Logo - smaller and left-aligned when scrolled */}
        <Link
          href="/"
          className="transition-all duration-300"
        >
          <span
            className={`text-stone-900 transition-all duration-300 ${
              isScrolled 
                ? "text-2xl md:text-3xl" 
                : "text-2xl md:text-3xl lg:text-4xl"
            }`}
            style={{ fontFamily: "var(--font-quentin)" }}
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

