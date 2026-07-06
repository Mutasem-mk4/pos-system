/**
 * ProductGrid — شبكة عرض بطاقات المنتجات
 * 
 * يقوم بتصفية المنتجات حسب الفئة النشطة واستعلام البحث،
 * ثم يعرض بطاقات المنتجات في شبكة متجاوبة.
 * يعرض حالة فارغة عند عدم وجود نتائج.
 */

import React, { useMemo } from 'react';
import { Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductCard from './ProductCard';
import EmptyState from '../shared/EmptyState';

export default function ProductGrid({ products = [], categories = [], searchQuery = '', activeCategory }) {
  const { addItem } = useCart();

  // بناء خريطة أيقونات الفئات للوصول السريع
  const categoryIconMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.icon;
    });
    return map;
  }, [categories]);

  // تصفية المنتجات حسب الفئة واستعلام البحث
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // تصفية حسب الفئة النشطة
      const matchesCategory = activeCategory === null || activeCategory === undefined
        ? true
        : product.categoryId === activeCategory;

      // تصفية حسب استعلام البحث (بحث غير حساس لحالة الأحرف)
      const matchesSearch = !searchQuery
        ? true
        : product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // معالجة إضافة المنتج إلى السلة
  const handleAdd = (product) => {
    addItem({
      ...product,
      categoryIcon: categoryIconMap[product.categoryId] || '📦',
    });
  };

  // عرض حالة فارغة إذا لم توجد منتجات مطابقة
  if (filteredProducts.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="لا توجد منتجات"
        description={
          searchQuery
            ? `لم يتم العثور على منتجات تطابق "${searchQuery}"`
            : 'لا توجد منتجات في هذه الفئة'
        }
      />
    );
  }

  return (
    /* شبكة متجاوبة: 2 أعمدة افتراضياً، 3 على lg، 4 على xl */
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryIcon={categoryIconMap[product.categoryId]}
          onAdd={handleAdd}
        />
      ))}
    </div>
  );
}
