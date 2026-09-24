import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ErrorBoundary from './ErrorBoundary';

function ThreeCanvasInner({ 
  mode = 'temple', 
  dishId = 'lawar-kuwir',
  merchantId = 'warung-ibu-wayan',
  makeoverState = 'after', // 'before' | 'after'
  isExploded = false, 
  height = '400px',
  useGyroscope = false,
  activeHotspot = 0,
  onSelectSpot = null,
  targetSpotId = null
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationFrameId = null;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    let camera;

    const width = container.clientWidth || 300;
    const heightVal = container.clientHeight || 300;
    const aspect = width / heightVal;

    if (mode === 'food') {
      camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      camera.position.set(0, 2.2, 4.2);
      camera.lookAt(0, 0, 0);
    } else if (mode === 'storefront') {
      camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 100);
      camera.position.set(0, 1.8, 6.2);
      camera.lookAt(0, 1.35, 0.7);
    } else if (mode === 'makeover') {
      camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      camera.position.set(0, 1.8, 4.8);
      camera.lookAt(0, 0.6, 0);
    } else if (mode === 'temple') {
      camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      if (activeHotspot === 0) {
        // Focus directly centered on Gebogan Buah Lokal
        camera.position.set(1.2, 0.15, 2.5);
        camera.lookAt(1.2, 0.1, 0.6);
      } else if (activeHotspot === 1) {
        // Full Framing on the Balinese Couple (Head to toe, perfectly framed)
        camera.position.set(0, 0.15, 2.85);
        camera.lookAt(0, 0.1, 0.7);
      } else if (activeHotspot === 2) {
        // Focus centered on Tedung Agung & Penjor
        camera.position.set(-1.6, 0.75, 3.2);
        camera.lookAt(-1.6, 0.65, 0.3);
      } else {
        // Full Overview: Candi Bentar, Balinese Figures, Gebogan, and Tedung Agung
        camera.position.set(0, 0.7, 4.4);
        camera.lookAt(0, 0.2, 0.2);
      }
    } else if (mode === 'pokemon_go') {
      // Pokemon GO AR Encounter: Real Camera Passthrough with 3D AR Cultural Landmark
      camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 100);
      camera.position.set(0, 1.3, 4.2);
      camera.lookAt(0, 0.8, 0);
    } else {
      // 360 World (Penglipuran Village Street Perspective)
      scene.fog = new THREE.FogExp2(0x0a101d, 0.012);
      camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
      camera.position.set(0, 1.6, 2.5);
      camera.lookAt(0, 1.4, -18);
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, heightVal);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL initialization fallback:", e);
      return;
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(6, 12, 8);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x00A3E0, 0.8);
    fillLight.position.set(-6, 6, -4);
    scene.add(fillLight);

    const warmPoint = new THREE.PointLight(0xd4af37, 2.5, 20);
    warmPoint.position.set(0, 3, 2);
    scene.add(warmPoint);

    // Main 3D Model Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    let explodedParts = [];
    let interactiveMarkers = [];
    let animatedWaypoints = [];
    let floatingIcons = [];
    let clickableLandmarks = [];

    // Shared Materials
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75 });
    const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const bananaLeafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    const thatchedRoofMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.95 });
    const hologramCyanMat = new THREE.MeshBasicMaterial({ color: 0x00A3E0, transparent: true, opacity: 0.85 });
    const polengMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.7 });
    const sashYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, emissive: 0xca8a04, emissiveIntensity: 0.2 });
    const flowerWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const flowerPinkMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });

    // =========================================================================
    // 1. TEMPLE CULTURAL STAGE (PIODALAN, GEBOGAN, CANDI BENTAR, TEDUNG AGUNG)
    // =========================================================================
    if (mode === 'temple') {
      mainGroup.position.set(0, 0, 0);

      // Stone Base Platform
      const base = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.3, 3.2), darkStoneMat);
      base.position.y = -0.6;
      mainGroup.add(base);

      // Steps leading to temple
      for (let s = 0; s < 3; s++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(1.6 - s * 0.2, 0.1, 0.4), darkStoneMat);
        step.position.set(0, -0.55 + s * 0.1, 1.2 - s * 0.2);
        mainGroup.add(step);
      }

      // Candi Bentar (Balinese Split Gate)
      for (let i = 0; i < 5; i++) {
        const w = 0.9 - i * 0.1;
        const leftTier = new THREE.Mesh(new THREE.BoxGeometry(w, 0.55, 0.75), i % 2 === 0 ? brickMat : darkStoneMat);
        leftTier.position.set(-0.85, -0.3 + i * 0.5, 0);
        mainGroup.add(leftTier);

        const rightTier = new THREE.Mesh(new THREE.BoxGeometry(w, 0.55, 0.75), i % 2 === 0 ? brickMat : darkStoneMat);
        rightTier.position.set(0.85, -0.3 + i * 0.5, 0);
        mainGroup.add(rightTier);

        // Golden filigree accents on gate tiers
        const leftGold = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, 0.08, 0.78), goldMat);
        leftGold.position.set(-0.85, -0.05 + i * 0.5, 0);
        mainGroup.add(leftGold);

        const rightGold = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, 0.08, 0.78), goldMat);
        rightGold.position.set(0.85, -0.05 + i * 0.5, 0);
        mainGroup.add(rightGold);
      }

      // Saput Poleng (Black & White Cloth) around Gate Bases
      const clothL = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 0.8), polengMat);
      clothL.position.set(-0.85, -0.3, 0);
      const sashL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.85), sashYellowMat);
      sashL.position.set(-0.85, -0.2, 0);
      mainGroup.add(clothL, sashL);

      const clothR = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 0.8), polengMat);
      clothR.position.set(0.85, -0.3, 0);
      const sashR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.85), sashYellowMat);
      sashR.position.set(0.85, -0.2, 0);
      mainGroup.add(clothR, sashR);

      // Center Padmasana / Altar
      const altar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), darkStoneMat);
      altar.position.set(0, -0.1, -0.3);
      mainGroup.add(altar);

      // Canang Sari on Altar
      const canang = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.06, 0.35), bananaLeafMat);
      canang.position.set(0, 0.33, -0.3);
      const flower = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
      flower.position.set(0, 0.4, -0.3);
      mainGroup.add(canang, flower);

      // --- HOTSPOT 0: GEBOGAN BUAH LOKAL (Fruit Tower Offering) ---
      const geboganGroup = new THREE.Group();
      geboganGroup.position.set(1.2, -0.4, 0.6);

      // Dulang (Pedestal Tray)
      const dulangBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.22, 0.18, 16), goldMat);
      geboganGroup.add(dulangBase);

      const dulangPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.4, 0.06, 24), goldMat);
      dulangPlate.position.y = 0.12;
      geboganGroup.add(dulangPlate);

      // Layer 1: Oranges / Citrus (Ring of fruit)
      const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
      for (let f = 0; f < 8; f++) {
        const ang = (f / 8) * Math.PI * 2;
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), orangeMat);
        fruit.position.set(Math.cos(ang) * 0.32, 0.22, Math.sin(ang) * 0.32);
        geboganGroup.add(fruit);
      }

      // Layer 2: Apples / Salak (Ring of red fruit)
      const appleMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
      for (let f = 0; f < 6; f++) {
        const ang = (f / 6) * Math.PI * 2 + 0.3;
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), appleMat);
        fruit.position.set(Math.cos(ang) * 0.22, 0.36, Math.sin(ang) * 0.22);
        geboganGroup.add(fruit);
      }

      // Layer 3: Yellow Fruit / Bananas
      const yellowFruitMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 });
      for (let f = 0; f < 4; f++) {
        const ang = (f / 4) * Math.PI * 2;
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), yellowFruitMat);
        fruit.position.set(Math.cos(ang) * 0.12, 0.48, Math.sin(ang) * 0.12);
        geboganGroup.add(fruit);
      }

      // Top Sampian Janur (Palm Leaf Crown) & Frangipani
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.3, 8), bananaLeafMat);
      crown.position.y = 0.68;
      const crownTip = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), goldMat);
      crownTip.position.y = 0.86;
      geboganGroup.add(crown, crownTip);

      mainGroup.add(geboganGroup);

      // --- HOTSPOT 1: BUSANA ADAT MADYA BALI (Authentic Balinese Couple) ---
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xf6d1ba, roughness: 0.55 });
      const whiteJacketMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 });
      const songketNavyMat = new THREE.MeshStandardMaterial({ color: 0x0a1128, roughness: 0.45 });
      const goldPradaMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.15 });
      const silverMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.2 });

      // =======================================================================
      // 1. BALINESE MAN (Pria Busana Safari Putih, Udeng Songket & Saput Prada)
      // =======================================================================
      const manGroup = new THREE.Group();
      manGroup.position.set(-0.38, -0.45, 0.7);
      manGroup.scale.set(1.18, 1.18, 1.18); // Elegant proportional scale

      // Kamen & Songket Prada Skirt (Dark Navy with Ornate Gold Center Fold)
      const manKamen = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.72, 16), songketNavyMat);
      manKamen.position.y = 0.36;
      // Gold Songket Center Panel (Kancut Songket Prada)
      const manSongketTrim = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.7, 0.03), goldPradaMat);
      manSongketTrim.position.set(0, 0.36, 0.2);
      // Gold Motifs on Sides
      for (let sm = 0; sm < 3; sm++) {
        const sideMotifL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.02), goldPradaMat);
        sideMotifL.position.set(-0.13, 0.2 + sm * 0.18, 0.15);
        const sideMotifR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.02), goldPradaMat);
        sideMotifR.position.set(0.13, 0.2 + sm * 0.18, 0.15);
        manGroup.add(sideMotifL, sideMotifR);
      }
      manGroup.add(manKamen, manSongketTrim);

      // Black Ceremonial Slippers (Selop Hitam)
      const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.16), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3 }));
      shoeL.position.set(-0.08, 0.025, 0.03);
      const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.16), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3 }));
      shoeR.position.set(0.08, 0.025, 0.03);
      manGroup.add(shoeL, shoeR);

      // Torso (Baju Safari Putih Polos & Kerah Shanghai)
      const manTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.18, 0.6, 16), whiteJacketMat);
      manTorso.position.y = 0.94;
      const manCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.06, 16), whiteJacketMat);
      manCollar.position.y = 1.25;
      manGroup.add(manTorso, manCollar);

      // Gold Spherical Buttons down front placket
      for (let b = 0; b < 5; b++) {
        const btn = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), goldPradaMat);
        btn.position.set(0, 0.74 + b * 0.11, 0.2);
        manGroup.add(btn);
      }

      // Gold Double-Chain Brooch on Left Breast (Pin Bros Rantai Emas)
      const broochPin = new THREE.Mesh(new THREE.OctahedronGeometry(0.025, 0), goldPradaMat);
      broochPin.position.set(-0.09, 1.12, 0.19);
      const broochChain = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.005, 6, 12, Math.PI), goldPradaMat);
      broochChain.position.set(-0.06, 1.1, 0.19);
      manGroup.add(broochPin, broochChain);

      // Arms & Formal Posture
      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.42, 12), whiteJacketMat);
      armL.position.set(-0.24, 0.92, 0.04);
      armL.rotation.z = 0.2;
      const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.42, 12), whiteJacketMat);
      armR.position.set(0.24, 0.92, 0.04);
      armR.rotation.z = -0.2;
      const handL = new THREE.Mesh(new THREE.SphereGeometry(0.044, 8, 8), skinMat);
      handL.position.set(-0.08, 0.73, 0.17);
      const watch = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.028, 12), new THREE.MeshStandardMaterial({ color: 0x18181b }));
      watch.position.set(-0.1, 0.75, 0.16);
      const handR = new THREE.Mesh(new THREE.SphereGeometry(0.044, 8, 8), skinMat);
      handR.position.set(0.08, 0.73, 0.17);
      const tridatu = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.01, 6, 12), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      tridatu.position.set(0.1, 0.75, 0.16);
      manGroup.add(armL, armR, handL, handR, watch, tridatu);

      // Head & Neck
      const manHead = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 16), skinMat);
      manHead.position.y = 1.36;
      const manNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.09, 12), skinMat);
      manNeck.position.y = 1.26;
      manGroup.add(manHead, manNeck);

      // Udeng Bali (Batik Songket Headcloth with Golden Peak / Kuncup)
      const udengWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.138, 0.13, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 }));
      udengWrap.position.y = 1.39;
      const udengGoldBrim = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.012, 8, 20), goldPradaMat);
      udengGoldBrim.rotation.x = Math.PI / 2;
      udengGoldBrim.position.y = 1.38;
      const udengPeak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.11, 8), new THREE.MeshStandardMaterial({ color: 0x1e1b4b }));
      udengPeak.rotation.z = -0.3;
      udengPeak.position.set(0.05, 1.48, 0.06);
      const udengPeakGold = new THREE.Mesh(new THREE.OctahedronGeometry(0.016, 0), goldPradaMat);
      udengPeakGold.position.set(0.06, 1.54, 0.06);
      manGroup.add(udengWrap, udengGoldBrim, udengPeak, udengPeakGold);
      mainGroup.add(manGroup);

      // =======================================================================
      // 2. BALINESE WOMAN (Wanita Kebaya Brokat, Mahkota Bunga Emas & Bokor Canang)
      // =======================================================================
      const womanGroup = new THREE.Group();
      womanGroup.position.set(0.38, -0.45, 0.7);
      womanGroup.scale.set(1.18, 1.18, 1.18); // Proportional scale

      // Kamen Songket Panjang (Long Silk Sarong with Gold Prada Tapestry)
      const womanKamen = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.72, 16), songketNavyMat);
      womanKamen.position.y = 0.36;
      const womanSongketTrim = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 0.03), goldPradaMat);
      womanSongketTrim.position.set(0, 0.36, 0.19);
      womanGroup.add(womanKamen, womanSongketTrim);

      // Golden Slippers (Selop Emas)
      const wShoeL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.045, 0.14), goldPradaMat);
      wShoeL.position.set(-0.06, 0.022, 0.03);
      const wShoeR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.045, 0.14), goldPradaMat);
      wShoeR.position.set(0.06, 0.022, 0.03);
      womanGroup.add(wShoeL, wShoeR);

      // White Lace Kebaya (Kebaya Brokat Putih Anggun)
      const womanTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.155, 0.56, 16), whiteJacketMat);
      womanTorso.position.y = 0.92;
      // Scoop Neckline & Gold Necklace
      const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.007, 6, 16), goldPradaMat);
      necklace.rotation.x = Math.PI / 2.5;
      necklace.position.set(0, 1.12, 0.11);
      womanGroup.add(womanTorso, necklace);

      // Yellow Velvet Sash (Senteng / Selendang Kuning Emas) & Buckle
      const sashMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 16), sashYellowMat);
      sashMesh.position.y = 0.8;
      const pendingEmas = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16), goldPradaMat);
      pendingEmas.rotation.x = Math.PI / 2;
      pendingEmas.position.set(0, 0.8, 0.18);
      const pendingGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.02, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 }));
      pendingGem.position.set(0, 0.8, 0.2);
      // Pleated Gold Ribbon Hanging Down
      const sashRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.42, 0.02), sashYellowMat);
      sashRibbon.position.set(0, 0.57, 0.19);
      const sashRibbonGold = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.025), goldPradaMat);
      sashRibbonGold.position.set(0, 0.38, 0.19);
      womanGroup.add(sashMesh, pendingEmas, pendingGem, sashRibbon, sashRibbonGold);

      // Arms & Hands Holding Bokor Canang Sari
      const wArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.04, 0.38, 12), whiteJacketMat);
      wArmL.position.set(-0.21, 0.9, 0.06);
      wArmL.rotation.z = 0.35;
      wArmL.rotation.x = -0.3;
      const wArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.04, 0.38, 12), whiteJacketMat);
      wArmR.position.set(0.21, 0.9, 0.06);
      wArmR.rotation.z = -0.35;
      wArmR.rotation.x = -0.3;
      const wHandL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), skinMat);
      wHandL.position.set(-0.09, 0.76, 0.22);
      const wHandR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), skinMat);
      wHandR.position.set(0.09, 0.76, 0.22);
      womanGroup.add(wArmL, wArmR, wHandL, wHandR);

      // Ceremonial Silver Bokor & Fresh Canang Sari Offering in Hands
      const bokorTray = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 0.04, 16), silverMat);
      bokorTray.position.set(0, 0.75, 0.24);
      const canangSquare = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.02, 0.11), bananaLeafMat);
      canangSquare.position.set(0, 0.78, 0.24);
      const canangFlower1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.025, 0), flowerWhiteMat);
      canangFlower1.position.set(-0.025, 0.8, 0.24);
      const canangFlower2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.025, 0), flowerPinkMat);
      canangFlower2.position.set(0.025, 0.8, 0.24);
      const canangFlower3 = new THREE.Mesh(new THREE.OctahedronGeometry(0.02, 0), goldPradaMat);
      canangFlower3.position.set(0, 0.81, 0.22);
      womanGroup.add(bokorTray, canangSquare, canangFlower1, canangFlower2, canangFlower3);

      // Head, Neck & Gold Floral Earrings (Subeng Emas)
      const womanHead = new THREE.Mesh(new THREE.SphereGeometry(0.118, 16, 16), skinMat);
      womanHead.position.y = 1.33;
      const womanNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.09, 12), skinMat);
      womanNeck.position.y = 1.23;
      const subengL = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), goldPradaMat);
      subengL.position.set(-0.12, 1.31, 0.02);
      const subengR = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), goldPradaMat);
      subengR.position.set(0.12, 1.31, 0.02);
      womanGroup.add(womanHead, womanNeck, subengL, subengR);

      // TRADITIONAL BALINESE SANGGUL PUSUNG TAGEL (Natural Dark Hair Bun)
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
      const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.122, 16, 16), hairMat);
      hairBase.position.set(0, 1.35, -0.02);
      const pusungBun = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), hairMat);
      pusungBun.position.set(0, 1.38, -0.09);
      womanGroup.add(hairBase, pusungBun);

      // BALINESE GELUNGAN EMAS (Curved Gold Tiara Crown Following Hairline)
      const gelunganArch = new THREE.Mesh(
        new THREE.TorusGeometry(0.122, 0.016, 8, 24, Math.PI * 0.9),
        goldPradaMat
      );
      gelunganArch.rotation.x = Math.PI / 2.3;
      gelunganArch.position.set(0, 1.38, 0.04);

      const gelunganTrim = new THREE.Mesh(
        new THREE.TorusGeometry(0.108, 0.01, 8, 20, Math.PI * 0.8),
        goldPradaMat
      );
      gelunganTrim.rotation.x = Math.PI / 2.3;
      gelunganTrim.position.set(0, 1.44, 0.02);
      womanGroup.add(gelunganArch, gelunganTrim);

      // Central Golden Finial (Cunduk Garuda Mungkur Emas)
      const cundukTop = new THREE.Mesh(new THREE.OctahedronGeometry(0.032, 0), goldPradaMat);
      cundukTop.position.set(0, 1.54, 0.04);
      const cundukSpike = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.06, 8), goldPradaMat);
      cundukSpike.position.set(0, 1.59, 0.04);
      womanGroup.add(cundukTop, cundukSpike);

      // Symmetrical Golden & Frangipani Blossoms along Crown Arch
      for (let i = -3; i <= 3; i++) {
        const fx = i * 0.038;
        const fy = 1.46 + (1 - Math.abs(i) * 0.22) * 0.06;
        const fz = 0.04 - Math.abs(i) * 0.012;

        const goldFlower = new THREE.Mesh(new THREE.OctahedronGeometry(0.02, 0), goldPradaMat);
        goldFlower.position.set(fx, fy, fz);

        const flowerPetal = new THREE.Mesh(new THREE.ConeGeometry(0.01, 0.04, 6), i % 2 === 0 ? goldPradaMat : flowerWhiteMat);
        flowerPetal.position.set(fx, fy + 0.03, fz);
        flowerPetal.rotation.z = -i * 0.15;
        womanGroup.add(goldFlower, flowerPetal);
      }

      mainGroup.add(womanGroup);

      // --- HOTSPOT 2: TEDUNG AGUNG & PENJOR BAMBU ---
      const poleGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.4);
      const umbrellaTier1 = new THREE.ConeGeometry(0.68, 0.32, 16);
      const umbrellaTier2 = new THREE.ConeGeometry(0.48, 0.22, 16);
      
      // Left Tedung Agung (Red Sakral)
      const leftPole = new THREE.Mesh(poleGeo, goldMat);
      leftPole.position.set(-1.8, 0.4, 0.3);
      const leftUmb1 = new THREE.Mesh(umbrellaTier1, new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      leftUmb1.position.set(-1.8, 1.3, 0.3);
      const leftUmb2 = new THREE.Mesh(umbrellaTier2, new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      leftUmb2.position.set(-1.8, 1.55, 0.3);
      const leftGoldFinial = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 8), goldMat);
      leftGoldFinial.position.set(-1.8, 1.75, 0.3);
      mainGroup.add(leftPole, leftUmb1, leftUmb2, leftGoldFinial);

      // Right Tedung Agung (Gold / Kuning Agung)
      const rightPole = new THREE.Mesh(poleGeo, goldMat);
      rightPole.position.set(1.8, 0.4, 0.3);
      const rightUmb1 = new THREE.Mesh(umbrellaTier1, goldMat);
      rightUmb1.position.set(1.8, 1.3, 0.3);
      const rightUmb2 = new THREE.Mesh(umbrellaTier2, goldMat);
      rightUmb2.position.set(1.8, 1.55, 0.3);
      const rightGoldFinial = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 8), goldMat);
      rightGoldFinial.position.set(1.8, 1.75, 0.3);
      mainGroup.add(rightPole, rightUmb1, rightUmb2, rightGoldFinial);

      // Penjor Bambu (Curved Bamboo with Hanging Janur)
      const penjorCurve = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.03, 8, 16, Math.PI / 1.8), bananaLeafMat);
      penjorCurve.position.set(-2.2, 1.6, -0.2);
      penjorCurve.rotation.z = -0.4;
      mainGroup.add(penjorCurve);
    }

    // =========================================================================
    // 2. STOREFRONT: 3 AUTHENTIC PENGLIPURAN AR BALINESE UMKM COMPOUNDS
    // =========================================================================
    else if (mode === 'storefront') {
      mainGroup.position.set(0, 0, 0);

      // Helper to generate crisp high-resolution 3D AR Holographic Signboards
      const createStoreSignboardTexture = (category, name, address, tagline, primaryColor, accentColor, bgColor) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Background with rich contrast gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, 360);
        bgGrad.addColorStop(0, bgColor || '#071526');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1024, 360);

        // Outer Glow & Metallic Border
        ctx.strokeStyle = primaryColor || '#d4af37';
        ctx.lineWidth = 10;
        ctx.strokeRect(12, 12, 1000, 336);

        ctx.strokeStyle = accentColor || '#38bdf8';
        ctx.lineWidth = 4;
        ctx.strokeRect(22, 22, 980, 316);

        // Header Category Badge (Pill)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(262, 28, 500, 44, 22);
        } else {
          ctx.rect(262, 28, 500, 44);
        }
        ctx.fill();
        ctx.strokeStyle = accentColor || '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = accentColor || '#38bdf8';
        ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '3px';
        ctx.fillText(category.toUpperCase(), 512, 58);

        // Main Store Name (Crisp, Extra-Bold with Drop Shadow)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 52px "Segoe UI", Arial, sans-serif';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 4;
        ctx.fillText(name, 512, 150);

        // Reset shadow for subtitle text
        ctx.shadowColor = 'transparent';

        // Address & Pekarangan Adat
        ctx.fillStyle = primaryColor || '#facc15';
        ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
        ctx.fillText(address, 512, 222);

        // Specialty Tagline / Menu
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'italic 500 24px "Segoe UI", Arial, sans-serif';
        ctx.fillText(tagline, 512, 288);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
      };

      // =======================================================================
      // THEME 1: WARUNG IBU WAYAN MURNI (Pekarangan Adat No. 14, Jalur Utama)
      // Authentic Penglipuran Red-Brick Angkul-Angkul, Tedung Agung, Inner Bale
      // =======================================================================
      if (merchantId === 'warung-ibu-wayan') {
        // Paved Stone Boulevard & Side Grass Verges
        const ground = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 4.4), darkStoneMat);
        ground.position.y = -0.1;
        mainGroup.add(ground);

        const grassL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 4.4), bananaLeafMat);
        grassL.position.set(-2.5, -0.09, 0);
        const grassR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 4.4), bananaLeafMat);
        grassR.position.set(2.5, -0.09, 0);
        mainGroup.add(grassL, grassR);

        // Stone Entrance Steps
        for (let s = 0; s < 3; s++) {
          const step = new THREE.Mesh(new THREE.BoxGeometry(1.9 - s * 0.15, 0.1, 0.4), darkStoneMat);
          step.position.set(0, -0.05 + s * 0.08, 0.9 - s * 0.25);
          mainGroup.add(step);
        }

        // Tembok Panyengker (Red Brick Compound Wall extending to left and right)
        const wallL = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.35), brickMat);
        wallL.position.set(-2.2, 0.7, 0);
        const wallR = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.35), brickMat);
        wallR.position.set(2.2, 0.7, 0);
        const wallCapL = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 0.45), thatchedRoofMat);
        wallCapL.position.set(-2.2, 1.45, 0);
        const wallCapR = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 0.45), thatchedRoofMat);
        wallCapR.position.set(2.2, 1.45, 0);
        mainGroup.add(wallL, wallR, wallCapL, wallCapR);

        // AUTHENTIC ANGKUL-ANGKUL GATE PILLARS (Red Brick with Volcanic Stone Base)
        for (let i = 0; i < 5; i++) {
          const w = 0.92 - i * 0.08;
          const leftTier = new THREE.Mesh(new THREE.BoxGeometry(w, 0.48, 0.75), i % 2 === 0 ? brickMat : darkStoneMat);
          leftTier.position.set(-0.88, 0.2 + i * 0.45, 0);
          mainGroup.add(leftTier);

          const rightTier = new THREE.Mesh(new THREE.BoxGeometry(w, 0.48, 0.75), i % 2 === 0 ? brickMat : darkStoneMat);
          rightTier.position.set(0.88, 0.2 + i * 0.45, 0);
          mainGroup.add(rightTier);

          // Golden relief accents
          const trimL = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.06, 0.78), goldMat);
          trimL.position.set(-0.88, 0.42 + i * 0.45, 0);
          const trimR = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.06, 0.78), goldMat);
          trimR.position.set(0.88, 0.42 + i * 0.45, 0);
          mainGroup.add(trimL, trimR);
        }

        // Angkul-Angkul Archway Lintel & Bamboo Sirap Roof
        const lintelBeam = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.25, 0.8), woodMat);
        lintelBeam.position.set(0, 2.45, 0);
        mainGroup.add(lintelBeam);

        const angkulRoof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 0.8, 4), thatchedRoofMat);
        angkulRoof.rotation.y = Math.PI / 4;
        angkulRoof.position.set(0, 2.95, 0);
        mainGroup.add(angkulRoof);

        const roofCrown = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.2), goldMat);
        roofCrown.position.set(0, 3.15, 0);
        mainGroup.add(roofCrown);

        // Saput Poleng (Black & White Sacred Cloth) & Gold Sashes around gate pillars
        const clothL = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.5, 0.78), polengMat);
        clothL.position.set(-0.88, 0.25, 0);
        const sashL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.82), sashYellowMat);
        sashL.position.set(-0.88, 0.35, 0);
        mainGroup.add(clothL, sashL);

        const clothR = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.5, 0.78), polengMat);
        clothR.position.set(0.88, 0.25, 0);
        const sashR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.82), sashYellowMat);
        sashR.position.set(0.88, 0.35, 0);
        mainGroup.add(clothR, sashR);

        // Apit Lawang (Stone Guardian Shrines) with Canang Sari
        const shrineL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.7, 0.45), darkStoneMat);
        shrineL.position.set(-1.45, 0.35, 0.5);
        const shrineR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.7, 0.45), darkStoneMat);
        shrineR.position.set(1.45, 0.35, 0.5);
        mainGroup.add(shrineL, shrineR);

        for (const sx of [-1.45, 1.45]) {
          const canangBase = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.28), bananaLeafMat);
          canangBase.position.set(sx, 0.72, 0.5);
          const flower1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
          flower1.position.set(sx - 0.04, 0.76, 0.5);
          const flower2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
          flower2.position.set(sx + 0.04, 0.76, 0.5);
          mainGroup.add(canangBase, flower1, flower2);
        }

        // Two Tall Red & Gold Tedung Agung Ceremonial Umbrellas
        const poleGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.6);
        const umbrellaTier1 = new THREE.ConeGeometry(0.68, 0.3, 16);
        const umbrellaTier2 = new THREE.ConeGeometry(0.48, 0.22, 16);

        // Left Tedung Agung (Sacred Red)
        const leftPole = new THREE.Mesh(poleGeo, goldMat);
        leftPole.position.set(-1.95, 1.1, 0.6);
        const leftUmb1 = new THREE.Mesh(umbrellaTier1, new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
        leftUmb1.position.set(-1.95, 2.1, 0.6);
        const leftUmb2 = new THREE.Mesh(umbrellaTier2, new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
        leftUmb2.position.set(-1.95, 2.32, 0.6);
        mainGroup.add(leftPole, leftUmb1, leftUmb2);

        // Right Tedung Agung (Royal Gold)
        const rightPole = new THREE.Mesh(poleGeo, goldMat);
        rightPole.position.set(1.95, 1.1, 0.6);
        const rightUmb1 = new THREE.Mesh(umbrellaTier1, goldMat);
        rightUmb1.position.set(1.95, 2.1, 0.6);
        const rightUmb2 = new THREE.Mesh(umbrellaTier2, goldMat);
        rightUmb2.position.set(1.95, 2.32, 0.6);
        mainGroup.add(rightPole, rightUmb1, rightUmb2);

        // Traditional Balinese Teak Carved Doors (Ajar Open into Courtyard)
        const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.9, 0.06), woodMat);
        doorL.position.set(-0.24, 1.05, -0.1);
        doorL.rotation.y = 0.35;
        const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.9, 0.06), woodMat);
        doorR.position.set(0.24, 1.05, -0.1);
        doorR.rotation.y = -0.35;
        mainGroup.add(doorL, doorR);

        // INNER COURTYARD: Bale Pavilion & Traditional Warung Dining Table (Visible through gate)
        const innerFloor = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 2.0), darkStoneMat);
        innerFloor.position.set(0, 0.1, -1.3);
        mainGroup.add(innerFloor);

        // Inner Pavilion Pillars & Roof
        for (const [px, pz] of [[-1.2, -0.8], [1.2, -0.8], [-1.2, -1.8], [1.2, -1.8]]) {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8), woodMat);
          post.position.set(px, 1.0, pz);
          mainGroup.add(post);
        }
        const innerRoof = new THREE.Mesh(new THREE.ConeGeometry(2.2, 0.7, 4), thatchedRoofMat);
        innerRoof.rotation.y = Math.PI / 4;
        innerRoof.position.set(0, 2.2, -1.3);
        mainGroup.add(innerRoof);

        // Traditional Dining Table with Banana Leaf Platter & Clay Jug
        const table = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.8), woodMat);
        table.position.set(0, 0.35, -1.3);
        const leafPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.03, 16), bananaLeafMat);
        leafPlate.position.set(-0.35, 0.62, -1.3);
        const jug = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.25, 12), new THREE.MeshStandardMaterial({ color: 0x7c2d12 }));
        jug.position.set(0.35, 0.73, -1.3);
        mainGroup.add(table, leafPlate, jug);

        // Courtyard Warm Glow
        const courtyardLight = new THREE.PointLight(0xf59e0b, 1.8, 5);
        courtyardLight.position.set(0, 1.5, -1.0);
        mainGroup.add(courtyardLight);

        // FLOATING 3D AR HOLOGRAPHIC SIGNBOARD WITH CRISP HIGH-RES TEXT
        const signboardGroup = new THREE.Group();
        signboardGroup.position.set(0, 2.05, 1.45);

        const signTexture = createStoreSignboardTexture(
          'BANGJO AR • UMKM PENGLIPURAN',
          'WARUNG IBU WAYAN MURNI',
          'Pekarangan Adat No. 14 • Jalur Utama',
          'Lawar Kuwir Sakral • Nasi Campur Bali • Sambal Matah',
          '#facc15',
          '#38bdf8',
          '#002B49'
        );

        if (signTexture) {
          const signMat = new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.2, metalness: 0.3 });
          const signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.95, 0.08), signMat);
          const signBorder = new THREE.Mesh(new THREE.BoxGeometry(2.78, 1.03, 0.06), goldMat);
          signBorder.position.z = -0.02;
          signboardGroup.add(signBoard, signBorder);
        }

        // Balinese Crown Top & Dulang Fruit Offering Emblem
        const signCrown = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.08, 0.08), new THREE.MeshStandardMaterial({ color: 0xE31837 }));
        signCrown.position.set(0, 0.52, 0);
        const dulang = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 0.1, 16), goldMat);
        dulang.position.set(0, 0.66, 0);
        const fruitLayer = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 1), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
        fruitLayer.position.set(0, 0.78, 0);
        const janurCrown = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 8), bananaLeafMat);
        janurCrown.position.set(0, 0.92, 0);
        signboardGroup.add(signCrown, dulang, fruitLayer, janurCrown);

        mainGroup.add(signboardGroup);
        floatingIcons.push({ group: signboardGroup, basePosY: 2.05, seed: 1 });
      }

      // =======================================================================
      // THEME 2: KEDAI LOLOH PAK MADE (Pekarangan Adat No. 22, Samping Hutan Bambu)
      // Natural Bamboo Grove Gateway, Giant Terracotta Jars, Emerald Display Racks
      // =======================================================================
      else if (merchantId === 'kedai-loloh-pak-made') {
        const bambooYellowMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
        const bambooGreenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.45 });
        const mossFloorMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
        const jarMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.8 });

        // Lush Forest Mossy Courtyard Floor
        const mossFloor = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 4.4), mossFloorMat);
        mossFloor.position.y = -0.1;
        mainGroup.add(mossFloor);

        // Stone pathway through moss
        const path = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 4.4), darkStoneMat);
        path.position.set(0, -0.09, 0);
        mainGroup.add(path);

        // Dense Living Bamboo Forest Groves (*Hutan Bambu Penglipuran*)
        for (let b = 0; b < 10; b++) {
          const side = b % 2 === 0 ? -1 : 1;
          const idx = Math.floor(b / 2);
          const bx = side * (2.1 + (idx % 3) * 0.4);
          const bz = -1.2 + idx * 0.8;
          const tallBamboo = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 4.6, 12), idx % 2 === 0 ? bambooGreenMat : bambooYellowMat);
          tallBamboo.position.set(bx, 2.1, bz);
          mainGroup.add(tallBamboo);

          // Bamboo leaf foliage crowns
          const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 1), bananaLeafMat);
          leaves.position.set(bx, 4.0, bz);
          mainGroup.add(leaves);
        }

        // AUTHENTIC BAMBOO ANGKUL-ANGKUL GATE (*Gapura Bambu Petung*)
        const archPillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.9, 12), bambooYellowMat);
        archPillarL.position.set(-0.9, 1.35, 0);
        const archPillarR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.9, 12), bambooYellowMat);
        archPillarR.position.set(0.9, 1.35, 0);
        mainGroup.add(archPillarL, archPillarR);

        // Layered Bamboo Crossbeams
        for (let c = 0; c < 4; c++) {
          const crossBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.5, 12), bambooYellowMat);
          crossBeam.rotation.z = Math.PI / 2;
          crossBeam.position.set(0, 2.0 + c * 0.25, 0);
          mainGroup.add(crossBeam);
        }

        // Multi-tiered Split Bamboo Sirap Roof
        const bambooRoof1 = new THREE.Mesh(new THREE.ConeGeometry(1.8, 0.7, 4), thatchedRoofMat);
        bambooRoof1.rotation.y = Math.PI / 4;
        bambooRoof1.position.set(0, 3.0, 0);
        const bambooRoof2 = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.5, 4), bananaLeafMat);
        bambooRoof2.rotation.y = Math.PI / 4;
        bambooRoof2.position.set(0, 3.4, 0);
        mainGroup.add(bambooRoof1, bambooRoof2);

        // Bamboo Slats Wicket Gate
        for (let s = 0; s < 4; s++) {
          const slatL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.8, 8), bambooYellowMat);
          slatL.position.set(-0.45 + s * 0.11, 0.9, -0.05);
          const slatR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.8, 8), bambooYellowMat);
          slatR.position.set(0.12 + s * 0.11, 0.9, -0.05);
          mainGroup.add(slatL, slatR);
        }

        // Giant Terracotta Water Cooling Jars (*Gentong Tanah Liat*) with Coconut Ladles
        for (const [jx, jz] of [[-1.35, 0.4], [1.35, 0.4]]) {
          const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.2, 0.6, 16), jarMat);
          jar.position.set(jx, 0.3, jz);
          const jarLid = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 16), woodMat);
          jarLid.position.set(jx, 0.62, jz);
          const ladle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), bambooYellowMat);
          ladle.position.set(jx + 0.08, 0.78, jz);
          ladle.rotation.z = 0.4;
          mainGroup.add(jar, jarLid, ladle);
        }

        // INNER KEDAI BOOTH: 3-Tier Herbal Loloh Display Rack & Clay Pouring Dispenser
        const counter = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 0.8), woodMat);
        counter.position.set(0, 0.35, -1.2);
        mainGroup.add(counter);

        // 3-Tier Shelf with Emerald Loloh Cemcem Bottles
        for (let tier = 0; tier < 3; tier++) {
          const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.22), woodMat);
          shelf.position.set(0, 0.75 + tier * 0.26, -1.2 + tier * 0.1);
          mainGroup.add(shelf);

          for (let b = 0; b < 5; b++) {
            const bottle = new THREE.Mesh(
              new THREE.CylinderGeometry(0.04, 0.04, 0.18, 12),
              new THREE.MeshPhysicalMaterial({ color: 0x15803d, transparent: true, opacity: 0.9, roughness: 0.1 })
            );
            bottle.position.set(-0.6 + b * 0.3, 0.86 + tier * 0.26, -1.2 + tier * 0.1);
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04), goldMat);
            cap.position.set(-0.6 + b * 0.3, 0.97 + tier * 0.26, -1.2 + tier * 0.1);
            mainGroup.add(bottle, cap);
          }
        }

        // Emerald Bio-Glow Light
        const herbalGlow = new THREE.PointLight(0x10b981, 2.0, 5);
        herbalGlow.position.set(0, 1.6, -0.8);
        mainGroup.add(herbalGlow);

        // FLOATING 3D AR HOLOGRAPHIC SIGNBOARD WITH CRISP TEXT & LOLOH EMBLEM
        const signboardGroup = new THREE.Group();
        signboardGroup.position.set(0, 2.05, 1.45);

        const signTexture = createStoreSignboardTexture(
          'BANGJO AR • HERBAL ALAMI PENGLIPURAN',
          'KEDAI LOLOH PAK MADE',
          'Pekarangan Adat No. 22 • Hutan Bambu',
          'Loloh Cemcem Asli • Khasiat Daun Alami Segar • Jamu Bali',
          '#10b981',
          '#34d399',
          '#064e3b'
        );

        if (signTexture) {
          const signMat = new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.2, metalness: 0.3 });
          const signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.95, 0.08), signMat);
          const signBorder = new THREE.Mesh(new THREE.BoxGeometry(2.78, 1.03, 0.06), goldMat);
          signBorder.position.z = -0.02;
          signboardGroup.add(signBoard, signBorder);
        }

        // 3D Emerald Loloh Bottle Floating Trophy
        const botBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.36, 16),
          new THREE.MeshPhysicalMaterial({ color: 0x15803d, transparent: true, opacity: 0.88, roughness: 0.1 })
        );
        botBody.position.set(0, 0.68, 0);
        const botCap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16), goldMat);
        botCap.position.set(0, 0.88, 0);
        signboardGroup.add(botBody, botCap);

        mainGroup.add(signboardGroup);
        floatingIcons.push({ group: signboardGroup, basePosY: 2.05, seed: 2 });
      }

      // =======================================================================
      // THEME 3: DAPUR BAMBU ASRI (Pekarangan Adat No. 08, Natah Utara)
      // Bale Paon (Balinese Kitchen), Charcoal BBQ Grill, Sate Lilit Embers, Lanterns
      // =======================================================================
      else {
        const warmTeakMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
        const amberWoodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });

        // Terracotta Courtyard Floor (Natah Utara)
        const deckFloor = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 4.4), brickMat);
        deckFloor.position.y = -0.1;
        mainGroup.add(deckFloor);

        // Stone borders
        const borderF = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.22, 0.4), darkStoneMat);
        borderF.position.set(0, -0.09, 2.0);
        mainGroup.add(borderF);

        // TRADITIONAL BALE PAON GAZEBO (4 Teakwood Pillars + Thatched Roof)
        const postGeo = new THREE.BoxGeometry(0.2, 2.4, 0.2);
        const postFL = new THREE.Mesh(postGeo, warmTeakMat);
        postFL.position.set(-1.5, 1.2, 0.9);
        const postFR = new THREE.Mesh(postGeo, warmTeakMat);
        postFR.position.set(1.5, 1.2, 0.9);
        const postBL = new THREE.Mesh(postGeo, warmTeakMat);
        postBL.position.set(-1.5, 1.2, -0.9);
        const postBR = new THREE.Mesh(postGeo, warmTeakMat);
        postBR.position.set(1.5, 1.2, -0.9);
        mainGroup.add(postFL, postFR, postBL, postBR);

        // Golden Bases for Posts
        for (const [px, pz] of [[-1.5, 0.9], [1.5, 0.9], [-1.5, -0.9], [1.5, -0.9]]) {
          const base = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.28), goldMat);
          base.position.set(px, 0.08, pz);
          mainGroup.add(base);
        }

        // Bale Paon Slanted Thatched Roof (Atap Sirap Bambu)
        const baleRoof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 0.95, 4), thatchedRoofMat);
        baleRoof.rotation.y = Math.PI / 4;
        baleRoof.position.set(0, 2.85, 0);
        mainGroup.add(baleRoof);

        const roofTrim = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.15), goldMat);
        roofTrim.position.set(0, 3.1, 0);
        mainGroup.add(roofTrim);

        // 4 Glowing Hanging Balinese Woven Lanterns (*Lampu Kurungan Bambu*)
        const lanternGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.32, 8);
        const lanternMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1.4 });

        const lanternFL = new THREE.Mesh(lanternGeo, lanternMat);
        lanternFL.position.set(-1.5, 1.9, 0.9);
        const lanternFR = new THREE.Mesh(lanternGeo, lanternMat);
        lanternFR.position.set(1.5, 1.9, 0.9);
        mainGroup.add(lanternFL, lanternFR);

        // Warm Ambient Kitchen Lighting
        const warmKitchenLight = new THREE.PointLight(0xf59e0b, 2.5, 7);
        warmKitchenLight.position.set(0, 2.0, 0.3);
        mainGroup.add(warmKitchenLight);

        // ACTIVE TRADITIONAL CHARCOAL BBQ GRILL TABLE (*Panggangan Sate Lilit*)
        const bbqTable = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.65, 0.55), darkStoneMat);
        bbqTable.position.set(-0.7, 0.32, 0.9);
        const bbqEmber = new THREE.Mesh(
          new THREE.BoxGeometry(1.3, 0.06, 0.45),
          new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xf97316, emissiveIntensity: 1.5 })
        );
        bbqEmber.position.set(-0.7, 0.66, 0.9);
        mainGroup.add(bbqTable, bbqEmber);

        // Sate Lilit Skewers with Lemongrass Stalks on Active Grill
        for (let s = 0; s < 6; s++) {
          const sateStick = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.38), new THREE.MeshStandardMaterial({ color: 0xd9f99d }));
          sateStick.rotation.x = Math.PI / 2;
          sateStick.position.set(-1.15 + s * 0.18, 0.72, 0.9);
          const sateMeat = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.22), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }));
          sateMeat.rotation.x = Math.PI / 2;
          sateMeat.position.set(-1.15 + s * 0.18, 0.72, 0.9);
          mainGroup.add(sateStick, sateMeat);
        }

        // BALINESE SPICE PREP COUNTER: Cobek Batu (Stone Mortar), Clay Bowls & Kukusan
        const prepCounter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 0.65), amberWoodMat);
        prepCounter.position.set(0.75, 0.32, 0.85);
        mainGroup.add(prepCounter);

        // Cobek Batu (Stone Mortar & Pestle)
        const cobek = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.08, 16), darkStoneMat);
        cobek.position.set(0.6, 0.68, 0.85);
        const ulekan = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.14, 8), darkStoneMat);
        ulekan.rotation.z = 0.5;
        ulekan.position.set(0.65, 0.74, 0.85);
        mainGroup.add(cobek, ulekan);

        // Woven Bamboo Steamer (*Kukusan Tumpeng*)
        const kukusan = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.32, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 }));
        kukusan.position.set(1.0, 0.8, 0.85);
        mainGroup.add(kukusan);

        // FLOATING 3D AR HOLOGRAPHIC SIGNBOARD WITH CRISP TEXT & SATE EMBLEM
        const signboardGroup = new THREE.Group();
        signboardGroup.position.set(0, 2.05, 1.65);

        const signTexture = createStoreSignboardTexture(
          'BANGJO AR • KULINER NATAH UTARA',
          'DAPUR BAMBU ASRI',
          'Pekarangan Adat No. 08 • Natah Utara',
          'Sate Lilit Aroma Batang Sereh • Tipat Cantok • Base Genep',
          '#f59e0b',
          '#fb923c',
          '#451a03'
        );

        if (signTexture) {
          const signMat = new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.2, metalness: 0.3 });
          const signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.95, 0.08), signMat);
          const signBorder = new THREE.Mesh(new THREE.BoxGeometry(2.78, 1.03, 0.06), goldMat);
          signBorder.position.z = -0.02;
          signboardGroup.add(signBoard, signBorder);
        }

        // Floating 3D Sate Lilit Skewers Emblem
        const sateEmblemGroup = new THREE.Group();
        sateEmblemGroup.position.set(0, 0.68, 0);
        for (let s = 0; s < 3; s++) {
          const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42), new THREE.MeshStandardMaterial({ color: 0xd9f99d }));
          stick.rotation.z = (s - 1) * 0.35;
          const meat = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.048, 0.22), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 }));
          meat.position.set(0, 0.08, 0);
          meat.rotation.z = (s - 1) * 0.35;
          sateEmblemGroup.add(stick, meat);
        }
        signboardGroup.add(sateEmblemGroup);

        mainGroup.add(signboardGroup);
        floatingIcons.push({ group: signboardGroup, basePosY: 2.05, seed: 3 });
      }
    }

    // =========================================================================
    // 3. AI MAKEOVER: 3D TRADITIONAL WARUNG (BEFORE VS AFTER 3D LAYOUT)
    // =========================================================================
    else if (mode === 'makeover') {
      mainGroup.position.set(0, -0.2, 0);

      // Stone & Cobblestone Foundation Platform
      const floor = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.18, 4.0), darkStoneMat);
      floor.position.y = -0.09;
      mainGroup.add(floor);

      if (makeoverState === 'before') {
        // --- BEFORE: DULL PLAIN CONVENTIONAL TABLE (No Structure, Messy) ---
        const plainTable = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.75, 1.3), new THREE.MeshStandardMaterial({ color: 0x785338, roughness: 0.9 }));
        plainTable.position.set(0, 0.38, 0);
        mainGroup.add(plainTable);

        // Cluttered Plain Box
        const messyBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.6), new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.95 }));
        messyBox.position.set(-0.7, 0.95, 0.1);
        mainGroup.add(messyBox);

        // Scattered Gray Bottles
        for (let b = 0; b < 5; b++) {
          const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.32, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
          bottle.position.set(-0.1 + b * 0.22, 0.92, (b % 2) * 0.3 - 0.15);
          mainGroup.add(bottle);
        }

        // Tilted plastic bag
        const bag = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 0), new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.8 }));
        bag.position.set(0.85, 0.88, 0.2);
        mainGroup.add(bag);

      } else {
        // --- AFTER: AUTHENTIC TRADITIONAL BALINESE KEDAI / WARUNG STRUCTURE ---
        
        // 1. KEDAI BOOTH PILLARS & ARCHITECTURE (4 Bamboo / Teak Support Pillars)
        const pillarGeo = new THREE.CylinderGeometry(0.065, 0.075, 2.3, 16);
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });

        const pillarFL = new THREE.Mesh(pillarGeo, pillarMat);
        pillarFL.position.set(-1.4, 1.15, 0.9);
        const pillarFR = new THREE.Mesh(pillarGeo, pillarMat);
        pillarFR.position.set(1.4, 1.15, 0.9);
        const pillarBL = new THREE.Mesh(pillarGeo, pillarMat);
        pillarBL.position.set(-1.4, 1.15, -0.9);
        const pillarBR = new THREE.Mesh(pillarGeo, pillarMat);
        pillarBR.position.set(1.4, 1.15, -0.9);
        mainGroup.add(pillarFL, pillarFR, pillarBL, pillarBR);

        // Golden Bases for Pillars
        for (const [px, pz] of [[-1.4, 0.9], [1.4, 0.9], [-1.4, -0.9], [1.4, -0.9]]) {
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.12, 12), goldMat);
          base.position.set(px, 0.06, pz);
          mainGroup.add(base);
        }

        // Top Roof Crossbeams (Rangka Atap Kayu)
        const beamF = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 0.08), woodMat);
        beamF.position.set(0, 2.25, 0.9);
        const beamB = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 0.08), woodMat);
        beamB.position.set(0, 2.45, -0.9);
        const beamL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.9), woodMat);
        beamL.position.set(-1.4, 2.35, 0);
        const beamR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.9), woodMat);
        beamR.position.set(1.4, 2.35, 0);
        mainGroup.add(beamF, beamB, beamL, beamR);

        // Sloping Balinese Bamboo Thatched Roof Awning (Atap Sirap Bambu)
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.95 });
        const roofShed = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 2.3), roofMat);
        roofShed.position.set(0, 2.42, 0.05);
        roofShed.rotation.x = 0.12; // Slanted down towards front
        mainGroup.add(roofShed);

        // Woven Bamboo Roof Ridge Trim (Lis Bambu)
        const roofTrim = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.08, 0.15), goldMat);
        roofTrim.position.set(0, 2.56, -1.05);
        mainGroup.add(roofTrim);

        // 2. FRONT SERVING COUNTER WITH WOVEN BAMBOO SLATS & SIGNBOARD
        const counterBase = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.8, 1.2), new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.7 }));
        counterBase.position.set(0, 0.4, 0);
        mainGroup.add(counterBase);

        // Front Bamboo Woven Slat Facade Panels
        for (let p = 0; p < 7; p++) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.72, 0.04), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 }));
          slat.position.set(-1.08 + p * 0.36, 0.4, 0.62);
          mainGroup.add(slat);
        }

        // SIGNBOARD: "WARUNG INFOR UPNVJT"
        const signCanvas = document.createElement('canvas');
        signCanvas.width = 1024;
        signCanvas.height = 256;
        const sCtx = signCanvas.getContext('2d');
        if (sCtx) {
          // Dark Teak Plang Background
          sCtx.fillStyle = '#1e0c03';
          sCtx.fillRect(0, 0, 1024, 256);

          // Outer Gold Border
          sCtx.strokeStyle = '#f59e0b';
          sCtx.lineWidth = 14;
          sCtx.strokeRect(12, 12, 1000, 232);

          // Inner Red Accent Line
          sCtx.strokeStyle = '#e31837';
          sCtx.lineWidth = 5;
          sCtx.strokeRect(26, 26, 972, 204);

          // Text Shadow
          sCtx.shadowColor = '#000000';
          sCtx.shadowBlur = 10;
          sCtx.shadowOffsetX = 3;
          sCtx.shadowOffsetY = 3;

          // Main Text
          sCtx.fillStyle = '#FFFFFF';
          sCtx.font = 'bold 74px "Segoe UI", Arial, sans-serif';
          sCtx.textAlign = 'center';
          sCtx.textBaseline = 'middle';
          sCtx.fillText('WARUNG INFOR UPNVJT', 512, 128);

          const signTexture = new THREE.CanvasTexture(signCanvas);
          signTexture.needsUpdate = true;

          const signMat = new THREE.MeshStandardMaterial({
            map: signTexture,
            roughness: 0.35,
            metalness: 0.15
          });

          const signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.46, 0.06), signMat);
          signBoard.position.set(0, 0.4, 0.65);
          mainGroup.add(signBoard);

          // Top and Bottom Golden Mounting Trim
          const mountTop = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.04, 0.08), goldMat);
          mountTop.position.set(0, 0.64, 0.65);
          const mountBot = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.04, 0.08), goldMat);
          mountBot.position.set(0, 0.16, 0.65);
          mainGroup.add(mountTop, mountBot);
        }

        // Counter Top Slab (Polished Teak)
        const counterTop = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.08, 1.35), new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.4 }));
        counterTop.position.set(0, 0.82, 0);
        mainGroup.add(counterTop);

        // Woven Bamboo Table Runner
        const runner = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.02, 0.85), bananaLeafMat);
        runner.position.set(0, 0.87, 0.05);
        mainGroup.add(runner);

        // 3. TIERED BAMBOO DISPLAY RACK (3-Tier Rak Susun Produk)
        const rackGroup = new THREE.Group();
        rackGroup.position.set(-0.75, 0.88, 0);

        for (let r = 0; r < 3; r++) {
          const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.45), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }));
          shelf.position.set(0, r * 0.26, -r * 0.06);
          rackGroup.add(shelf);

          // Emerald Green Loloh Cemcem Herbal Drink Bottles
          for (let b = 0; b < 3; b++) {
            const bot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.25, metalness: 0.1 }));
            bot.position.set(-0.25 + b * 0.25, r * 0.26 + 0.12, -r * 0.06);
            
            // Bottle Cap
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 8), goldMat);
            cap.position.set(-0.25 + b * 0.25, r * 0.26 + 0.23, -r * 0.06);
            rackGroup.add(bot, cap);
          }
        }
        mainGroup.add(rackGroup);

        // 4. TERRACOTTA CLAY DISPENSER JAR & BAMBOO TUMBLERS (Gentong Tradisional)
        const clayJarGroup = new THREE.Group();
        clayJarGroup.position.set(0.85, 0.88, -0.15);

        // Terracotta Body
        const clayBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.52, 16), new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.85 }));
        clayBody.position.y = 0.26;
        const clayLid = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.14, 16), woodMat);
        clayLid.position.y = 0.56;
        const spigot = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8), goldMat);
        spigot.rotation.x = Math.PI / 2;
        spigot.position.set(0, 0.15, 0.22);
        clayJarGroup.add(clayBody, clayLid, spigot);

        // Set of Bamboo Cups
        for (let c = 0; c < 2; c++) {
          const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.15, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }));
          cup.position.set(-0.25 + c * 0.16, 0.08, 0.35);
          clayJarGroup.add(cup);
        }
        mainGroup.add(clayJarGroup);

        // 5. WOODEN CARVED QRIS PAYMENT STAND
        const qrisGroup = new THREE.Group();
        qrisGroup.position.set(0.12, 0.88, 0.32);
        qrisGroup.rotation.y = -0.2;

        const qrisStandWood = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, 0.04), goldMat);
        qrisStandWood.position.y = 0.18;
        const qrisFace = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.02), new THREE.MeshBasicMaterial({ color: 0x002B49 }));
        qrisFace.position.set(0, 0.18, 0.02);
        qrisGroup.add(qrisStandWood, qrisFace);
        mainGroup.add(qrisGroup);

        // 6. CANANG SARI FLORAL OFFERING ON COUNTER CORNER
        const canangBox = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.22), bananaLeafMat);
        canangBox.position.set(-1.15, 0.88, 0.4);
        const flowerOff = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
        flowerOff.position.set(-1.15, 0.93, 0.4);
        mainGroup.add(canangBox, flowerOff);

        // 7. GLOWING WOVEN BAMBOO LANTERNS (Lampu Kurungan Adat)
        const lanternGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.28, 8);
        const lanternMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1.2 });

        const lanternL = new THREE.Mesh(lanternGeo, lanternMat);
        lanternL.position.set(-1.0, 1.95, 0.6);
        const lanternR = new THREE.Mesh(lanternGeo, lanternMat);
        lanternR.position.set(1.0, 1.95, 0.6);
        mainGroup.add(lanternL, lanternR);

        // Warm Interior Ambient Light
        const warungLight = new THREE.PointLight(0xf59e0b, 2.4, 5.5);
        warungLight.position.set(0, 1.8, 0.3);
        mainGroup.add(warungLight);

        // Floating AI Optimization Hologram Crystal
        const aiBadge = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.9 }));
        aiBadge.position.set(0, 2.85, 0);
        mainGroup.add(aiBadge);
        floatingIcons.push({ group: aiBadge, basePosY: 2.85, seed: 2 });
      }
    }

    // =========================================================================
    // 4. FOOD INSPECTION (4 DISTINCT DISHES)
    // =========================================================================
    else if (mode === 'food') {
      mainGroup.position.set(0, 0, 0);

      if (dishId === 'lawar-kuwir') {
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.3, 0.08, 32), bananaLeafMat);
        plate.position.y = -0.2;
        mainGroup.add(plate);

        const rice = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.7, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        rice.position.set(0, 0.15, 0);
        mainGroup.add(rice);
        explodedParts.push({ mesh: rice, origin: new THREE.Vector3(0, 0.15, 0), target: new THREE.Vector3(0, 1.0, 0) });

        const lawar = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45, 1), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 }));
        lawar.position.set(-0.6, 0.05, 0.3);
        mainGroup.add(lawar);
        explodedParts.push({ mesh: lawar, origin: new THREE.Vector3(-0.6, 0.05, 0.3), target: new THREE.Vector3(-1.1, 0.6, 0.6) });

        for (let i = 0; i < 3; i++) {
          const sateGroup = new THREE.Group();
          const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.0), new THREE.MeshStandardMaterial({ color: 0xd9f99d }));
          stick.rotation.z = Math.PI / 4;
          const meat = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.5), new THREE.MeshStandardMaterial({ color: 0x78350f }));
          meat.position.set(0.15, 0.15, 0);
          meat.rotation.z = Math.PI / 4;
          sateGroup.add(stick, meat);
          sateGroup.position.set(0.5 + i * 0.2, -0.05, -0.2 + i * 0.25);
          mainGroup.add(sateGroup);
        }

      } else if (dishId === 'loloh-cemcem') {
        const coaster = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.1, 0.06, 24), new THREE.MeshStandardMaterial({ color: 0x78350f }));
        coaster.position.y = -0.4;
        mainGroup.add(coaster);

        const bottleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.2, 24), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, transmission: 0.9 }));
        bottleBody.position.y = 0.2;
        const bottleNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 0.4, 24), bottleBody.material);
        bottleNeck.position.y = 0.95;
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 24), goldMat);
        cap.position.y = 1.2;
        mainGroup.add(bottleBody, bottleNeck, cap);

        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.0, 24), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
        liquid.position.y = 0.15;
        mainGroup.add(liquid);
        explodedParts.push({ mesh: liquid, origin: new THREE.Vector3(0, 0.15, 0), target: new THREE.Vector3(0, 0.8, 0) });

      } else if (dishId === 'sate-lilit') {
        const grill = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.2, 0.2, 32), new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 }));
        grill.position.y = -0.3;
        mainGroup.add(grill);

        for (let s = 0; s < 5; s++) {
          const sateItem = new THREE.Group();
          const angle = (s - 2) * 0.25;
          const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.3), new THREE.MeshStandardMaterial({ color: 0xd9f99d }));
          stick.rotation.z = angle;
          const meat = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.7), new THREE.MeshStandardMaterial({ color: 0x78350f }));
          meat.position.set(Math.sin(angle) * 0.3, 0.2, 0);
          meat.rotation.z = angle;
          sateItem.add(stick, meat);
          sateItem.position.set((s - 2) * 0.25, 0.05, 0);
          mainGroup.add(sateItem);
          explodedParts.push({ mesh: sateItem, origin: sateItem.position.clone(), target: new THREE.Vector3((s - 2) * 0.6, 0.7, 0) });
        }

        const sambalBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.2, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0x1f2937 }));
        sambalBowl.position.set(0, 0.1, 0.8);
        mainGroup.add(sambalBowl);
        explodedParts.push({ mesh: sambalBowl, origin: new THREE.Vector3(0, 0.1, 0.8), target: new THREE.Vector3(0, 0.4, 1.4) });

      } else if (dishId === 'tipat-cantok') {
        const ingkaPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.3, 0.1, 32), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
        ingkaPlate.position.y = -0.25;
        mainGroup.add(ingkaPlate);

        for (let t = 0; t < 4; t++) {
          const tipat = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.35), new THREE.MeshStandardMaterial({ color: 0xffffff }));
          tipat.rotation.y = Math.PI / 4 + t * 0.4;
          tipat.position.set((t % 2 === 0 ? -0.3 : 0.3), 0.0, (t < 2 ? -0.2 : 0.2));
          mainGroup.add(tipat);
          explodedParts.push({ mesh: tipat, origin: tipat.position.clone(), target: new THREE.Vector3(tipat.position.x * 2.2, 0.6, tipat.position.z * 2.2) });
        }

        const sauce = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        sauce.position.set(0, 0.18, 0);
        mainGroup.add(sauce);
      }
    }
    // =========================================================================
    // 5. POKEMON GO WEBAR PASSTHROUGH: 3D AR CULTURAL OBJECT OVER LIVE CAMERA
    // =========================================================================
    else if (mode === 'pokemon_go') {
      const activeId = targetSpotId || 'spot-photo';
      mainGroup.position.set(0, 0, 0);

      // A. Ground Holographic AR Mandala Projection Ring & Soft Shadow
      const shadowDisc = new THREE.Mesh(
        new THREE.CircleGeometry(1.6, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
      );
      shadowDisc.rotation.x = -Math.PI / 2;
      shadowDisc.position.y = -0.58;
      mainGroup.add(shadowDisc);

      // Concentric glowing holographic rings
      const arRing1 = new THREE.Mesh(
        new THREE.RingGeometry(1.4, 1.48, 48),
        new THREE.MeshBasicMaterial({ color: 0x00A3E0, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
      );
      arRing1.rotation.x = -Math.PI / 2;
      arRing1.position.y = -0.56;

      const arRing2 = new THREE.Mesh(
        new THREE.RingGeometry(1.75, 1.82, 48),
        new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
      );
      arRing2.rotation.x = -Math.PI / 2;
      arRing2.position.y = -0.56;

      mainGroup.add(arRing1, arRing2);

      // 4 Cardinal Sacred Direction Orbs on the AR Ring
      for (let d = 0; d < 4; d++) {
        const rad = (d * Math.PI) / 2;
        const orb = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.08, 0),
          new THREE.MeshStandardMaterial({ color: 0x00A3E0, emissive: 0x00A3E0, emissiveIntensity: 1.2 })
        );
        orb.position.set(Math.cos(rad) * 1.6, -0.54, Math.sin(rad) * 1.6);
        mainGroup.add(orb);
      }

      // B. 3D Model Building per targetSpotId
      const modelHolder = new THREE.Group();
      modelHolder.position.set(0, 0, 0);

      if (activeId === 'spot-temple') {
        // --- 1. PURA PENATARAN AGUNG (UTAMA MANDALA) ---
        // Stone Base Platform & Steps
        const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 2.4), darkStoneMat);
        base.position.y = -0.45;
        modelHolder.add(base);

        for (let s = 0; s < 3; s++) {
          const step = new THREE.Mesh(new THREE.BoxGeometry(1.4 - s * 0.2, 0.08, 0.35), darkStoneMat);
          step.position.set(0, -0.4 + s * 0.08, 0.9 - s * 0.2);
          modelHolder.add(step);
        }

        // Candi Bentar Split Gate Pillars
        for (let t = 0; t < 6; t++) {
          const w = 0.75 - t * 0.09;
          const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.45, 0.6), t % 2 === 0 ? brickMat : darkStoneMat);
          leftPillar.position.set(-0.75, -0.2 + t * 0.4, 0);
          const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.45, 0.6), t % 2 === 0 ? brickMat : darkStoneMat);
          rightPillar.position.set(0.75, -0.2 + t * 0.4, 0);

          const goldTrimL = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, 0.06, 0.62), goldMat);
          goldTrimL.position.set(-0.75, 0.02 + t * 0.4, 0);
          const goldTrimR = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, 0.06, 0.62), goldMat);
          goldTrimR.position.set(0.75, 0.02 + t * 0.4, 0);

          modelHolder.add(leftPillar, rightPillar, goldTrimL, goldTrimR);
        }

        // Saput Poleng & Yellow Sash
        const clothL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.38, 0.65), polengMat);
        clothL.position.set(-0.75, -0.2, 0);
        const sashL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 0.7), sashYellowMat);
        sashL.position.set(-0.75, -0.1, 0);

        const clothR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.38, 0.65), polengMat);
        clothR.position.set(0.75, -0.2, 0);
        const sashR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 0.7), sashYellowMat);
        sashR.position.set(0.75, -0.1, 0);
        modelHolder.add(clothL, sashL, clothR, sashR);

        // Center Padmasana Shrine
        const altar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 0.65), darkStoneMat);
        altar.position.set(0, -0.05, -0.35);
        const altarRoof = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.5, 4), thatchedRoofMat);
        altarRoof.rotation.y = Math.PI / 4;
        altarRoof.position.set(0, 0.55, -0.35);
        modelHolder.add(altar, altarRoof);

        // Twin Golden Penjor Poles
        for (const side of [-1.5, 1.5]) {
          const penjorPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 2.6, 8), woodMat);
          penjorPole.position.set(side, 0.8, 0.2);
          const penjorTip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 8), sashYellowMat);
          penjorTip.position.set(side, 2.1, 0.2);
          penjorTip.rotation.z = side > 0 ? 0.3 : -0.3;
          modelHolder.add(penjorPole, penjorTip);
        }

        // Royal Yellow Tedung Agung (Ceremonial Umbrellas)
        const umbrella = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.35, 16), sashYellowMat);
        umbrella.position.set(0, 1.25, -0.35);
        const umbStaff = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1), woodMat);
        umbStaff.position.set(0, 0.75, -0.35);
        modelHolder.add(umbrella, umbStaff);

      } else if (activeId === 'spot-craft') {
        // --- 2. PUSAT ANYAMAN BAMBU PAK KETUT (MADYA MANDALA) ---
        // Raised Bamboo Platform
        const platform = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 2.2), woodMat);
        platform.position.y = -0.45;
        modelHolder.add(platform);

        // 4 Bamboo Pillars
        for (const px of [-1.2, 1.2]) {
          for (const pz of [-0.8, 0.8]) {
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }));
            pillar.position.set(px, 0.45, pz);
            modelHolder.add(pillar);
          }
        }

        // Thatched Sirap Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.0, 4), thatchedRoofMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(0, 1.7, 0);
        modelHolder.add(roof);

        // Woven Bamboo Craft Shelves & Baskets
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.5), woodMat);
        shelf.position.set(0, -0.15, -0.5);
        modelHolder.add(shelf);

        // Woven Sokasi Baskets on Display
        for (let b = 0; b < 3; b++) {
          const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.25, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 }));
          basket.position.set(-0.55 + b * 0.55, 0.28, -0.5);
          modelHolder.add(basket);
        }

        // Hanging Glowing Bamboo Lantern
        const lantern = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.16, 0.35, 8),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1.4 })
        );
        lantern.position.set(0, 0.9, 0.3);
        modelHolder.add(lantern);

      } else if (activeId === 'spot-loloh') {
        // --- 3. PUSAT KULINER LOLOH CEMCEM ---
        // Wooden Tasting Table
        const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 1.8), woodMat);
        tableTop.position.y = -0.1;
        modelHolder.add(tableTop);

        for (const tx of [-1.1, 1.1]) {
          for (const tz of [-0.7, 0.7]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5), darkStoneMat);
            leg.position.set(tx, -0.35, tz);
            modelHolder.add(leg);
          }
        }

        // Center Big Loloh Cemcem Bottle with Green Liquid & Glass Material
        const bottleBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.35, 1.1, 24),
          new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, transmission: 0.9 })
        );
        bottleBody.position.set(0, 0.5, 0);
        const bottleNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.35, 0.35, 24), bottleBody.material);
        bottleNeck.position.set(0, 1.15, 0);
        const bottleCap = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.1, 24), goldMat);
        bottleCap.position.set(0, 1.35, 0);

        const greenLiquid = new THREE.Mesh(
          new THREE.CylinderGeometry(0.31, 0.31, 0.9, 24),
          new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3, emissive: 0x15803d, emissiveIntensity: 0.3 })
        );
        greenLiquid.position.set(0, 0.45, 0);
        modelHolder.add(bottleBody, bottleNeck, bottleCap, greenLiquid);

        // Clay Water Jar (Kendi Tradisional)
        const clayJar = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 }));
        clayJar.position.set(-0.75, 0.28, 0.2);
        const claySpout = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.25, 12), clayJar.material);
        claySpout.position.set(-0.75, 0.6, 0.2);
        modelHolder.add(clayJar, claySpout);

        // Bamboo Drinking Cups
        for (let c = 0; c < 2; c++) {
          const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }));
          cup.position.set(0.65 + c * 0.25, 0.12, 0.25);
          modelHolder.add(cup);
        }

      } else if (activeId === 'spot-festival') {
        // --- 4. PANGGUNG BUDAYA FESTIVAL PENGLIPURAN ---
        // Cultural Festival Stage Platform
        const stage = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.3, 2.4), polengMat);
        stage.position.y = -0.42;
        const stageTrim = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 2.5), sashYellowMat);
        stageTrim.position.y = -0.3;
        modelHolder.add(stage, stageTrim);

        // Multi-tiered Gebogan Fruit & Flower Tower
        const geboganBase = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 0.15, 16), goldMat);
        geboganBase.position.set(0, -0.2, 0);
        const geboganFruits = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 }));
        geboganFruits.position.set(0, 0.45, 0);
        const geboganSampian = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), flowerPinkMat);
        geboganSampian.position.set(0, 1.15, 0);
        modelHolder.add(geboganBase, geboganFruits, geboganSampian);

        // Twin Royal Yellow Tedung Agung Umbrellas
        for (const ux of [-1.2, 1.2]) {
          const umb = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.35, 16), sashYellowMat);
          umb.position.set(ux, 1.3, -0.3);
          const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), woodMat);
          staff.position.set(ux, 0.4, -0.3);
          modelHolder.add(umb, staff);
        }

        // Golden Gong & Frame
        const gongFrame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.1), woodMat);
        gongFrame.position.set(-0.9, 0.2, 0.4);
        const gongDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16), goldMat);
        gongDisc.rotation.x = Math.PI / 2;
        gongDisc.position.set(-0.9, 0.2, 0.42);
        modelHolder.add(gongFrame, gongDisc);

      } else if (activeId === 'spot-lawar') {
        // --- 5. WARUNG LAWAR KUWIR NATAH UTARA ---
        // Woven Table Platform
        const diningTable = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 2.0), woodMat);
        diningTable.position.y = -0.15;
        modelHolder.add(diningTable);

        // Large Banana Leaf Platter
        const platter = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.9, 0.05, 24), bananaLeafMat);
        platter.position.set(0, -0.05, 0);
        modelHolder.add(platter);

        // Nasi Tumpeng Cone
        const rice = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.65, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
        rice.position.set(0, 0.3, -0.1);
        modelHolder.add(rice);

        // Spiced Lawar Meat
        const lawar = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 1), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 }));
        lawar.position.set(-0.4, 0.15, 0.25);
        modelHolder.add(lawar);

        // Sate Lilit Skewers on Lemongrass
        for (let s = 0; s < 3; s++) {
          const sateGroup = new THREE.Group();
          const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7), new THREE.MeshStandardMaterial({ color: 0xd9f99d }));
          stick.rotation.z = Math.PI / 4;
          const meat = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.35), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 }));
          meat.position.set(0.1, 0.1, 0);
          meat.rotation.z = Math.PI / 4;
          sateGroup.add(stick, meat);
          sateGroup.position.set(0.3 + s * 0.15, 0.05, -0.1 + s * 0.18);
          modelHolder.add(sateGroup);
        }

        // Sambal Matah Bowl
        const sambalBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 0.1, 16), darkStoneMat);
        sambalBowl.position.set(0, 0.05, 0.5);
        const sambalContent = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        sambalContent.position.set(0, 0.09, 0.5);
        modelHolder.add(sambalBowl, sambalContent);

      } else if (activeId === 'spot-bamboo-forest') {
        // --- 6. HUTAN KONSERVASI BAMBU SAKRAL ---
        // Mossy Ground Mound
        const forestGround = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.2, 24), new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 }));
        forestGround.position.y = -0.45;
        modelHolder.add(forestGround);

        // Dense Cluster of Tall Bamboo Poles
        const bambooMatGreen = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 });
        const bambooMatGold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });

        const bambooPositions = [
          [-0.8, -0.4, 2.6, bambooMatGreen],
          [-0.5, -0.6, 2.9, bambooMatGold],
          [-0.3, 0.2, 2.7, bambooMatGreen],
          [0.4, -0.5, 3.1, bambooMatGold],
          [0.7, -0.2, 2.8, bambooMatGreen],
          [0.9, 0.3, 2.5, bambooMatGold],
          [-0.9, 0.4, 2.4, bambooMatGreen]
        ];

        bambooPositions.forEach(([bx, bz, bh, bMat]) => {
          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, bh, 8), bMat);
          stem.position.set(bx, -0.45 + bh / 2, bz);
          modelHolder.add(stem);
          for (let n = 1; n < 4; n++) {
            const node = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 8), darkStoneMat);
            node.position.set(bx, -0.45 + (bh / 4) * n, bz);
            modelHolder.add(node);
          }
        });

        // Sacred Guardian Stone Shrine with Saput Poleng
        const shrine = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.75, 0.45), darkStoneMat);
        shrine.position.set(0, -0.05, 0.2);
        const shrineCloth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.5), polengMat);
        shrineCloth.position.set(0, -0.1, 0.2);
        const shrineSash = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.52), sashYellowMat);
        shrineSash.position.set(0, 0.02, 0.2);
        modelHolder.add(shrine, shrineCloth, shrineSash);

      } else {
        // --- 7. PEKARANGAN ADAT NO. 04 / ANGKUL-ANGKUL TRADISIONAL (DEFAULT) ---
        // Raised Andesite Stone Base
        const stoneBase = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.2, 2.2), darkStoneMat);
        stoneBase.position.y = -0.45;
        modelHolder.add(stoneBase);

        // Angkul-Angkul Tiered Red Brick Pillars
        for (let t = 0; t < 5; t++) {
          const w = 0.55 - t * 0.04;
          const h = 0.38;
          const pL = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.55), t % 2 === 0 ? brickMat : darkStoneMat);
          pL.position.set(-0.65, -0.2 + t * 0.35, 0);
          const pR = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.55), t % 2 === 0 ? brickMat : darkStoneMat);
          pR.position.set(0.65, -0.2 + t * 0.35, 0);

          const goldL = new THREE.Mesh(new THREE.BoxGeometry(w * 0.95, 0.05, 0.58), goldMat);
          goldL.position.set(-0.65, -0.02 + t * 0.35, 0);
          const goldR = new THREE.Mesh(new THREE.BoxGeometry(w * 0.95, 0.05, 0.58), goldMat);
          goldR.position.set(0.65, -0.02 + t * 0.35, 0);

          modelHolder.add(pL, pR, goldL, goldR);
        }

        // Saput Poleng & Yellow Sash on Pillars
        const cloth1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.6), polengMat);
        cloth1.position.set(-0.65, -0.15, 0);
        const sash1 = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.08, 0.64), sashYellowMat);
        sash1.position.set(-0.65, -0.05, 0);

        const cloth2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.6), polengMat);
        cloth2.position.set(0.65, -0.15, 0);
        const sash2 = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.08, 0.64), sashYellowMat);
        sash2.position.set(0.65, -0.05, 0);
        modelHolder.add(cloth1, sash1, cloth2, sash2);

        // Lintel Wooden Beam & Thatched Sirap Roof
        const beam = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.18, 0.5), woodMat);
        beam.position.set(0, 1.45, 0);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.7, 4), thatchedRoofMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(0, 1.95, 0);
        const murda = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.2), goldMat);
        murda.position.set(0, 2.35, 0);
        modelHolder.add(beam, roof, murda);

        // Carved Teakwood Double Doors
        const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.3, 0.32), woodMat);
        doorL.position.set(-0.16, 0.45, 0.05);
        doorL.rotation.y = 0.35;
        const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.3, 0.32), woodMat);
        doorR.position.set(0.16, 0.45, 0.05);
        doorR.rotation.y = -0.35;
        modelHolder.add(doorL, doorR);

        // Pelinggih Apit Lawang Shrines with Canang Sari
        for (const sx of [-1.15, 1.15]) {
          const shrine = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 0.3), darkStoneMat);
          shrine.position.set(sx, -0.15, 0.15);
          const canang = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.16), bananaLeafMat);
          canang.position.set(sx, 0.14, 0.15);
          const flw = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), flowerPinkMat);
          flw.position.set(sx, 0.18, 0.15);
          modelHolder.add(shrine, canang, flw);
        }

        // Tembok Panyengker Red Brick Perimeter Walls
        const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.2), brickMat);
        wallL.position.set(-1.4, -0.05, 0);
        const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.2), brickMat);
        wallR.position.set(1.4, -0.05, 0);
        modelHolder.add(wallL, wallR);
      }

      mainGroup.add(modelHolder);

      // C. Clickable Hitbox for Touch Raycasting
      const hitbox = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 3.2, 12), new THREE.MeshBasicMaterial({ visible: false }));
      hitbox.position.y = 0.8;
      hitbox.userData = { id: activeId };
      modelHolder.add(hitbox);
      clickableLandmarks.push(hitbox);

      // D. Floating Holographic Diamond Beacon & Glowing Recognition Wireframe
      const diamondMat = new THREE.MeshStandardMaterial({
        color: 0x00A3E0,
        emissive: 0x00A3E0,
        emissiveIntensity: 1.4,
        metalness: 0.8,
        roughness: 0.2
      });
      const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), diamondMat);
      diamond.position.y = 2.65;
      modelHolder.add(diamond);
      floatingIcons.push({ group: diamond, basePosY: 2.65, seed: 1 });

      const wireframeBox = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 3.2, 2.4),
        new THREE.MeshBasicMaterial({ color: 0x00A3E0, wireframe: true, transparent: true, opacity: 0.4 })
      );
      wireframeBox.position.y = 0.9;
      modelHolder.add(wireframeBox);
    }

    // Atmospheric Floating Golden Fireflies & Embers (Kunang-Kunang Bali)
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 12;
      particlePos[i + 1] = Math.random() * 4.5 + 0.2;
      particlePos[i + 2] = -Math.random() * 50;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: 0xfacc15, size: 0.09, transparent: true, opacity: 0.85 })
    );
    scene.add(particles);

    // =========================================================================
    // INTERACTION (ORBIT DRAG & RAYCASTER CLICKS)
    // =========================================================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let pointerDownPos = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = mode === 'food' || mode === 'makeover' ? 0.2 : 0;

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      previousMousePosition = { x: clientX, y: clientY };
      pointerDownPos = { x: clientX, y: clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-0.4, Math.min(0.5, targetRotationX));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = (e) => {
      isDragging = false;
      const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
      const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;
      const dist = Math.hypot(clientX - pointerDownPos.x, clientY - pointerDownPos.y);

      // Tap / Click without dragging triggers raycasting
      if (dist < 10 && onSelectSpot && mode === 'pokemon_go' && clickableLandmarks.length > 0) {
        const rect = domElement.getBoundingClientRect();
        const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
        const intersects = raycaster.intersectObjects(clickableLandmarks, true);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit && hit.userData && hit.userData.id) {
            onSelectSpot(hit.userData);
          }
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        if (mode === 'pokemon_go') {
          targetRotationY = Math.sin(elapsedTime * 0.35) * 0.18; // Gentle street gaze across left and right row houses
        } else if (mode === 'temple' && activeHotspot >= 0) {
          // Gentle breathing sway that keeps the focused item perfectly framed in the viewport
          targetRotationY = Math.sin(elapsedTime * 0.4) * 0.1;
        } else if (mode === 'temple') {
          // Subtle temple stage overview sway
          targetRotationY = Math.sin(elapsedTime * 0.25) * 0.2;
        } else {
          targetRotationY += 0.004; // Smooth turntable rotation
        }
      }

      mainGroup.rotation.y = THREE.MathUtils.lerp(mainGroup.rotation.y, targetRotationY, 0.1);
      mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, targetRotationX, 0.1);

      if (mode === 'food' && explodedParts.length > 0) {
        explodedParts.forEach(p => {
          if (p && p.mesh && p.mesh.position) {
            const dest = isExploded ? p.target : p.origin;
            if (dest) p.mesh.position.lerp(dest, 0.08);
          }
        });
      }

      if (floatingIcons.length > 0) {
        floatingIcons.forEach((item) => {
          if (item && item.group && item.group.position) {
            item.group.position.y = item.basePosY + Math.sin(elapsedTime * 2 + item.seed) * 0.15;
          }
        });
      }

      if (animatedWaypoints.length > 0) {
        animatedWaypoints.forEach((wp, idx) => {
          if (wp && wp.position) {
            wp.position.z += 0.045;
            if (wp.position.z > 3) wp.position.z = -38;
          }
        });
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
      if (domElement) {
        domElement.removeEventListener('mousedown', onPointerDown);
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        domElement.removeEventListener('touchstart', onPointerDown);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);
      }
      if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [mode, dishId, merchantId, makeoverState, isExploded, useGyroscope, activeHotspot, targetSpotId, onSelectSpot]);

  return (
    <div 
      ref={mountRef} 
      style={{ height }} 
      className="w-full relative cursor-grab active:cursor-grabbing overflow-hidden touch-none"
    />
  );
}

export default function ThreeCanvas(props) {
  return (
    <ErrorBoundary>
      <ThreeCanvasInner {...props} />
    </ErrorBoundary>
  );
}
