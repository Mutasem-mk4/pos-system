import { useState } from 'react';
import Button from '../shared/Button';
import EmptyState from '../shared/EmptyState';
import Modal from '../shared/Modal';
import { Pencil, Trash2, Tag } from 'lucide-react';

/**
 * عرض جميع الأصناف في شبكة بطاقات
 * @param {Array} categories - مصفوفة الأصناف
 * @param {Function} onEdit - دالة التعديل تستقبل كائن الصنف
 * @param {Function} onDelete - دالة الحذف تستقبل معرّف الصنف
 */
export default function CategoryList({ categories, onEdit, onDelete }) {
  // ─── حالة تأكيد الحذف ───
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ─── معالج تأكيد الحذف ───
  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // ─── حالة فارغة ───
  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        icon={Tag}
        message="لا توجد أصناف بعد. أضف صنفاً جديداً للبدء."
        actionLabel="إضافة صنف"
        onAction={() => onEdit(null)}
      />
    );
  }

  return (
    <>
      {/* ─── شبكة بطاقات الأصناف ─── */}
      {/* 2 أعمدة على الأجهزة اللوحية، 3 على سطح المكتب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-5
                       hover:border-slate-600 transition-colors duration-200
                       flex flex-col items-center gap-3"
          >
            {/* ─── الأيقونة ─── */}
            <span className="text-5xl leading-none">
              {category.icon || '📦'}
            </span>

            {/* ─── اسم الصنف ─── */}
            <h3 className="text-slate-100 font-semibold text-lg text-center">
              {category.name}
            </h3>

            {/* ─── أزرار الإجراءات ─── */}
            <div className="flex gap-2 w-full mt-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Pencil}
                onClick={() => onEdit(category)}
                fullWidth
              >
                تعديل
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => setDeleteTarget(category)}
                fullWidth
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── نافذة تأكيد الحذف ─── */}
      {deleteTarget && (
        <Modal
          title="تأكيد الحذف"
          onClose={() => setDeleteTarget(null)}
          maxWidth="sm"
        >
          <div className="space-y-6">
            {/* رسالة التأكيد */}
            <div className="text-center space-y-3">
              <div className="text-5xl">{deleteTarget.icon || '📦'}</div>
              <p className="text-slate-300 text-base">
                هل أنت متأكد من حذف الصنف{' '}
                <span className="text-slate-100 font-semibold">
                  "{deleteTarget.name}"
                </span>
                ؟
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
