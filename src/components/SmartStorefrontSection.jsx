import React, { useState } from 'react';
import { MERCHANTS, CULINARY_ITEMS } from '../data/mockData';
import { 
  Store, Camera, MapPin, ShieldCheck, QrCode, ArrowRight, 
  Sparkles, Smartphone, CheckCircle2, User, Award
} from 'lucide-react';
import ThreeCanvas from './ThreeCanvas';
import { translations } from '../utils/translations';

export default function SmartStorefrontSection({ onOpenAR, onOpenQRIS, lang = 'id' }) {
  const t = (translations[lang] || translations.id).storefront;
  const [activeMerchant, setActiveMerchant] = useState(MERCHANTS[0]);

  return (
    <section id="storefront" className="py-16 md:py-20 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bangjo-badge-gradient text-[#002B49] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>{t.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B49] tracking-tight">
            {t.heading}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl mx-auto">
            {t.sub}
          </p>
        </div>

        {/* 2-BOX SIDE-BY-SIDE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* KOTAK 1 (KIRI): FOKUS AR VIEWPORT */}
          <div className="lg:col-span-7 bg-[#002B49] rounded-2xl p-3.5 sm:p-5 shadow-xl border border-stone-800 flex flex-col justify-between text-white">
            
            {/* Viewport Top Header */}
            <div className="flex justify-between items-center px-1 pb-2.5 sm:pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A3E0] animate-pulse shrink-0"></span>
                <span className="font-bold text-white tracking-wide text-xs sm:text-sm truncate">
                  {t.viewportTitle}{activeMerchant.name}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold shrink-0">
                {t.zeroBanner}
              </span>
            </div>

            {/* 3D WebGL Canvas */}
            <div className="relative my-2.5 sm:my-3 rounded-xl overflow-hidden border border-white/15 bg-[#001D33] shadow-inner">
              <ThreeCanvas 
                mode="storefront" 
                merchantId={activeMerchant.id}
                height="280px" 
              />

              {/* Floating Holographic Info Badge on Canvas */}
              <div className="absolute top-2.5 left-2.5 bg-[#002B49]/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/20 text-xs shadow-lg pointer-events-none">
                <span className="text-[8.5px] sm:text-[9px] font-bold text-[#00A3E0] uppercase tracking-wider block">
                  {t.floatingBadge}
                </span>
                <p className="text-[11px] sm:text-xs font-bold text-white mt-0.5 truncate">{activeMerchant.name}</p>
              </div>

              {/* Canvas Bottom Instruction */}
              <div className="absolute bottom-2 right-2 text-[9px] sm:text-[10px] text-stone-400 pointer-events-none bg-black/40 px-2 py-0.5 rounded">
                {t.dragInstruction}
              </div>
            </div>

            {/* Viewport Bottom Strip */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-1 pt-1 text-xs text-stone-300">
              <span className="text-[10px] sm:text-[11px] flex items-center gap-1 truncate">
                <MapPin size={12} className="text-[#00A3E0] shrink-0" />
                <span>{activeMerchant.address}</span>
              </span>
              <button
                onClick={onOpenAR}
                className="w-full sm:w-auto justify-center bg-gradient-to-r from-[#E31837] via-[#9B1348] to-[#1D4ED8] hover:opacity-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-98"
              >
                <Smartphone size={13} />
                <span>{t.btnOpenMobileAR}</span>
              </button>
            </div>

          </div>

          {/* KOTAK 2 (KANAN): KETERANGAN & PILIHAN WARUNG */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-stone-200 flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              
              {/* Selector Pills */}
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                  {t.selectMerchantTitle}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {MERCHANTS.map((m) => {
                    const isSelected = activeMerchant.id === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setActiveMerchant(m)}
                        className={`p-2.5 rounded-xl text-left transition-all border flex items-center justify-between gap-2 text-xs ${
                          isSelected
                            ? 'bg-[#002B49] text-white border-[#002B49] shadow-sm ring-2 ring-[#00A3E0]/40'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold truncate">{m.name}</p>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                            {m.address}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          isSelected ? 'bg-[#E31837] text-white' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {isSelected ? (lang === 'id' ? 'Aktif' : 'Active') : (lang === 'id' ? 'Pilih' : 'Select')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keterangan */}
              <div className="p-3.5 bg-[#FAF9F7] rounded-xl border border-stone-200 space-y-2 text-xs text-stone-700">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500 font-medium">{t.hostTitle}</span>
                  <span className="font-bold text-[#002B49]">{activeMerchant.host}</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500 font-medium">{t.signatureMenuTitle}</span>
                  <span className="font-bold text-[#002B49]">{activeMerchant.signatureMenu.join(', ')}</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
                  {lang === 'id'
                    ? 'Wisatawan yang melintasi pekarangan langsung melihat plang 3D melayang lewat kamera tanpa perlu ada spanduk fisik yang merusak batu bata gerbang adat.'
                    : 'Visitors passing through the courtyard see floating 3D holographic signboards through AR cameras without physical banners damaging traditional brick gateways.'}
                </p>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-[10px] text-stone-400">{lang === 'id' ? 'Spanduk Fisik' : 'Physical Banner'}</p>
                  <p className="font-extrabold text-emerald-600 text-xs mt-0.5">0% ({lang === 'id' ? 'Bebas' : 'Zero'})</p>
                </div>
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-[10px] text-stone-400">{lang === 'id' ? 'Jarak AR' : 'AR Distance'}</p>
                  <p className="font-extrabold text-[#0054A6] text-xs mt-0.5">15 Meter</p>
                </div>
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-[10px] text-stone-400">{lang === 'id' ? 'Biaya Cetak' : 'Print Cost'}</p>
                  <p className="font-extrabold text-[#002B49] text-xs mt-0.5">Rp 0</p>
                </div>
              </div>

            </div>

            {/* QRIS Action Trigger */}
            <div className="pt-2">
              <button
                onClick={() => onOpenQRIS(CULINARY_ITEMS[0])}
                className="w-full bg-gradient-to-r from-[#002B49] via-[#0054A6] to-[#E31837] hover:opacity-95 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md active:scale-98"
              >
                <QrCode size={14} />
                <span>{lang === 'id' ? 'Simulasikan Pembayaran QRIS' : 'Simulate QRIS Payment'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
