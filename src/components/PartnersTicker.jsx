import React from 'react';
import { PROJECT_INFO } from '../data/mockData';
import { Building2, Globe, Award, ShieldCheck } from 'lucide-react';

export default function PartnersTicker({ lang }) {
  return (
    <section className="bg-white border-y border-stone-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0054A6] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-2">
            <Globe size={13} />
            <span>Pengabdian & Riset Akademik</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#002B49] tracking-tight">
            Informatics UPN Veteran Jawa Timur
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Fakultas Ilmu Komputer • Program Pengabdian kepada Masyarakat & Penguatan Branding Pariwisata Berkelanjutan
          </p>
        </div>

        {/* Coordinator Card */}
        <div className="max-w-xl mx-auto">
          {PROJECT_INFO.coordinators.map((coord, idx) => (
            <div 
              key={idx}
              className="bg-stone-50 hover:bg-white p-6 rounded-2xl border border-stone-200 hover:border-[#0054A6] shadow-sm hover:shadow-md transition-all group text-center"
            >
              <div className="inline-flex items-center gap-2 mb-2 bg-[#002B49] text-white text-xs font-bold px-3 py-1 rounded-full">
                <Building2 size={14} className="text-[#00A3E0]" />
                <span>{coord.institution}</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#002B49] group-hover:text-[#0054A6] transition-colors mt-2">
                {coord.name}
              </h3>
              <p className="text-xs font-bold text-[#E31837] mt-1">{coord.role} / Ketua Tim Pengabdian</p>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Pengembangan ekosistem teknologi WebAR, 3D Spatial Simulator, dan Digitalisasi UMKM Desa Wisata Penglipuran, Bangli, Bali.
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
