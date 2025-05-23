import * as path from 'path';

/**
 * Sanitizes and validates a file path to prevent path traversal attacks
 * @param filePath The path to sanitize
 * @returns The sanitized path or null if invalid
 */
export function sanitizePath(filePath: string): string | null {
  if (!filePath) {
    return null;
  }

  // Normalize the path
  const normalizedPath = path.normalize(filePath);

  // Check for path traversal attempts
  if (normalizedPath.includes('..')) {
    return null;
  }

  // Remove any null bytes
  if (normalizedPath.includes('\0')) {
    return null;
  }

  // Check for absolute paths
  if (path.isAbsolute(normalizedPath)) {
    return null;
  }

  // Remove any control characters
  const sanitizedPath = normalizedPath.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  // Additional validation for specific file types
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const ext = path.extname(sanitizedPath).toLowerCase();
  
  if (ext && !allowedExtensions.includes(ext)) {
    return null;
  }

  return sanitizedPath;
}

/**
 * Validates if a file path is within an allowed directory
 * @param filePath The path to validate
 * @param allowedDir The allowed directory
 * @returns boolean indicating if the path is valid
 */
export function isPathWithinDirectory(filePath: string, allowedDir: string): boolean {
  const resolvedFilePath = path.resolve(filePath);
  const resolvedAllowedDir = path.resolve(allowedDir);
  
  return resolvedFilePath.startsWith(resolvedAllowedDir);
}

/**
 * Generates a safe filename from user input
 * @param filename The input filename
 * @returns A sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path components
  const basename = path.basename(filename);
  
  // Replace invalid characters with underscores
  return basename.replace(/[^a-zA-Z0-9-_\.]/g, '_');
} 