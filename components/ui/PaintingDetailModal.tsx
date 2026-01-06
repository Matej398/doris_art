"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Painting } from "@/lib/paintings";

interface PaintingDetailModalProps {
  painting: Painting;
  onClose: () => void;
}

export function PaintingDetailModal({ painting, onClose }: PaintingDetailModalProps) {
  const t = useTranslations("paintings.detail");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const hasMultipleImages = painting.images.length > 1;
  const currentImage = painting.images[currentImageIndex];

  // Reset image loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentImageIndex]);

  const goToNextImage = useCallback(() => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % painting.images.length);
    }
  }, [hasMultipleImages, painting.images.length]);

  const goToPrevImage = useCallback(() => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + painting.images.length) % painting.images.length);
    }
  }, [hasMultipleImages, painting.images.length]);

  // Handle keyboard navigation and trigger fade-in
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      } else if (e.key === "ArrowLeft") {
        goToPrevImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 10);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goToNextImage, goToPrevImage]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/60 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      {/* Modal content - fullscreen white background */}
      <div 
        className={`relative bg-white w-full h-full md:w-[95vw] md:h-[95vh] md:max-w-[1800px] md:rounded-lg overflow-hidden flex flex-col lg:flex-row transition-all duration-700 ${
          imageLoaded && isVisible 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 transition-all duration-500 bg-white/80 rounded-full ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          aria-label={t("close")}
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image section */}
        <div className="relative flex-1 bg-stone-50 flex items-center justify-center min-h-[50vh] lg:min-h-0">
          {/* Previous button */}
          {hasMultipleImages && (
            <button
              onClick={goToPrevImage}
              className="absolute left-4 md:left-6 z-10 p-3 text-stone-600 hover:text-stone-900 transition-colors bg-white/90 rounded-full shadow-md"
              aria-label={t("prevImage")}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Main image */}
          <div className="relative w-full h-full">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-contain p-4 md:p-8"
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
              onLoad={handleImageLoad}
            />
          </div>

          {/* Next button */}
          {hasMultipleImages && (
            <button
              onClick={goToNextImage}
              className="absolute right-4 md:right-6 z-10 p-3 text-stone-600 hover:text-stone-900 transition-colors bg-white/90 rounded-full shadow-md"
              aria-label={t("nextImage")}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone-600 text-sm bg-white/90 px-4 py-2 rounded-full shadow-sm">
              {currentImageIndex + 1} / {painting.images.length}
            </div>
          )}
        </div>

        {/* Details panel */}
        <div className="w-full lg:w-96 xl:w-[420px] p-6 md:p-8 lg:p-10 overflow-y-auto border-t lg:border-t-0 lg:border-l border-stone-200 bg-white">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-900 mb-6">
            {painting.title}
          </h2>

          {/* Details list */}
          <div className="space-y-4">
            {/* Size */}
            <div>
              <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                {t("size")}
              </span>
              <p className="text-stone-900 mt-1">{painting.size}</p>
            </div>

            {/* Technique */}
            <div>
              <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                {t("technique")}
              </span>
              <p className="text-stone-900 mt-1">{painting.technique}</p>
            </div>

            {/* Location (if available) */}
            {painting.location && (
              <div>
                <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                  {t("location")}
                </span>
                <p className="text-stone-900 mt-1">{painting.location}</p>
              </div>
            )}
          </div>

          {/* Image thumbnails (if multiple images) */}
          {hasMultipleImages && (
            <div className="mt-8 pt-6 border-t border-stone-200">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {painting.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? "border-accent" 
                        : "border-transparent hover:border-stone-300"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

