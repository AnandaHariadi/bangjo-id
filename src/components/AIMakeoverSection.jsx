import React, { useState } from 'react';
import ThreeCanvas from './ThreeCanvas';
import { translations } from '../utils/translations';

export default function AIMakeoverSection({ lang = 'id' }) {
  const t = (translations[lang] || translations.id).advisor;
  const [makeoverState, setMakeoverState] = useState('after'); // 'before' | 'after'

  return (
    <section id="advisor" className="relative py-16 md:py-24 bg-[#FAF9F7] bangjo-mesh-section-alt border-t border-stone-200 overflow-hidden">
      {/* Subtle Ambient Glowing Orbs */}
      <div className="absolute top-1/4 -right-32 w-80 h-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -left-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bangjo-badge-gradient text-[#002B49] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span>{t.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B49] tracking-tight">
            {t.heading}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t.sub}
          </p>
        </div>

        {/* SINGLE FOCUSED 3D STUDIO BOX WITH 3D DEPTH & BEVEL CHASSIS */}
        <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-gradient-to-b from-[#003B64] via-[#002B49] to-[#001526] border-t-2 border-t-[#00A3E0]/80 border-x border-x-white/15 border-b-[5px] sm:border-b-[6px] border-b-[#000E1A] shadow-[0_30px_70px_-15px_rgba(0,43,73,0.85),0_12px_30px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.25)] ring-1 ring-white/10 space-y-4 sm:space-y-5 text-white">
          
          {/* Box Top Header: Title & Switcher Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/15">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A3E0] shadow-[0_0_8px_#00A3E0] animate-pulse shrink-0"></span>
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                  {makeoverState === 'after' ? t.afterTitle : t.beforeTitle}
                </h3>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-300 mt-0.5">
                {makeoverState === 'after' ? t.afterDesc : t.beforeDesc}
              </p>
            </div>

            {/* Toggle Switcher Buttons */}
            <div className="inline-flex p-1 bg-black/40 rounded-xl border border-white/15 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] shrink-0 self-stretch sm:self-auto justify-center">
              <button
                onClick={() => setMakeoverState('before')}
                className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  makeoverState === 'before'
                    ? 'bg-gradient-to-b from-stone-700 to-stone-900 text-white shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] border border-stone-600'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {t.btnBefore}
              </button>
              <button
                onClick={() => setMakeoverState('after')}
                className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  makeoverState === 'after'
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-[0_2px_8px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] border border-emerald-400/50 ring-1 ring-emerald-400/40'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {t.btnAfter}
              </button>
            </div>
          </div>

          {/* 3D WebGL Canvas Viewport */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 border-black/60 bg-[#00101E] shadow-[inset_0_6px_20px_rgba(0,0,0,0.85),0_6px_16px_rgba(0,0,0,0.4)]">
            <ThreeCanvas 
              mode="makeover" 
              makeoverState={makeoverState}
              height="300px" 
            />

            {/* Top-Right Badge on Canvas */}
            <div className="absolute top-2.5 right-2.5 pointer-events-none">
              <span className={`text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-md shadow-md border ${
                makeoverState === 'after' 
                  ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                  : 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              }`}>
                {makeoverState === 'after' ? t.badgeStandard : t.badgeNeedWork}
              </span>
            </div>

            {/* Canvas Bottom Instruction */}
            <div className="absolute bottom-2.5 right-2.5 text-[9px] sm:text-[10px] text-stone-300 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md pointer-events-none border border-white/15 shadow-md">
              {t.instruction}
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-1 text-xs">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] bg-gradient-to-b from-white/15 to-white/5 text-stone-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/15 font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.3)]">
                {t.pill1}
              </span>
              <span className="text-[10px] sm:text-[11px] bg-gradient-to-b from-white/15 to-white/5 text-stone-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/15 font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.3)]">
                {t.pill2}
              </span>
              <span className="text-[10px] sm:text-[11px] bg-gradient-to-b from-white/15 to-white/5 text-stone-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/15 font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.3)]">
                {t.pill3}
              </span>
            </div>

            <span className="text-[10px] sm:text-[11px] text-emerald-300 font-semibold tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {lang === 'id' ? 'Ekonomi Sirkular Pengrajin Lokal' : 'Circular Economy for Local Artisans'}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
