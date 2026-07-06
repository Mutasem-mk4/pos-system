/**
 * DiscountInput — حقل إدخال الخصم
 * 
 * يتيح التبديل بين الخصم بالنسبة المئوية (%) والمبلغ الثابت (JOD).
 * يعرض مبلغ الخصم المحسوب في الوقت الفعلي.
 */

import React from 'react';
import { Percent, DollarSign } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function DiscountInput({ discount, onChange }) {
  const { totals } = useCart();

  // نوع الخصم الحالي (نسبة مئوية أو مبلغ ثابت)
  const discountType = discount?.type || 'percentage';
  const discountValue = discount?.value || 0;

  // حساب مبلغ الخصم الفعلي
  const calculatedAmount = discountType === 'percentage'
    ? (totals.subtotal * discountValue) / 100
    : discountValue;

  // تحديث نوع الخصم
  const handleTypeChange = (type) => {
    onChange({ type, value: 0 });
  };

  // تحديث قيمة الخصم
  const handleValueChange = (e) => {
    const val = parseFloat(e.target.value) || 0;

    // تحقق من صحة القيمة
    if (discountType === 'percentage' && val > 100) return;
    if (discountType === 'fixed' && val > totals.subtotal) return;
    if (val < 0) return;

    onChange({ type: discountType, value: val });
  };

  return (
    <div className="space-y-2">
      {/* عنوان القسم */}
      <label className="text-xs font-medium text-slate-400">
        الخصم
      </label>

      <div className="flex gap-1.5">
        {/* أزرار تبديل نوع الخصم */}
        <div className="flex bg-slate-900/60 rounded-xl p-0.5 shrink-0">
          {/* زر النسبة المئوية */}
          <button
            onClick={() => handleTypeChange('percentage')}
            className={`
              px-3 py-2 rounded-lg text-xs font-medium
              min-h-[40px]
              transition-all duration-200
              ${discountType === 'percentage'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
            aria-label="خصم بالنسبة المئوية"
          >
            <Percent size={14} />
          </button>

          {/* زر المبلغ الثابت */}
          <button
            onClick={() => handleTypeChange('fixed')}
            className={`
              px-3 py-2 rounded-lg text-xs font-medium
              min-h-[40px]
              transition-all duration-200
              ${discountType === 'fixed'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
            aria-label="خصم بمبلغ ثابت"
          >
            <span className="text-xs font-bold">JOD</span>
          </button>
        </div>

        {/* حقل إدخال قيمة الخصم */}
        <input
          type="number"
          min="0"
          max={discountType === 'percentage' ? 100 : totals.subtotal}
          step={discountType === 'percentage' ? 1 : 0.1}
          value={discountValue || ''}
          onChange={handleValueChange}
          placeholder={discountType === 'percentage' ? '0 %' : '0.000'}
          className="
            flex-1 px-3 py-2 rounded-xl
            bg-slate-900 border border-slate-600
            text-slate-100 placeholder-slate-500
            text-sm text-start
            min-h-[40px]
            focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30
            transition-colors duration-200
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          "
        />
      </div>

      {/* عرض مبلغ الخصم المحسوب — يظهر فقط عند وجود خصم */}
      {discountValue > 0 && (
        <p className="text-xs text-green-400 flex items-center gap-1">
          <span>خصم:</span>
          <span className="font-bold">{formatCurrency(calculatedAmount)}</span>
        </p>
      )}
    </div>
  );
}
