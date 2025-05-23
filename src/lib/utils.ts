'use client';

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines tailwind classes with clsx for better class name management
 * Removes duplicates and handles conflicting classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amounts consistently
 * @param amount Amount to format
 * @param currency Currency code (default: EUR)
 * @param locale Locale for formatting (default: en-IE)
 */
export function formatCurrency(
  amount: number, 
  currency = "EUR", 
  locale = "en-IE"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2}).format(amount);
}

/**
 * Format a date consistently
 * @param date Date to format (Date object or timestamp)
 * @param format Format style (default: medium)
 * @param locale Locale for formatting (default: en-IE)
 */
export function formatDate(
  date: Date | number | string,
  format: "short" | "medium" | "long" = "medium",
  locale = "en-IE"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : 
               typeof date === "number" ? new Date(date) :
               date;

  const options: Intl.DateTimeFormatOptions = 
    format === "short" ? { day: "numeric", month: "short", year: "numeric" } :
    format === "medium" ? { day: "numeric", month: "long", year: "numeric" } :
    { day: "numeric", month: "long", year: "numeric", weekday: "long" };

  return new Intl.DateTimeFormat(localeoptions).format(dateObj);
}

/**
 * Safely access nested object properties without errors
 * @param obj Object to access
 * @param path Path to the property as a dot-notation string
 * @param defaultValue Value to return if path doesn't exist
 */
export function getNestedValue<T>(
  obj: Record<string, any> | null | undefined,
  path: string,
  defaultValue: T
): T {
  if (!obj) return defaultValue;

  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current === undefined || current === null || typeof current !== "object") {
      return defaultValue;
    }
    current = current[key];
  }

  return current === undefined ? defaultValue : (current as T);
}

/**
 * Truncate text to a specific length with ellipsis
 * @param text Text to truncate
 * @param length Maximum length
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0length) + "...";
}

/**
 * Debounce a function to prevent rapid consecutive calls
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function(...args: Parameters<T>): void {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Create a URL-friendly slug from a string
 * @param str String to convert to a slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .trim();
}

/**
 * Check if an element is in the viewport
 * @param element Element to check
 * @param offset Optional offset from the viewport edge
 */
export function isInViewport(
  element: HTMLElement,
  offset: number = 0
): boolean {
  if (!element) return false;

  const rect = element.getBoundingClientRect();

  return (
    rect.top>= 0 - offset &&
    rect.left>= 0 - offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
}

/**
 * Safely parse JSON with error handling
 * @param jsonString JSON string to parse
 * @param defaultValue Default value to return if parsing fails
 */
export function safeJsonParse<T>(
  jsonString: string,
  defaultValue: T
): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {

    return defaultValue;
  }
}