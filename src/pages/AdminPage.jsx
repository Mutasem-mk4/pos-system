import { useState, useEffect } from 'react';
import { Store } from '../data/store';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/shared/Button';
import CategoryList from '../components/admin/CategoryList';
import CategoryForm from '../components/admin/CategoryForm';
import ProductList from '../components/admin/ProductList';
import ProductForm from '../components/admin/ProductForm';
import { Plus, Tag, Package } from 'lucide-react';

/**
 * صفحة الإدارة الرئيسية
 * تجمع إدارة الأصناف والمنتجات في واجهة واحدة مع تبويبات
 */
export default function AdminPage() {
  // ─── التبويب النشط ───
  const [activeTab, setActiveTab] = useState('categories');

  // ─── بيانات الأصناف والمنتجات ───
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // ─── حالة النموذج المنبثق ───
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // ════════════════════════════════════════════════════
  // تحميل البيانات من المخزن
  // ════════════════════════════════════════════════════
  const loadData = () => {
    setCategories(Store.categories.getAll());
    setProducts(Store.products.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  // ════════════════════════════════════════════════════
  // معالجات CRUD للأصناف
  // ════════════════════════════════════════════════════
  const handleSaveCategory = (data) => {
    if (editingItem) {
      Store.categories.update(editingItem.id, data);
    } else {
      Store.categories.create(data);
    }
    loadData();
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteCategory = (id) => {
    Store.categories.remove(id);
    loadData();
  };

  // ════════════════════════════════════════════════════
  // معالجات CRUD للمنتجات
  // ════════════════════════════════════════════════════
  const handleSaveProduct = (data) => {
    if (editingItem) {
      Store.products.update(editingItem.id, data);
    } else {
      Store.products.create(data);
    }
    loadData();
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteProduct = (id) => {
    Store.products.remove(id);
    loadData();
  };

  // ════════════════════════════════════════════════════
  // فتح نموذج الإضافة/التعديل
  // ════════════════════════════════════════════════════
  const openForm = (item = null) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* ════════════════════════════════════════════════════
          رأس الصفحة
          ════════════════════════════════════════════════════ */}
      <PageHeader
        title="إدارة المنتجات"
        subtitle="إضافة وتعديل الأصناف والمنتجات"
      >
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => openForm(null)}
        >
          {activeTab === 'categories' ? 'إضافة صنف' : 'إضافة منتج'}
        </Button>
      </PageHeader>

      {/* ════════════════════════════════════════════════════
          مبدّل التبويبات
          ════════════════════════════════════════════════════ */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'categories' ? 'primary' : 'secondary'}
          icon={Tag}
          onClick={() => setActiveTab('categories')}
        >
          الأصناف
          {/* عدد الأصناف */}
          {categories.length > 0 && (
            <span
              className={`ms-2 inline-flex items-center justify-center min-w-[24px] h-6
                         px-1.5 rounded-full text-xs font-bold
                         ${activeTab === 'categories'
                           ? 'bg-teal-400/20 text-teal-300'
                           : 'bg-slate-600 text-slate-300'
                         }`}
            >
              {categories.length}
            </span>
          )}
        </Button>
        <Button
          variant={activeTab === 'products' ? 'primary' : 'secondary'}
          icon={Package}
          onClick={() => setActiveTab('products')}
        >
          المنتجات
          {/* عدد المنتجات */}
          {products.length > 0 && (
            <span
              className={`ms-2 inline-flex items-center justify-center min-w-[24px] h-6
                         px-1.5 rounded-full text-xs font-bold
                         ${activeTab === 'products'
                           ? 'bg-teal-400/20 text-teal-300'
                           : 'bg-slate-600 text-slate-300'
                         }`}
            >
              {products.length}
            </span>
          )}
        </Button>
      </div>

      {/* ════════════════════════════════════════════════════
          محتوى التبويب النشط
          ════════════════════════════════════════════════════ */}
      {activeTab === 'categories' ? (
        <CategoryList
          categories={categories}
          onEdit={(cat) => openForm(cat)}
          onDelete={handleDeleteCategory}
        />
      ) : (
        <ProductList
          products={products}
          categories={categories}
          onEdit={(prod) => openForm(prod)}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* ════════════════════════════════════════════════════
          نوافذ النماذج المنبثقة
          ════════════════════════════════════════════════════ */}
      {showForm && activeTab === 'categories' && (
        <CategoryForm
          category={editingItem}
          onSave={handleSaveCategory}
          onClose={closeForm}
        />
      )}

      {showForm && activeTab === 'products' && (
        <ProductForm
          product={editingItem}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
