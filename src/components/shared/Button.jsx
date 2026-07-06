/**
 * Button.jsx — زر قابل لإعادة الاستخدام
 * 
 * يدعم عدة أنماط (primary, secondary, danger, success, ghost)
 * وأحجام متعددة مع دعم اللمس (حد أدنى 48px)
 * يمكن إضافة أيقونة من Lucide React
 */

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  children,
  className = '',
  ...props
}) {
  // الأنماط الأساسية المشتركة بين جميع الأزرار
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  // أنماط الألوان حسب النوع
  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/20',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
    danger: 'bg-red-600/80 hover:bg-red-500 text-white',
    success: 'bg-green-600 hover:bg-green-500 text-white',
    ghost: 'bg-transparent hover:bg-slate-700/50 text-slate-300',
  };

  // أحجام الأزرار — جميعها تلبي الحد الأدنى للمس
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[48px]',
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]',
  };

  // حجم الأيقونة يتناسب مع حجم الزر
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </button>
  );
}
