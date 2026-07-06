// =============================================================================
// تنسيق العملة - Currency Formatting
// =============================================================================

import { SETTINGS } from '../config/settings.js';

/**
 * تنسيق المبلغ بالدينار الأردني
 * Format a number as Jordanian Dinar currency
 *
 * @param {number} amount - المبلغ المراد تنسيقه
 * @returns {string} النص المنسق، مثال: "2.500 د.أ"
 *
 * @example
 * formatCurrency(2.5)    // "2.500 د.أ"
 * formatCurrency(0.35)   // "0.350 د.أ"
 * formatCurrency(10)     // "10.000 د.أ"
 */
export function formatCurrency(amount) {
  const formatted = Number(amount).toFixed(SETTINGS.currencyDecimals);
  return `${formatted} ${SETTINGS.currencySymbol}`;
}
