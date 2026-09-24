import React from 'react';
import { translations } from '../utils/translations';
import { MapPin, ShieldCheck } from 'lucide-react';

export default function Footer({ lang = 'id' }) {
  const t = translations[lang]?.footer || translations.id.footer;

  return (
    <footer className="bg-[#002B49] text-white relative">
      {/* Signature BANGJO Top Gradient Accent Line */}
      <div className="h-1 bg-gradient-to-r from-[#E31837] via-[#85164B] to-[#1D4ED8] w-full"></div>
      
      <div className="pt-12 pb-8 sm:pt-16 sm:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Col 1: Branding & Governance */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img 
                src="/logo-upnvjt.png" 
                alt="Logo UPN Veteran Jawa Timur" 
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 bg-white/10 p-0.5 rounded"
              />
              <span className="font-extrabold text-sm sm:text-base tracking-tight">BANGJO AR</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              {t.desc}
            </p>

            <div className="pt-1 text-xs text-stone-400 space-y-1.5">
              <p className="flex items-center gap-1.5 text-stone-300">
                <MapPin size={13} className="text-[#E31837] shrink-0" />
                <span>{t.location}</span>
              </p>
              <p className="flex items-center gap-1.5 text-[#00A3E0]">
                <ShieldCheck size={13} className="shrink-0" />
                <span>{t.programBadge}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Academic Institution */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-3">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#00A3E0]">
              {t.devTitle}
            </h4>
            <div className="text-xs text-stone-300 space-y-1 sm:space-y-1.5">
              <p className="font-bold text-white text-sm tracking-tight leading-snug">
                {t.university}
              </p>
              <p className="text-stone-300 font-medium">{t.faculty}</p>
              <p className="text-stone-400">{t.city}</p>
            </div>
          </div>

          {/* Col 3: Ecosystem Navigation */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-3">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#00A3E0]">
              {t.moduleTitle}
            </h4>
            <ul className="text-xs text-stone-300 space-y-1.5 sm:space-y-2">
              <li><a href="#festival" className="hover:text-white transition-colors">{t.modFest}</a></li>
              <li><a href="#culinary" className="hover:text-white transition-colors">{t.modCulin}</a></li>
              <li><a href="#storefront" className="hover:text-white transition-colors">{t.modStore}</a></li>
              <li><a href="#advisor" className="hover:text-white transition-colors">{t.modAdv}</a></li>
            </ul>
          </div>

          {/* Col 4: Local Governance & Ethics */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-3">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#00A3E0]">
              {t.ethicsTitle}
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              {t.ethicsDesc}
            </p>
            <div className="p-2 sm:p-2.5 bg-white/5 rounded border border-white/10 text-[10px] text-stone-300">
              <em>"Heritage Through Technology • Interactive, Educational, Sustainable"</em>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-stone-400 text-center sm:text-left">
          <p>© 2026 BANGJO AR • Informatics UPN Veteran Jawa Timur. {t.rights}</p>
          <p className="text-[10px] sm:text-[11px] text-stone-400">
            {t.location}
          </p>
        </div>

      </div>
    </footer>
  );
}
