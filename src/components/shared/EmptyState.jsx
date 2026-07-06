/**
 * EmptyState.jsx — حالة القائمة الفارغة
 * 
 * يُعرض عندما لا توجد عناصر في القائمة
 * يدعم أيقونة ورسالة وزر إجراء اختياري
 */

import Button from './Button';

export default function EmptyState({ icon: Icon, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      {/* أيقونة توضيحية */}
      {Icon && <Icon size={48} className="mb-4 opacity-50" />}

      {/* رسالة الحالة الفارغة */}
      <p className="text-lg mb-4">{message}</p>

      {/* زر إجراء اختياري */}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
