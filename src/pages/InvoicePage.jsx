import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Store } from '../data/store.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { SETTINGS } from '../config/settings.js';
import Button from '../components/shared/Button.jsx';
import { Printer, ArrowRight } from 'lucide-react';

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
 * InvoicePage — Displays a single invoice for viewing/printing
 * Accessible at /invoice/:id
 */
export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const found = Store.orders.getById(id);
    if (found) {
      setOrder(found);
    }
  }, [id]);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400 text-lg">الفاتورة غير موجودة</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/');
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(order.createdAt).toLocaleTimeString('ar-JO', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col h-full">
      {/* Action bar — hidden when printing */}
      <div className="no-print flex items-center justify-between p-4 border-b border-slate-700">
        <Button variant="ghost" icon={ArrowRight} onClick={handleBack}>
          العودة لنقطة البيع
        </Button>
        <Button variant="primary" icon={Printer} onClick={handlePrint}>
          طباعة الفاتورة
        </Button>
      </div>

      {/* Invoice content — this is the printable area */}
      <div className="flex-1 overflow-y-auto p-4 flex justify-center">
        <div className="print-area w-full max-w-[400px]">
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-slate-600 print:border-gray-400">
            <h1 className="text-2xl font-bold text-slate-100 print:text-black mb-1">
              {SETTINGS.storeName}
            </h1>
            <p className="text-slate-400 print:text-gray-600 text-sm">فاتورة ضريبية مبسطة</p>
          </div>

          {/* Invoice info */}
          <div className="mb-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-500">رقم الفاتورة:</span>
              <span className="font-semibold text-slate-100 print:text-black">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-500">التاريخ:</span>
              <span className="text-slate-200 print:text-black">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-500">الوقت:</span>
              <span className="text-slate-200 print:text-black">{formattedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-500">نوع الطلب:</span>
              <span className="text-slate-200 print:text-black">
                {ORDER_TYPE_LABELS[order.orderType] || order.orderType}
              </span>
            </div>
            {order.orderType === 'dine-in' && order.tableNumber && (
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-500">رقم الطاولة:</span>
                <span className="text-slate-200 print:text-black">{order.tableNumber}</span>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-b border-dashed border-slate-600 print:border-gray-400 mb-4" />

          {/* Items table */}
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-slate-700 print:border-gray-300">
                <th className="text-start py-2 text-slate-400 print:text-gray-500 font-medium">الصنف</th>
                <th className="text-center py-2 text-slate-400 print:text-gray-500 font-medium w-12">الكمية</th>
                <th className="text-center py-2 text-slate-400 print:text-gray-500 font-medium">السعر</th>
                <th className="text-end py-2 text-slate-400 print:text-gray-500 font-medium">المجموع</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-800 print:border-gray-200">
                  <td className="py-2 text-slate-200 print:text-black">{item.name}</td>
                  <td className="py-2 text-center text-slate-300 print:text-black">{item.quantity}</td>
                  <td className="py-2 text-center text-slate-300 print:text-black price-display">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-2 text-end text-slate-200 print:text-black price-display">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Separator */}
          <div className="border-b border-dashed border-slate-600 print:border-gray-400 mb-4" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-500">المجموع الفرعي:</span>
              <span className="text-slate-200 print:text-black price-display">
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-400 print:text-black">
                <span>
                  الخصم
                  {order.discountType === 'percentage' ? ` (${order.discountValue}%)` : ''}:
                </span>
                <span className="price-display">- {formatCurrency(order.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-500">
                الضريبة ({(order.taxRate * 100).toFixed(0)}%):
              </span>
              <span className="text-slate-200 print:text-black price-display">
                {formatCurrency(order.taxAmount)}
              </span>
            </div>

            <div className="border-t border-slate-600 print:border-gray-400 pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-teal-400 print:text-black">الإجمالي:</span>
                <span className="text-teal-400 print:text-black price-display">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-b border-dashed border-slate-600 print:border-gray-400 my-4" />

          {/* Payment info */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-gray-500">طريقة الدفع:</span>
              <span className="text-slate-200 print:text-black">
                {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
              </span>
            </div>

            {order.paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-500">المبلغ المدفوع:</span>
                  <span className="text-slate-200 print:text-black price-display">
                    {formatCurrency(order.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-amber-400 print:text-black">الباقي:</span>
                  <span className="text-amber-400 print:text-black price-display">
                    {formatCurrency(order.change)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-dashed border-slate-600 print:border-gray-400 text-center">
            <p className="text-slate-500 print:text-gray-500 text-xs">شكراً لتعاملكم معنا</p>
            <p className="text-slate-600 print:text-gray-400 text-xs mt-1">
              {SETTINGS.storeName} — نظام نقاط البيع
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
