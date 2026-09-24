import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, Volume2, VolumeX, Compass, MapPin, Layers, Info, Check, 
  ArrowRight, QrCode, Smartphone, Eye, EyeOff, Navigation, ShieldCheck, Radio, 
  Activity, Map, Maximize2, Minimize2, Sparkles, Building2, ChevronRight, CheckCircle2,
  ChevronLeft, Sparkle, Utensils, Award, Scan, Mic, RotateCcw, ChevronDown, ChevronUp
} from 'lucide-react';
import ThreeCanvas from './ThreeCanvas';
import { gamelanAudio } from '../utils/audioSynth';
import { CULINARY_ITEMS } from '../data/mockData';
import { translations } from '../utils/translations';

// Base coordinates of Penglipuran Village (Bangli, Bali)
const PENGLIPURAN_BASE = { lat: -8.453300, lon: 115.357200 };

export default function ARCameraModal({ isOpen, onClose, defaultMode = 'pokemon_go', onOpenQRIS, lang = 'id' }) {
  const [currentLang, setCurrentLang] = useState(lang);
  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);
  const t = (translations[currentLang] || translations.id).arModal;
  const [viewMode, setViewMode] = useState('fullscreen_ar'); // 'fullscreen_ar' | 'split'
  const [cameraActive, setCameraActive] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(true);
  const [useGyroscope, setUseGyroscope] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [snapshotFlash, setSnapshotFlash] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpotListOpen, setIsSpotListOpen] = useState(false);
  const [calibrationKey, setCalibrationKey] = useState(0);
  const videoRef = useRef(null);

  // Real-time GPS Telemetry State
  const [gpsData, setGpsData] = useState({
    lat: -8.453312,
    lon: 115.357245,
    accuracy: 2.8,
    heading: 42,
    speed: 1.2,
    altitude: 624,
    isLive: false,
    satellites: 9
  });

  const ALL_SPOTS = [
    {
      id: 'spot-festival',
      name: lang === 'id' ? 'Simulasi Prosesi Mepeed & Tari Pendet' : 'Mepeed Procession & Pendet Dance',
      shortTitle: lang === 'id' ? 'Mepeed Adat' : 'Mepeed Ritual',
      azimuth: 180,
      latOffset: 0.00012,
      lonOffset: 0.00005,
      baseDist: 15,
      direction: lang === 'id' ? '15m Lurus Depan' : '15m Straight Ahead',
      category: lang === 'id' ? 'Simulasi Ritual Sakral' : 'Sacred Ritual Simulation',
      zone: lang === 'id' ? 'Madya ke Utama Mandala' : 'Madya to Utama Mandala',
      code: 'SPOT-01',
      mapPos: { x: 50, y: 72 },
      desc: lang === 'id' 
        ? 'Prosesi arak-arakan sakral Piodalan dengan penari Pendet membawa canang sari dan iringan Gamelan Balaganjur.'
        : 'Sacred Piodalan procession with Pendet dancers offering canang sari accompanied by Balaganjur Gamelan.',
      materials: lang === 'id' ? 'Canang Janur Enau, Busana Tenun Songket Prada, Tedung Agung Sutra Kuning' : 'Palm Janur Canang, Prada Songket Weave, Silk Ceremonial Umbrellas',
      philosophyAwig: lang === 'id' ? 'Pelaksanaan Yadnya suci sesuai Awig-Awig Parahyangan untuk menjaga keharmonisan kosmik Tri Hita Karana.' : 'Sacred Yadnya ceremony complying with Parahyangan customary law to preserve cosmic harmony.',
      actionType: 'story',
      actionLabel: lang === 'id' ? 'Putar Narasi Budaya' : 'Play Cultural Story'
    },
    {
      id: 'spot-lawar',
      name: 'Warung Tradisional Ibu Wayan Murni',
      shortTitle: 'Lawar Kuwir',
      azimuth: 225,
      latOffset: 0.00022,
      lonOffset: 0.00015,
      baseDist: 25,
      direction: lang === 'id' ? '25m Kanan (Pekarangan 14)' : '25m Right (Compound 14)',
      category: lang === 'id' ? 'Kuliner UMKM Pilihan' : 'Curated MSME Culinary',
      zone: lang === 'id' ? 'Madya Mandala (Pekarangan Adat No. 14)' : 'Madya Mandala (Customary Compound No. 14)',
      code: 'SPOT-02',
      mapPos: { x: 74, y: 62 },
      desc: lang === 'id'
        ? 'Spesialis Lawar Kuwir & Sate Lilit segar dengan racikan 15 rempah Bumbu Genep warisan leluhur.'
        : 'Specialist Lawar Kuwir & fresh Sate Lilit with authentic 15-spice ancestral Bumbu Genep blend.',
      materials: lang === 'id' ? 'Angkul-Angkul Bata Gosok, Atap Sirap Bambu 3 Lapis, Pelinggih Apit Lawang Paras Putih' : 'Polished Red Brick Gate, 3-Layer Bamboo Sirap Roof, White Sandstone Apit Lawang Shrines',
      philosophyAwig: lang === 'id' ? 'Pekarangan mempertahankan 30% area terbuka hijau (Natah) untuk menjaga tata ruang Tri Mandala.' : 'Compound retains 30% open courtyard area (Natah) preserving Tri Mandala spatial harmony.',
      dish: CULINARY_ITEMS[0],
      actionType: 'qris',
      actionLabel: lang === 'id' ? 'Pesan Lawar Kuwir (QRIS)' : 'Order Lawar Kuwir (QRIS)'
    },
    {
      id: 'spot-loloh',
      name: 'Kedai Herbal Loloh Cemcem Pak Made',
      shortTitle: 'Loloh Cemcem',
      azimuth: 135,
      latOffset: 0.00031,
      lonOffset: -0.00018,
      baseDist: 35,
      direction: lang === 'id' ? '35m Kiri (Pekarangan 22)' : '35m Left (Compound 22)',
      category: lang === 'id' ? 'Herbal Alami Organik' : 'Organic Natural Herbal',
      zone: lang === 'id' ? 'Madya Mandala (Pekarangan Adat No. 22)' : 'Madya Mandala (Customary Compound No. 22)',
      code: 'SPOT-03',
      mapPos: { x: 26, y: 50 },
      desc: lang === 'id'
        ? 'Minuman herbal kesehatan legendaris dari perasan daun cemcem hutan liar, gula aren, dan garam Kusamba.'
        : 'Legendary health tonic extracted from wild cemcem forest leaves, palm nectar, and Kusamba sea salt.',
      materials: lang === 'id' ? 'Bale Sekepat Kayu Jati, Gentong Pendingin Tanah Liat, Rak Anyaman Bambu' : 'Teakwood Bale Sekepat, Terracotta Cooling Jars, Handcrafted Bamboo Racks',
      philosophyAwig: lang === 'id' ? 'Pengolahan hasil alam non-plastik memperkuat konsep Pawongan dan Palemahan.' : 'Zero-plastic processing of local natural harvest strengthening human-nature harmony.',
      dish: CULINARY_ITEMS[1],
      actionType: 'qris',
      actionLabel: lang === 'id' ? 'Beli Loloh Cemcem (QRIS)' : 'Buy Loloh Cemcem (QRIS)'
    },
    {
      id: 'spot-photo',
      name: lang === 'id' ? 'Angkul-Angkul Tradisional (Pekarangan 08)' : 'Angkul-Angkul Gateway (Compound 08)',
      shortTitle: 'Angkul-Angkul',
      azimuth: 90,
      latOffset: 0.00042,
      lonOffset: 0.00012,
      baseDist: 45,
      direction: lang === 'id' ? '45m Kanan (Pekarangan 08)' : '45m Right (Compound 08)',
      category: lang === 'id' ? 'Arsitektur Spasial Adat' : 'Customary Architecture',
      zone: lang === 'id' ? 'Madya Mandala (Jalur Utama Desa)' : 'Madya Mandala (Main Village Street)',
      code: 'SPOT-04',
      mapPos: { x: 74, y: 38 },
      desc: lang === 'id'
        ? 'Gerbang khas pekarangan Penglipuran dengan proporsi harmoni arsitektur Bali tradisional beratap sirap bambu.'
        : 'Traditional Penglipuran courtyard gate with authentic bamboo-shingled roof architecture.',
      materials: lang === 'id' ? 'Pintu Kayu Jati Kori Gelap, Mahkota Murda Emas, Kain Poleng Catur Warna' : 'Carved Teakwood Doors, Golden Murda Finials, Sacred Poleng Cloth',
      philosophyAwig: lang === 'id' ? 'Ketinggian dan lebar gerbang seragam melambangkan kesetaraan sosial seluruh warga desa (Tat Twam Asi).' : 'Uniform gateway dimensions symbolizing social equality across all village families (Tat Twam Asi).',
      actionType: 'info',
      actionLabel: lang === 'id' ? 'Detail Arsitektur 3D' : '3D Architectural Detail'
    },
    {
      id: 'spot-craft',
      name: lang === 'id' ? 'Pusat Anyaman Bambu Tradisional Pak Ketut' : 'Pak Ketut Bamboo Craft Center',
      shortTitle: 'Anyaman Bambu',
      azimuth: 45,
      latOffset: 0.00055,
      lonOffset: -0.00022,
      baseDist: 55,
      direction: lang === 'id' ? '55m Kiri (Pekarangan 18)' : '55m Left (Compound 18)',
      category: lang === 'id' ? 'Kerajinan Tangan UMKM' : 'MSME Handicrafts',
      zone: lang === 'id' ? 'Madya Mandala (Pekarangan Adat No. 18)' : 'Madya Mandala (Customary Compound No. 18)',
      code: 'SPOT-05',
      mapPos: { x: 26, y: 28 },
      desc: lang === 'id'
        ? 'Kerajinan anyaman bambu ramah lingkungan asli karya para tetua pengrajin Desa Penglipuran.'
        : 'Eco-friendly handwoven bamboo crafts handcrafted by elder artisans of Penglipuran Village.',
      materials: lang === 'id' ? 'Bambu Tali Lokal, Pewarna Alami Getah Pohon, Atap Rumbia Adat' : 'Local Tali Bamboo, Natural Tree Sap Pigments, Thatch Roofing',
      philosophyAwig: lang === 'id' ? 'Pemanfaatan bambu dari hutan konservasi desa secara sirkular dan berkesinambungan.' : 'Sustainable circular utilization of timber from village conservation forest.',
      actionType: 'info',
      actionLabel: lang === 'id' ? 'Katalog Anyaman Bambu' : 'View Craft Catalog'
    },
    {
      id: 'spot-temple',
      name: 'Pura Penataran Agung (Utama Mandala)',
      shortTitle: 'Pura Penataran',
      azimuth: 0,
      latOffset: 0.00070,
      lonOffset: 0.00000,
      baseDist: 70,
      direction: lang === 'id' ? '70m Lurus Depan (Puncak Utara)' : '70m Straight Ahead (North Peak)',
      category: lang === 'id' ? 'Pura Suci Utama' : 'Grand Sacred Temple',
      zone: lang === 'id' ? 'Utama Mandala (Zona Tersuci Gunung / Kaja)' : 'Utama Mandala (Most Sacred North / Mountain Zone)',
      code: 'SPOT-06',
      mapPos: { x: 50, y: 12 },
      desc: lang === 'id'
        ? 'Zona suci Utama Mandala tempat pemujaan Sang Hyang Widhi dan pusat spiritual seluruh warga desa.'
        : 'Sacred Utama Mandala sanctuary for spiritual worship and cultural nucleus of the village.',
      materials: lang === 'id' ? 'Candi Bentar Batu Candi Hitam, Meru Tumpang 7 Atap Ijuk, Ukiran Karang Boma' : 'Black Volcanic Stone Gate, 7-Tier Palm Fiber Meru Towers, Karang Boma Relic Carvings',
      philosophyAwig: lang === 'id' ? 'Orientasi tertinggi Kaja (menghadap Gunung Batur & Gunung Agung) sebagai hulu spiritual desa.' : 'Highest Kaja orientation (facing Mount Batur & Agung) as village sacred summit.',
      actionType: 'story',
      actionLabel: lang === 'id' ? 'Eksplorasi Sejarah Pura' : 'Explore Temple History'
    },
    {
      id: 'spot-bamboo-forest',
      name: lang === 'id' ? 'Gerbang Hutan Bambu Konservasi Keramat' : 'Sacred Bamboo Conservation Forest',
      shortTitle: 'Hutan Bambu',
      azimuth: 270,
      latOffset: 0.00085,
      lonOffset: -0.00030,
      baseDist: 85,
      direction: lang === 'id' ? '85m Kiri Atas (Batu Karang)' : '85m Top-Left (Sacred Rock)',
      category: lang === 'id' ? 'Hutan Konservasi Adat' : 'Customary Conservation Forest',
      zone: lang === 'id' ? 'Zona Konservasi Palemahan Adat' : 'Customary Palemahan Conservation Zone',
      code: 'SPOT-07',
      mapPos: { x: 18, y: 8 },
      desc: lang === 'id'
        ? 'Kawasan hutan bambu seluas 45 hektar yang disucikan dan dilindungi hukum adat Awig-Awig desa.'
        : '45-hectare sacred bamboo conservation forest protected under customary Awig-Awig village law.',
      materials: lang === 'id' ? 'Spesies 15 Varietas Bambu Langka, Gapura Batu Paras Hutan Lumut' : '15 Rare Bamboo Species, Mossy Natural Forest Sandstone Portal',
      philosophyAwig: lang === 'id' ? 'Larangan keras menebang bambu tanpa izin tetua adat (Bendesa) demi menjaga resapan air desa.' : 'Strict customary ban on unauthorized timber harvesting to preserve village aquifer.',
      actionType: 'info',
      actionLabel: lang === 'id' ? 'Panduan Hutan Konservasi' : 'Bamboo Forest Guide'
    }
  ];

  const [activeSpot, setActiveSpot] = useState(ALL_SPOTS[3]); // Default to Angkul-Angkul Tradisional

  const startCameraStream = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setCameraActive(true);
        }
      } catch (err) {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play().catch(() => {});
            setCameraActive(true);
          }
        } catch (err2) {
          console.log("Camera access not granted or simulated fallback:", err2);
          setCameraActive(false);
        }
      }
    }
  };

  useEffect(() => {
    const unsubscribe = gamelanAudio.subscribe((state) => {
      setAudioPlaying(state.isPlaying);
    });
    return unsubscribe;
  }, []);

  // Real-time GPS Position Tracker & Telemetry Stream
  useEffect(() => {
    let watchId = null;
    let simInterval = null;

    if (isOpen) {
      gamelanAudio.startMode('balaganjur');
      startCameraStream();

      // 1. Real GPS via Geolocation API
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const coords = pos.coords;
            setGpsData((prev) => ({
              lat: Number(coords.latitude.toFixed(6)),
              lon: Number(coords.longitude.toFixed(6)),
              accuracy: Number((coords.accuracy || 2.4).toFixed(1)),
              heading: coords.heading ? Math.round(coords.heading) : prev.heading,
              speed: coords.speed ? Number((coords.speed * 3.6).toFixed(1)) : 1.2,
              altitude: coords.altitude ? Math.round(coords.altitude) : 624,
              isLive: true,
              satellites: Math.min(12, Math.max(7, Math.round(14 - (coords.accuracy || 3) / 2)))
            }));
          },
          () => {},
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }

      // 2. Real-time Compass Device Orientation & Auto Landmark Switching
      const handleOrientation = (e) => {
        if (e.alpha !== null) {
          const h = Math.round(e.alpha);
          setGpsData((prev) => ({ ...prev, heading: h }));
          
          const closest = ALL_SPOTS.reduce((prev, curr) => {
            const diffPrev = Math.min(Math.abs(h - prev.azimuth), 360 - Math.abs(h - prev.azimuth));
            const diffCurr = Math.min(Math.abs(h - curr.azimuth), 360 - Math.abs(h - curr.azimuth));
            return diffCurr < diffPrev ? curr : prev;
          });
          if (closest && closest.id !== activeSpot.id) {
            setActiveSpot(closest);
          }
        }
      };
      window.addEventListener('deviceorientation', handleOrientation, true);

      // 3. Keyboard Shortcuts for Desktop/Laptop Testing
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === ' ' || e.key === 'Enter') {
          handleTriggerInspect();
        } else if (e.key === 'c' || e.key === 'C') {
          handleTakeSnapshot();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          setActiveSpot((prev) => {
            const idx = ALL_SPOTS.findIndex(s => s.id === prev.id);
            return ALL_SPOTS[(idx + 1) % ALL_SPOTS.length];
          });
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          setActiveSpot((prev) => {
            const idx = ALL_SPOTS.findIndex(s => s.id === prev.id);
            return ALL_SPOTS[(idx - 1 + ALL_SPOTS.length) % ALL_SPOTS.length];
          });
        } else if (e.key === 'm' || e.key === 'M') {
          toggleAudio();
        } else if (e.key === 'Tab') {
          e.preventDefault();
          setViewMode(prev => prev === 'split' ? 'fullscreen_ar' : 'split');
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      // 4. Dynamic Realtime GPS Walking Tick Simulation
      let tick = 0;
      simInterval = setInterval(() => {
        tick++;
        setGpsData((prev) => {
          const jitterLat = Math.sin(tick * 0.4) * 0.000008;
          const jitterLon = Math.cos(tick * 0.4) * 0.000006;
          const liveHeading = (prev.heading + Math.sin(tick * 0.2) * 1.5 + 360) % 360;
          return {
            ...prev,
            lat: Number((PENGLIPURAN_BASE.lat + jitterLat).toFixed(6)),
            lon: Number((PENGLIPURAN_BASE.lon + jitterLon).toFixed(6)),
            heading: Math.round(liveHeading),
            speed: Number((1.2 + Math.sin(tick * 0.3) * 0.3).toFixed(1))
          };
        });
      }, 1000);

      return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId);
        if (simInterval) clearInterval(simInterval);
        window.removeEventListener('deviceorientation', handleOrientation, true);
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      gamelanAudio.stop();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  }, [isOpen]);

  const toggleAudio = () => {
    if (audioPlaying) {
      gamelanAudio.stop();
    } else {
      gamelanAudio.startMode('balaganjur');
    }
  };

  const handlePlayVoice = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'id' ? 'id-ID' : 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      gamelanAudio.playCulturalSpeech(text);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 5000);
    }
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    gamelanAudio.stopCulturalSpeech();
    setIsSpeaking(false);
  };

  const handleRecalibrate = () => {
    gamelanAudio.playARBeaconPing();
    setCalibrationKey(prev => prev + 1);
    setToastMessage(currentLang === 'id' ? 'Posisi 3D dikalibrasi ulang ke titik pandang!' : '3D Model recalibrated to your viewpoint!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAskAI = () => {
    const aiFacts = {
      'spot-festival': currentLang === 'id' 
        ? 'Tradisi Mepeed mencerminkan falsafah Tri Hita Karana, di mana para penari berarak membawa persembahan suci canang sari sebagai ungkapan rasa syukur tulus kepada Sang Hyang Widhi.'
        : 'The Mepeed tradition embodies the Tri Hita Karana philosophy, where dancers process carrying sacred offerings in gratitude to cosmic harmony.',
      'spot-lawar': currentLang === 'id'
        ? 'Lawar Kuwir dibuat dengan racikan 15 rempah Bumbu Genep dan daging entog segar pilihan, melambangkan kebersamaan dan gotong royong warga pekarangan.'
        : 'Lawar Kuwir is blended with 15 ancestral Bumbu Genep spices and tender waterfowl, symbolizing customary unity and communal mutual aid.',
      'spot-loloh': currentLang === 'id'
        ? 'Loloh Cemcem diolah alami dari daun cemcem liar hutan desa Penglipuran, dicampur gula aren dan garam Kusamba untuk menjaga kebugaran tubuh secara organik.'
        : 'Loloh Cemcem is freshly extracted from indigenous forest cemcem leaves, blended with palm nectar and Kusamba sea salt for organic vitality.',
      'spot-photo': currentLang === 'id'
        ? 'Arsitektur gerbang Angkul-Angkul memiliki proporsi ukuran yang seragam di seluruh desa, mencerminkan kesetaraan derajat sosial seluruh warga adat Penglipuran.'
        : 'Angkul-Angkul gateways feature uniform dimensions across the village, symbolizing sacred social equality among all families.',
      'spot-craft': currentLang === 'id'
        ? 'Kerajinan anyaman bambu Penglipuran memanfaatkan bambu tali pilihan dari hutan konservasi desa dengan sistem rotasi panen yang ramah lingkungan.'
        : 'Penglipuran woven bamboo crafts utilize sustainable bamboo harvested from the village conservation forest under eco-friendly customary law.',
      'spot-temple': currentLang === 'id'
        ? 'Pura Penataran Agung berdiri di zona Utama Mandala yang paling disucikan di utara (Kaja), menghadap Gunung Batur sebagai hulu spiritual desa.'
        : 'Penataran Agung Temple stands in the most sacred elevated Utama Mandala zone facing Mount Batur as the village spiritual pinnacle.',
      'spot-bamboo-forest': currentLang === 'id'
        ? 'Hutan Bambu seluas 45 hektar dilindungi hukum adat Awig-Awig desa sebagai zona resapan mata air dan paru-paru ekologis Bali timur.'
        : 'The 45-hectare sacred bamboo forest is strictly protected by Awig-Awig customary law to preserve natural aquifers and biodiversity.'
    };
    const answer = aiFacts[activeSpot.id] || activeSpot.desc;
    handlePlayVoice(answer);
    setToastMessage(currentLang === 'id' ? '🎙️ AI Budaya sedang berbicara...' : '🎙️ Cultural AI speaking...');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectSpotFrom3D = (spotData) => {
    gamelanAudio.playARBeaconPing();
    const found = ALL_SPOTS.find(s => s.id === spotData.id);
    if (found) {
      setActiveSpot(found);
      setIsInspectModalOpen(true);
    }
  };

  const requestGyroscope = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            setUseGyroscope(true);
          }
        })
        .catch(console.error);
    } else {
      setUseGyroscope(!useGyroscope);
    }
  };

  const handleTakeSnapshot = () => {
    gamelanAudio.playARBeaconPing();
    setSnapshotFlash(true);
    setTimeout(() => setSnapshotFlash(false), 250);
    setToastMessage(currentLang === 'id' ? 'Foto AR Budaya Berhasil Disimpan!' : 'Cultural AR Photo Captured!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTriggerInspect = () => {
    gamelanAudio.playARBeaconPing();
    setIsInspectModalOpen(true);
  };

  const getCompassDir = (deg) => {
    const dirs = ['U / N', 'TL / NE', 'T / E', 'TG / SE', 'S / S', 'BD / SW', 'B / W', 'BL / NW'];
    const idx = Math.round(deg / 45) % 8;
    return dirs[idx];
  };

  // Handle touch / mouse drag on viewfinder to pan compass and detect landmarks
  const dragStartX = useRef(0);
  const isPointerDown = useRef(false);

  const handlePointerDown = (e) => {
    isPointerDown.current = true;
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handlePointerMove = (e) => {
    if (!isPointerDown.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diff = clientX - dragStartX.current;
    if (Math.abs(diff) > 40) {
      // Rotate virtual heading
      const step = diff > 0 ? -1 : 1;
      setActiveSpot((prev) => {
        const idx = ALL_SPOTS.findIndex(s => s.id === prev.id);
        const nextIdx = (idx + step + ALL_SPOTS.length) % ALL_SPOTS.length;
        return ALL_SPOTS[nextIdx];
      });
      dragStartX.current = clientX;
    }
  };

  const handlePrevSpot = () => {
    gamelanAudio.playARBeaconPing();
    setActiveSpot((prev) => {
      const idx = ALL_SPOTS.findIndex(s => s.id === (prev?.id || ALL_SPOTS[0].id));
      const prevIdx = (idx - 1 + ALL_SPOTS.length) % ALL_SPOTS.length;
      return ALL_SPOTS[prevIdx];
    });
  };

  const handleNextSpot = () => {
    gamelanAudio.playARBeaconPing();
    setActiveSpot((prev) => {
      const idx = ALL_SPOTS.findIndex(s => s.id === (prev?.id || ALL_SPOTS[0].id));
      const nextIdx = (idx + 1) % ALL_SPOTS.length;
      return ALL_SPOTS[nextIdx];
    });
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#001D33] flex flex-col justify-between overflow-hidden select-none touch-none">
      
      {/* 1. Camera Snapshot Flash Effect */}
      {snapshotFlash && (
        <div className="absolute inset-0 z-50 bg-white animate-out fade-out duration-300 pointer-events-none" />
      )}

      {/* 2. Toast Notification Feedback */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-black/90 border border-emerald-400/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles size={14} className="text-amber-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Live Webcam Video Stream (Passthrough Background) */}
      <div className="absolute inset-0 -z-10 bg-[#001D33] flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        />
        {!cameraActive && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#041226] to-[#010914] flex flex-col items-center justify-center p-6 text-center space-y-3 pointer-events-auto z-10">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
              <Camera size={28} className="text-cyan-400 animate-pulse" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">
                {lang === 'id' ? 'Kamera Spasial Realtime Aktif' : 'Realtime Spatial Camera Active'}
              </p>
              <p className="text-stone-400 text-xs mt-0.5 max-w-xs">
                {lang === 'id' 
                  ? 'Arahkan ke bangunan atau pilih titik adat di bawah untuk melihat 3D realtime.' 
                  : 'Point at buildings or tap landmarks below to view 3D models.'}
              </p>
            </div>
            <button
              onClick={startCameraStream}
              className="px-4 py-2 bg-gradient-to-r from-[#E31837] to-[#0054A6] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
            >
              {lang === 'id' ? 'Aktifkan Kamera Perangkat' : 'Enable Device Camera'}
            </button>
          </div>
        )}
      </div>

      {/* 4. CLEAN TOP BAR (Zero Distraction, No Redundant Telemetry) */}
      <div className="p-3 sm:p-4 flex items-center justify-between z-30 pointer-events-auto bg-gradient-to-b from-black/80 to-transparent">
        {/* Brand + Lang Toggle */}
        <div className="flex items-center gap-2">
          <span className="font-black text-xs tracking-wider text-white">BANGJO AR</span>
          <div className="inline-flex rounded-md bg-white/10 p-0.5 text-[9px] font-bold text-white">
            <button
              onClick={() => setCurrentLang('id')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                currentLang === 'id' ? 'bg-white/30 text-white' : 'text-stone-300'
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setCurrentLang('en')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                currentLang === 'en' ? 'bg-white/30 text-white' : 'text-stone-300'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all active:scale-95"
          title="Tutup AR"
        >
          <X size={15} />
        </button>
      </div>

      {/* 5. MAIN CONTENT AREA: 3D AR VIEWPORT (100% Focused on 3D Model, No Overlapping Badges) */}
      <div 
        className="flex-1 relative overflow-hidden flex flex-col justify-between"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        {/* Three.js Transparent WebGL Overlay */}
        <div className="w-full h-full absolute inset-0 z-10 pointer-events-auto">
          <ThreeCanvas 
            key={`${activeSpot.id}-${calibrationKey}`}
            mode="pokemon_go" 
            height="100%" 
            useGyroscope={useGyroscope}
            targetSpotId={activeSpot.id}
            onSelectSpot={handleSelectSpotFrom3D}
          />
        </div>

        {/* Minimal Reticle Target in Center */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/40"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/40"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
          </div>
        </div>

        {/* Floating Show UI Pill (Only visible when UI is hidden) */}
        {isUIHidden && (
          <div className="absolute bottom-6 right-4 sm:right-6 z-40">
            <button
              onClick={() => setIsUIHidden(false)}
              className="bg-white/90 hover:bg-white text-stone-900 font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Eye size={14} />
              <span>Tampilkan Info</span>
            </button>
          </div>
        )}
      </div>

      {/* 6. COMPACT BOTTOM CONSOLE (Single card, ~110px height, No Clutter, No Emojis) */}
      {!isUIHidden && (
        <div className="pb-4 pt-1 px-3 sm:px-6 z-30 pointer-events-auto max-w-md mx-auto w-full animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-black/75 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 space-y-2.5 shadow-2xl">
            
            {/* Header: Code + Name + Pager */}
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-white/10 text-stone-200 border border-white/10 shrink-0">
                  {activeSpot.code}
                </span>
                <span className="font-extrabold text-xs sm:text-sm text-white truncate">
                  {activeSpot.shortTitle}
                </span>
                <span className="text-[10px] text-stone-400 font-mono shrink-0">
                  {activeSpot.baseDist}m
                </span>
              </div>

              {/* Landmark Pager < 5 / 7 > */}
              <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] text-stone-300">
                <button 
                  onClick={handlePrevSpot}
                  className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
                  title="Sebelumnya"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="px-1 font-bold text-white">
                  {ALL_SPOTS.findIndex(s => s.id === activeSpot.id) + 1}/{ALL_SPOTS.length}
                </span>
                <button 
                  onClick={handleNextSpot}
                  className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
                  title="Selanjutnya"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Narrative summary (Clean 2 lines) */}
            <p className="text-[11px] text-stone-300 leading-relaxed line-clamp-2">
              {activeSpot.desc}
            </p>

            {/* Bottom Actions Row */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={handleRecalibrate}
                className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all shrink-0"
                title="Pusatkan Objek 3D"
              >
                <RotateCcw size={12} />
                <span>Letakkan Ulang</span>
              </button>

              <button
                onClick={() => isSpeaking ? handleStopVoice() : handlePlayVoice(activeSpot.desc)}
                className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all shrink-0 ${
                  isSpeaking 
                    ? 'bg-red-600 text-white border-red-500 animate-pulse' 
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                }`}
              >
                <Volume2 size={12} />
                <span>{isSpeaking ? 'Hentikan' : 'Suara'}</span>
              </button>

              {activeSpot.dish ? (
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenQRIS) onOpenQRIS(activeSpot.dish);
                  }}
                  className="flex-1 bg-white hover:bg-stone-50 text-[#E31837] font-black text-[11px] py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all whitespace-nowrap min-w-0"
                >
                  <QrCode size={12} className="shrink-0" />
                  <span className="truncate">Pesan QRIS</span>
                </button>
              ) : (
                <button
                  onClick={handleTriggerInspect}
                  className="flex-1 bg-white hover:bg-stone-50 text-[#002B49] font-black text-[11px] py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all whitespace-nowrap min-w-0"
                >
                  <Building2 size={12} className="shrink-0 text-[#0054A6]" />
                  <span className="truncate">Detail 3D</span>
                </button>
              )}

              <button
                onClick={() => setIsUIHidden(true)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-300 flex items-center justify-center active:scale-95 transition-all shrink-0"
                title="Sembunyikan Panel"
              >
                <EyeOff size={13} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CULTURAL & ARCHITECTURAL 3D BUILDING INSPECTION MODAL                      */}
      {/* ========================================================================= */}
      {isInspectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#002B49] text-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-cyan-400/40 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-[#003B64] to-[#001D33] border-b border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#E31837] text-white text-[9px] font-black px-2 py-0.5 rounded shadow">
                    {activeSpot.code}
                  </span>
                  <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                    {activeSpot.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
                  {activeSpot.name}
                </h3>
              </div>
              <button 
                onClick={() => setIsInspectModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Telemetry Bar */}
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-black/40 rounded-xl border border-white/10 font-mono">
                <div>
                  <span className="text-[9px] text-stone-400 block">JARAK</span>
                  <span className="text-xs font-bold text-cyan-300">{activeSpot.baseDist}m</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block">ARAH</span>
                  <span className="text-xs font-bold text-emerald-400">{getCompassDir(gpsData.heading)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block">STATUS</span>
                  <span className="text-xs font-bold text-amber-300">Terdaftar</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Deskripsi & Fungsi Bangunan:
                </span>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {activeSpot.desc}
                </p>
              </div>

              {/* Architectural Materials */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <Building2 size={13} className="text-cyan-400" />
                  {t.materialsTitle}
                </span>
                <p className="text-xs text-stone-200">
                  {activeSpot.materials}
                </p>
              </div>

              {/* Awig-Awig Philosophy */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-amber-400" />
                  {t.philosophyTitle}
                </span>
                <p className="text-xs text-stone-200 italic">
                  "{activeSpot.philosophyAwig}"
                </p>
              </div>

              {/* Zone */}
              <div className="text-[11px] text-stone-300 flex items-center gap-1.5 pt-1">
                <MapPin size={13} className="text-[#E31837] shrink-0" />
                <span>{t.zoneMandala} <strong>{activeSpot.zone}</strong></span>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-[#001D33] border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  gamelanAudio.playCulturalSpeech(activeSpot.desc);
                }}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Volume2 size={14} className="text-cyan-400" />
                <span>{t.btnPlayAudio}</span>
              </button>

              {activeSpot.dish ? (
                <button
                  onClick={() => {
                    setIsInspectModalOpen(false);
                    onClose();
                    if (onOpenQRIS) onOpenQRIS(activeSpot.dish);
                  }}
                  className="bg-[#E31837] hover:bg-[#B30E26] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  <QrCode size={14} />
                  <span>{t.btnOrderQris}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsInspectModalOpen(false)}
                  className="bg-[#0054A6] hover:bg-[#003B64] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>{lang === 'id' ? 'Selesai Eksplorasi' : 'Done'}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
