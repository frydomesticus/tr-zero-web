export interface PowerPlant {
  id: string;
  tesis_adi: string;
  yakit: "Linyit" | "Ithal_Komur" | "Asfaltit";
  kapasite_mw: number;
  emisyon_mt: number;
  komisyon_yili: number;
  lisans_bitis: number;
}

export interface PilotProvince {
  id: string;
  Il_Adi: string;
  Bolge: string;
  Dominant_Sektor: string;
  ETS_Kapsam_Tahmini_MtCO2: number;
  Enlem: number;
  Boylam: number;
  // İki katmanlı pilot il metodolojisi (Haziran 2026):
  // "birincil" → ABM modelindeki 13 kömür santralinden birinin bulunduğu il.
  //   ETS_Kapsam değeri ABM santral toplamından türetilmiştir (gerçek veri).
  // "ikincil"  → Kömür santrali bulunmayan, ancak enerji-yoğun sanayi yapısı
  //   ve AB SKDM/CBAM maruziyeti nedeniyle ETS'ten dolaylı etkilenecek il.
  //   ETS_Kapsam değeri ekonomik bağlam göstergesidir, simülasyon çıktısı değil.
  etki_tipi: "birincil" | "ikincil";
  // Birincil iller için: ildeki ABM santrallerinin adları
  santraller?: string[];
  // Birincil iller için: toplam modellenen kapasite (MW)
  toplam_kapasite_mw?: number;
  // İkincil iller için: SKDM/CBAM ve dolaylı ETS etki notu
  skdm_risk_notu?: string;
}

export interface SectoralEmission {
  Year: number;
  Toplam_LULUCF_Haric: number;
  Enerji_Toplam: number;
  IPPU_Toplam: number;
  Tarim_Toplam: number;
  Atik_Toplam: number;
}

export interface MacCurveOption {
  sektor: string;
  sektor_etiket: string;
  teknoloji: string;
  mac: number; // €/tCO2
  potansiyel: number; // %
  sure: number; // yıl
}

// KÖMÜR SANTRALLERİ — en büyük 13 tesis (ulusal filonun alt-kümesi, tüm filo değil).
// kapasite_mw/komisyon_yili/yakit: EPDK Lisans & GEM Ocak 2026 Turkey Coal Plant Tracker.
// emisyon_mt: tesis bazlı CO2 resmi kaynaklarda kamuya açık DEĞİL → TÜRETİLMİŞ TAHMİN
//   (kapasite × kapasite faktörü × emisyon yoğunluğu; linyit ~1.0-1.2, ithal ~0.85-1.0 tCO2/MWh).
//   13 tesis toplamı ~90.1 Mt; ulusal kömür toplamı (~111 Mt, Ember 2023) değildir.
export const GERCEK_KOMUR_SANTRALLERI: PowerPlant[] = [
  { id: "T005", tesis_adi: "Zonguldak Eren", yakit: "Ithal_Komur", kapasite_mw: 2790, emisyon_mt: 17.0, komisyon_yili: 2010, lisans_bitis: 2053 },
  { id: "T002", tesis_adi: "Afşin-Elbistan B", yakit: "Linyit", kapasite_mw: 1440, emisyon_mt: 11.3, komisyon_yili: 1984, lisans_bitis: 2052 },
  { id: "T001", tesis_adi: "Afşin-Elbistan A", yakit: "Linyit", kapasite_mw: 1355, emisyon_mt: 10.9, komisyon_yili: 1984, lisans_bitis: 2052 },
  { id: "T006", tesis_adi: "İskenderun İSKEN", yakit: "Ithal_Komur", kapasite_mw: 1320, emisyon_mt: 7.8, komisyon_yili: 2003, lisans_bitis: 2039 },
  { id: "T008", tesis_adi: "Cenal Karabiga", yakit: "Ithal_Komur", kapasite_mw: 1320, emisyon_mt: 7.5, komisyon_yili: 2017, lisans_bitis: 2067 },
  { id: "T003", tesis_adi: "Soma B", yakit: "Linyit", kapasite_mw: 990, emisyon_mt: 7.5, komisyon_yili: 1981, lisans_bitis: 2052 },
  { id: "T007", tesis_adi: "Hunutlu", yakit: "Ithal_Komur", kapasite_mw: 1320, emisyon_mt: 7.2, komisyon_yili: 2022, lisans_bitis: 2064 },
  { id: "T009", tesis_adi: "Kemerköy", yakit: "Linyit", kapasite_mw: 630, emisyon_mt: 4.4, komisyon_yili: 1994, lisans_bitis: 2052 },
  { id: "T013", tesis_adi: "Çayırhan", yakit: "Linyit", kapasite_mw: 620, emisyon_mt: 4.0, komisyon_yili: 1987, lisans_bitis: 2069 },
  { id: "T011", tesis_adi: "Seyitömer", yakit: "Linyit", kapasite_mw: 600, emisyon_mt: 3.7, komisyon_yili: 1985, lisans_bitis: 2052 },
  { id: "T028", tesis_adi: "Tufanbeyli", yakit: "Linyit", kapasite_mw: 450, emisyon_mt: 3.1, komisyon_yili: 2016, lisans_bitis: 2057 },
  { id: "T029", tesis_adi: "Silopi", yakit: "Asfaltit", kapasite_mw: 405, emisyon_mt: 2.9, komisyon_yili: 2009, lisans_bitis: 2053 },
  { id: "T016", tesis_adi: "Kangal", yakit: "Linyit", kapasite_mw: 457, emisyon_mt: 2.8, komisyon_yili: 1989, lisans_bitis: 2052 }
];

