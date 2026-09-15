// Web Audio & Spatial Sound Engine for Authentic Balinese Gamelan, Rindik, and WebAR Soundscapes

class BalineseAudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentMode = 'rindik'; // 'rindik' | 'balaganjur' | 'pendet'
    this.stepIndex = 0;
    this.loopTimer = null;
    this.subscribers = new Set();
    this.volume = 0.8;
    this.htmlAudio = null;

    // Authentic Balinese Pelog Selisir Tuning Scale (Hz)
    // 5-Tone Pentatonic: Ding (C#4), Dong (D4), Deng (F#4), Dung (G#4), Dang (A4)
    // Octave 1 (Calung / Jublag / Reyong Low)
    // Octave 2 (Ugal / Gangsa / Rindik / Kantil)
    this.pelogSelisir = {
      ding0: 138.59, dong0: 146.83, deng0: 185.00, dung0: 207.65, dang0: 220.00,
      ding1: 277.18, dong1: 293.66, deng1: 369.99, dung1: 415.30, dang1: 440.00,
      ding2: 554.37, dong2: 587.33, deng2: 739.99, dung2: 830.61, dang2: 880.00,
      ding3: 1108.73, dong3: 1174.66, deng3: 1479.98
    };

    this.scaleArr = [
      this.pelogSelisir.ding1, // 0: Ding (277.18 Hz)
      this.pelogSelisir.dong1, // 1: Dong (293.66 Hz)
      this.pelogSelisir.deng1, // 2: Deng (369.99 Hz)
      this.pelogSelisir.dung1, // 3: Dung (415.30 Hz)
      this.pelogSelisir.dang1, // 4: Dang (440.00 Hz)
      this.pelogSelisir.ding2, // 5: Ding' (554.37 Hz)
      this.pelogSelisir.dong2, // 6: Dong' (587.33 Hz)
      this.pelogSelisir.deng2, // 7: Deng' (739.99 Hz)
      this.pelogSelisir.dung2, // 8: Dung' (830.61 Hz)
      this.pelogSelisir.dang2, // 9: Dang' (880.00 Hz)
    ];

    // Info for UI and audio player
    this.audioTracks = {
      rindik: {
        title: "Tabuh Rindik Bambu Penglipuran",
        category: "Suasana Pedesaan Tradisional Bali",
        bpm: 112,
        desc: "Alunan bilah bambu petung berongga dengan pola kotekan saling mengisi (polos & sangsih) dan desau suling bambu pegunungan."
      },
      balaganjur: {
        title: "Gamelan Balaganjur Pawai Piodalan",
        category: "Prosesi Sakral Adat & Mepeed",
        bpm: 138,
        desc: "Ritme dinamis gamelan prosesi pura dengan tabuhan kendang bali bertalu-talu, ceng-ceng kopyak riuh, dan dentuman Gong Ageng bergelombang (ombak)."
      },
      pendet: {
        title: "Gong Kebyar - Tari Pendet Yadnya",
        category: "Tarian Penyambutan & Persembahan",
        bpm: 126,
        desc: "Harmoni klasik perunggu gong kebyar dengan getaran ugal, kempli penuntun tempo, dan nuansa khidmat yadnya."
      }
    };
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => {
      try {
        cb({
          isPlaying: this.isPlaying,
          currentMode: this.currentMode,
          trackInfo: this.audioTracks[this.currentMode] || { title: "Gamelan Bali Tradisional", category: "AR Audio" }
        });
      } catch (e) {
        console.warn("Audio subscriber error:", e);
      }
    });
  }

  // =========================================================================
  // AUTHENTIC BALINESE INSTRUMENT PHYSICAL MODELING SYNTHESIZERS
  // =========================================================================

  // 1. Rindik Bambu (Tubular Bamboo Resonator with Woody Mallet Strike)
  playRindik(freq, time = 0, duration = 1.6, pan = 0) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + time;

    // Tube Fundamental + Resonant Cavity + Mallet Strike
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const oscSub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Panner for spatial stereo width (Left/Right Kotekan)
    let panner = null;
    if (this.ctx.createStereoPanner) {
      panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(pan, now);
    }

    // Hollow Bamboo Tube Resonance
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Woody Bamboo Fiber Overtone (slightly sharp harmonic)
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 3.01, now);

    // Warm Low Cavity Body
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(freq * 0.5, now);

    const attack = 0.008;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.42 * this.volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    oscSub.connect(gain);

    if (panner) {
      gain.connect(panner);
      panner.connect(this.ctx.destination);
    } else {
      gain.connect(this.ctx.destination);
    }

    osc1.start(now);
    osc2.start(now);
    oscSub.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    oscSub.stop(now + duration);
  }

  // 2. Gangsa / Ugal Bronze Metallophone with Authentic Balinese "Ombak" Shimmer
  playGangsa(freq, time = 0, duration = 2.0, isDamped = false) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + time;
    const effectiveDur = isDamped ? 0.35 : duration;

    // Paired Tuning: Balinese "Pengisap" (Higher) & "Pengumbang" (Lower) tuned 7.5 Hz apart!
    const oscPengumbang = this.ctx.createOscillator();
    const oscPengisap = this.ctx.createOscillator();
    const oscMetallic = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Fundamental Bronze Key
    oscPengumbang.type = 'sine';
    oscPengumbang.frequency.setValueAtTime(freq, now);

    // Paired 7.5Hz Ombak Beat Wave
    oscPengisap.type = 'sine';
    oscPengisap.frequency.setValueAtTime(freq + 7.5, now);

    // High Metallic Ring
    oscMetallic.type = 'triangle';
    oscMetallic.frequency.setValueAtTime(freq * 2.76, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, now);
    filter.Q.setValueAtTime(2.0, now);

    const attack = 0.004;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.38 * this.volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, now + effectiveDur);

    oscPengumbang.connect(filter);
    oscPengisap.connect(filter);
    oscMetallic.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    oscPengumbang.start(now);
    oscPengisap.start(now);
    oscMetallic.start(now);
    oscPengumbang.stop(now + effectiveDur);
    oscPengisap.stop(now + effectiveDur);
    oscMetallic.stop(now + effectiveDur);
  }

  // 3. Suling Bali (Bamboo Flute with Breathy Vibrato)
  playSuling(freq, time = 0, duration = 1.8) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + time;

    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    // 5.5 Hz Balinese Flute Graceful Vibrato
    vibrato.frequency.setValueAtTime(5.5, now);
    vibratoGain.gain.setValueAtTime( freq * 0.025, now);
    vibrato.connect(osc.frequency);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const attack = 0.12;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22 * this.volume, now + attack);
    gain.gain.setValueAtTime(0.2 * this.volume, now + duration - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    vibrato.start(now);
    osc.start(now);
    vibrato.stop(now + duration);
    osc.stop(now + duration);
  }

  // 4. Kendang Bali (Double-Headed Drum: Dag, Tut, Pak, Plak)
  playKendang(stroke = 'dag', time = 0) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + time;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (stroke === 'dag') {
      // Deep resonant open bass slap
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.18);
      gain.gain.setValueAtTime(0.45 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (stroke === 'tut') {
      // High tuned slap on small head (Wadon/Lanang)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
      gain.gain.setValueAtTime(0.32 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else {
      // 'pak' / 'plak' - Muted rim snap (Noise burst)
      const bufferSize = this.ctx.sampleRate * 0.06;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.06);
    }
  }

  // 5. Ceng-Ceng Kopyak (Balinese Clashing Cymbal Cluster)
  playCengCeng(time = 0, isAccent = false) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + time;

    const bufferSize = Math.floor(this.ctx.sampleRate * (isAccent ? 0.22 : 0.1));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3500, now);

    const gain = this.ctx.createGain();
    const vol = (isAccent ? 0.38 : 0.18) * this.volume;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isAccent ? 0.22 : 0.1));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + (isAccent ? 0.22 : 0.1));
  }

  // 6. Gong Ageng & Kempur (Majestic Ceremonial Colotomic Gong with Deep Ombak)
  playGong(freq = 65.4, time = 0, duration = 4.8) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + time;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const oscSub = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Deep Majestic Fundamental (C2: 65.4Hz or B1: 61.7Hz)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Paired Detuning for Slow 3.5Hz Gamelan Ombak Beating Wave
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq + 3.8, now);

    // Deepest Sub Rumble
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(freq * 0.5, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    const attack = 0.02;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.55 * this.volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    oscSub.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    oscSub.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    oscSub.stop(now + duration);
  }

  // 7. AR Spatial Beacon Radar Ping
  playARBeaconPing() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.22);

    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // =========================================================================
  // 3 ICONIC BALINESE MUSICAL COMPOSITIONS (KOTEKAN, POLORITME & GONG STRUCTURE)
  // =========================================================================

  startMode(mode = 'rindik') {
    this.initContext();
    this.currentMode = mode;
    this.isPlaying = true;
    this.stepIndex = 0;

    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }

    // 1. RINDIK BAMBU PENGLIPURAN: Interlocking Kotekan Polos + Sangsih + Suling Melody
    if (mode === 'rindik') {
      const stepTime = 135; // ~112 BPM 16th notes
      // Polos (Main Pattern - Left Pan)
      const polosNotes =   [0, 2, 4, 3, 2, 0, 1, 3, 4, 2, 0, 2, 3, 4, 5, 4];
      // Sangsih (Interlocking Off-beat - Right Pan)
      const sangsihNotes = [2, 4, 5, 4, 3, 2, 3, 5, 5, 4, 2, 3, 4, 5, 7, 5];
      // Suling Bamboo Flute Soaring Phrase
      const sulingMelody = [null, 5, null, 7, null, 8, null, 7, null, 5, null, 4, null, 3, null, 2];

      const tick = () => {
        if (!this.isPlaying) return;
        const s = this.stepIndex % 16;
        const bar = Math.floor(this.stepIndex / 16) % 4;

        // Polos note (Left stereo)
        const pNote = polosNotes[s];
        this.playRindik(this.scaleArr[pNote], 0, 0.4, -0.45);

        // Sangsih interlocking note (Right stereo)
        const saNote = sangsihNotes[s];
        this.playRindik(this.scaleArr[saNote], 0.035, 0.4, 0.45);

        // Suling melody on key beats
        const suNote = sulingMelody[s];
        if (suNote !== null && s % 2 === 0) {
          this.playSuling(this.scaleArr[suNote], 0, 0.6);
        }

        // Soft Klentang / Kempli time keeper on beats 0, 4, 8, 12
        if (s % 4 === 0) {
          this.playRindik(this.pelogSelisir.ding0 * 2, 0, 0.25, 0);
        }

        // Deep Gong at the end of the 4-bar Gong cycle (Gongan)
        if (s === 0 && bar === 0) {
          this.playGong(65.4, 0, 4.5);
        }

        this.stepIndex++;
      };

      tick();
      this.loopTimer = setInterval(tick, stepTime);
    }

    // 2. GAMELAN BALAGANJUR PIODALAN: High Energy Processional Gamelan
    else if (mode === 'balaganjur') {
      const stepTime = 110; // ~138 BPM Fast Marching Tempo
      // Reyong Kotekan Pattern
      const reyongPolos =   [2, 3, 5, 3, 2, 0, 2, 3, 5, 7, 5, 3, 2, 3, 2, 0];
      const reyongSangsih = [3, 5, 7, 5, 3, 2, 3, 5, 7, 8, 7, 5, 3, 5, 3, 2];
      
      // Kendang Drumming Pattern (Dag, Tut, Pak)
      const kendangPattern = ['dag', 'tut', 'pak', 'tut', 'dag', 'pak', 'tut', 'dag', 'pak', 'tut', 'dag', 'tut', 'dag', 'pak', 'tut', 'dag'];

      const tick = () => {
        if (!this.isPlaying) return;
        const s = this.stepIndex % 16;
        const bar = Math.floor(this.stepIndex / 16) % 2;

        // Gangsa & Reyong Strike
        this.playGangsa(this.scaleArr[reyongPolos[s]], 0, 0.35, s % 2 !== 0);
        this.playGangsa(this.scaleArr[reyongSangsih[s]], 0.02, 0.35, s % 2 !== 0);

        // Kendang Bali beat
        const kStroke = kendangPattern[s];
        this.playKendang(kStroke, 0);

        // Ceng-Ceng Cymbal Syncopation
        if (s % 2 === 1 || s === 14 || s === 15) {
          this.playCengCeng(0, s === 15);
        }

        // Colotomic Gongs: Kempur on beat 8, Gong Ageng on beat 0
        if (s === 8) {
          this.playGong(98.0, 0, 2.8); // Kempur
        }
        if (s === 0 && bar === 0) {
          this.playGong(61.7, 0, 4.5); // Majestic Gong Ageng
        }

        this.stepIndex++;
      };

      tick();
      this.loopTimer = setInterval(tick, stepTime);
    }

    // 3. GONG KEBYAR TARI PENDET: Majestic Classic Yadnya Dance
    else {
      const stepTime = 125; // ~120 BPM Classic Temple Dance
      const pendetMelody = [0, 2, 3, 4, 2, 5, 3, 0, 4, 3, 2, 4, 5, 7, 4, 2];
      const ugalOrnament = [2, 4, 5, 7, 4, 7, 5, 2, 5, 4, 3, 5, 7, 8, 5, 3];

      const tick = () => {
        if (!this.isPlaying) return;
        const s = this.stepIndex % 16;
        const cycle = Math.floor(this.stepIndex / 16) % 4;

        // Gangsa Ugal Leading Line
        const n = pendetMelody[s];
        this.playGangsa(this.scaleArr[n], 0, 0.8, false);

        // Calung / Kantil fast shimmer
        if (s % 2 === 0) {
          const u = ugalOrnament[s];
          this.playGangsa(this.scaleArr[u], 0, 0.3, true);
        }

        // Suling Bali breath on long phrases
        if (s === 0 || s === 6 || s === 12) {
          this.playSuling(this.scaleArr[n + 2] || this.scaleArr[n], 0, 0.9);
        }

        // Kendang graceful rhythm
        if (s === 0 || s === 6 || s === 10 || s === 14) {
          this.playKendang('dag', 0);
        } else if (s === 3 || s === 9 || s === 13) {
          this.playKendang('tut', 0);
        }

        // Ceng-Ceng accent on transitions
        if (s === 7 || s === 15) {
          this.playCengCeng(0, true);
        }

        // Majestic Gong Cycle
        if (s === 0 && cycle === 0) {
          this.playGong(65.4, 0, 5.0);
        } else if (s === 8 && cycle % 2 === 1) {
          this.playGong(87.3, 0, 3.2); // Klentang / Kempur
        }

        this.stepIndex++;
      };

      tick();
      this.loopTimer = setInterval(tick, stepTime);
    }

    this.notifySubscribers();
  }

  toggle(mode = 'rindik') {
    if (this.isPlaying && this.currentMode === mode) {
      this.stop();
    } else {
      this.startMode(mode);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.htmlAudio) {
      try {
        this.htmlAudio.pause();
        this.htmlAudio.currentTime = 0;
      } catch (e) {}
    }
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.notifySubscribers();
  }
}

export const gamelanAudio = new BalineseAudioManager();

