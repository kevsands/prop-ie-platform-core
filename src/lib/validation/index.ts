import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Base validators
export const validators = {
  email: z.string().email('Invalid email address'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),

  phone: z.string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Invalid phone number'),

  eircode: z.string()
    .regex(/^[A-Z0-9]{7}$/, 'Invalid Eircode format'),

  url: z.string().url('Invalid URL'),

  date: z.string().datetime('Invalid date format'),

  uuid: z.string().uuid('Invalid UUID'),

  price: z.number()
    .positive('Price must be positive')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')};

// Sanitization functions
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']});
}

export function sanitizeText(input: string): string {
  return input
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, ''')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.+/g, '.')
    .replace(/^\./, '');
}

// Common schemas
export const schemas = {
  // User registration
  registration: z.object({
    email: validators.email,
    password: validators.password,
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms')}).refine((data: any) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]}),

  // Login
  login: z.object({
    email: validators.email,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional()}),

  // Property listing
  propertyListing: z.object({
    name: z.string().min(1, 'Property name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: validators.price,
    bedrooms: z.number().int().positive(),
    bathrooms: z.number().int().positive(),
    size: z.number().positive(),
    address: z.object({
      addressLine1: z.string().min(1, 'Address is required'),
      addressLine2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      county: z.string().min(1, 'County is required'),
      eircode: validators.eircode}),
    features: z.array(z.string()),
    images: z.array(z.string().url())}),

  // Contact form
  contactForm: z.object({
    name: z.string().min(1, 'Name is required'),
    email: validators.email,
    phone: validators.phone.optional(),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters')}),

  // Viewing request
  viewingRequest: z.object({
    propertyId: validators.uuid,
    preferredDate: validators.date,
    preferredTime: z.string(),
    numberOfGuests: z.number().int().min(1).max(10),
    specialRequirements: z.string().optional()}),

  // Payment
  payment: z.object({
    amount: validators.price,
    currency: z.string().length(3, 'Currency must be 3 characters'),
    paymentMethod: z.enum(['card', 'bank_transfer', 'cheque']),
    reference: z.string().min(1, 'Reference is required')})};

// CSRF token validation
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64;
}

// File upload validation
export function validateFileUpload(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
} = {}): { valid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']} = options;

  // Check file size
  if (file.size> maxSize) {
    return { 
      valid: false, 
      error: `File size must be less than ${maxSize / 1024 / 1024}MB` 
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} is not allowed` 
    };
  }

  // Check file extension
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return { 
      valid: false, 
      error: `File extension ${extension} is not allowed` 
    };
  }

  return { valid: true };
}

// SQL injection prevention
export function escapeSQLIdentifier(identifier: string): string {
  return identifier.replace(/[^a-zA-Z0-9_]/g, '');
}

// Command injection prevention
export function escapeShellArg(arg: string): string {
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

// Validate and sanitize query parameters
export function validateQueryParams(params: Record<string, any>, schema: z.ZodSchema): {
  valid: boolean;
  data?: any;
  errors?: z.ZodError;
} {
  try {
    const data = schema.parse(params);
    return { valid: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, errors: error };
    }
    throw error;
  }
}

// Validate JSON payload
export function validateJSON(json: string): boolean {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

// Rate limiting helper
export function checkRateLimit(
  key: string,
  limit: number,
  window: number,
  store: Map<string, { count: number; resetTime: number }>
): boolean {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now> record.resetTime) {
    store.set(key, {
      count: 1,
      resetTime: now + window});
    return true;
  }

  if (record.count>= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Export all schemas and validators for easy access
export default {
  validators,
  schemas,
  sanitizeHtml,
  sanitizeText,
  sanitizeFilename,
  validateCSRFToken,
  validateFileUpload,
  escapeSQLIdentifier,
  escapeShellArg,
  validateQueryParams,
  validateJSON,
  checkRateLimit};