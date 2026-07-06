import { useState } from 'react';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import EmptyState from '../shared/EmptyState';
import Modal from '../shared/Modal';
import { Pencil, Trash2, Package } from 'lucide-react';
import { formatCurrency } from '../../utils';

/**
 * عرض جميع المنتجات في جدول (سطح المكتب) أو بطاقات (الجوال)
 * @param {Array} products - مصفوفة المنتجات
 * @param {Array} categories - مصفوفة الأصناف لربط categoryId بالاسم
 * @param {Function} onEdit - دالة التعديل تستقبل كائن المنتج
 * @param {Function} onDelete - دالة الحذف تستقبل معرّف المنتج
 */
export default function ProductList({ products, categories, onEdit, onDelete }) {
  // ─── حالة تأكيد الحذف ───
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ─── دالة مساعدة: الحصول على اسم الصنف من المعرّف ───
  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'غير محدد';
  };

  // ─── دالة مساعدة: الحصول على أيقونة الصنف ───
  const getCategoryIcon = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.icon || '📦';
  };

  // ─── معالج تأكيد الحذف ───
  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // ─── حالة فارغة ───
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        message="لا توجد منتجات بعد. أضف منتجاً جديداً للبدء."
        actionLabel="إضافة منتج"
        onAction={() => onEdit(null)}
      />
    );
  }

  return (
    <>
      {/* ════════════════════════════════════════════════════
          عرض الجدول — مرئي على الشاشات المتوسطة والكبيرة
          ════════════════════════════════════════════════════ */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-700">
        <table className="w-full text-start">
          {/* ─── رأس الجدول ─── */}
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="text-start px-5 py-4 text-sm font-semibold text-slate-400">
                المنتج
              </th>
              <th className="text-start px-5 py-4 text-sm font-semibold text-slate-400">
                الصنف
              </th>
              <th className="text-start px-5 py-4 text-sm font-semibold text-slate-400">
                السعر
              </th>
              <th className="text-end px-5 py-4 text-sm font-semibold text-slate-400">
                الإجراءات
              </th>
            </tr>
          </thead>

          {/* ─── صفوف المنتجات ─── */}
          <tbody className="divide-y divide-slate-700">
            {products.map((product) => (
              <tr
                key={product.id}
                className="bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              >
                {/* اسم المنتج */}
                <td className="px-5 py-4">
                  <span className="text-slate-100 font-medium text-base">
                    {product.name}
                  </span>
                </td>

                {/* الصنف */}
                <td className="px-5 py-4">
                  <Badge variant="default">
                    {getCategoryIcon(product.categoryId)}{' '}
                    {getCategoryName(product.categoryId)}
                  </Badge>
                </td>

                {/* السعر */}
                <td className="px-5 py-4">
                  <span className="text-teal-400 font-semibold">
                    {formatCurrency(product.price)}
                  </span>
                </td>

                {/* أزرار الإجراءات */}
                <td className="px-5 py-4">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Pencil}
                      onClick={() => onEdit(product)}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => setDeleteTarget(product)}
                    >
                      حذف
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ════════════════════════════════════════════════════
          عرض البطاقات — مرئي على الشاشات الصغيرة فقط
          ════════════════════════════════════════════════════ */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-4
                       hover:border-slate-600 transition-colors"
          >
            {/* ─── معلومات المنتج ─── */}
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <h3 className="text-slate-100 font-semibold text-base">
                  {product.name}
                </h3>
                <Badge variant="default">
                  {getCategoryIcon(product.categoryId)}{' '}
                  {getCategoryName(product.categoryId)}
                </Badge>
              </div>
              <span className="text-teal-400 font-bold text-lg">
                {formatCurrency(product.price)}
              </span>
            </div>

            {/* ─── أزرار الإجراءات ─── */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Pencil}
                onClick={() => onEdit(product)}
                fullWidth
              >
                تعديل
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => setDeleteTarget(product)}
                fullWidth
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          نافذة تأكيد الحذف
          ════════════════════════════════════════════════════ */}
      {deleteTarget && (
        <Modal
          title="تأكيد الحذف"
          onClose={() => setDeleteTarget(null)}
          maxWidth="sm"
        >
          <div className="space-y-6">
            {/* رسالة التأكيد */}
            <div className="text-center space-y-3">
              <p className="text-slate-300 text-base">
                هل أنت متأكد من حذف المنتج{' '}
                <span className="text-slate-100 font-semibold">
                  "{deleteTarget.name}"
                </span>
                ؟
              </p>
              <p className="text-slate-400 text-sm">
                السعر: {formatCurrency(deleteTarget.price)}
              </p>
              <p className="text-red-400 text-sm">
                ⚠️ لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>

            {/* أزرار التأكيد */}
            <div className="flex gap-3">
              <Button
                variant="danger"
                icon={Trash2}
                onClick={confirmDelete}
                fullWidth
              >
                نعم، احذف
              </Button>
              <Button
                variant="secondary"
                onClick={() => setDeleteTarget(null)}
                fullWidth
              >
                إلغاء
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
