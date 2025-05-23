'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DevelopmentSummary, getStatusColorClass } from "@/hooks/api/useDevelopments";

interface DevelopmentCardConnectedProps {
  development: DevelopmentSummary;
}

/**
 * Connected version of the DevelopmentCard component
 * This component receives data from GraphQL queries and maps it to the UI
 */
const DevelopmentCardConnected: React.FC<DevelopmentCardConnectedProps> = React.memo(({ 
  development 
}) => {
  // Location formatting for display
  const formattedLocation = development.location ? 
    `${development.location.city}, ${development.location.county}` : 
    "Location TBC";

  return (
    <Link 
      key={development.id} 
      href={`/developments/${development.slug || development.id}`} 
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
      aria-label={`View details for ${development.name}`}
    >
      <div className="relative h-48 w-full">
        {development.mainImage ? (
          <Image
            src={development.mainImage}
            alt={`Exterior view of ${development.name}`}
            fill
            style={ objectFit: "cover" }
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
        <p className="text-sm text-gray-600 mt-1">{formattedLocation}</p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{development.shortDescription || ""</p>

        {development.priceRange && (
          <p className="text-[#2B5273] font-semibold mt-2">{development.priceRange}</p>
        )}

        {/* Display availability info */}
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <span className="mr-2">
            {development.availableUnits} of {development.totalUnits} units available
          </span>
        </div>
      </div>
    </Link>
  );
});

DevelopmentCardConnected.displayName = "DevelopmentCardConnected";

export default DevelopmentCardConnected;