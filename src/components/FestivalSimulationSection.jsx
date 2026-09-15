import React, { useState, useEffect } from 'react';
import { FESTIVALS } from '../data/mockData';
import { Volume2, VolumeX, Camera, Info, ArrowRight, CheckCircle2, BookOpen, Layers, Sparkles, Music, Eye } from 'lucide-react';
import ThreeCanvas from './ThreeCanvas';
import { gamelanAudio } from '../utils/audioSynth';
import { translations } from '../utils/translations';

export default function FestivalSimulationSection({ onOpenAR, onSelectDish, lang = 'id' }) {
  const t = (translations[lang] || translations.id).festival;
  const [selectedFestival, setSelectedFestival] = useState(FESTIVALS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(-1);

  useEffect(() => {
    const unsubscribe = gamelanAudio.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying);
    });
    return unsubscribe;
  }, []);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      gamelanAudio.stop();
    } else {
      const mode = selectedFestival.id === 'piodalan' ? 'balaganjur' : 'pendet';
      gamelanAudio.startMode(mode);
    }
  };

  return (
    <section id="festival" className="py-16 md:py-24 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-red-50 text-[#E31837] border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <span>{t.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B49] tracking-tight">
            {t.heading}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl mx-auto">
            {t.sub}
          </p>
        </div>

        {/* Festival Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-6 sm:mb-8">
          {FESTIVALS.map((fest) => (
            <button
              key={fest.id}
              onClick={() => {
                setSelectedFestival(fest);
                setActiveHotspot(-1);
              }}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
                selectedFestival.id === fest.id
                  ? 'bg-[#002B49] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{fest.name}</span>
              <span className="text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-white/20 text-white font-medium">
                {fest.category}
              </span>
            </button>
          ))}
        </div>

        {/* Main Showcase Grid */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Real Interactive 3D WebGL Viewport */}
          <div className="lg:col-span-7 bg-[#002B49] p-3.5 sm:p-6 flex flex-col justify-between relative min-h-[360px] sm:min-h-[420px]">
            
            {/* Viewport Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 z-10 px-1 sm:px-2 py-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A3E0] animate-pulse shrink-0"></span>
                <span className="text-xs font-bold text-white tracking-wide">
                  {t.viewportTitle}{selectedFestival.name}
                </span>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setActiveHotspot(-1)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[11px] sm:text-xs font-bold transition-all ${
                    activeHotspot === -1
                      ? 'bg-[#0054A6] text-white border-blue-400 shadow-md ring-1 ring-white/30'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  }`}
                  title="Tampilkan seluruh panggung upacara"
                >
                  <Eye size={12} className={activeHotspot === -1 ? 'text-white' : 'text-[#00A3E0]'} />
                  <span>{t.btnShowAll}</span>
                </button>

                {/* Audio Synthesizer Trigger */}
                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20 text-[11px] sm:text-xs font-bold transition-all"
                >
                  {isPlayingAudio ? <Volume2 size={13} className="text-[#00A3E0]" /> : <VolumeX size={13} />}
                  <span>{isPlayingAudio ? t.audioActive : t.audioPlay}</span>
                </button>
              </div>
            </div>

            {/* The 3D Interactive Stage Canvas */}
            <div className="relative my-2 rounded-xl overflow-hidden border border-white/10 bg-[#001D33]">
              <ThreeCanvas mode="temple" activeHotspot={activeHotspot} height="280px" />
              
              {/* Floating Hotspot Overlay Pins */}
              <div className="absolute bottom-2.5 left-2 right-2 flex flex-wrap gap-1 sm:gap-2 z-10 pointer-events-auto">
                {selectedFestival.hotspots.map((hs, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHotspot(idx)}
                    className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all backdrop-blur-md border flex items-center gap-1 sm:gap-1.5 ${
                      activeHotspot === idx
                        ? 'bg-[#E31837] text-white border-white shadow-lg scale-105 ring-2 ring-white/30'
                        : 'bg-black/60 text-stone-200 hover:bg-black/80 border-white/20'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white/20 text-[9px] sm:text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[120px] sm:max-w-none">{hs.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Viewport Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 z-10 px-1 sm:px-2 text-xs text-stone-300">
              <span className="text-[10px] sm:text-[11px]">
                {t.audioLabel} <strong className="text-white">{selectedFestival.audioTrack}</strong>
              </span>
              <button
                onClick={onOpenAR}
                className="w-full sm:w-auto justify-center bg-[#E31837] hover:bg-[#B30E26] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5"
              >
                <Camera size={14} />
                <span>{t.btnOpenFullAR}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Cultural Details & Hotspot Inspector */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
            
            <div className="space-y-4">
              
              {/* Active Hotspot Inspector Card */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="text-xs font-bold text-[#0054A6] flex items-center gap-1.5">
                  {activeHotspot === -1 ? (
                    <>
                      <Eye size={13} className="text-[#0054A6]" />
                      <span>{t.inspectorOverviewTitle}</span>
                    </>
                  ) : (
                    <span>{t.inspectorElementTitle}{activeHotspot + 1}: {selectedFestival.hotspots[activeHotspot]?.title}</span>
                  )}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeHotspot === -1 
                    ? (t.inspectorOverviewDesc 
                        ? t.inspectorOverviewDesc.replace('{name}', selectedFestival.name)
                        : (lang === 'id' 
                            ? `Menampilkan seluruh komposisi panggung prosesi ${selectedFestival.name} beserta seluruh elemen sakral dan alunan gamelan.`
                            : `Displaying the entire stage composition of ${selectedFestival.name} with all sacred elements and gamelan music.`
                          )
                      )
                    : selectedFestival.hotspots[activeHotspot]?.desc
                  }
                </p>
              </div>

              {/* Ritual Description & Philosophy */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#002B49]">
                  {t.meaningHeading}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedFestival.description}
                </p>
              </div>

              {/* Cultural Essence Box */}
              <div className="p-3.5 bg-[#FAF9F7] rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <span className="font-bold text-[#002B49] block">{t.triHitaKarana}</span>
                <p className="italic text-stone-600 leading-relaxed">
                  "{selectedFestival.philosophy}"
                </p>
              </div>

            </div>

            {/* Cultural-to-Culinary Bridge Card */}
            <div className="pt-4 mt-4 border-t border-stone-100">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">
                    {t.relatedCuisine}
                  </span>
                  <span className="text-xs font-bold text-[#002B49]">
                    {selectedFestival.relatedCuisine}
                  </span>
                </div>
                <a
                  href="#culinary"
                  className="p-2 rounded bg-[#002B49] text-white hover:bg-[#E31837] transition-colors"
                  title={t.btnViewCulinary}
                >
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
