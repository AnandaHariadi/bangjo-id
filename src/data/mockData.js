export const PROJECT_INFO = {
  title: "IMPLEMENTATION OF AUGMENTED REALITY (AR) FOR STRENGTHENING CULTURAL TOURISM BRANDING",
  subtitle: "Heritage Through Technology • Interactive, Educational, Sustainable",
  location: "Penglipuran Village, Bangli – Bali, Indonesia",
  tagline: "Culture Connects People",
  coordinators: [
    {
      name: "Dr. I Gede Susrama Mas Diyasa",
      role: "Coordinator",
      institution: "Faculty of Computer Science, UPN 'Veteran' East Java",
      country: "Indonesia",
      flag: "🇮🇩"
    }
  ]
};

export const FESTIVALS = [
  {
    id: "piodalan",
    name: "Upacara Piodalan & Mepeed",
    category: "Ritual Sakral",
    description: "Arak-arakan sakral warga desa Penglipuran berbusana adat madya dan agung dengan membawa Gebogan (susunan buah dan bunga) menuju Pura Penataran.",
    philosophy: "Perwujudan konsep Tri Hita Karana sebagai ungkapan syukur dan menjaga keselarasan kosmik antara manusia, alam semesta, dan Sang Hyang Widhi.",
    audioTrack: "Gamelan Balaganjur Tabuh Telu",
    duration: "15 Menit",
    hotspots: [
      { title: "Gebogan Buah Lokal", desc: "Susunan buah organik hasil bumi Bali melambangkan persembahan tulus (Yadnya)." },
      { title: "Busana Adat Madya", desc: "Kain tenun khas Penglipuran dengan selempang kuning keemasan." },
      { title: "Tedung Agung", desc: "Payung sakral pelindung pratima dan simbol kesucian ritual." }
    ],
    relatedCuisine: "Lawar Kuwir & Sate Lilit"
  },
  {
    id: "ngrebeg",
    name: "Prosesi Ngrebeg Penglipuran",
    category: "Pembersihan Spiritual",
    description: "Ritual pembersihan desa secara serempak di sepanjang jalur utama desa bebas polusi untuk menetralisir energi negatif.",
    philosophy: "Ritual penyucian natah desa agar tercipta kedamaian batin (Shanti) bagi seluruh warga dan tamu yang berkunjung.",
    audioTrack: "Gamelan Gong Gede Klasik",
    duration: "20 Menit",
    hotspots: [
      { title: "Dupa Gaharu Alami", desc: "Aroma rempah alami pengantar doa ke alam dewata." },
      { title: "Tirta Pembersihan", desc: "Air suci bersumber dari mata air hutan bambu keramat." }
    ],
    relatedCuisine: "Loloh Cemcem & Jajan Bali"
  }
];

export const CULINARY_ITEMS = [
  {
    id: "lawar-kuwir",
    name: "Lawar Kuwir Tradisional",
    origin: "Warisan Kuliner Piodalan Penglipuran",
    price: 35000,
    rating: 4.9,
    spiceLevel: "Sedang (Bumbu Genep)",
    description: "Olahan daging entok (kuwir) khas Bali dengan parutan kelapa bakar, kacang panjang, dan racikan 15 rempah tradisional Bumbu Genep.",
    philosophy: "Simbol keseimbangan 4 penjuru mata angin (Catur Warna) yang disajikan dalam tradisi Megibung (makan bersama).",
    spices: ["Kunyit", "Lengkuas", "Kencur", "Jahe", "Bawang Merah", "Bawang Putih", "Cabai", "Terasi Kusamba"],
    nutrition: "Kaya protein, antioksidan rempah, rendah lemak jenuh.",
    merchantId: "warung-ibu-wayan",
    merchantName: "Warung Tradisional Ibu Wayan Murni"
  },
  {
    id: "loloh-cemcem",
    name: "Loloh Cemcem Segar Asli",
    origin: "Minuman Herbal Khas Desa Penglipuran",
    price: 12000,
    rating: 5.0,
    spiceLevel: "Asam Segar Alami",
    description: "Minuman herbal kesehatan legendaris yang dibuat dari perasan daun cemcem hutan liar, air kelapa muda, garam laut Kusamba, dan gula aren aren murni.",
    philosophy: "Rahasia kebugaran para tetua desa Penglipuran setelah seharian bergotong royong di perkebunan bambu.",
    spices: ["Daun Cemcem Hutan", "Gula Aren Bali", "Garam Kusamba", "Air Kelapa Muda"],
    nutrition: "Menurunkan tekanan darah, melancarkan pencernaan, dan kaya elektrolit alami.",
    merchantId: "kedai-loloh-pak-made",
    merchantName: "Kedai Herbal Loloh Pak Made"
  },
  {
    id: "sate-lilit",
    name: "Sate Lilit Ikan Laut & Bumbu Bali",
    origin: "Hidangan Pesta Adat Bali",
    price: 25000,
    rating: 4.8,
    spiceLevel: "Gurih Rempah",
    description: "Cincangan ikan segar dipadukan dengan kelapa parut dan santan kental, dililitkan pada batang serai wangi lalu dibakar di atas arang batok kelapa.",
    philosophy: "Bentuk lilitan melambangkan ikatan persaudaraan yang erat di antara warga banjar adat.",
    spices: ["Batang Serai", "Kelapa Parut", "Bumbu Genep", "Santan Murni"],
    nutrition: "Asam lemak Omega-3 dan aroma serai relaksasi.",
    merchantId: "dapur-bambu-asri",
    merchantName: "Dapur Bambu Asri Penglipuran"
  },
  {
    id: "tipat-cantok",
    name: "Tipat Cantok Saus Kacang Alami",
    origin: "Kuliner Sehat Pekarangan Desa",
    price: 20000,
    rating: 4.7,
    spiceLevel: "Pedas Manis Gurih",
    description: "Ketupat beras lokal disajikan bersama aneka sayuran rebus segar dari kebun desa, disiram saus kacang tanah kental yang diulek dadakan.",
    philosophy: "Mengedepankan hasil panen organik lokal yang segar langsung dari tanah subur Bangli.",
    spices: ["Kacang Tanah Sangrai", "Bawang Putih Goreng", "Gula Bali", "Jeruk Limau"],
    nutrition: "Tinggi serat nabati dan bebas bahan pengawet.",
    merchantId: "warung-natah-adat",
    merchantName: "Warung Natah Adat Penglipuran"
  }
];

