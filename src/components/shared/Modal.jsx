/**
 * Modal.jsx — نافذة حوار منبثقة
 * 
 * تعرض محتوى فوق طبقة معتمة مع تأثير ضبابي
 * تدعم الإغلاق بالنقر خارج النافذة أو زر الإغلاق
 * تستخدم حركة انتقالية (fade + scale) عند الفتح والإغلاق
 */

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Modal({ title, children, onClose, maxWidth = 'max-w-lg' }) {
  const overlayRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // منع تمرير الصفحة خلف النافذة
    document.body.style.overflow = 'hidden';

    // تشغيل الحركة الانتقالية بعد التركيب
    requestAnimationFrame(() => setIsVisible(true));

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // إغلاق مع حركة انتقالية عكسية
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  // الإغلاق عند النقر على الخلفية المعتمة
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
    >
      {/* لوحة المحتوى */}
      <div
        className={`bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full ${maxWidth} max-h-[90vh] flex flex-col transition-all duration-200 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* رأس النافذة — العنوان وزر الإغلاق */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* جسم النافذة — المحتوى القابل للتمرير */}
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
