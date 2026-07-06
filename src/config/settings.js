// =============================================================================
// إعدادات النظام - App Configuration
// =============================================================================

/**
 * الإعدادات العامة لنظام نقطة البيع
 * General settings for the POS system
 */
export const SETTINGS = {
  storeName: 'نقطة البيع',       // اسم المتجر
  taxRate: 0.16,                  // 16% ضريبة المبيعات العامة (الأردن)
  currency: 'JOD',               // الدينار الأردني
  currencySymbol: 'د.أ',         // رمز العملة
  currencyDecimals: 3,            // الدينار الأردني يستخدم 3 خانات عشرية
  invoicePrefix: 'INV',          // بادئة رقم الفاتورة
};

/**
 * أنواع الطلبات المتاحة
 * Available order types
 */
export const ORDER_TYPES = [
  { id: 'dine-in', label: 'تناول في المطعم', icon: 'UtensilsCrossed' },
  { id: 'takeaway', label: 'سفري', icon: 'ShoppingBag' },
  { id: 'direct-sale', label: 'بيع مباشر', icon: 'Store' },
];

/**
 * طرق الدفع المتاحة
 * Available payment methods
 */
export const PAYMENT_METHODS = [
  { id: 'cash', label: 'نقدي', icon: 'Banknote' },
  { id: 'card', label: 'بطاقة', icon: 'CreditCard' },
];