export const MERCHANTS = [
  {
    id: "warung-ibu-wayan",
    name: "Warung Tradisional Ibu Wayan Murni",
    address: "Pekarangan Adat No. 14, Jalur Utama Penglipuran",
    distance: "35 meter (1 min jalan kaki)",
    rating: 4.9,
    reviewsCount: 156,
    qrisNmid: "ID1029384756199",
    host: "Ibu Wayan Murni (Generasi ke-3 Pelestari Resep)",
    signatureMenu: ["Lawar Kuwir", "Nasi Sela", "Loloh Cemcem"],
    verifiedBadge: "UMKM Adat Terverifikasi",
    ecoFriendly: "100% Bebas Plastik Sekali Pakai",
    arStorefront3d: "Plang Ukir Kayu Jati 3D + Banner Digital Melayang"
  },
  {
    id: "kedai-loloh-pak-made",
    name: "Kedai Herbal Loloh Pak Made",
    address: "Pekarangan Adat No. 22, Samping Hutan Bambu",
    distance: "60 meter (2 min jalan kaki)",
    rating: 5.0,
    reviewsCount: 204,
    qrisNmid: "ID1029384756201",
    host: "Pak Made Arnawa (Petani & Peracik Herbal)",
    signatureMenu: ["Loloh Cemcem Dingin", "Teh Daun Bambu", "Jajan Bali Klepon"],
    verifiedBadge: "Herbal Organik Bersertifikat",
    ecoFriendly: "Kemasan Botol Kaca Refillable",
    arStorefront3d: "Lentera Bambu 3D + Efek Daun Herbal Melayang"
  },
  {
    id: "dapur-bambu-asri",
    name: "Dapur Bambu Asri Penglipuran",
    address: "Pekarangan Adat No. 08, Natah Utara",
    distance: "85 meter (3 min jalan kaki)",
    rating: 4.8,
    reviewsCount: 98,
    qrisNmid: "ID1029384756312",
    host: "Keluarga Bapak Ketut Sutama",
    signatureMenu: ["Sate Lilit Ikan", "Ayam Betutu Desa", "Sambal Matah Kecombrang"],
    verifiedBadge: "Kearifan Dapur Tradisional",
    ecoFriendly: "Piring Anyaman Daun Kelapa",
    arStorefront3d: "Patung Penari Bali 3D + Papan Menu Dinamis"
  }
];

export const AI_MAKEOVER_TIPS = [
  {
    title: "Display Produk Anyaman Bambu",
    beforeText: "Meja kayu polos tanpa display terstruktur",
    afterText: "Rak susun 3 tingkat berbahan bambu lokal dengan pencahayaan hangat dan papan QRIS kayu",
    impact: "+45% Daya Tarik Visual Wisatawan Mancanegara"
  },
  {
    title: "Signage & Plang Nama Ramah Lingkungan",
    beforeText: "Kertas menu ditempel di dinding bata",
    afterText: "Papan nama kayu ukir gantung dengan QR code AR interaktif di gerbang Angkul-Angkul",
    impact: "Memenuhi 100% Standar Tata Ruang Adat Penglipuran"
  },
  {
    title: "Pojok Cicip 'Live Tasting Corner'",
    beforeText: "Botol minuman ditaruh di dalam boks es biasa",
    afterText: "Gentong tanah liat pendingin alami berhias daun cemcem segar dan gelas bambu mini",
    impact: "+60% Minat Wisatawan Mencoba & Membeli Langsung"
  }
];
