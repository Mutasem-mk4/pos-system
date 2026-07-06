/**
 * CategoryTabs — شريط التبويبات الأفقي للفئات
 * 
 * يعرض جميع فئات المنتجات كتبويبات قابلة للتمرير أفقياً.
 * التبويب الأول "الكل" يعرض جميع المنتجات.
 * التبويب النشط يتميز بلون أخضر مائي (teal).
 */

import React, { useRef } from 'react';

export default function CategoryTabs({ categories = [], activeCategory, onSelect }) {
  const scrollRef = useRef(null);

  return (
    <div className="relative mt-3">
      {/* حاوية التمرير الأفقي — شريط تمرير مخفي */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* تبويب "الكل" — يظهر جميع المنتجات */}
        <button
          onClick={() => onSelect(null)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl
            text-sm font-medium whitespace-nowrap
            min-h-[48px] min-w-[80px]
            transition-all duration-200 shrink-0
            ${activeCategory === null
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/25'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-slate-100'
            }
          `}
        >
          <span className="text-lg">📋</span>
          <span>الكل</span>
        </button>

        {/* تبويبات الفئات */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl
              text-sm font-medium whitespace-nowrap
              min-h-[48px] min-w-[80px]
              transition-all duration-200 shrink-0
              ${activeCategory === category.id
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/25'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-slate-100'
              }
            `}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* CSS لإخفاء شريط التمرير في المتصفحات المختلفة */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
