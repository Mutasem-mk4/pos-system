/**
 * CartItem — صف عنصر واحد في السلة
 * 
 * يعرض اسم العنصر، السعر الوحدوي، أزرار التحكم بالكمية،
 * والإجمالي للسطر مع زر الحذف.
 */

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  // الإجمالي للسطر = السعر × الكمية
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-700/50 last:border-b-0">
      {/* أيقونة الفئة */}
      <span className="text-xl mt-0.5 shrink-0 select-none">
        {item.categoryIcon || '📦'}
      </span>

      {/* معلومات العنصر وأزرار التحكم */}
      <div className="flex-1 min-w-0">
        {/* الصف الأول: الاسم وزر الحذف */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-slate-100 leading-tight line-clamp-2">
            {item.name}
          </h4>

          {/* زر الحذف */}
          <button
            onClick={() => onRemove(item.productId)}
            className="
              shrink-0 p-1.5 rounded-lg
              text-slate-500 hover:text-red-400
              hover:bg-red-400/10
              transition-colors duration-150
              min-w-[32px] min-h-[32px]
              flex items-center justify-center
            "
            aria-label="حذف العنصر"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* الصف الثاني: السعر الوحدوي */}
        <p className="text-xs text-slate-400 mt-0.5">
          {formatCurrency(item.price)} للوحدة
        </p>

        {/* الصف الثالث: أزرار الكمية والإجمالي */}
        <div className="flex items-center justify-between mt-2">
          {/* أزرار التحكم بالكمية */}
          <div className="flex items-center gap-1 bg-slate-900/60 rounded-xl p-0.5">
            {/* زر تقليل الكمية */}
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              className="
                w-8 h-8 rounded-lg
                flex items-center justify-center
                bg-slate-700 hover:bg-slate-600
                text-slate-200 transition-colors duration-150
                active:scale-90
              "
              aria-label="تقليل الكمية"
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>

            {/* عرض الكمية الحالية */}
            <span className="
              w-8 text-center text-sm font-bold text-slate-100
              select-none
            ">
              {item.quantity}
            </span>

            {/* زر زيادة الكمية */}
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              className="
                w-8 h-8 rounded-lg
                flex items-center justify-center
                bg-slate-700 hover:bg-slate-600
                text-slate-200 transition-colors duration-150
                active:scale-90
              "
              aria-label="زيادة الكمية"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* إجمالي السطر */}
          <span className="text-sm font-bold text-teal-400">
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