// =============================================================================
// BİRİNCİL PILOT İLLER — ABM modelindeki 13 kömür santralinin bulunduğu 11 il
// ETS_Kapsam değerleri ABM'deki santral emisyon toplamından türetilmiştir (gerçek veri).
// İki il (Kahramanmaraş, Adana) birden fazla santral barındırmaktadır.
// Kaynak: GERCEK_KOMUR_SANTRALLERI verisi; GEM Ocak 2026 + EPDK lisans veritabanı.
// =============================================================================
export const PRIMARY_ILLER: PilotProvince[] = [
  {
    id: "p01", Il_Adi: "Kahramanmaraş", Bolge: "Akdeniz",
    Dominant_Sektor: "Kömür Enerjisi (Linyit)",
    ETS_Kapsam_Tahmini_MtCO2: 22.2,  // Afşin-Elbistan A (10.9) + B (11.3)
    Enlem: 37.58, Boylam: 36.93, etki_tipi: "birincil",
    santraller: ["Afşin-Elbistan A", "Afşin-Elbistan B"],
    toplam_kapasite_mw: 2795
  },
  {
    id: "p02", Il_Adi: "Zonguldak", Bolge: "Karadeniz",
    Dominant_Sektor: "Kömür Enerjisi (İthal)",
    ETS_Kapsam_Tahmini_MtCO2: 17.0,  // Zonguldak Eren
    Enlem: 41.45, Boylam: 31.79, etki_tipi: "birincil",
    santraller: ["Zonguldak Eren"],
    toplam_kapasite_mw: 2790
  },
  {
    id: "p03", Il_Adi: "Adana", Bolge: "Akdeniz",
    Dominant_Sektor: "Kömür Enerjisi (İthal & Linyit)",
    ETS_Kapsam_Tahmini_MtCO2: 10.3,  // Hunutlu (7.2) + Tufanbeyli (3.1)
    Enlem: 36.99, Boylam: 35.32, etki_tipi: "birincil",
    santraller: ["Hunutlu", "Tufanbeyli"],
    toplam_kapasite_mw: 1770
  },
  {
    id: "p04", Il_Adi: "Hatay", Bolge: "Akdeniz",
    Dominant_Sektor: "Kömür Enerjisi (İthal)",
    ETS_Kapsam_Tahmini_MtCO2: 7.8,   // İskenderun İSKEN
    Enlem: 36.20, Boylam: 36.16, etki_tipi: "birincil",
    santraller: ["İskenderun İSKEN"],
    toplam_kapasite_mw: 1320
  },
  {
    id: "p05", Il_Adi: "Çanakkale", Bolge: "Marmara",
    Dominant_Sektor: "Kömür Enerjisi (İthal)",
    ETS_Kapsam_Tahmini_MtCO2: 7.5,   // Cenal Karabiga
    Enlem: 40.15, Boylam: 26.41, etki_tipi: "birincil",
    santraller: ["Cenal Karabiga"],
    toplam_kapasite_mw: 1320
  },
  {
    id: "p06", Il_Adi: "Manisa", Bolge: "Ege",
    Dominant_Sektor: "Kömür Enerjisi (Linyit)",
    ETS_Kapsam_Tahmini_MtCO2: 7.5,   // Soma B
    Enlem: 38.61, Boylam: 27.43, etki_tipi: "birincil",
    santraller: ["Soma B"],
    toplam_kapasite_mw: 990
  },
  {
    id: "p07", Il_Adi: "Muğla", Bolge: "Ege",
    Dominant_Sektor: "Kömür Enerjisi (Linyit)",
    ETS_Kapsam_Tahmini_MtCO2: 4.4,   // Kemerköy
    Enlem: 37.21, Boylam: 28.36, etki_tipi: "birincil",
    santraller: ["Kemerköy"],
    toplam_kapasite_mw: 630
  },
  {
    id: "p08", Il_Adi: "Ankara", Bolge: "İç Anadolu",
    Dominant_Sektor: "Kömür Enerjisi (Linyit)",
    ETS_Kapsam_Tahmini_MtCO2: 4.0,   // Çayırhan
    Enlem: 39.93, Boylam: 32.85, etki_tipi: "birincil",
    santraller: ["Çayırhan"],
    toplam_kapasite_mw: 620
  },
  {
    id: "p09", Il_Adi: "Kütahya", Bolge: "Ege",
    Dominant_Sektor: "Kömür Enerjisi (Linyit)",
    ETS_Kapsam_Tahmini_MtCO2: 3.7,   // Seyitömer
    Enlem: 39.42, Boylam: 29.98, etki_tipi: "birincil",
    santraller: ["Seyitömer"],
    toplam_kapasite_mw: 600
  },
  {
    id: "p10", Il_Adi: "Şırnak", Bolge: "Güneydoğu Anadolu",
    Dominant_Sektor: "Kömür Enerjisi (Asfaltit)",
    ETS_Kapsam_Tahmini_MtCO2: 2.9,   // Silopi
    Enlem: 37.57, Boylam: 42.45, etki_tipi: "birincil",
    santraller: ["Silopi"],
    toplam_kapasite_mw: 405
  },
  {
    id: "p11", Il_Adi: "Sivas", Bolge: "İç Anadolu",
    Dominant_Sektor: "Kömür Enerjisi (Linyit)",
    ETS_Kapsam_Tahmini_MtCO2: 2.8,   // Kangal
    Enlem: 39.75, Boylam: 37.01, etki_tipi: "birincil",
    santraller: ["Kangal"],
    toplam_kapasite_mw: 457
  }
];

