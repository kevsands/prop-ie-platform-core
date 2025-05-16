// src/components/DevelopmentCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Development } from "@/types"; // Assuming types are in src/types

interface DevelopmentCardProps {
  development: Development;
  getStatusColorClass: (statusColor: string | undefined) => string; // Pass helper function as prop
}

const DevelopmentCard: React.FC<DevelopmentCardProps> = React.memo(({ development, getStatusColorClass }) => {
  return (
    <Link 
      key={development.id} 
      href={`/developments/${development.id}`} 
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
      aria-label={`View details for ${development.name}`}
    >
      <div className="relative h-48 w-full">
        {development.image ? (
          <Image
            src={development.image} // Assuming image is a URL or correct path in /public
            alt={`Exterior view of ${development.name}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" // Optimized sizes
            // Consider adding placeholder="blur" if blurDataURL is available
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">No Image Available</div>
        )}
        {development.status && (
          <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded ${getStatusColorClass(development.statusColor)}`}>
            {development.status}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2B5273] transition-colors">{development.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{development.location || "Location TBC"}</p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{development.description || ""}</p>
      </div>
    </Link>
  );
});

DevelopmentCard.displayName = "DevelopmentCard"; // Add display name for better debugging

export default DevelopmentCard;

