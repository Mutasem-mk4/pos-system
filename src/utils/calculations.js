// =============================================================================
// حسابات الطلب - Order Calculations
// =============================================================================

import { SETTINGS } from '../config/settings.js';

/**
 * حساب إجماليات الطلب شاملة الخصم والضريبة
 * Calculate order totals including discount and tax
 *
 * @param {Array} items - عناصر السلة [{price, quantity}]
 * @param {Object|null} discount - الخصم {type: 'percentage'|'fixed', value: number}
 * @param {number} taxRate - نسبة الضريبة (اختياري، الافتراضي من الإعدادات)
 * @returns {Object} {subtotal, discountAmount, taxableAmount, taxAmount, total}
 *
 * @example
 * const items = [
 *   { price: 1.500, quantity: 2 },
 *   { price: 0.500, quantity: 3 },
 * ];
 * const totals = calculateOrderTotals(items, { type: 'percentage', value: 10 });
 * // subtotal: 4.500, discountAmount: 0.450, taxableAmount: 4.050, ...
 */
export function calculateOrderTotals(items, discount = null, taxRate = SETTINGS.taxRate) {
  // المجموع الفرعي = مجموع (السعر × الكمية) لجميع العناصر
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // حساب مبلغ الخصم
  let discountAmount = 0;
  if (discount && discount.value > 0) {
    if (discount.type === 'percentage') {
      // خصم بالنسبة المئوية
      discountAmount = subtotal * (discount.value / 100);
    } else {
      // خصم بمبلغ ثابت - لا يمكن أن يتجاوز المجموع الفرعي
      discountAmount = Math.min(discount.value, subtotal);
    }
  }

  // المبلغ الخاضع للضريبة = المجموع الفرعي - الخصم
  const taxableAmount = subtotal - discountAmount;

  // مبلغ الضريبة
  const taxAmount = taxableAmount * taxRate;

  // الإجمالي النهائي
  const total = taxableAmount + taxAmount;

  return {
    subtotal: roundCurrency(subtotal),
    discountAmount: roundCurrency(discountAmount),
    taxableAmount: roundCurrency(taxableAmount),
    taxAmount: roundCurrency(taxAmount),
    total: roundCurrency(total),
  };
}

/**
 * حساب الباقي للدفع النقدي
 * Calculate change for cash payments
 *
 * @param {number} total - المبلغ الإجمالي المطلوب
 * @param {number} amountPaid - المبلغ المدفوع
 * @returns {number} الباقي (لا يقل عن صفر)
 */
export function calculateChange(total, amountPaid) {
  return roundCurrency(Math.max(0, amountPaid - total));
}

/**
 * التقريب حسب خانات العملة (3 خانات للدينار الأردني)
 * Round to currency decimal places (3 for JOD)
 *
 * @param {number} amount - المبلغ المراد تقريبه
 * @returns {number} المبلغ بعد التقريب
 */
export function roundCurrency(amount) {
  const factor = Math.pow(10, SETTINGS.currencyDecimals);
  return Math.round(amount * factor) / factor;
}
