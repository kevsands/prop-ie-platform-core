import { MediaFile } from './MediaUpload';

/**
 * Format file size in bytes to human-readable format
 */
export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes <1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes <1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * Check if file type is an image
 */
export const isImageFile = (file: File | MediaFile): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Check if file type is a document (PDF, DOC, etc.)
 */
export const isDocumentFile = (file: File | MediaFile): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  return documentTypes.includes(file.type);
};

/**
 * Validate files based on type, size, and count restrictions
 */
export const validateFiles = (
  files: File[],
  existingFiles: File[] = [],
  options: {
    maxFiles?: number;
    maxSizeInMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; message: string } => {
  const {
    maxFiles = 10,
    maxSizeInMB = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  } = options;

  if (files.length + existingFiles.length> maxFiles) {
    return { valid: false, message: `You can upload a maximum of ${maxFiles} files.` };
  }

  for (const file of files) {
    if (file.size> maxSizeInMB * 1024 * 1024) {
      return { valid: false, message: `File ${file.name} exceeds the ${maxSizeInMB}MB size limit.` };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: `File type ${file.type} is not supported.` };
    }
  }

  return { valid: true, message: '' };
};

/**
 * Create MediaFile objects from File objects
 */
export const createMediaFiles = (files: File[]): MediaFile[] => {
  return files.map(file => {
    const mediaFile = file as MediaFile;

    // Add preview URL for images
    if (file.type.startsWith('image/')) {
      mediaFile.preview = URL.createObjectURL(file);
    }

    // Add unique ID
    mediaFile.id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(29)}`;

    return mediaFile;
  });
};

/**
 * Clean up MediaFile objects (revoke object URLs)
 */
export const cleanupMediaFiles = (files: MediaFile[]): void => {
  files.forEach(file => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  });
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Group files by type category
 */
export const groupFilesByType = (files: MediaFile[]): Record<string, MediaFile[]> => {
  const groups: Record<string, MediaFile[]> = {
    images: [],
    documents: [],
    other: []
  };

  files.forEach(file => {
    if (isImageFile(file)) {
      groups.images.push(file);
    } else if (isDocumentFile(file)) {
      groups.documents.push(file);
    } else {
      groups.other.push(file);
    }
  });

  return groups;
};

/**
 * Create a download link for a file
 */
export const downloadFile = (file: File | MediaFile): void => {
  const mediaFile = file as MediaFile;
  const url = mediaFile.preview || URL.createObjectURL(file);

  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up URL object if we created one
  if (!mediaFile.preview) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Creates a placeholder preview for non-image files
 */
export const getNonImagePreview = (mimeType: string): string => {
  // Return SVG data URL based on file type
  if (mimeType === 'application/pdf') {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Crect width='56' height='56' fill='%23f7f7f7'/%3E%3Cpath d='M35 16H21c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V18c0-1.1-.9-2-2-2z' fill='%23e53935'/%3E%3Cpath d='M28 27h-5v-2h5v2zm5-4H23v-2h10v2zm0-4H23v-2h10v2z' fill='white'/%3E%3C/svg%3E";
  } else if (mimeType.startsWith('image/')) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Crect width='56' height='56' fill='%23f7f7f7'/%3E%3Cpath d='M35 16H21c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V18c0-1.1-.9-2-2-2z' fill='%232196f3'/%3E%3Cpath d='M33 34H23l2.5-3 1.5 2 3-4 3 5z' fill='white'/%3E%3Ccircle cx='26' cy='24' r='2' fill='white'/%3E%3C/svg%3E";
  } else {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Crect width='56' height='56' fill='%23f7f7f7'/%3E%3Cpath d='M35 16H21c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V18c0-1.1-.9-2-2-2z' fill='%23757575'/%3E%3Cpath d='M33 34H23v-2h10v2zm0-4H23v-2h10v2zm0-4H23v-2h10v2zm0-4H23v-2h10v2z' fill='white'/%3E%3C/svg%3E";
  }
};

/**
 * Check if a file is a floor plan
 */
export const isFloorPlanFile = (file: File | MediaFile): boolean => {
  const extension = getFileExtension(file.name);
  return ['dwg', 'dxf', 'pdf'].includes(extension) || 
         (file.name.toLowerCase().includes('floor') && file.name.toLowerCase().includes('plan'));
};

/**
 * Check if a file is a brochure
 */
export const isBrochureFile = (file: File | MediaFile): boolean => {
  return file.name.toLowerCase().includes('brochure') || 
         (file.type === 'application/pdf' && !isFloorPlanFile(file));
};

/**
 * Auto-categorize files based on name and type
 */
export const autoCategorizeFiles = (
  files: MediaFile[],
  categories: string[] = ['development-images', 'floor-plans', 'brochures']
): Record<string, MediaFile[]> => {
  const categorized: Record<string, MediaFile[]> = {};

  // Initialize categories
  categories.forEach(category => {
    categorized[category] = [];
  });

  files.forEach(file => {
    if (isFloorPlanFile(file)) {
      categorized['floor-plans'].push(file);
    } else if (isBrochureFile(file)) {
      categorized['brochures'].push(file);
    } else if (isImageFile(file)) {
      categorized['development-images'].push(file);
    } else {
      // Default to the first category
      const defaultCategory = categories[0];
      categorized[defaultCategory].push(file);
    }
  });

  return categorized;
};

/**
 * Apply a text watermark to an image
 */
export const applyWatermark = async (
  file: MediaFile,
  options: {
    text: string;
    position?: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    opacity?: number;
    fontSize?: number;
    color?: string;
  }
): Promise<MediaFile> => {
  return new Promise((resolvereject: any) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const {
      text,
      position = 'bottom-right',
      opacity = 0.5,
      fontSize = 24,
      color = '#ffffff'
    } = options;

    // Create canvas and context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Create image element and load the file
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image
      ctx.drawImage(img, 00);

      // Apply watermark
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px Arial, sans-serif`;

      // Measure text width for positioning
      const textWidth = ctx.measureText(text).width;
      const textHeight = fontSize;

      // Get coordinates based on position
      let x = 0;
      let y = 0;

      const padding = 20;

      switch (position) {
        case 'center':
          x = canvas.width / 2 - textWidth / 2;
          y = canvas.height / 2 + textHeight / 4;
          break;
        case 'bottom-right':
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding;
          break;
        case 'top-right':
          x = canvas.width - textWidth - padding;
          y = padding + textHeight;
          break;
        case 'top-left':
          x = padding;
          y = padding + textHeight;
          break;
      }

      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Draw the text
      ctx.fillText(text, xy);

      // Reset transparency
      ctx.globalAlpha = 1.0;

      // Convert canvas to blob
      canvas.toBlob((blob: any) => {
        if (!blob) {
          reject(new Error('Could not create image blob'));
          return;
        }

        // Create a new file with the watermarked image
        const watermarkedFile = new File([blob], file.name, { type: file.type }) as MediaFile;

        // Create a new preview URL
        watermarkedFile.preview = URL.createObjectURL(blob);
        watermarkedFile.id = file.id || `${file.name}-${Date.now()}`; // Preserve the original ID

        resolve(watermarkedFile);
      }, file.type);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Start the process by reading the file
    reader.readAsDataURL(file);
  });
};

