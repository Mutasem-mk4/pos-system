/**
 * ProductCard — بطاقة منتج واحدة في الشبكة
 * 
 * تعرض أيقونة الفئة، اسم المنتج، والسعر.
 * النقر على البطاقة يضيف المنتج إلى السلة.
 * تأثيرات تفاعلية: رفع عند التمرير، تصغير عند الضغط.
 */

import React from 'react';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ProductCard({ product, categoryIcon, onAdd }) {
  return (
    <button
      onClick={() => onAdd(product)}
      className="
        group relative flex flex-col items-center justify-center
        bg-slate-800 border border-slate-700 rounded-2xl
        p-4 min-h-[120px] min-w-[120px] w-full
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10
        hover:border-teal-500/40
        active:scale-95 active:shadow-none
        cursor-pointer text-center
      "
    >
      {/* شارة + في الزاوية للإشارة إلى إمكانية الإضافة */}
      <div className="
        absolute top-2 end-2
        w-6 h-6 rounded-full
        bg-teal-600/20 text-teal-400
        flex items-center justify-center
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
      ">
        <Plus size={14} strokeWidth={2.5} />
      </div>

      {/* أيقونة الفئة — كبيرة ومتوسطة */}
      <span className="text-3xl mb-2 select-none">
        {categoryIcon || '📦'}
      </span>

      {/* اسم المنتج */}
      <h3 className="
        text-sm font-medium text-slate-100
        line-clamp-2 leading-tight mb-1.5
        w-full
      ">
        {product.name}
      </h3>

      {/* السعر المنسق */}
      <span className="
        text-sm font-bold text-teal-400
        mt-auto
      ">
        {formatCurrency(product.price)}
      </span>
    </button>
  );
}
