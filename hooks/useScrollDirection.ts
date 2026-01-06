"use client";

import { useState, useEffect } from "react";

export type ScrollDirection = "up" | "down" | null;

interface ScrollState {
  direction: ScrollDirection;
  isScrolled: boolean;
  scrollY: number;
}

export function useScrollDirection(threshold = 10): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    direction: null,
    isScrolled: false,
    scrollY: 0,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      const direction = scrollY > lastScrollY ? "down" : "up";
      const isScrolled = scrollY > 50;

      setScrollState({
        direction,
        isScrolled,
        scrollY,
      });

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return scrollState;
}

