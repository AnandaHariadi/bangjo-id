import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../utils/translations';

export default function QRISModal({ isOpen, onClose, selectedItem, lang = 'id' }) {
  const t = (translations[lang] || translations.id).qris;
  const [quantity, setQuantity] = useState(1);
  const [isPaid, setIsPaid] = useState(false);

  if (!isOpen || !selectedItem) return null;

  const basePrice = selectedItem.price || 35000;
  const discount = 5000;
  const villageTax = 500;
  const totalPrice = Math.max(0, basePrice * quantity - discount + villageTax);

  const handleSimulatePayment = () => {
    setIsPaid(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetAndClose = () => {
    setIsPaid(false);
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#002B49] p-3.5 sm:p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-[#00A3E0]" />
            <h3 className="font-bold text-xs uppercase tracking-wider">{t.header}</h3>
          </div>
          <button 
            onClick={resetAndClose}
            className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          
          {!isPaid ? (
            <>
              {/* Order Info */}
              <div className="p-3.5 bg-stone-50 rounded border border-stone-200 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">{selectedItem.name}</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">{selectedItem.merchantName || t.defaultMerchant}</p>
                  </div>
                  <p className="font-bold text-xs text-[#002B49]">
                    Rp {basePrice.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex justify-between items-center pt-2 border-t border-stone-200/60">
                  <span className="text-xs text-stone-600 font-medium">{t.orderQty}</span>
                  <div className="flex items-center gap-3 bg-white border border-stone-300 px-2 py-0.5 rounded">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-5 h-5 bg-stone-100 hover:bg-stone-200 font-bold text-xs flex items-center justify-center rounded"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-stone-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-5 h-5 bg-stone-100 hover:bg-stone-200 font-bold text-xs flex items-center justify-center rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo Banner */}
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded flex items-center gap-2 text-xs text-emerald-800">
                <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: t.promoText }}></span>
              </div>

              {/* QRIS Code Box */}
              <div className="bg-[#002B49] p-4 rounded-xl text-center space-y-2.5">
                <div className="inline-block bg-white p-3 rounded shadow">
                  <div className="w-36 h-36 bg-stone-900 flex flex-col items-center justify-center p-2 rounded relative">
                    <QrCode size={105} className="text-white" />
                    <span className="text-[9px] font-bold text-white mt-1 tracking-widest uppercase">
                      {t.qrisNational}
                    </span>
                  </div>
                </div>

                <div className="text-white space-y-0.5">
                  <p className="text-[10px] font-mono text-stone-300">NMID: ID1029384756199</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">{t.supportedBanks}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span>Rp {(basePrice * quantity).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>{t.incentive}</span>
                  <span>-Rp {discount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>{t.templeTax}</span>
                  <span>+Rp {villageTax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#002B49] pt-1.5 border-t border-stone-200">
                  <span>{t.totalBill}</span>
                  <span className="text-[#E31837]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSimulatePayment}
                className="w-full bg-[#E31837] hover:bg-[#B30E26] text-white font-bold py-3 rounded shadow-xs transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <CheckCircle2 size={16} />
                <span>{t.btnConfirm}</span>
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-[#002B49]">{t.successTitle}</h4>
                <p className="text-xs text-stone-500">{t.successSub}</p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded text-center space-y-1">
                <span className="text-[10px] font-mono text-stone-400 block">{t.officialCred}</span>
                <p className="text-xs font-bold text-[#002B49]">
                  {t.certTitle}
                </p>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full bg-[#002B49] hover:bg-stone-800 text-white font-bold py-2.5 rounded transition-all text-xs"
              >
                {t.btnClose}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
