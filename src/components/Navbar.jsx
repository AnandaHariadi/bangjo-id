import React, { useState, useEffect } from 'react';
import { Camera, Globe, Volume2, VolumeX, Menu, X, ChevronRight, Layers, Compass, Building2, Search, Music, Disc } from 'lucide-react';
import { gamelanAudio } from '../utils/audioSynth';

export default function Navbar({ onOpenAR, lang, setLang, activeSection, setActiveSection }) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState('rindik');
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = gamelanAudio.subscribe((state) => {
      setIsAudioPlaying(state.isPlaying);
      setCurrentMode(state.currentMode);
    });
    return unsubscribe;
  }, []);

  const toggleGamelan = (mode = 'rindik') => {
    if (isAudioPlaying && currentMode === mode) {
      gamelanAudio.stop();
    } else {
      gamelanAudio.startMode(mode);
    }
  };

  const navLinks = [
    { id: 'festival', label: lang === 'id' ? 'Simulasi Festival' : 'Festival Simulation' },
    { id: 'culinary', label: lang === 'id' ? 'Peta Kuliner & Riset' : 'Culinary & Research' },
    { id: 'storefront', label: lang === 'id' ? 'Storefront UMKM' : 'MSME Storefront' },
    { id: 'advisor', label: lang === 'id' ? 'AI Tata Ruang' : 'AI Spatial Advisor' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-xs">
      
      {/* Signature BANGJO Top Gradient Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#E31837] via-[#85164B] to-[#1D4ED8]" />
      
      {/* Corporate Top Utility Bar */}
      <div className="bg-[#002B49] text-white text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 border-b border-white/10 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-3">
          
          {/* Mobile Top Row / Desktop Left: Location & Mobile Language Switcher */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] animate-pulse shrink-0"></span>
              <span className="truncate text-[10px] sm:text-[11px] text-stone-200">
                Desa Wisata Penglipuran, Bangli, Bali
              </span>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex sm:hidden items-center border border-white/20 rounded overflow-hidden text-[9px] shrink-0">
              <button 
                onClick={() => setLang('id')}
                className={`px-2 py-0.5 font-bold transition-all ${lang === 'id' ? 'bg-[#E31837] text-white' : 'text-white/70 hover:text-white'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 font-bold transition-all ${lang === 'en' ? 'bg-[#E31837] text-white' : 'text-white/70 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Bottom Row / Desktop Right: Music Player & Gamelan Mode pills */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2.5 w-full sm:w-auto">
            {/* Music Button */}
            <button 
              onClick={() => toggleGamelan(currentMode)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded text-[9.5px] sm:text-[10.5px] font-bold transition-all border shrink-0 whitespace-nowrap flex-nowrap ${
                isAudioPlaying 
                  ? 'bg-red-600 text-white border-red-400 shadow-[0_0_8px_rgba(227,24,55,0.5)]' 
                  : 'bg-white/10 hover:bg-white/20 text-stone-200 border-white/15'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <div className="flex items-end gap-0.5 h-2.5 shrink-0">
                    <span className="w-0.5 bg-white animate-[bounce_0.6s_infinite_100ms] h-1.5"></span>
                    <span className="w-0.5 bg-white animate-[bounce_0.6s_infinite_300ms] h-2.5"></span>
                    <span className="w-0.5 bg-white animate-[bounce_0.6s_infinite_200ms] h-1"></span>
                  </div>
                  <span className="whitespace-nowrap">Musik Aktif</span>
                </>
              ) : (
                <>
                  <Volume2 size={11} className="text-[#00A3E0] shrink-0" />
                  <span className="whitespace-nowrap">Musik Bali</span>
                </>
              )}
            </button>

            {/* Track Selector */}
            <div className="flex items-center gap-0.5 bg-white/5 p-0.5 rounded border border-white/10 text-[8.5px] sm:text-[9.5px] shrink-0">
              <button
                onClick={() => gamelanAudio.startMode('rindik')}
                className={`px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${isAudioPlaying && currentMode === 'rindik' ? 'bg-[#00A3E0] text-white font-bold' : 'text-stone-300 hover:text-white'}`}
                title="Rindik Bambu Khas Penglipuran"
              >
                Rindik
              </button>
              <button
                onClick={() => gamelanAudio.startMode('balaganjur')}
                className={`px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${isAudioPlaying && currentMode === 'balaganjur' ? 'bg-[#E31837] text-white font-bold' : 'text-stone-300 hover:text-white'}`}
                title="Gamelan Balaganjur Upacara"
              >
                Balaganjur
              </button>
              <button
                onClick={() => gamelanAudio.startMode('pendet')}
                className={`px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${isAudioPlaying && currentMode === 'pendet' ? 'bg-amber-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}
                title="Gamelan Tari Pendet"
              >
                Pendet
              </button>
            </div>

            {/* Desktop Language Switcher */}
            <div className="hidden sm:flex items-center border border-white/20 rounded overflow-hidden text-[10px] sm:text-[11px] shrink-0">
              <button 
                onClick={() => setLang('id')}
                className={`px-2 py-0.5 transition-all ${lang === 'id' ? 'bg-[#E31837] text-white font-bold' : 'text-white/70 hover:text-white'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 transition-all ${lang === 'en' ? 'bg-[#E31837] text-white font-bold' : 'text-white/70 hover:text-white'}`}
              >
                EN
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Main Corporate Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5 flex justify-between items-center">
        
        {/* Brand Logo & Institutional Tag */}
        <a href="#hero" className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <img 
            src="/logo-upnvjt.png" 
            alt="Logo UPN Veteran Jawa Timur" 
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform" 
          />
          <div className="min-w-0">
            <div className="font-extrabold text-sm sm:text-base text-[#002B49] tracking-tight leading-none flex items-center gap-1">
              <span>BANGJO</span>
              <span className="text-[9px] sm:text-xs bg-[#0054A6] text-white font-bold px-1.5 py-0.2 rounded">AR</span>
            </div>
            <p className="text-[7.5px] sm:text-[9.5px] text-stone-500 font-bold uppercase tracking-wider mt-0.5 truncate">
              INFORMATICS UPN VETERAN JAWA TIMUR
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setActiveSection(link.id)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeSection === link.id
                  ? 'text-[#E31837] border-b-2 border-[#E31837] rounded-none'
                  : 'text-stone-700 hover:text-[#0054A6]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Primary Corporate CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button 
            onClick={onOpenAR}
            className="flex items-center gap-2 bg-[#E31837] hover:bg-[#B30E26] text-white font-bold px-4 py-2 rounded text-xs shadow-xs transition-all tracking-wide uppercase"
          >
            <Camera size={15} />
            <span>{lang === 'id' ? 'Aktivasi Kamera AR' : 'Launch AR View'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-stone-700 hover:text-[#E31837] rounded-lg border border-stone-200"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-5 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => {
                  setActiveSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeSection === link.id
                    ? 'bg-red-50 text-[#E31837]'
                    : 'text-stone-800 hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight size={14} className="text-stone-400" />
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAR();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#E31837] hover:bg-[#B30E26] text-white font-bold py-3 rounded-xl text-xs uppercase shadow-md active:scale-98 transition-all"
            >
              <Camera size={16} />
              <span>{lang === 'id' ? 'Aktivasi Kamera AR Spasial' : 'Launch Spatial AR Camera'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
