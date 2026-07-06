/**
 * CartSidebar — الشريط الجانبي للسلة
 * 
 * يعرض جميع عناصر السلة، محدد نوع الطلب، حقل الخصم،
 * قسم الإجماليات، وزر الدفع.
 * قابل للتمرير في قائمة العناصر مع رأس وتذييل ثابتين.
 */

import React from 'react';
import { ShoppingCart, X, CreditCard, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { SETTINGS } from '../../config/settings';
import CartItem from './CartItem';
import OrderTypeSelector from './OrderTypeSelector';
import DiscountInput from './DiscountInput';
import Badge from '../shared/Badge';
import EmptyState from '../shared/EmptyState';

export default function CartSidebar({ onCheckout, onClose }) {
  const {
    items,
    orderType,
    discount,
    totals,
    itemCount,
    updateQuantity,
    removeItem,
    setOrderType,
    setDiscount,
    clearCart,
  } = useCart();

  const isEmpty = items.length === 0;

  return (
    <div className="flex flex-col h-full w-full">
      {/* ===== رأس السلة — ثابت ===== */}
      <div className="shrink-0 px-4 py-3 border-b border-slate-700 bg-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-teal-400" />
            <h2 className="text-lg font-bold text-slate-100">السلة</h2>
            {itemCount > 0 && (
              <Badge variant="teal">{itemCount}</Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* زر تفريغ السلة */}
            {!isEmpty && (
              <button
                onClick={clearCart}
                className="
                  p-2 rounded-lg text-slate-400
                  hover:text-red-400 hover:bg-red-400/10
                  transition-colors duration-150
                  min-w-[40px] min-h-[40px]
                  flex items-center justify-center
                "
                aria-label="تفريغ السلة"
              >
                <Trash2 size={16} />
              </button>
            )}

            {/* زر الإغلاق — يظهر فقط في الوضع المحمول */}
            {onClose && (
              <button
                onClick={onClose}
                className="
                  p-2 rounded-lg text-slate-400
                  hover:text-slate-100 hover:bg-slate-700
                  transition-colors duration-150
                  min-w-[40px] min-h-[40px]
                  flex items-center justify-center
                "
                aria-label="إغلاق السلة"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== محتوى السلة — قابل للتمرير ===== */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isEmpty ? (
          /* حالة السلة الفارغة */
          <div className="flex items-center justify-center h-full p-6">
            <EmptyState
              icon={ShoppingCart}
              title="السلة فارغة"
              description="أضف منتجات من القائمة لبدء الطلب"
            />
          </div>
        ) : (
          <div className="px-4">
            {/* قائمة عناصر السلة */}
            <div className="py-2">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* فاصل */}
            <div className="border-t border-slate-700 my-2" />

            {/* محدد نوع الطلب */}
            <div className="py-3">
              <OrderTypeSelector
                value={orderType}
                onChange={setOrderType}
              />
            </div>

            {/* فاصل */}
            <div className="border-t border-slate-700 my-2" />

            {/* حقل الخصم */}
            <div className="py-3">
              <DiscountInput
                discount={discount}
                onChange={setDiscount}
              />
            </div>
          </div>
        )}
      </div>

      {/* ===== تذييل السلة — ثابت ===== */}
      {!isEmpty && (
        <div className="shrink-0 border-t border-slate-700 bg-slate-800/90 px-4 py-3 space-y-3">
          {/* قسم الإجماليات */}
          <div className="space-y-1.5">
            {/* المجموع الفرعي */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">المجموع الفرعي</span>
              <span className="text-slate-200">{formatCurrency(totals.subtotal)}</span>
            </div>

            {/* الخصم — يظهر فقط عند وجود خصم */}
            {totals.discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400">الخصم</span>
                <span className="text-green-400">- {formatCurrency(totals.discountAmount)}</span>
              </div>
            )}

            {/* الضريبة */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                الضريبة
                <span className="text-slate-500 ms-1">
                  ({SETTINGS?.taxRate || 16}%)
                </span>
              </span>
              <span className="text-slate-200">{formatCurrency(totals.taxAmount)}</span>
            </div>

            {/* خط فاصل قبل الإجمالي */}
            <div className="border-t border-slate-600 pt-1.5 mt-1.5">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-100">الإجمالي</span>
                <span className="text-xl font-bold text-teal-400">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>
          </div>

          {/* زر الدفع */}
          <button
            onClick={onCheckout}
            disabled={isEmpty}
            className="
              w-full py-3.5 px-6 rounded-xl
              bg-teal-600 hover:bg-teal-500
              text-white font-bold text-base
              min-h-[52px]
              flex items-center justify-center gap-2
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98]
              shadow-lg shadow-teal-600/20
            "
          >
            <CreditCard size={20} />
            <span>الدفع</span>
          </button>
        </div>
      )}
    </div>
  );
}
