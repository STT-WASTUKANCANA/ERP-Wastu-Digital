import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string or Date object into a localized Indonesian date string.
 * Format: "dd MMMM yyyy" (e.g., "23 Januari 2026")
 */
export function formatDate(date: string | Date): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Generates the full URL for a storage path.
 * If the path is already a full URL, it returns it as is.
 */
export function getStorageUrl(path: string | null): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  // Clean up path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:8000/storage'}/${cleanPath}`;
}