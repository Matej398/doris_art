"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface Image3DProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  intensity?: "strong" | "subtle";
}

export function Image3D({ 
  src, 
  alt, 
  width = 400, 
  height = 400, 
  className = "",
  onClick,
  intensity = "subtle"
}: Image3DProps) {
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
    
    // Homepage uses /15 with scale, subtle uses /180 without scale
    const divisor = intensity === "strong" ? 15 : 180;
    const rotateX = (y - centerY) / divisor;
    const rotateY = (centerX - x) / divisor;
    
    const scale = intensity === "strong" ? " scale3d(1.05, 1.05, 1.05)" : "";
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)${scale}`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  const useFill = className?.includes('aspect-');
  
  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative w-full overflow-hidden transition-transform duration-200 ease-out ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
      style={{ 
        transform,
        transformStyle: "preserve-3d",
      }}
    >
      {useFill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
        />
      )}
    </div>
  );
}



