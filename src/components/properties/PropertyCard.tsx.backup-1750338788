'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Square, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    status: string;
    bedrooms: number;
    bathrooms: number;
    size: number;
    image: string;
    tags?: string[];
  };
  onViewDetails?: () => void;
}

export default function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0}).format(amount);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {property.status}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </p>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-bold text-[#2B5273]">
            {formatCurrency(property.price)}
          </p>
          {property.tags && property.tags.length> 0 && (
            <div className="flex gap-1">
              {property.tags.slice(0).map((tag: any) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <BedDouble className="h-4 w-4 mr-1" />
            {property.bedrooms} bed
          </span>
          <span className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} bath
          </span>
          <span className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.size} m²
          </span>
        </div>

        <Link
          href={`/properties/${property.id}`}
          className="block w-full text-center bg-[#2B5273] text-white py-2 rounded-md hover:bg-[#1E3142] transition-colors"
          onClick={(e: any) => {
            if (onViewDetails) {
              e.preventDefault();
              onViewDetails();
            }
          }
        >
          View Details
        </Link>
      </CardContent>
    </Card>
  );
}