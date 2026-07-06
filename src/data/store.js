// =============================================================================
// طبقة البيانات - Data Store (localStorage)
// =============================================================================

import { SEED_CATEGORIES, SEED_PRODUCTS } from './seedData.js';
import { generateInvoiceNumber } from '../utils/invoiceNumber.js';

// ── مفاتيح التخزين المحلي ────────────────────────────────────────────────────
const KEYS = {
  categories: 'pos_categories',
  products: 'pos_products',
  orders: 'pos_orders',
  initialized: 'pos_initialized',
};

// =============================================================================
// دوال مساعدة - Helper Functions
// =============================================================================

/**
 * توليد معرّف فريد
 * Generate a unique ID with a given prefix
 *
 * @param {string} prefix - بادئة المعرّف (مثل 'cat', 'prod')
 * @returns {string} معرّف فريد مثل "cat_1720299915000_a3bk9x2f1"
 */
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// عمليات CRUD العامة - Generic CRUD Operations
// =============================================================================

/**
 * جلب جميع العناصر من مفتاح معين
 * Get all items from a given storage key
 *
 * @param {string} key - مفتاح التخزين
 * @returns {Array} مصفوفة العناصر
 */
function getAll(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`خطأ في قراءة البيانات من "${key}":`, error);
    return [];
  }
}

/**
 * جلب عنصر واحد بواسطة المعرّف
 * Get a single item by its ID
 *
 * @param {string} key - مفتاح التخزين
 * @param {string} id - معرّف العنصر
 * @returns {Object|null} العنصر أو null إذا لم يُوجد
 */
function getById(key, id) {
  const items = getAll(key);
  return items.find((item) => item.id === id) || null;
}

/**
 * إنشاء عنصر جديد مع توليد معرّف وتاريخ الإنشاء تلقائياً
 * Create a new item with auto-generated ID and createdAt timestamp
 *
 * @param {string} key - مفتاح التخزين
 * @param {Object} item - بيانات العنصر الجديد
 * @param {string} prefix - بادئة المعرّف
 * @returns {Object} العنصر بعد الإنشاء (مع id و createdAt)
 */
function create(key, item, prefix) {
  const items = getAll(key);
  const newItem = {
    ...item,
    id: generateId(prefix),
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  localStorage.setItem(key, JSON.stringify(items));
  return newItem;
}

/**
 * تحديث عنصر موجود بواسطة المعرّف
 * Update an existing item by its ID
 *
 * @param {string} key - مفتاح التخزين
 * @param {string} id - معرّف العنصر
 * @param {Object} updates - الحقول المراد تحديثها
 * @returns {Object|null} العنصر بعد التحديث أو null إذا لم يُوجد
 */
function update(key, id, updates) {
  const items = getAll(key);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    console.warn(`العنصر غير موجود: ${id}`);
    return null;
  }

  // دمج التحديثات مع الحفاظ على المعرّف وتاريخ الإنشاء
  items[index] = {
    ...items[index],
    ...updates,
    id: items[index].id,                 // لا يمكن تغيير المعرّف
    createdAt: items[index].createdAt,   // لا يمكن تغيير تاريخ الإنشاء
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(key, JSON.stringify(items));
  return items[index];
}

/**
 * حذف عنصر بواسطة المعرّف
 * Remove an item by its ID
 *
 * @param {string} key - مفتاح التخزين
 * @param {string} id - معرّف العنصر
 * @returns {boolean} true إذا تم الحذف بنجاح
 */
function remove(key, id) {
  const items = getAll(key);
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) {
    console.warn(`العنصر غير موجود للحذف: ${id}`);
    return false;
  }

  localStorage.setItem(key, JSON.stringify(filtered));
  return true;
}

// =============================================================================
// التهيئة الأولية - Initialization
// =============================================================================

/**
 * تهيئة البيانات الأولية عند أول تشغيل
 * Initialize seed data on first run only
 */
function initialize() {
  if (localStorage.getItem(KEYS.initialized)) {
    return; // البيانات مُهيأة مسبقاً
  }

  localStorage.setItem(KEYS.categories, JSON.stringify(SEED_CATEGORIES));
  localStorage.setItem(KEYS.products, JSON.stringify(SEED_PRODUCTS));
  localStorage.setItem(KEYS.orders, JSON.stringify([]));
  localStorage.setItem(KEYS.initialized, 'true');

  console.log('تم تهيئة البيانات الأولية بنجاح ✓');
}

// =============================================================================
// واجهة المتجر العامة - Public Store API
// =============================================================================

/**
 * واجهة الوصول للبيانات
 * Data access layer for the POS system
 *
 * @example
 * // تهيئة البيانات
 * Store.initialize();
 *
 * // جلب جميع المنتجات
 * const products = Store.products.getAll();
 *
 * // إنشاء تصنيف جديد
 * const newCat = Store.categories.create({ name: 'حلويات', icon: '🍰' });
 *
 * // إنشاء طلب جديد (يستخدم رقم فاتورة تسلسلي)
 * const order = Store.orders.create({ items: [...], total: 5.800 });
 */
export const Store = {
  // ── التصنيفات ─────────────────────────────────────────────────────
  categories: {
    /** جلب جميع التصنيفات */
    getAll: () => getAll(KEYS.categories),
    /** جلب تصنيف بواسطة المعرّف */
    getById: (id) => getById(KEYS.categories, id),
    /** إنشاء تصنيف جديد */
    create: (cat) => create(KEYS.categories, cat, 'cat'),
    /** تحديث تصنيف */
    update: (id, updates) => update(KEYS.categories, id, updates),
    /** حذف تصنيف */
    remove: (id) => remove(KEYS.categories, id),
  },

  // ── المنتجات ──────────────────────────────────────────────────────
  products: {
    /** جلب جميع المنتجات */
    getAll: () => getAll(KEYS.products),
    /** جلب منتج بواسطة المعرّف */
    getById: (id) => getById(KEYS.products, id),
    /** إنشاء منتج جديد */
    create: (prod) => create(KEYS.products, prod, 'prod'),
    /** تحديث منتج */
    update: (id, updates) => update(KEYS.products, id, updates),
    /** حذف منتج */
    remove: (id) => remove(KEYS.products, id),
  },

  // ── الطلبات ───────────────────────────────────────────────────────
  orders: {
    /** جلب جميع الطلبات */
    getAll: () => getAll(KEYS.orders),
    /** جلب طلب بواسطة المعرّف (رقم الفاتورة) */
    getById: (id) => getById(KEYS.orders, id),
    /**
     * إنشاء طلب جديد
     * يستخدم رقم فاتورة تسلسلي كمعرّف (INV-0001, INV-0002, ...)
     *
     * @param {Object} order - بيانات الطلب
     * @returns {Object} الطلب بعد الإنشاء مع رقم الفاتورة وتاريخ الإنشاء
     */
    create: (order) => {
      const orders = getAll(KEYS.orders);
      const newOrder = {
        ...order,
        id: generateInvoiceNumber(),
        createdAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      localStorage.setItem(KEYS.orders, JSON.stringify(orders));
      return newOrder;
    },
  },

  // ── التهيئة ───────────────────────────────────────────────────────
  initialize,

  /**
   * إعادة تعيين جميع البيانات (للتطوير فقط)
   * Reset all data (development utility)
   */
  resetAll: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    // إعادة تعيين عداد الفواتير أيضاً
    localStorage.removeItem('pos_invoice_counter');
    console.log('تم إعادة تعيين جميع البيانات ✓');
  },
};
