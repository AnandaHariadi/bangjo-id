import React, { useState } from 'react';
import { 
  Camera, Search, MapPin, Compass, ShieldCheck, Calendar, ArrowRight, 
  ChevronRight, CheckCircle2, QrCode, Globe, Building2, BookOpen, Layers,
  Store, Award, Navigation, Sparkles, Utensils, Smartphone, Wand2
} from 'lucide-react';
import ThreeCanvas from './ThreeCanvas';
import { CULINARY_ITEMS } from '../data/mockData';
import { translations } from '../utils/translations';

export default function HeroSection({ onOpenAR, onSelectDish, onOpenQRIS, lang = 'id' }) {
  const t = (translations[lang] || translations.id).hero;
  const [selectedCategory, setSelectedCategory] = useState(t.categories[0]);

  return (
    <section id="hero" className="bg-white">
      
      {/* 1. CORPORATE EDITORIAL HERO BANNER */}
      <div className="relative bg-[#FAF9F7] bangjo-mesh-hero border-b border-stone-200 overflow-hidden">
        
        {/* Subtle Ambient Glowing Orbs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-14 lg:pb-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Clear Strategic Copy */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Official Academic Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-stone-100/95 border border-stone-300/80 px-2.5 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-stone-800 shadow-xs max-w-full overflow-hidden flex-nowrap">
                <img 
                  src="/logo-upnvjt.png" 
                  alt="UPN Veteran Jawa Timur" 
                  className="w-4 h-4 object-contain shrink-0" 
                />
                <span className="font-bold tracking-tight text-[#002B49] whitespace-nowrap shrink-0">BANGJO AR</span>
                <span className="text-stone-300 shrink-0">|</span>
                <span className="text-stone-600 text-[9px] sm:text-[11px] whitespace-nowrap truncate shrink min-w-0">
                  {t.academicBadge}
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <div className="relative inline-flex flex-col items-start w-fit max-w-full">
                  <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] font-black tracking-tighter leading-none select-none">
                    <span className="text-[#E31837]">BANG</span><span className="text-[#002B49]">JO</span>
                  </h1>
                  {/* Dynamic Curved Swoosh Underline - Perfectly Proportional to Text */}
                  <div className="w-full px-0.5 -mt-1 sm:-mt-2">
                    <svg 
                      className="w-full h-2.5 sm:h-4 md:h-6 overflow-visible" 
                      viewBox="0 0 200 14" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M 2 8 C 45 14, 125 14, 198 4" 
                        stroke="url(#bangjo_grad)" 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                      />
                      <defs>
                        <linearGradient id="bangjo_grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#E31837" />
                          <stop offset="55%" stopColor="#E31837" />
                          <stop offset="78%" stopColor="#00A3E0" />
                          <stop offset="100%" stopColor="#002B49" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed max-w-xl">
                {t.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                <button
                  onClick={onOpenAR}
                  className="bg-gradient-to-r from-[#E31837] via-[#9B1348] to-[#1D4ED8] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 tracking-wide uppercase active:scale-98"
                >
                  <Camera size={16} />
                  <span>{t.btnLaunchAR}</span>
                </button>

                <a
                  href="#culinary"
                  className="bg-white hover:bg-stone-50 text-[#002B49] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-stone-300 shadow-2xs transition-all flex items-center justify-center text-center"
                >
                  <span>{t.btnCulinary}</span>
                </a>
              </div>

              {/* Key Indicators Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-stone-200">
                <div className="space-y-0.5">
                  <p className="text-base sm:text-xl font-extrabold text-[#002B49]">100%</p>
                  <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight">{t.statEmission}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-base sm:text-xl font-extrabold text-[#E31837]">{t.statBeaconsVal}</p>
                  <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight">{t.statBeacons}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-base sm:text-xl font-extrabold text-[#0054A6]">QRIS</p>
                  <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight">{t.statQRIS}</p>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Interactive World Portal (BANGJO Mesh Gradient Chassis) */}
            <div className="lg:col-span-5 xl:col-span-5 relative mt-4 lg:mt-0 w-full max-w-full overflow-hidden">
              <div className="relative bangjo-card-gradient rounded-3xl p-2.5 sm:p-3 border border-white/25 shadow-[0_24px_55px_-10px_rgba(227,24,55,0.35),0_12px_28px_rgba(0,43,73,0.3)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group">
                
                {/* Subtle Ambient Glowing Orbs */}
                <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-red-400/35 blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blue-400/35 blur-2xl pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-3xl"></div>

                {/* 3D Header Bar */}
                <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-black/40 backdrop-blur-md rounded-t-2xl text-white text-xs border-b border-white/15 relative z-10 gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399] shrink-0"></span>
                    <span className="font-mono text-[9.5px] sm:text-[11px] font-extrabold tracking-wider text-white truncate">
                      {t.spatialTitle}
                    </span>
                  </div>
                  <span className="text-[8.5px] sm:text-[10px] bg-white/20 text-white border border-white/30 px-2 sm:px-2.5 py-0.5 rounded-md font-bold shadow-xs whitespace-nowrap shrink-0">
                    {t.spatialBadge}
                  </span>
                </div>

                {/* 3D WebGL Canvas (Responsive Viewport) */}
                <div className="relative rounded-none overflow-hidden border-x border-black/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] w-full">
                  <ThreeCanvas mode="pokemon_go" height="280px" />
                </div>

                {/* Action Bar below 3D with Crisp White Action Button */}
                <div className="p-2.5 sm:p-3 bg-black/40 backdrop-blur-md text-white flex items-center justify-between gap-2 text-xs rounded-b-2xl border-t border-white/15 relative z-10">
                  <div className="flex items-center gap-1.5 text-stone-200 text-[10px] sm:text-[11px] min-w-0 flex-1 overflow-hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className="truncate">{t.spatialSub}</span>
                  </div>
                  <button
                    onClick={onOpenAR}
                    className="bg-white hover:bg-stone-100 text-[#E31837] font-black text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap"
                  >
                    <Camera size={13} className="shrink-0 text-[#E31837]" />
                    <span className="whitespace-nowrap">{t.btnFullscreenAR}</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* 2. DOCKED CONSOLE */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 p-3.5 sm:p-4">
            
            {/* Category Tabs */}
            <div className="flex gap-2 border-b border-stone-100 pb-3 mb-3 overflow-x-auto scrollbar-none">
              {t.categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#002B49] text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Filter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 items-center">
              
              <div className="px-3 py-2 bg-stone-50 rounded border border-stone-200 text-xs">
                <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">{t.filterZoneLabel}</p>
                <p className="font-bold text-stone-800">{t.filterZoneVal}</p>
              </div>

              <div className="px-3 py-2 bg-stone-50 rounded border border-stone-200 text-xs">
                <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">{t.filterStatusLabel}</p>
                <p className="font-bold text-stone-800">{t.filterStatusVal}</p>
              </div>

              <div className="px-3 py-2 bg-stone-50 rounded border border-stone-200 text-xs">
                <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">{t.filterIntegrationLabel}</p>
                <p className="font-bold text-stone-800">{t.filterIntegrationVal}</p>
              </div>

              <button
                onClick={onOpenAR}
                className="w-full bg-gradient-to-r from-[#E31837] via-[#9B1348] to-[#1D4ED8] hover:opacity-95 text-white font-bold text-xs py-3 rounded shadow-xs transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-98"
              >
                <Search size={14} />
                <span>{t.btnStartExplore}</span>
              </button>

            </div>

          </div>
        </div>

      </div>

      {/* 3. FOUR CORE MODULES */}
      <div className="relative bg-[#FAF9F7] bangjo-mesh-section border-t border-stone-200 overflow-hidden py-16 sm:py-20">
        {/* Subtle Ambient Glowing Orbs */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -right-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E31837] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            {t.moduleTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B49] tracking-tight mt-2">
            {t.moduleHeading}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t.moduleSub}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 01: MODUL RITUAL */}
          <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[#E31837] border-x border-b border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_35px_-10px_rgba(227,24,55,0.12),0_1px_3px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:border-red-200 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] font-bold text-[#E31837] tracking-wider px-2.5 py-1 bg-red-50/80 rounded-lg border border-red-100 inline-block">
                  {t.mod1Tag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#002B49] group-hover:text-[#E31837] transition-colors leading-snug">
                  {t.mod1Title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal mt-2">
                  {t.mod1Desc}
                </p>
              </div>
            </div>

            <a 
              href="#festival" 
              className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#002B49] group-hover:text-[#E31837] transition-colors group/link"
            >
              <span>{t.mod1Btn}</span>
              <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform text-stone-400 group-hover:text-[#E31837]" />
            </a>
          </div>

          {/* 02: GASTRO-TOURISM */}
          <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[#9B1348] border-x border-b border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_35px_-10px_rgba(0,84,166,0.12),0_1px_3px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] font-bold text-[#0054A6] tracking-wider px-2.5 py-1 bg-blue-50/80 rounded-lg border border-blue-100 inline-block">
                  {t.mod2Tag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#002B49] group-hover:text-[#0054A6] transition-colors leading-snug">
                  {t.mod2Title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal mt-2">
                  {t.mod2Desc}
                </p>
              </div>
            </div>

            <a 
              href="#culinary" 
              className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#002B49] group-hover:text-[#0054A6] transition-colors group/link"
            >
              <span>{t.mod2Btn}</span>
              <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform text-stone-400 group-hover:text-[#0054A6]" />
            </a>
          </div>

          {/* 03: STOREFRONT AR */}
          <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[#0054A6] border-x border-b border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_35px_-10px_rgba(16,185,129,0.12),0_1px_3px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] font-bold text-emerald-700 tracking-wider px-2.5 py-1 bg-emerald-50/80 rounded-lg border border-emerald-100 inline-block">
                  {t.mod3Tag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#002B49] group-hover:text-emerald-700 transition-colors leading-snug">
                  {t.mod3Title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal mt-2">
                  {t.mod3Desc}
                </p>
              </div>
            </div>

            <a 
              href="#storefront" 
              className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#002B49] group-hover:text-emerald-700 transition-colors group/link"
            >
              <span>{t.mod3Btn}</span>
              <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform text-stone-400 group-hover:text-emerald-700" />
            </a>
          </div>

          {/* 04: SPATIAL ADVISOR */}
          <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[#1D4ED8] border-x border-b border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_35px_-10px_rgba(245,158,11,0.12),0_1px_3px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:border-amber-200 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] font-bold text-amber-700 tracking-wider px-2.5 py-1 bg-amber-50/80 rounded-lg border border-amber-100 inline-block">
                  {t.mod4Tag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#002B49] group-hover:text-amber-700 transition-colors leading-snug">
                  {t.mod4Title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal mt-2">
                  {t.mod4Desc}
                </p>
              </div>
            </div>

            <a 
              href="#advisor" 
              className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#002B49] group-hover:text-amber-700 transition-colors group/link"
            >
              <span>{t.mod4Btn}</span>
              <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform text-stone-400 group-hover:text-amber-700" />
            </a>
          </div>

        </div>

      </div>
    </div>

      {/* 4. FEATURED CULINARY LISTINGS */}
      <div className="relative bg-[#FAF9F7] bangjo-mesh-section-alt border-t border-stone-200 overflow-hidden py-16 sm:py-24">
        {/* Subtle Ambient Glowing Orbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -left-24 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0054A6] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                {t.featuredTag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B49] tracking-tight mt-2">
                {t.featuredHeading}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {t.featuredSub}
              </p>
            </div>

            <a
              href="#culinary"
              className="text-xs font-bold text-[#E31837] hover:underline flex items-center gap-1"
            >
              <span>{t.viewAllMenu}</span>
              <ChevronRight size={16} />
            </a>
          </div>

          {/* 3-Column Listing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {CULINARY_ITEMS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl bg-white border border-stone-200/90 shadow-[0_14px_30px_-8px_rgba(0,43,73,0.18),0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_26px_50px_-10px_rgba(0,43,73,0.3),0_12px_24px_rgba(0,0,0,0.1)] hover:-translate-y-2.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card 3D Visual Header */}
                  <div className="h-44 bg-gradient-to-b from-[#003B64] via-[#002B49] to-[#00172A] p-5 flex flex-col justify-between relative text-white border-b-2 border-b-black/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25)]">
                    {/* Top Status & Rating */}
                    <div className="flex justify-between items-start z-10">
                      <span className="bg-gradient-to-r from-[#E31837] to-[#B30E26] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs border border-white/20">
                        {item.origin}
                      </span>
                      <span className="bg-black/40 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/15 shadow-inner">
                        ★ {item.rating}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="z-10">
                      <p className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-stone-300 font-medium mt-0.5">
                        {item.spiceLevel}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3.5">
                    <h3 className="text-base font-extrabold text-[#002B49] group-hover:text-[#E31837] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Inset Merchant Box */}
                    <div className="p-3 bg-gradient-to-b from-stone-50 to-stone-100/80 rounded-xl border border-stone-200/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] text-xs">
                      <span className="text-stone-400 block text-[10px] font-semibold uppercase tracking-wider">{t.registeredMerchant}</span>
                      <span className="font-bold text-[#002B49] mt-0.5 block">{item.merchantName}</span>
                    </div>

                    {/* Spices tags */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {item.spices.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[10px] bg-white text-stone-700 px-2.5 py-1 rounded-md border border-stone-200/80 font-medium shadow-2xs">
                          {s}
                        </span>
                      ))}
                      <span className="text-[10px] bg-stone-100 text-stone-500 px-2.5 py-1 rounded-md border border-stone-200/50">
                        +{item.spices.length - 3} {t.otherSpices}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-gradient-to-b from-stone-50 to-stone-100/90 border-t border-stone-200 flex items-center justify-between gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <button
                    onClick={onOpenAR}
                    className="px-3.5 py-2 rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-bold shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-0.5 flex items-center gap-1.5 transition-all"
                  >
                    <Camera size={13} className="text-[#0054A6]" />
                    <span>{t.btn3dModel}</span>
                  </button>

                  <button
                    onClick={() => onOpenQRIS(item)}
                    className="bg-gradient-to-b from-[#E31837] to-[#B30E26] hover:from-[#B30E26] hover:to-[#8E091C] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-[0_3px_8px_rgba(227,24,55,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] active:translate-y-0.5 flex items-center gap-1.5 transition-all"
                  >
                    <QrCode size={13} />
                    <span>{t.btnOrderQris}</span>
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
