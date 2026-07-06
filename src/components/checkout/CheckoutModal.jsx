import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../../context/CartContext.jsx';
import { Store } from '../../data/store.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { calculateChange } from '../../utils/calculations.js';
import { SETTINGS, PAYMENT_METHODS } from '../../config/settings.js';
import Modal from '../shared/Modal.jsx';
import Button from '../shared/Button.jsx';
import { Banknote, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * CheckoutModal — Payment flow
 * 
 * Handles:
 * 1. Payment method selection (Cash / Card)
 * 2. Cash: amount received + change calculation
 * 3. Card: simple confirmation
 * 4. Save order + navigate to invoice
 */
export default function CheckoutModal({ onClose }) {
  const navigate = useNavigate();
  const cart = useCart();
  const { items, orderType, tableNumber, discount, totals } = cart;

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const amountPaidNum = parseFloat(amountPaid) || 0;
  const change = calculateChange(totals.total, amountPaidNum);
  const isCashSufficient = amountPaidNum >= totals.total;

  // Quick amount buttons for cash payment
  const quickAmounts = [
    Math.ceil(totals.total),
    Math.ceil(totals.total / 5) * 5,
    Math.ceil(totals.total / 10) * 10,
    20,
    50,
  ].filter((v, i, arr) => v >= totals.total && arr.indexOf(v) === i).slice(0, 4);

  const handleConfirm = () => {
    // Validate
    if (paymentMethod === 'cash' && !isCashSufficient) {
      setError('المبلغ المدفوع أقل من الإجمالي');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Build order data
      const orderData = {
        orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : null,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: totals.subtotal,
        discountType: discount.type,
        discountValue: discount.value,
        discountAmount: totals.discountAmount,
        taxRate: SETTINGS.taxRate,
        taxAmount: totals.taxAmount,
        total: totals.total,
        paymentMethod,
        amountPaid: paymentMethod === 'cash' ? amountPaidNum : totals.total,
        change: paymentMethod === 'cash' ? change : 0,
      };

      // Save to store
      const savedOrder = Store.orders.create(orderData);

      // Clear the cart
      cart.clearCart();

      // Navigate to invoice
      onClose();
      navigate(`/invoice/${savedOrder.id}`);
    } catch (err) {
      setError('حدث خطأ أثناء حفظ الطلب');
      setIsProcessing(false);
    }
  };

  const ICONS = { Banknote, CreditCard };

  return (
    <Modal title="إتمام الدفع" onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-6">
        {/* Order summary */}
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">الإجمالي المطلوب</span>
            <span className="text-2xl font-bold text-teal-400 price-display">
              {formatCurrency(totals.total)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {items.length} أصناف • شامل الضريبة ({(SETTINGS.taxRate * 100).toFixed(0)}%)
          </p>
        </div>

        {/* Payment method selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            طريقة الدفع
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = ICONS[method.icon];
              return (
                <button
                  key={method.id}
                  onClick={() => {
                    setPaymentMethod(method.id);
                    setError('');
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === method.id
                      ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {Icon && <Icon size={28} />}
                  <span className="font-medium">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cash payment details */}
        {paymentMethod === 'cash' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                المبلغ المستلم من العميل
              </label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => {
                  setAmountPaid(e.target.value);
                  setError('');
                }}
                placeholder="0.000"
                step="0.001"
                min="0"
                autoFocus
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-2xl text-center text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 price-display"
              />
            </div>

            {/* Quick amount buttons */}
            <div className="flex gap-2 flex-wrap">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setAmountPaid(amount.toFixed(SETTINGS.currencyDecimals));
                    setError('');
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>

            {/* Change display */}
            {amountPaidNum > 0 && (
              <div className={`rounded-xl p-4 text-center ${
                isCashSufficient
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                {isCashSufficient ? (
                  <>
                    <p className="text-sm text-slate-400 mb-1">الباقي للعميل</p>
                    <p className="text-3xl font-bold text-amber-400 price-display">
                      {formatCurrency(change)}
                    </p>
                  </>
                ) : (
                  <p className="text-red-400 flex items-center justify-center gap-2">
                    <AlertCircle size={18} />
                    المبلغ غير كافٍ — ينقص {formatCurrency(totals.total - amountPaidNum)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Card payment confirmation */}
        {paymentMethod === 'card' && (
          <div className="bg-slate-900 rounded-xl p-6 text-center">
            <CreditCard size={48} className="text-teal-400 mx-auto mb-3" />
            <p className="text-slate-300 mb-1">سيتم خصم المبلغ من البطاقة</p>
            <p className="text-2xl font-bold text-teal-400 price-display">
              {formatCurrency(totals.total)}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              (محاكاة — لا يتم الخصم فعلياً)
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Confirm button */}
        <Button
          variant="success"
          size="lg"
          fullWidth
          icon={CheckCircle}
          onClick={handleConfirm}
          disabled={isProcessing || (paymentMethod === 'cash' && !isCashSufficient)}
        >
          {isProcessing ? 'جارٍ المعالجة...' : 'تأكيد الدفع وإصدار الفاتورة'}
        </Button>
      </div>
    </Modal>
  );
}
