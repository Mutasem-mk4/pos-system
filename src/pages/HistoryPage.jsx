import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Store } from '../data/store.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import PageHeader from '../components/layout/PageHeader.jsx';
import SearchInput from '../components/shared/SearchInput.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import Badge from '../components/shared/Badge.jsx';
import { ClipboardList, Eye, ReceiptText } from 'lucide-react';

/**
 * ORDER_TYPE_LABELS — Arabic labels for order types
 */
const ORDER_TYPE_LABELS = {
  'dine-in': 'تناول في المطعم',
  'takeaway': 'سفري',
  'direct-sale': 'بيع مباشر',
};

const PAYMENT_LABELS = {
  'cash': 'نقدي',
  'card': 'بطاقة',
};

/**
 * HistoryPage — Lists all issued invoices with view/reprint
 */
export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const allOrders = Store.orders.getAll();
    // Sort by newest first
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setOrders(allOrders);
  }, []);

  // Filter orders by invoice number or date
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      new Date(order.createdAt).toLocaleDateString('ar-JO').includes(query)
    );
  });

  const handleView = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <PageHeader
        title="سجل الفواتير"
        subtitle={`${orders.length} فاتورة مسجلة`}
      />

      {/* Search */}
      <div className="mb-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="ابحث برقم الفاتورة..."
        />
      </div>

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            message={orders.length === 0 ? 'لا توجد فواتير بعد' : 'لا توجد نتائج مطابقة'}
          />
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const date = new Date(order.createdAt);
              const formattedDate = date.toLocaleDateString('ar-JO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              const formattedTime = date.toLocaleTimeString('ar-JO', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <button
                  key={order.id}
                  onClick={() => handleView(order.id)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 hover:bg-slate-750 hover:border-slate-600 transition-all cursor-pointer text-start group"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Invoice icon + number */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center shrink-0">
                        <ReceiptText size={20} className="text-teal-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-100">{order.id}</p>
                        <p className="text-xs text-slate-400">
                          {formattedDate} — {formattedTime}
                        </p>
                      </div>
                    </div>

                    {/* Order info */}
                    <div className="hidden sm:flex items-center gap-3">
                      <Badge variant={order.orderType === 'dine-in' ? 'primary' : order.orderType === 'takeaway' ? 'warning' : 'default'}>
                        {ORDER_TYPE_LABELS[order.orderType]}
                      </Badge>
                      <Badge variant={order.paymentMethod === 'cash' ? 'success' : 'primary'}>
                        {PAYMENT_LABELS[order.paymentMethod]}
                      </Badge>
                    </div>

                    {/* Total + view button */}
                    <div className="flex items-center gap-3">
                      <div className="text-end">
                        <p className="font-bold text-teal-400 price-display">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.items.length} أصناف
                        </p>
                      </div>
                      <Eye size={18} className="text-slate-500 group-hover:text-teal-400 transition-colors" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
