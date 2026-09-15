import React, { useState } from 'react';
import { Award, ShieldCheck, Camera, CheckCircle2, Bookmark, Globe, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DigitalPassportSection({ onOpenAR, lang }) {
  const [stamps, setStamps] = useState([
    { id: 1, title: 'Penjelajah Festival AR', code: 'PASSPORT-FEST-01', date: '16 Sep 2026', unlocked: true },
    { id: 2, title: 'Cita Rasa Lawar Kuwir', code: 'PASSPORT-CUL-02', date: '16 Sep 2026', unlocked: true },
    { id: 3, title: 'Pecinta Herbal Loloh', code: 'PASSPORT-HERB-03', date: '16 Sep 2026', unlocked: true },
    { id: 4, title: 'Duta Budaya Penglipuran', code: 'PASSPORT-ADV-04', date: 'Terkunci', unlocked: false },
  ]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <section id="passport" className="py-16 md:py-24 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Award size={13} />
            <span>Paspor Digital & Laporan Dampak</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B49] tracking-tight">
            Transparansi Dampak & Sertifikasi Kunjungan
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl mx-auto">
            Sistem pengumpulan bukti partisipasi budaya dan pelaporan langsung kontribusi ekonomi ke kas warga desa.
          </p>
        </div>

        {/* Passport Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Digital Credential Collector */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-[#002B49]">
                  Paspor Kunjungan Budaya Digital
                </h3>
                <p className="text-[11px] text-stone-500">Sertifikasi Wisatawan Berkelanjutan 2026</p>
              </div>
              <button
                onClick={triggerConfetti}
                className="bg-stone-100 hover:bg-stone-200 text-[#002B49] text-xs font-bold px-3 py-1.5 rounded transition-all"
              >
                Validasi
              </button>
            </div>

            {/* Stamps Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stamps.map((stamp) => (
                <div
                  key={stamp.id}
                  className={`p-3.5 rounded border text-left transition-all ${
                    stamp.unlocked
                      ? 'bg-stone-50 border-[#0054A6]/40'
                      : 'bg-stone-50/50 border-dashed border-stone-300 opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-mono text-stone-400 block">{stamp.code}</span>
                  <h4 className="text-xs font-bold text-[#002B49] mt-0.5">{stamp.title}</h4>
                  <span className={`text-[10px] font-semibold mt-1 inline-block px-1.5 py-0.2 rounded ${
                    stamp.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {stamp.date}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>Kelengkapan Sertifikasi: 75%</span>
                <span className="text-[#E31837]">3 / 4 Lencana</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#E31837] rounded-full w-3/4"></div>
              </div>
            </div>

            <button
              onClick={onOpenAR}
              className="w-full bg-[#002B49] hover:bg-[#E31837] text-white font-bold py-3 px-4 rounded transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Camera size={15} />
              <span>Aktivasi Filter Dokumentasi AR</span>
            </button>
          </div>

          {/* Right Column: Sustainability Impact Metrics */}
          <div className="lg:col-span-6 bg-[#002B49] text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
            <div>
              <span className="bg-white/10 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                Sustainability Dashboard
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-2 tracking-tight">
                Laporan Kontribusi Terhadap Komunitas Lokal
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Penyaluran manfaat ekonomi dan lingkungan secara transparan untuk Desa Penglipuran
              </p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/10 p-3.5 rounded border border-white/10">
                <p className="text-xl font-black text-white">100%</p>
                <p className="text-xs font-bold mt-0.5">Kas Langsung Warga</p>
                <p className="text-[10px] text-stone-300">Tanpa potongan perantara</p>
              </div>

              <div className="bg-white/10 p-3.5 rounded border border-white/10">
                <p className="text-xl font-black text-emerald-300">0 kg</p>
                <p className="text-xs font-bold mt-0.5">Sampah Plastik</p>
                <p className="text-[10px] text-stone-300">Wadah daun & bambu</p>
              </div>

              <div className="bg-white/10 p-3.5 rounded border border-white/10">
                <p className="text-xl font-black text-amber-300">1%</p>
                <p className="text-xs font-bold mt-0.5">Dana Kas Adat Pura</p>
                <p className="text-[10px] text-stone-300">Pemeliharaan pura desa</p>
              </div>
            </div>

            {/* SDG Alignment */}
            <div className="pt-2 border-t border-white/15 space-y-2">
              <p className="text-xs font-bold text-stone-200">Selaras dengan Target PBB (UN SDGs):</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  SDG 8: Pertumbuhan Ekonomi Lokal
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  SDG 11: Kota & Komunitas Berkelanjutan
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  SDG 12: Konsumsi Bertanggung Jawab
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