// =============================================================================
// İKİNCİL PILOT İLLER — Doğrudan kömür santrali bulunmayan, ancak enerji-yoğun
// sanayi yapısı ve AB SKDM/CBAM maruziyeti nedeniyle ETS'ten dolaylı etkilenecek
// 5 büyük sanayi ili. ETS_Kapsam değerleri ekonomik bağlam göstergesidir;
// simülasyon çıktısı değil, il bazlı sanayi GSYH ağırlığından türetilmiştir.
// Kaynak: TÜİK İl Bazında GSYH 2022; Yıllık Sanayi ve Hizmet İstatistikleri 2022.
// =============================================================================
export const SECONDARY_ILLER: PilotProvince[] = [
  {
    id: "s01", Il_Adi: "Kocaeli", Bolge: "Marmara",
    Dominant_Sektor: "Demir Çelik & Kimya",
    ETS_Kapsam_Tahmini_MtCO2: 18.4,
    Enlem: 40.76, Boylam: 29.92, etki_tipi: "ikincil",
    skdm_risk_notu: "Türkiye demir-çelik ihracatının ~%40'ı bu ilde üretilir; AB SKDM doğrudan etkiler."
  },
  {
    id: "s02", Il_Adi: "İzmir", Bolge: "Ege",
    Dominant_Sektor: "Rafineri & Çimento",
    ETS_Kapsam_Tahmini_MtCO2: 12.8,
    Enlem: 38.42, Boylam: 27.14, etki_tipi: "ikincil",
    skdm_risk_notu: "TÜPRAŞ rafinerisi ve çimento sektörü ETS dolaylı enerji maliyeti baskısıyla karşı karşıya."
  },
  {
    id: "s03", Il_Adi: "Bursa", Bolge: "Marmara",
    Dominant_Sektor: "Otomotiv & Çimento",
    ETS_Kapsam_Tahmini_MtCO2: 8.7,
    Enlem: 40.18, Boylam: 29.06, etki_tipi: "ikincil",
    skdm_risk_notu: "Otomotiv tedarik zinciri AB pazarına bağlı; artan enerji maliyeti rekabet gücünü etkiler."
  },
  {
    id: "s04", Il_Adi: "Gaziantep", Bolge: "Güneydoğu Anadolu",
    Dominant_Sektor: "Tekstil & Plastik",
    ETS_Kapsam_Tahmini_MtCO2: 5.6,
    Enlem: 37.06, Boylam: 37.38, etki_tipi: "ikincil",
    skdm_risk_notu: "Tekstil ve plastik sektörü enerji-yoğun; AB ihracat bağımlılığı SKDM riskini artırır."
  },
  {
    id: "s05", Il_Adi: "Mersin", Bolge: "Akdeniz",
    Dominant_Sektor: "Liman & Petrokimya",
    ETS_Kapsam_Tahmini_MtCO2: 4.8,
    Enlem: 36.81, Boylam: 34.63, etki_tipi: "ikincil",
    skdm_risk_notu: "Türkiye'nin en büyük konteyner limanı; petrokimya ve çimento ihracatı SKDM kapsamında."
  }
];

