import { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { Save, X } from 'lucide-react';
import { formatCurrency } from '../../utils';

/**
 * نموذج إنشاء/تعديل منتج
 * @param {Object|null} product - بيانات المنتج للتعديل، أو null للإنشاء
 * @param {Array} categories - قائمة الأصناف المتاحة
 * @param {Function} onSave - دالة الحفظ تستقبل { name, categoryId, price, imageUrl }
 * @param {Function} onClose - دالة إغلاق النافذة
 */
export default function ProductForm({ product, categories, onSave, onClose }) {
  // ─── حالة الحقول ─── يتم ملؤها مسبقاً عند التعديل
  const [name, setName] = useState(product?.name || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');

  // ─── التحقق من صلاحية النموذج ───
  const isValid = name.trim() && categoryId && price && parseFloat(price) > 0;

  // ─── معالج الإرسال ───
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    onSave({
      name: name.trim(),
      categoryId,
      price: parseFloat(price),
      imageUrl: product?.imageUrl || null,
    });
    onClose();
  };

  return (
    <Modal
      title={product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      onClose={onClose}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── حقل اسم المنتج ─── */}
        <div>
          <label
            htmlFor="product-name"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            اسم المنتج <span className="text-red-400">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: شاي أحمر"
            required
            className="w-full min-h-[48px] px-4 py-3 bg-slate-700 border border-slate-600
                       rounded-xl text-slate-100 placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       text-base font-[Cairo]"
            dir="rtl"
          />
        </div>

        {/* ─── حقل الصنف ─── */}
        <div>
          <label
            htmlFor="product-category"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            الصنف <span className="text-red-400">*</span>
          </label>
          <select
            id="product-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full min-h-[48px] px-4 py-3 bg-slate-700 border border-slate-600
                       rounded-xl text-slate-100 appearance-none
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       text-base font-[Cairo] cursor-pointer"
            dir="rtl"
          >
            <option value="" disabled className="text-slate-500">
              اختر الصنف...
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-700">
                {cat.icon || '📦'} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* ─── حقل السعر ─── */}
        <div>
          <label
            htmlFor="product-price"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            السعر (د.أ) <span className="text-red-400">*</span>
          </label>
          <input
            id="product-price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.000"
            required
            min="0.001"
            step="0.001"
            className="w-full min-h-[48px] px-4 py-3 bg-slate-700 border border-slate-600
                       rounded-xl text-slate-100 placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       text-base font-[Cairo] text-start"
            dir="ltr"
          />
          {/* ─── تلميح بتنسيق العملة ─── */}
          {price && parseFloat(price) > 0 && (
            <p className="text-sm text-teal-400 mt-2">
              💰 {formatCurrency(parseFloat(price))}
            </p>
          )}
        </div>

        {/* ─── ملخص المنتج (معاينة) ─── */}
        {isValid && (
          <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600 space-y-2">
            <p className="text-xs text-slate-400 mb-1">معاينة:</p>
            <div className="flex items-center justify-between">
              <span className="text-slate-100 font-medium">{name}</span>
              <span className="text-teal-400 font-semibold">
                {formatCurrency(parseFloat(price))}
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              {categories.find((c) => c.id === categoryId)?.icon || '📦'}{' '}
              {categories.find((c) => c.id === categoryId)?.name}
            </p>
          </div>
        )}

        {/* ─── أزرار الإجراءات ─── */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            disabled={!isValid}
            fullWidth
          >
            {product ? 'حفظ التعديلات' : 'إضافة المنتج'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={X}
            onClick={onClose}
            fullWidth
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
}
