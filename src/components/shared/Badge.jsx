/**
 * Badge.jsx — شارة / علامة صغيرة
 * 
 * تُستخدم لعرض تصنيفات المنتجات وحالات الطلبات
 * تدعم عدة ألوان: default, primary, success, warning, danger
 */

export default function Badge({ variant = 'default', children, className = '' }) {
  // ألوان الخلفية والنص حسب النوع
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    primary: 'bg-teal-500/20 text-teal-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-amber-500/20 text-amber-400',
    danger: 'bg-red-500/20 text-red-400',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