// =============================================================================
// PILOT_ILLER — Geriye dönük uyumluluk için birincil + ikincil iller birleşimi.
// App.tsx bu diziyi kullanmaya devam eder; etki_tipi alanıyla iki katman ayırt edilir.
// =============================================================================
export const PILOT_ILLER: PilotProvince[] = [...PRIMARY_ILLER, ...SECONDARY_ILLER];

export const SEKTOREL_EMISYONLAR: SectoralEmission[] = [
  // Kaynak: sektorel_emisyonlar_v2.csv — TÜİK (2026) Sera Gazı Emisyon İstatistikleri, 1990-2024
  { Year: 1990, Toplam_LULUCF_Haric: 228.90, Enerji_Toplam: 143.70, IPPU_Toplam: 23.10, Tarim_Toplam: 51.80, Atik_Toplam: 10.30 },
  { Year: 1995, Toplam_LULUCF_Haric: 257.40, Enerji_Toplam: 170.30, IPPU_Toplam: 25.90, Tarim_Toplam: 49.00, Atik_Toplam: 12.10 },
  { Year: 2000, Toplam_LULUCF_Haric: 307.50, Enerji_Toplam: 220.20, IPPU_Toplam: 26.60, Tarim_Toplam: 46.00, Atik_Toplam: 14.60 },
  { Year: 2005, Toplam_LULUCF_Haric: 345.80, Enerji_Toplam: 247.80, IPPU_Toplam: 34.70, Tarim_Toplam: 46.30, Atik_Toplam: 17.00 },
  { Year: 2010, Toplam_LULUCF_Haric: 406.40, Enerji_Toplam: 290.80, IPPU_Toplam: 49.70, Tarim_Toplam: 47.70, Atik_Toplam: 18.20 },
  { Year: 2015, Toplam_LULUCF_Haric: 483.90, Enerji_Toplam: 346.50, IPPU_Toplam: 60.40, Tarim_Toplam: 59.20, Atik_Toplam: 17.90 },
  { Year: 2020, Toplam_LULUCF_Haric: 534.00, Enerji_Toplam: 372.00, IPPU_Toplam: 68.90, Tarim_Toplam: 76.40, Atik_Toplam: 16.60 },
  { Year: 2021, Toplam_LULUCF_Haric: 575.30, Enerji_Toplam: 408.30, IPPU_Toplam: 76.50, Tarim_Toplam: 75.40, Atik_Toplam: 15.10 },
  { Year: 2022, Toplam_LULUCF_Haric: 561.30, Enerji_Toplam: 401.90, IPPU_Toplam: 72.30, Tarim_Toplam: 71.50, Atik_Toplam: 15.60 },
  { Year: 2023, Toplam_LULUCF_Haric: 555.20, Enerji_Toplam: 397.80, IPPU_Toplam: 70.70, Tarim_Toplam: 71.80, Atik_Toplam: 14.90 },
  { Year: 2024, Toplam_LULUCF_Haric: 584.50, Enerji_Toplam: 419.90, IPPU_Toplam: 75.70, Tarim_Toplam: 73.50, Atik_Toplam: 15.40 },
  { Year: 2025, Toplam_LULUCF_Haric: 559.00, Enerji_Toplam: 398.50, IPPU_Toplam: 73.50, Tarim_Toplam: 72.50, Atik_Toplam: 14.50 }
];

