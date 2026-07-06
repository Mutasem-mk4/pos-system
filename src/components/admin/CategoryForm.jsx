import { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { Save, X } from 'lucide-react';

// ─── قائمة الأيقونات الجاهزة للاختيار السريع ───
const PRESET_EMOJIS = ['🥤', '🥗', '🥪', '🍽️', '🥛', '🧹', '🍞', '🛒', '🍰', '🧃'];

/**
 * نموذج إنشاء/تعديل صنف
 * @param {Object|null} category - بيانات الصنف للتعديل، أو null للإنشاء
 * @param {Function} onSave - دالة الحفظ تستقبل { name, icon }
 * @param {Function} onClose - دالة إغلاق النافذة
 */
export default function CategoryForm({ category, onSave, onClose }) {
  // ─── حالة الحقول ─── يتم ملؤها مسبقاً عند التعديل
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || '');

  // ─── معالج الإرسال ───
  const handleSubmit = (e) => {
    e.preventDefault();
    // التحقق من الحقل المطلوب
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon: icon || '📦' });
    onClose();
  };

  return (
    <Modal
      title={category ? 'تعديل الصنف' : 'إضافة صنف جديد'}
      onClose={onClose}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── حقل اسم الصنف ─── */}
        <div>
          <label
            htmlFor="category-name"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            اسم الصنف <span className="text-red-400">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: مشروبات"
            required
            className="w-full min-h-[48px] px-4 py-3 bg-slate-700 border border-slate-600
                       rounded-xl text-slate-100 placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       text-base font-[Cairo]"
            dir="rtl"
          />
        </div>

        {/* ─── حقل الأيقونة (إيموجي) ─── */}
        <div>
          <label
            htmlFor="category-icon"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            الأيقونة (اختياري)
          </label>
          <input
            id="category-icon"
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="🍽️"
            className="w-full min-h-[48px] px-4 py-3 bg-slate-700 border border-slate-600
                       rounded-xl text-slate-100 placeholder-slate-500 text-center text-2xl
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />

          {/* ─── أزرار الأيقونات الجاهزة ─── */}
          <div className="flex flex-wrap gap-2 mt-3">
            {PRESET_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`min-w-[48px] min-h-[48px] flex items-center justify-center
                           text-2xl rounded-xl border-2 transition-all duration-150
                           ${icon === emoji
                             ? 'border-teal-500 bg-teal-500/20 scale-110'
                             : 'border-slate-600 bg-slate-700 hover:border-slate-500 hover:bg-slate-600'
                           }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* ─── معاينة الصنف ─── */}
        {(name || icon) && (
          <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl border border-slate-600">
            <span className="text-3xl">{icon || '📦'}</span>
            <span className="text-slate-100 font-medium text-lg">
              {name || 'اسم الصنف'}
            </span>
          </div>
        )}

        {/* ─── أزرار الإجراءات ─── */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            disabled={!name.trim()}
            fullWidth
          >
            {category ? 'حفظ التعديلات' : 'إضافة الصنف'}
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
