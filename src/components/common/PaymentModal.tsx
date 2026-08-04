import React, { useState } from 'react';
import { useHMS } from '../../context/HMSContext';
import { PaymentMethod } from '../../types/hms';
import { X, CheckCircle, Smartphone, CreditCard, DollarSign, ShieldCheck, QrCode, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PaymentModal: React.FC = () => {
  const { paymentModal, closePaymentModal, triggerConfetti } = useHMS();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    paymentModal?.defaultMethod || 'Telebirr'
  );
  const [phoneNumber, setPhoneNumber] = useState('+251 911 405 921');
  const [telebirrPin, setTelebirrPin] = useState('****');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');

  if (!paymentModal || !paymentModal.isOpen) return null;

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const ref = `${selectedMethod.toUpperCase().slice(0, 3)}-${Math.floor(
        10000000 + Math.random() * 90000000
      )}`;
      setGeneratedRef(ref);
      setIsProcessing(false);
      setIsSuccess(true);

      triggerConfetti();

      setTimeout(() => {
        paymentModal.onSuccess(selectedMethod, ref);
        closePaymentModal();
      }, 1800);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">{paymentModal.title || 'Digital Payment Checkout'}</span>
            </div>
            <button
              onClick={closePaymentModal}
              disabled={isProcessing}
              className="p-1 rounded-full text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {isSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">Payment Verified!</h3>
                <p className="text-sm text-slate-600">
                  Amount: <strong className="text-slate-900">ETB {paymentModal.amount}</strong> paid via <strong>{selectedMethod}</strong>.
                </p>
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 inline-block">
                  Transaction Ref: <span className="font-bold text-emerald-700">{generatedRef}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Amount Banner */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Total Billable Amount</span>
                    <span className="text-xs text-emerald-400 font-semibold">{paymentModal.itemDescription || 'Hospital Fee'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      ETB {paymentModal.amount}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Digital Payment Provider
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('Telebirr')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        selectedMethod === 'Telebirr'
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <span className="text-xs">Telebirr</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('Chapa')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        selectedMethod === 'Chapa'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs">Chapa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('Cash')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        selectedMethod === 'Cash'
                          ? 'bg-slate-100 border-slate-600 text-slate-900 font-bold shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <DollarSign className="w-5 h-5 text-slate-700" />
                      <span className="text-xs">Cash Desk</span>
                    </button>
                  </div>
                </div>

                {/* Provider Details Form */}
                {selectedMethod === 'Telebirr' && (
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>Telebirr Quick Payment (Ethio Telecom API)</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Telebirr Registered Phone Number
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="+251 9..."
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-blue-800 bg-blue-100/60 p-2 rounded-lg">
                      <span>USSD Prompt Push sent to phone</span>
                      <QrCode className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                )}

                {selectedMethod === 'Chapa' && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Chapa Digital Gateway (CBE Birr / Awash / Cards)</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Payer Phone / Account
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === 'Cash' && (
                  <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-slate-900">Manual Cash Reconciliation</div>
                    <p>Collect cash at physical cashier window and issue printed receipt.</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Verifying Transaction via Gateway...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirm & Authorize ETB {paymentModal.amount}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
