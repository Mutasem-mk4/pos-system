// =============================================================================
// توليد أرقام الفواتير - Invoice Number Generation
// =============================================================================

import { SETTINGS } from '../config/settings.js';

/** مفتاح العداد في التخزين المحلي */
const COUNTER_KEY = 'pos_invoice_counter';

/**
 * توليد رقم فاتورة تسلسلي جديد
 * Generate next sequential invoice number
 *
 * الصيغة: INV-0001, INV-0002, ...
 * Format: INV-0001, INV-0002, etc.
 *
 * @returns {string} رقم الفاتورة الجديد
 *
 * @example
 * generateInvoiceNumber() // "INV-0001" (أول فاتورة)
 * generateInvoiceNumber() // "INV-0002" (ثاني فاتورة)
 */
export function generateInvoiceNumber() {
  let counter = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
  counter += 1;
  localStorage.setItem(COUNTER_KEY, counter.toString());
  return `${SETTINGS.invoicePrefix}-${String(counter).padStart(4, '0')}`;
}

/**
 * الحصول على قيمة العداد الحالية (لأغراض العرض)
 * Get current invoice counter value (for display purposes)
 *
 * @returns {number} عدد الفواتير المُصدرة حتى الآن
 */
export function getCurrentInvoiceCount() {
  return parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
}