export const MAC_CURVE: MacCurveOption[] = [
  // Linyit (Yerli Linyit)
  { sektor: "Linyit", sektor_etiket: "Yerli Linyit", teknoloji: "Kazan Verimliliği", mac: -15, potansiyel: 0.05, sure: 2 },
  { sektor: "Linyit", sektor_etiket: "Yerli Linyit", teknoloji: "Yük Optimizasyonu", mac: 5, potansiyel: 0.03, sure: 1 },
  { sektor: "Linyit", sektor_etiket: "Yerli Linyit", teknoloji: "Yüksek Gaz Ko-firing", mac: 28, potansiyel: 0.30, sure: 3 },
  { sektor: "Linyit", sektor_etiket: "Yerli Linyit", teknoloji: "GES/RES Hibritleşmesi", mac: 50, potansiyel: 0.45, sure: 5 },
  { sektor: "Linyit", sektor_etiket: "Yerli Linyit", teknoloji: "Karbon Yakalama (CCS)", mac: 120, potansiyel: 0.20, sure: 8 },

  // Ithal_Komur (İthal Kömür)
  { sektor: "Ithal_Komur", sektor_etiket: "İthal Kömür", teknoloji: "Kazan Verimliliği", mac: -5, potansiyel: 0.03, sure: 2 },
  { sektor: "Ithal_Komur", sektor_etiket: "İthal Kömür", teknoloji: "Yük Optimizasyonu", mac: 8, potansiyel: 0.02, sure: 1 },
  { sektor: "Ithal_Komur", sektor_etiket: "İthal Kömür", teknoloji: "Yüksek Gaz Ko-firing", mac: 33, potansiyel: 0.28, sure: 3 },
  { sektor: "Ithal_Komur", sektor_etiket: "İthal Kömür", teknoloji: "GES/RES Hibritleşmesi", mac: 50, potansiyel: 0.45, sure: 5 },
  { sektor: "Ithal_Komur", sektor_etiket: "İthal Kömür", teknoloji: "Karbon Yakalama (CCS)", mac: 120, potansiyel: 0.20, sure: 8 },

  // Asfaltit
  { sektor: "Asfaltit", sektor_etiket: "Asfaltit", teknoloji: "Kazan Verimliliği", mac: -8, potansiyel: 0.04, sure: 2 },
  { sektor: "Asfaltit", sektor_etiket: "Asfaltit", teknoloji: "Yük Optimizasyonu", mac: 6, potansiyel: 0.02, sure: 1 },
  { sektor: "Asfaltit", sektor_etiket: "Asfaltit", teknoloji: "GES/RES Hibritleşmesi", mac: 55, potansiyel: 0.35, sure: 5 },
  { sektor: "Asfaltit", sektor_etiket: "Asfaltit", teknoloji: "Karbon Yakalama (CCS)", mac: 120, potansiyel: 0.15, sure: 8 }
];
