/**
 * OrderTypeSelector — محدد نوع الطلب
 * 
 * يعرض ثلاثة أزرار لاختيار نوع الطلب:
 * محلي، سفري، بيع مباشر.
 * عند اختيار "محلي"، يظهر حقل إدخال رقم الطاولة.
 */

import React from 'react';
import { UtensilsCrossed, ShoppingBag, Banknote } from 'lucide-react';
import { ORDER_TYPES } from '../../config/settings';
import { useCart } from '../../context/CartContext';

// أيقونات أنواع الطلبات
const ORDER_TYPE_ICONS = {
  'dine-in': UtensilsCrossed,
  'takeaway': ShoppingBag,
  'direct-sale': Banknote,
};

// تسميات أنواع الطلبات بالعربية
const ORDER_TYPE_LABELS = {
  'dine-in': 'محلي',
  'takeaway': 'سفري',
  'direct-sale': 'بيع مباشر',
};

export default function OrderTypeSelector({ value, onChange }) {
  const { tableNumber, setTableNumber } = useCart();

  return (
    <div className="space-y-2">
      {/* عنوان القسم */}
      <label className="text-xs font-medium text-slate-400">
        نوع الطلب
      </label>

      {/* أزرار أنواع الطلبات */}
      <div className="flex gap-1.5">
        {ORDER_TYPES.map((type) => {
          const Icon = ORDER_TYPE_ICONS[type] || ShoppingBag;
          const label = ORDER_TYPE_LABELS[type] || type;
          const isActive = value === type;

          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`
                flex-1 flex items-center justify-center gap-1.5
                py-2.5 px-2 rounded-xl
                text-xs font-medium
                min-h-[48px]
                transition-all duration-200
                ${isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-100'
                }
              `}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* حقل رقم الطاولة — يظهر فقط عند اختيار "محلي" */}
      {value === 'dine-in' && (
        <div className="mt-2">
          <input
            type="text"
            value={tableNumber || ''}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="رقم الطاولة..."
            className="
              w-full px-3 py-2.5 rounded-xl
              bg-slate-900 border border-slate-600
              text-slate-100 placeholder-slate-500
              text-sm text-start
              min-h-[48px]
              focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30
              transition-colors duration-200
            "
          />
        </div>
      )}
    </div>
  );
}