/**
 * Apply an image watermark to an image
 */
export const applyImageWatermark = async (
  file: MediaFile,
  watermarkImageUrl: string,
  options: {
    position?: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    opacity?: number;
    scale?: number; // Scale factor relative to main image (0-1)
  }
): Promise<MediaFile> => {
  return new Promise((resolvereject: any) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const {
      position = 'bottom-right',
      opacity = 0.5,
      scale = 0.25, // Default to 25% of main image size
    } = options;

    // Create canvas and context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Create image elements
    const img = new Image();
    const watermarkImg = new Image();

    // Load the watermark image
    watermarkImg.src = watermarkImageUrl;
    watermarkImg.crossOrigin = 'anonymous';

    // Create reader for main image
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    // Process both images when loaded
    Promise.all([
      new Promise<void>((res: any) => { img.onload = () => res(); }),
      new Promise<void>((res: any) => { watermarkImg.onload = () => res(); })
    ])
    .then(() => {
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image
      ctx.drawImage(img, 00);

      // Apply watermark
      ctx.globalAlpha = opacity;

      // Scale watermark image
      const watermarkWidth = watermarkImg.width * scale;
      const watermarkHeight = watermarkImg.height * scale;

      // Get coordinates based on position
      let x = 0;
      let y = 0;

      const padding = 20;

      switch (position) {
        case 'center':
          x = (canvas.width - watermarkWidth) / 2;
          y = (canvas.height - watermarkHeight) / 2;
          break;
        case 'bottom-right':
          x = canvas.width - watermarkWidth - padding;
          y = canvas.height - watermarkHeight - padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - watermarkHeight - padding;
          break;
        case 'top-right':
          x = canvas.width - watermarkWidth - padding;
          y = padding;
          break;
        case 'top-left':
          x = padding;
          y = padding;
          break;
      }

      // Draw the watermark image
      ctx.drawImage(
        watermarkImg, 
        x, 
        y, 
        watermarkWidth, 
        watermarkHeight
      );

      // Reset transparency
      ctx.globalAlpha = 1.0;

      // Convert canvas to blob
      canvas.toBlob((blob: any) => {
        if (!blob) {
          reject(new Error('Could not create image blob'));
          return;
        }

        // Create a new file with the watermarked image
        const watermarkedFile = new File([blob], file.name, { type: file.type }) as MediaFile;

        // Create a new preview URL
        watermarkedFile.preview = URL.createObjectURL(blob);
        watermarkedFile.id = file.id || `${file.name}-${Date.now()}`; // Preserve the original ID

        resolve(watermarkedFile);
      }, file.type);
    })
    .catch((error: any) => {
      reject(error);
    });

    // Start the process by reading the file
    reader.readAsDataURL(file);
  });
};