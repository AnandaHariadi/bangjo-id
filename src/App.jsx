import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FestivalSimulationSection from './components/FestivalSimulationSection';
import CulinaryMapSection from './components/CulinaryMapSection';
import SmartStorefrontSection from './components/SmartStorefrontSection';
import AIMakeoverSection from './components/AIMakeoverSection';
import Footer from './components/Footer';
import ARCameraModal from './components/ARCameraModal';
import QRISModal from './components/QRISModal';
import { Camera } from 'lucide-react';
import { CULINARY_ITEMS } from './data/mockData';

export default function App() {
  const [lang, setLang] = useState('id');
  const [activeSection, setActiveSection] = useState('hero');
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [arModalMode, setArModalMode] = useState('pokemon_go');
  const [isQRISModalOpen, setIsQRISModalOpen] = useState(false);
  const [selectedQRISDish, setSelectedQRISDish] = useState(CULINARY_ITEMS[0]);

  const handleOpenAR = (mode = 'pokemon_go') => {
    setArModalMode(mode);
    setIsARModalOpen(true);
  };

  const handleOpenQRIS = (dish) => {
    setSelectedQRISDish(dish || CULINARY_ITEMS[0]);
    setIsQRISModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-bali-terracotta selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        onOpenAR={() => handleOpenAR('pokemon_go')} 
        lang={lang} 
        setLang={setLang}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection 
          onOpenAR={() => handleOpenAR('pokemon_go')} 
          onSelectDish={handleOpenQRIS}
          onOpenQRIS={handleOpenQRIS}
          lang={lang} 
        />
        
        <FestivalSimulationSection 
          onOpenAR={() => handleOpenAR('pokemon_go')} 
          onSelectDish={handleOpenQRIS}
          lang={lang} 
        />
        
        <CulinaryMapSection 
          onSelectMerchant={() => handleOpenAR('pokemon_go')} 
          onSelectDish={handleOpenQRIS}
          onOpenQRIS={handleOpenQRIS}
          lang={lang} 
        />
        
        <SmartStorefrontSection 
          onOpenAR={() => handleOpenAR('pokemon_go')} 
          onOpenQRIS={handleOpenQRIS}
          lang={lang} 
        />
        
        <AIMakeoverSection 
          lang={lang} 
        />
      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Floating Action Button (FAB) on Mobile */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <button
          onClick={() => handleOpenAR('pokemon_go')}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-bali-terracotta to-bali-gold text-white shadow-2xl flex items-center justify-center animate-bounce border-2 border-white"
          title="Buka Kamera AR"
        >
          <Camera size={26} />
        </button>
      </div>

      {/* AR Fullscreen Camera Modal with 7 3D Beacons and Gyroscope */}
      <ARCameraModal 
        isOpen={isARModalOpen} 
        onClose={() => setIsARModalOpen(false)} 
        defaultMode={arModalMode}
        onOpenQRIS={handleOpenQRIS}
        lang={lang}
      />

      {/* Dynamic QRIS Checkout Modal */}
      <QRISModal 
        isOpen={isQRISModalOpen} 
        onClose={() => setIsQRISModalOpen(false)} 
        selectedItem={selectedQRISDish}
        lang={lang}
      />

    </div>
  );
}
