/**
 * SearchInput.jsx — حقل بحث عن المنتجات
 * 
 * مكون مُتحكَّم به (controlled) مع أيقونة بحث وزر مسح
 * يستخدم الخصائص المنطقية (start/end) لدعم RTL
 * حجم ملائم للمس (حد أدنى 48px)
 */

import { Search, X } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'ابحث عن منتج...',
  autoFocus = false,
}) {
  return (
    <div className="relative">
      {/* أيقونة البحث — في بداية الحقل (يمين في RTL) */}
      <Search
        size={20}
        className="absolute top-1/2 -translate-y-1/2 start-4 text-slate-400 pointer-events-none"
      />

      {/* حقل الإدخال */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl ps-12 pe-12 py-3 min-h-[48px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
      />

      {/* زر المسح — يظهر فقط عند وجود نص */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute top-1/2 -translate-y-1/2 end-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
