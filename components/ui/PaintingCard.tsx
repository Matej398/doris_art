"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Painting } from "@/lib/paintings";

interface PaintingCardProps {
  painting: Painting;
  onClick: () => void;
}

export function PaintingCard({ painting, onClick }: PaintingCardProps) {
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

  // Get the first image as thumbnail
  const thumbnailImage = painting.images[0];

  if (!thumbnailImage) return null;

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer overflow-hidden transition-transform duration-200 ease-out group"
      style={{ 
        transform,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Image container - flexible aspect ratio */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <Image
          src={thumbnailImage.src}
          alt={thumbnailImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

