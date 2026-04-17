/**
 * KitDrop Currency Configuration
 * Single source of truth for all currency display across the platform.
 */

export const CURRENCY_SYMBOL = "৳";
export const CURRENCY_CODE = "BDT";
export const CURRENCY_NAME = "Bangladeshi Taka";

/**
 * Format a numeric price for display.
 * Example: formatPrice(89.99) → "৳89.99"
 */
export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
}

/**
 * Free shipping threshold (in BDT).
 * Used by cart drawer, checkout, and shipping logic.
 */
export const FREE_SHIPPING_THRESHOLD = 80;
