/**
 * CashierPage — صفحة الكاشير الرئيسية
 * 
 * تجمع جميع مكونات نقطة البيع:
 * - منطقة المحتوى الرئيسية (بحث + تبويبات الفئات + شبكة المنتجات)
 * - الشريط الجانبي للسلة (على سطح المكتب)
 * - لوحة سلة منزلقة (على الأجهزة المحمولة)
 * - زر عائم لفتح السلة (على الأجهزة المحمولة)
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Store } from '../data/store';
import SearchInput from '../components/shared/SearchInput';
import CategoryTabs from '../components/cashier/CategoryTabs';
import ProductGrid from '../components/cashier/ProductGrid';
import CartSidebar from '../components/cart/CartSidebar';
import CheckoutModal from '../components/checkout/CheckoutModal.jsx';

export default function CashierPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);      // تبديل السلة في الوضع المحمول
  const [showCheckout, setShowCheckout] = useState(false); // نافذة الدفع
  const { itemCount } = useCart();

  // تحميل الفئات والمنتجات من المتجر عند التحميل الأول
  useEffect(() => {
    setCategories(Store.categories.getAll());
    setProducts(Store.products.getAll());
  }, []);

  return (
    <div className="flex h-full overflow-hidden">

      {/* ===== منطقة المحتوى الرئيسية ===== */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden min-w-0">
        {/* حقل البحث */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="ابحث عن منتج..."
        />

        {/* تبويبات الفئات */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* شبكة المنتجات — قابلة للتمرير */}
        <div className="flex-1 overflow-y-auto mt-4 pb-4">
          <ProductGrid
            products={products}
            categories={categories}
            searchQuery={searchQuery}
            activeCategory={activeCategory}
          />
        </div>
      </div>

      {/* ===== الشريط الجانبي للسلة — سطح المكتب ===== */}
      <div className="hidden lg:flex w-[380px] shrink-0 border-s border-slate-700 bg-slate-800/50">
        <CartSidebar onCheckout={() => setShowCheckout(true)} />
      </div>

      {/* ===== زر السلة العائم — الأجهزة المحمولة ===== */}
      {itemCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="
            lg:hidden fixed bottom-20 end-4 z-30
            bg-teal-600 hover:bg-teal-500
            text-white
            w-16 h-16 rounded-full
            shadow-lg shadow-teal-600/30
            flex items-center justify-center
            transition-all duration-200
            active:scale-90
          "
          aria-label="فتح السلة"
        >
          <ShoppingCart size={24} />
          {/* شارة عدد العناصر */}
          <span className="
            absolute -top-1 -end-1
            bg-red-500 text-white text-xs font-bold
            w-6 h-6 rounded-full
            flex items-center justify-center
            shadow-sm
          ">
            {itemCount}
          </span>
        </button>
      )}

      {/* ===== لوحة السلة المنزلقة — الأجهزة المحمولة ===== */}
      {showCart && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* خلفية معتمة */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />

          {/* لوحة السلة المنزلقة من الجانب */}
          <div className="
            absolute inset-y-0 end-0
            w-full max-w-[400px]
            bg-slate-900 border-s border-slate-700
            shadow-2xl
            animate-slide-in
          ">
            <CartSidebar
              onCheckout={() => {
                setShowCart(false);
                setShowCheckout(true);
              }}
              onClose={() => setShowCart(false)}
            />
          </div>
        </div>
      )}

      {/* ===== نافذة الدفع ===== */}
      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}

      {/* أنيميشن الانزلاق للسلة المحمولة */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        [dir="rtl"] @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
