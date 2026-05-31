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

export const PILOT_ILLER: PilotProvince[] = [
  { id: "il1", Il_Adi: "Kocaeli", Bolge: "Marmara", Dominant_Sektor: "Demir Çelik & Kimya", ETS_Kapsam_Tahmini_MtCO2: 18.4, Enlem: 40.76, Boylam: 29.92 },
  { id: "il2", Il_Adi: "Hatay", Bolge: "Akdeniz", Dominant_Sektor: "Demir Çelik & Çimento", ETS_Kapsam_Tahmini_MtCO2: 15.2, Enlem: 36.20, Boylam: 36.16 },
  { id: "il3", Il_Adi: "Zonguldak", Bolge: "Karadeniz", Dominant_Sektor: "Ağır Sanayi & Termik", ETS_Kapsam_Tahmini_MtCO2: 14.1, Enlem: 41.45, Boylam: 31.79 },
  { id: "il4", Il_Adi: "İzmir", Bolge: "Ege", Dominant_Sektor: "Rafineri & Çimento", ETS_Kapsam_Tahmini_MtCO2: 12.8, Enlem: 38.42, Boylam: 27.14 },
  { id: "il5", Il_Adi: "Adana", Bolge: "Akdeniz", Dominant_Sektor: "Enerji & Çimento", ETS_Kapsam_Tahmini_MtCO2: 11.3, Enlem: 36.99, Boylam: 35.32 },
  { id: "il6", Il_Adi: "Kahramanmaraş", Bolge: "Akdeniz", Dominant_Sektor: "Tekstil & Metalürji", ETS_Kapsam_Tahmini_MtCO2: 9.4, Enlem: 37.58, Boylam: 36.93 },
  { id: "il7", Il_Adi: "Bursa", Bolge: "Marmara", Dominant_Sektor: "Otomotiv & Çimento", ETS_Kapsam_Tahmini_MtCO2: 8.7, Enlem: 40.18, Boylam: 29.06 },
  { id: "il8", Il_Adi: "Ankara", Bolge: "İç Anadolu", Dominant_Sektor: "Savunma & Cam/Çimento", ETS_Kapsam_Tahmini_MtCO2: 7.1, Enlem: 39.93, Boylam: 32.85 },
  { id: "il9", Il_Adi: "Gaziantep", Bolge: "Güneydoğu Anadolu", Dominant_Sektor: "Gıda & Plastik Dokuma", ETS_Kapsam_Tahmini_MtCO2: 5.6, Enlem: 37.06, Boylam: 37.38 },
  { id: "il10", Il_Adi: "Mersin", Bolge: "Akdeniz", Dominant_Sektor: "Liman, Cam & Petrokimya", ETS_Kapsam_Tahmini_MtCO2: 4.8, Enlem: 36.81, Boylam: 34.63 }
];

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
