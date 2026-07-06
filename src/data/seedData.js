// =============================================================================
// البيانات الأولية - Seed Data
// =============================================================================

/**
 * التصنيفات الأولية
 * Seed categories for the POS system
 */
export const SEED_CATEGORIES = [
  { id: 'cat_01', name: 'مشروبات', icon: '🥤' },
  { id: 'cat_02', name: 'مقبلات', icon: '🥗' },
  { id: 'cat_03', name: 'ساندويشات', icon: '🥪' },
  { id: 'cat_04', name: 'أطباق رئيسية', icon: '🍽️' },
  { id: 'cat_05', name: 'ألبان', icon: '🥛' },
  { id: 'cat_06', name: 'تنظيف', icon: '🧹' },
  { id: 'cat_07', name: 'مخبوزات', icon: '🍞' },
];

/**
 * المنتجات الأولية بأسعار واقعية بالدينار الأردني
 * Seed products with realistic Jordanian Dinar prices
 */
export const SEED_PRODUCTS = [
  // ── مشروبات (Drinks) ──────────────────────────────────────────────
  { id: 'prod_01', name: 'شاي', categoryId: 'cat_01', price: 0.350, imageUrl: null },
  { id: 'prod_02', name: 'قهوة عربية', categoryId: 'cat_01', price: 0.500, imageUrl: null },
  { id: 'prod_03', name: 'عصير برتقال طازج', categoryId: 'cat_01', price: 1.000, imageUrl: null },
  { id: 'prod_04', name: 'بيبسي', categoryId: 'cat_01', price: 0.500, imageUrl: null },

  // ── مقبلات (Appetizers) ────────────────────────────────────────────
  { id: 'prod_05', name: 'حمص', categoryId: 'cat_02', price: 1.250, imageUrl: null },
  { id: 'prod_06', name: 'فتوش', categoryId: 'cat_02', price: 1.500, imageUrl: null },
  { id: 'prod_07', name: 'تبولة', categoryId: 'cat_02', price: 1.250, imageUrl: null },

  // ── ساندويشات (Sandwiches) ─────────────────────────────────────────
  { id: 'prod_08', name: 'شاورما دجاج', categoryId: 'cat_03', price: 1.500, imageUrl: null },
  { id: 'prod_09', name: 'شاورما لحم', categoryId: 'cat_03', price: 2.000, imageUrl: null },
  { id: 'prod_10', name: 'فلافل', categoryId: 'cat_03', price: 0.750, imageUrl: null },

  // ── أطباق رئيسية (Main Dishes) ─────────────────────────────────────
  { id: 'prod_11', name: 'منسف', categoryId: 'cat_04', price: 5.000, imageUrl: null },
  { id: 'prod_12', name: 'مقلوبة', categoryId: 'cat_04', price: 3.500, imageUrl: null },
  { id: 'prod_13', name: 'كبسة دجاج', categoryId: 'cat_04', price: 3.000, imageUrl: null },

  // ── ألبان (Dairy) ──────────────────────────────────────────────────
  { id: 'prod_14', name: 'حليب طازج 1 لتر', categoryId: 'cat_05', price: 0.850, imageUrl: null },
  { id: 'prod_15', name: 'لبن زبادي', categoryId: 'cat_05', price: 0.500, imageUrl: null },
  { id: 'prod_16', name: 'جبنة بيضاء 500غ', categoryId: 'cat_05', price: 2.250, imageUrl: null },

  // ── تنظيف (Cleaning) ───────────────────────────────────────────────
  { id: 'prod_17', name: 'صابون غسيل', categoryId: 'cat_06', price: 3.500, imageUrl: null },
  { id: 'prod_18', name: 'معقم أيدي', categoryId: 'cat_06', price: 1.750, imageUrl: null },

  // ── مخبوزات (Bakery) ───────────────────────────────────────────────
  { id: 'prod_19', name: 'خبز عربي (ربطة)', categoryId: 'cat_07', price: 0.350, imageUrl: null },
  { id: 'prod_20', name: 'كعك بالسمسم', categoryId: 'cat_07', price: 0.500, imageUrl: null },
];
