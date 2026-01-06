"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localIndex, setLocalIndex] = useState(currentIndex);

  const hasMultipleImages = images.length > 1;
  const currentImage = images[localIndex];

  // Update local index when currentIndex prop changes
  useEffect(() => {
    setLocalIndex(currentIndex);
    setImageLoaded(false);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (hasMultipleImages) {
      const nextIndex = (localIndex + 1) % images.length;
      setLocalIndex(nextIndex);
      setImageLoaded(false);
      onNavigate?.(nextIndex);
    }
  }, [hasMultipleImages, localIndex, images.length, onNavigate]);

  const goToPrev = useCallback(() => {
    if (hasMultipleImages) {
      const prevIndex = (localIndex - 1 + images.length) % images.length;
      setLocalIndex(prevIndex);
      setImageLoaded(false);
      onNavigate?.(prevIndex);
    }
  }, [hasMultipleImages, localIndex, images.length, onNavigate]);

  // Close on escape key, navigate with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";

    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 10);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goToNext, goToPrev]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className={`absolute top-4 right-4 text-white hover:text-stone-300 transition-all duration-500 z-10 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      {hasMultipleImages && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className={`absolute left-4 md:left-6 z-10 p-3 text-white hover:text-stone-200 transition-all duration-500 bg-black/50 rounded-full backdrop-blur-sm ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          aria-label="Previous image"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Main image */}
      <div className={`relative max-w-5xl max-h-[90vh] w-full h-full transition-all duration-700 ${
        imageLoaded && isVisible 
          ? "opacity-100 scale-100" 
          : "opacity-0 scale-95"
      }`}>
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-contain"
          onClick={(e) => e.stopPropagation()}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Next button */}
      {hasMultipleImages && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className={`absolute right-4 md:right-6 z-10 p-3 text-white hover:text-stone-200 transition-all duration-500 bg-black/50 rounded-full backdrop-blur-sm ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          aria-label="Next image"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image counter */}
      {hasMultipleImages && (
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
          {localIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

