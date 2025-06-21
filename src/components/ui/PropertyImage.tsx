import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PropertyImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export const PropertyImage: React.FC<PropertyImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes,
  priority = false,
  fallbackSrc = '/images/placeholder-property.svg'
}) => {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const imageProps = {
    src: imageSrc,
    alt: alt || 'Property image',
    onError: handleError,
    onLoad: handleLoad,
    className: cn(
      'transition-opacity duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    priority
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
    />
  );
};

PropertyImage.displayName = 'PropertyImage';