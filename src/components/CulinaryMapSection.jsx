import React, { useState } from 'react';
import { CULINARY_ITEMS, MERCHANTS } from '../data/mockData';
import { Utensils, MapPin, Layers, ChevronRight, ArrowRight, QrCode, Compass, ShieldCheck, Star } from 'lucide-react';
import ThreeCanvas from './ThreeCanvas';
import { translations } from '../utils/translations';

export default function CulinaryMapSection({ onSelectMerchant, onSelectDish, onOpenQRIS, lang = 'id' }) {
  const t = (translations[lang] || translations.id).culinary;
  const [selectedDish, setSelectedDish] = useState(CULINARY_ITEMS[0]);
  const [isExploded, setIsExploded] = useState(false);

  return (
    <section id="culinary" className="relative py-16 md:py-24 bg-[#FAF9F7] bangjo-mesh-section-alt border-t border-stone-200 overflow-hidden">
      {/* Subtle Ambient Glowing Orbs */}
      <div className="absolute top-1/4 -right-32 w-80 h-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -left-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bangjo-badge-gradient text-[#002B49] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0054A6]"></span>
            <span>{t.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B49] tracking-tight">
            {t.heading}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl mx-auto">
            {t.sub}
          </p>
        </div>

        {/* 3D Food Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-12 sm:mb-16 bg-white p-4 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          
          {/* Left Column: Centered 3D Canvas Box */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            
            <div className="bg-[#002B49] rounded-xl p-2 sm:p-2.5 shadow-lg border border-stone-800 relative overflow-hidden">
              
              {/* Top Viewport Bar */}
              <div className="flex justify-between items-center px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#001D33] rounded-t text-white text-xs border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A3E0] animate-pulse"></span>
                  <span className="font-semibold text-[10px] sm:text-[11px] tracking-wide truncate max-w-[200px] sm:max-w-none">{t.modelTitle}{selectedDish.name}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] bg-white/10 text-stone-200 font-mono px-2 py-0.5 rounded shrink-0">
                  {t.scale1to1}
                </span>
              </div>

              {/* Three.js 3D Food Canvas */}
              <ThreeCanvas 
                mode="food" 
                dishId={selectedDish.id} 
                isExploded={isExploded} 
                height="280px" 
              />

              {/* Controls Bar */}
              <div className="p-2.5 sm:p-3 bg-[#001D33] flex items-center justify-between gap-2 sm:gap-3 text-white text-xs border-t border-white/10">
                <span className="text-[10px] sm:text-[11px] text-stone-300 truncate">
                  {isExploded ? t.msgExploded : t.msgRotated}
                </span>
                <button
                  onClick={() => setIsExploded(!isExploded)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                    isExploded
                      ? 'bg-[#E31837] text-white'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                >
                  <Layers size={13} />
                  <span>{isExploded ? t.btnAssemble : t.btnExplode}</span>
                </button>
              </div>
            </div>

            {/* Quick Dish Switcher Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CULINARY_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedDish(item);
                    setIsExploded(false);
                  }}
                  className={`p-2.5 rounded text-left transition-all border ${
                    selectedDish.id === item.id
                      ? 'bg-[#002B49] text-white border-[#002B49] shadow-md scale-102'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  <p className="font-bold text-xs line-clamp-1">{item.name}</p>
                  <p className={`text-[10px] mt-0.5 font-semibold ${selectedDish.id === item.id ? 'text-[#00A3E0]' : 'text-[#E31837]'}`}>
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Dish Narrative & Spices */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#E31837] uppercase tracking-wider">
                  {selectedDish.origin}
                </span>
                <h3 className="text-xl font-bold text-[#002B49] mt-0.5">
                  {selectedDish.name}
                </h3>
              </div>
              <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded">
                {t.rating} {selectedDish.rating} / 5.0
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {selectedDish.description}
            </p>

            {/* Cultural Philosophy */}
            <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs text-stone-700 space-y-1">
              <span className="font-bold text-[#002B49] block">{t.philosophyLabel}</span>
              <p className="italic text-stone-600">"{selectedDish.philosophy}"</p>
            </div>

            {/* Spices Breakdown */}
            <div>
              <p className="text-xs font-bold text-[#002B49] mb-1.5">
                {t.spicesLabel}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedDish.spices.map((spice, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-stone-100 px-2.5 py-1 rounded border border-stone-200 text-stone-700"
                  >
                    {spice}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Order Button */}
            <div className="p-3.5 bg-stone-50 rounded border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3">
              <div>
                <span className="text-[10px] text-stone-500 block">{t.registeredMerchantLabel}</span>
                <span className="text-xs font-bold text-[#002B49]">{selectedDish.merchantName}</span>
              </div>

              <button
                onClick={() => onOpenQRIS(selectedDish)}
                className="bg-gradient-to-r from-[#E31837] via-[#9B1348] to-[#1D4ED8] hover:opacity-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-98"
              >
                <span>{t.btnQrisOrder}</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>

        </div>

        {/* Merchants Directory */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-lg font-bold text-[#002B49]">
                {lang === 'id' ? 'Direktori Mitra UMKM Terverifikasi Desa Penglipuran' : 'Verified MSME Resident Directory of Penglipuran'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'id' ? 'Pekarangan rumah adat terdaftar dalam sistem pengabdian masyarakat' : 'Customary compounds registered in community service program'}
              </p>
            </div>
            
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded border border-emerald-200">
              {lang === 'id' ? '3 Warung Buka Hari Ini' : '3 Merchants Open Today'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MERCHANTS.map((m) => (
              <div
                key={m.id}
                className="bg-white p-5 rounded-xl border border-stone-200 hover:border-[#0054A6] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="bg-stone-100 text-[#002B49] text-[10px] font-bold px-2 py-0.5 rounded">
                      {m.verifiedBadge}
                    </span>
                    <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>{m.rating} ({m.reviewsCount})</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#002B49]">
                    {m.name}
                  </h4>

                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin size={12} className="text-[#E31837] shrink-0" />
                    <span>{m.address}</span>
                  </p>

                  <div className="p-2 bg-stone-50 rounded border border-stone-200 text-xs">
                    <span className="text-stone-400 block text-[10px]">{lang === 'id' ? 'Jarak Lokasi:' : 'Distance:'}</span>
                    <span className="font-bold text-[#0054A6]">{m.distance}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-emerald-700 font-medium">
                    {m.ecoFriendly}
                  </span>
                  <button
                    onClick={() => onSelectMerchant(m)}
                    className="bg-[#002B49] hover:bg-[#E31837] text-white text-xs font-bold px-3 py-1 rounded transition-colors flex items-center gap-1"
                  >
                    <span>{lang === 'id' ? 'Detail' : 'Details'}</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
