'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  Square3Stack3DIcon,
  BoltIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSimilarProperties } from '@/hooks/useSimilarProperties';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface SimilarPropertiesProps {
  currentPropertyId: string;
  location: {
    area: string;
    county: string;
  };
  propertyType: string;
  priceRange: {
    min: number;
    max: number;
  };
}

interface SimilarProperty {
  id: string;
  name: string;
  address: string;
  location: {
    area: string;
    county: string;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  propertyType: string;
  berRating: string;
  mainImage: string;
  images: string[];
  status: 'AVAILABLE' | 'SALE_AGREED' | 'PRICE_DROP';
  features: string[];
  similarity: {
    score: number;
    reasons: string[];
  };
}

export default function SimilarProperties({ 
  currentPropertyId, 
  location, 
  propertyType,
  priceRange 
}: SimilarPropertiesProps) {
  const { data: properties, isLoading } = useSimilarProperties({
    currentPropertyId,
    location,
    propertyType,
    priceRange
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No similar properties found</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="pb-10"
      >
        {properties.map((property: SimilarProperty, index: number) => (
          <SwiperSlide key={property.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative h-48">
                    <img
                      src={property.mainImage}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    {property.status === 'PRICE_DROP' && (
                      <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                        Price Reduced
                      </Badge>
                    )}
                    {property.status === 'SALE_AGREED' && (
                      <Badge className="absolute top-2 left-2 bg-orange-600 text-white">
                        Sale Agreed
                      </Badge>
                    )}
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-green-600 text-white">
                        {property.similarity.score}% Match
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold line-clamp-1">{property.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {property.address}, {property.location.area}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-blue-600">
                        €{property.price.toLocaleString()}
                      </p>
                      <Badge className="bg-gray-100 text-gray-800">
                        BER {property.berRating}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <HomeIcon className="h-4 w-4 mr-1" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center">
                        <Square3Stack3DIcon className="h-4 w-4 mr-1" />
                        {property.bathrooms}
                      </div>
                      <div className="flex items-center">
                        <CurrencyEuroIcon className="h-4 w-4 mr-1" />
                        {property.size}m²
                      </div>
                    </div>

                    {property.similarity.reasons.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600 mb-1">Similar because:</p>
                        <div className="flex flex-wrap gap-1">
                          {property.similarity.reasons.slice(0, 2).map((reason, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <Button
        size="icon"
        variant="outline"
        className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}