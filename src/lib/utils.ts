import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() — Conditional Tailwind class merger.
 *
 * Combines clsx (for conditional class joining) with tailwind-merge
 * (for deduplicating conflicting Tailwind utilities).
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-blue-500", "px-6") // → "py-2 bg-blue-500 px-6"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
