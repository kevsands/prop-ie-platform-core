import sharp from 'sharp';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '@/config/env';
import { cache, CacheTTL } from '@/lib/cache/redis';
import { logError, logInfo } from '@/lib/monitoring/logger';

// S3 client for image storage
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey});

// Image optimization presets
export const imagePresets = {
  thumbnail: { width: 150, height: 150, quality: 80 },
  small: { width: 300, height: 300, quality: 85 },
  medium: { width: 600, height: 600, quality: 85 },
  large: { width: 1200, height: 1200, quality: 90 },
  hero: { width: 1920, height: 1080, quality: 90 } as const;

export type ImagePreset = keyof typeof imagePresets;

/**
 * Image optimization service
 */
export class ImageOptimizer {
  /**
   * Optimize and resize image
   */
  async optimize(
    buffer: Buffer,
    preset: ImagePreset,
    format: 'jpeg' | 'png' | 'webp' = 'webp'
  ): Promise<Buffer> {
    const { width, height, quality } = imagePresets[preset];

    try {
      const optimized = await sharp(buffer)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true})
        .toFormat(format, { quality })
        .toBuffer();

      logInfo('Image optimized', {
        preset,
        format,
        originalSize: buffer.length,
        optimizedSize: optimized.length,
        reduction: `${Math.round((1 - optimized.length / buffer.length) * 100)}%`});

      return optimized;
    } catch (error) {
      logError('Image optimization failed', error as Error);
      throw error;
    }
  }

  /**
   * Generate responsive image set
   */
  async generateResponsiveSet(
    buffer: Buffer,
    presets: ImagePreset[] = ['thumbnail', 'small', 'medium', 'large']
  ): Promise<Record<ImagePreset, Buffer>> {
    const results: Record<string, Buffer> = {};

    await Promise.all(
      presets.map(async (preset: any) => {
        results[preset] = await this.optimize(bufferpreset);
      })
    );

    return results as Record<ImagePreset, Buffer>
  );
  }

  /**
   * Upload optimized image to S3
   */
  async uploadToS3(
    buffer: Buffer,
    key: string,
    contentType: string = 'image/webp'
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable'});

    await s3Client.send(command);

    // Return CloudFront URL if available, otherwise S3 URL
    if (config.aws.cloudfrontUrl) {
      return `${config.aws.cloudfrontUrl}/${key}`;
    }

    return `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
  }

  /**
   * Get signed URL for private images
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    // Check cache first
    const cacheKey = `signed-url:${key}`;
    const cached = await cache.get<string>(cacheKey);

    if (cached) {
      return cached;
    }

    const command = new GetObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key});

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    // Cache the URL for slightly less than its expiration
    await cache.set(cacheKey, url, expiresIn - 60);

    return url;
  }

  /**
   * Process property images
   */
  async processPropertyImages(
    images: Array<{ buffer: Buffer; filename: string }>,
    propertyId: string
  ): Promise<Array<{ preset: string; url: string }>> {
    const processedImages: Array<{ preset: string; url: string }> = [];

    for (const [indeximage] of images.entries()) {
      const responsiveSet = await this.generateResponsiveSet(image.buffer);

      for (const [presetbuffer] of Object.entries(responsiveSet)) {
        const key = `properties/${propertyId}/${index}-${preset}.webp`;
        const url = await this.uploadToS3(bufferkey);

        processedImages.push({ preset, url });
      }
    }

    return processedImages;
  }

  /**
   * Lazy load placeholder generator
   */
  async generatePlaceholder(buffer: Buffer): Promise<string> {
    const placeholder = await sharp(buffer)
      .resize(20, 20, { fit: 'inside' })
      .blur(5)
      .toFormat('jpeg', { quality: 50 })
      .toBuffer();

    return `data:image/jpeg;base64,${placeholder.toString('base64')}`;
  }
}

// Export singleton instance
export const imageOptimizer = new ImageOptimizer();

/**
 * Next.js Image component optimization
 */
export function getOptimizedImageProps(
  src: string,
  preset: ImagePreset = 'medium'
): {
  src: string;
  width: number;
  height: number;
  quality: number;
} {
  const { width, height, quality } = imagePresets[preset];

  return {
    src,
    width,
    height,
    quality};
}

/**
 * Responsive image srcset generator
 */
export function generateSrcSet(
  baseUrl: string,
  presets: ImagePreset[] = ['small', 'medium', 'large']
): string {
  return presets
    .map((preset: any) => {
      const { width } = imagePresets[preset];
      return `${baseUrl.replace('{preset}', preset)} ${width}w`;
    })
    .join(', ');
}

/**
 * Image preloading utility
 */
export function preloadImage(url: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  }
}

/**
 * Progressive image loading component props
 */
export interface ProgressiveImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

export function getProgressiveImageProps(
  src: string,
  placeholder: string,
  alt: string
): ProgressiveImageProps {
  return {
    src,
    placeholder,
    alt,
    className: 'transition-opacity duration-300',
    onLoad: () => {
      // Handle load complete
    };
}