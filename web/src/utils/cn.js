import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 🔗 cn (Class Name Merger)
 * Standard utility for safe Tailwind class merging.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
