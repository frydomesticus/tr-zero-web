import { GERCEK_KOMUR_SANTRALLERI, MAC_CURVE, PowerPlant } from "./data";

export interface SimulationResultRow {
  Yil: number;
  Toplam_Emisyon: number;
  Cap: number;
  Karbon_Fiyati: number;
  ETS_Gelir_MEUR: number;
  Vergi_Gelir_MEUR: number;
  Aktif_Tesis: number;
  Donusum_Tesis: number;
  Temiz_Tesis: number;
  Kapali_Tesis: number;
}

export interface SimulationParams {
  baslangic_cap: number; // Mt CO2
  cap_azalma_orani: number; // 0.0 - 0.06
  tesvik_miktari: number; // TL/MW or equivalent
  taban_fiyat: number; // €/t
  tavan_fiyat: number; // €/t
  fiyat_katsayi: number; // multiplier for demand-supply delta
  ab_skdm: number; // EU CBAM price
  dogal_buyume: number; // natural annual emission growth
  seed: number;
  bitis_yili: number;
  tesvik_katsayi?: number;
}

// 5 reference scenarios exactly synchronized with Python v4.2 and based on policy references
export const REFERENCE_SCENARIOS_CFG: Record<string, Partial<SimulationParams>> = {
  BAU: {
    baslangic_cap: 9999.0,
    cap_azalma_orani: 0.0,
    tesvik_miktari: 0,
    taban_fiyat: 20,
    tavan_fiyat: 150,
    fiyat_katsayi: 300,
    ab_skdm: 82,
    dogal_buyume: 0.02,
    tesvik_katsayi: 1.0,
  },
  Yumusak_ETS: {
    baslangic_cap: 90.1,    // Modellenen 13 santralin TAHMİNİ emisyon alt-toplamı (~90.1 Mt) — ulusal kömür toplamı (~111 Mt) DEĞİL; tesis CO2'si yoğunluk×kapasite ile türetilmiştir (bkz. data.ts notu)
    cap_azalma_orani: 0.02, // Aşıcı (2024): Soft mitigation rate to avoid 17 Mt quota surplus risks in Turkey ETS (METU Studies 2025)
    tesvik_miktari: 30000,
    taban_fiyat: 20,
    tavan_fiyat: 150,
    fiyat_katsayi: 300,
    ab_skdm: 82,
    dogal_buyume: 0.02,
    tesvik_katsayi: 1.0,
  },
  Siki_ETS: {
    baslangic_cap: 85.0,
    cap_azalma_orani: 0.04, // Kat (Gungor & Sari 2024 Energy 305 & Bora Kat): Aggressive mitigation rate aligned with early 2030s coal phase-out paths (IEA NZE 2024)
    tesvik_miktari: 50000,
    taban_fiyat: 20,
    tavan_fiyat: 150,
    fiyat_katsayi: 300,
    ab_skdm: 82,
    dogal_buyume: 0.02,
    tesvik_katsayi: 1.0,
  },
  ETS_Tesvik: {
    baslangic_cap: 85.0,
    cap_azalma_orani: 0.04,
    tesvik_miktari: 100000,
    taban_fiyat: 20,
    tavan_fiyat: 150,
    fiyat_katsayi: 300,
    ab_skdm: 82,
    dogal_buyume: 0.02,
    tesvik_katsayi: 0.70, // YAZAR VARSAYIMI (%30 sübvansiyon): Bassart-i-Loré (2026, TF&SC 222:124372) "politika karışımı > tek enstrüman" + İDASEP E-S.1.x kavramsal dayanak; 0.70 modelcinin kabulüdür
  },
  Karbon_Vergisi: {
    baslangic_cap: 9999.0,
    cap_azalma_orani: 0.0,
    tesvik_miktari: 50000,
    taban_fiyat: 20,
    tavan_fiyat: 150,
    fiyat_katsayi: 300,
    ab_skdm: 82,
    dogal_buyume: 0.02,
    tesvik_katsayi: 1.0, // IMF (2023): Carbon tax trajectory reference
  }
};

// IMF (2023) "Carbon Pricing Policies for Turkey": Carbon tax path proposal (€20-€80 price corridor)
export const KARBON_VERGISI_PATIKASI: Record<number, number> = {
  2025: 0.0, 2026: 25.0, 2027: 32.0, 2028: 39.0, 2029: 46.0,
  2030: 53.0, 2031: 60.0, 2032: 67.0, 2033: 73.0, 2034: 77.0, 2035: 80.0
};

// Simulation Constants
const PILOT_BASLANGIC = 2026;
const PILOT_BITIS = 2027;
const TAM_UYGULAMA = 2028;
const UYGULAMA_UCRETSIZ_ORAN = 0.7; // YAZAR VARSAYIMI: Yönetmelik oranı Karbon Piyasası Kurulu'na bırakır (Md.13); %70 AB-ETS benzeri kabul
const EUR_TRY = 40.22; // derived from OVP USD_TRY (37.0) / parite (0.92)
// NOT (cap tasarımı): Bu model AB-ETS tipi MUTLAK azalan cap kullanır; gerçek TR-ETS yoğunluk-bazlı benchmark cap öngörür. Normatif/karşı-olgusal test (bkz. DENETİM_RAPORU Bölüm H.3).
// NOT (RNG): Web arayüzü deterministik Math.sin(seed++) kullanır; Python motoru numpy Mersenne Twister kullanır.
// Bu nedenle web tek-koşum sayıları Python Monte Carlo ortalamasıyla birebir eşleşmez.
// Resmi ve istatistiksel olarak geçerli sonuçlar Python MC çıktısıdır (output/final/). Web göstergesi yalnızca görsel referans amaçlıdır.

interface PlantSimState {
  id: string;
  tesis_adi: string;
  yakit: "Linyit" | "Ithal_Komur" | "Asfaltit";
  kapasite_mw: number;
  emisyon: number;
  baslangic_emisyon: number;
  komisyon_yili: number;
  lisans_bitis: number;
  durum: "Aktif" | "Donusum" | "Temiz" | "Kapali";
  yatirim_durumu: string | null;
  kalan_yatirim_suresi: number;
  emisyon_azalma_potansiyeli: number;
  toplam_maliyet: number;
  uygulanan_teknolojiler: Set<string>;
}

function getEnUygunYatirim(
  ps: PlantSimState,
  carbonPrice: number,
  year: number,
  tesvikKatsayi: number
) {
  const lisansKalan = ps.lisans_bitis - year;
  // SEFiA & E3G (2024) Stranded Asset Kısıtı: Lisans bitimine son 10 yıl kala atıl sermaye riskinden dolayı yatırım yapılmaz.
  if (lisansKalan <= 10) return null;

  const candidates: { teknoloji: string; mac: number; potansiyel: number; sure: number; netFayda: number }[] = [];
  const sectorOptions = MAC_CURVE.filter((opt) => opt.sektor === ps.yakit);

  sectorOptions.forEach((opt) => {
    if (ps.uygulanan_teknolojiler.has(opt.teknoloji)) {
      return;
    }

    const mac = opt.mac;

    // Wang et al. (2025) "Bekle-Gör" Kuralı: Düşük efektif pilot ceza döneminde (2026-2027) sermaye-yoğun (MAC > 0) yatırımlar ertelenir.
    if (year <= PILOT_BITIS && mac > 0) {
      return;
    }

    // SEFiA & E3G (2024): 10-15 yıl kalan lisans ömrü diliminde sadece işletmeye kazanç sağlayan (MAC <= 0) verimlilik yatırımları seçilir.
    if (lisansKalan <= 15 && mac > 0) {
      return;
    }

    // Bassart-i-Loré (2026: Tech. Forecasting & Social Change 222:124372) & IDASEP E-S.1.x: Teşvikli senaryoda yenilenebilir yatırımlarının MAC'i devlet sübvansiyon oranı kadar (x0.70) azaltılır.
    const isRenewable = opt.teknoloji.includes("GES/RES") || opt.teknoloji.includes("Yenilenebilir");
    const efektifMac = isRenewable ? mac * tesvikKatsayi : mac;

    if (efektifMac < carbonPrice) {
      const netFayda = (carbonPrice - efektifMac) * opt.potansiyel;
      candidates.push({
        teknoloji: opt.teknoloji,
        mac: efektifMac,
        potansiyel: opt.potansiyel,
        sure: opt.sure,
        netFayda: netFayda
      });
    }
  });

  if (candidates.length === 0) return null;

  // En yüksek net fayda sağlayan yatırımı seç
  candidates.sort((a, b) => b.netFayda - a.netFayda);
  return candidates[0];
}

export function runSimulation(
  scenarioType: "BAU" | "Yumusak_ETS" | "Siki_ETS" | "ETS_Tesvik" | "Karbon_Vergisi" | "CUSTOM",
  paramsOverride?: Partial<SimulationParams>
): SimulationResultRow[] {
  const defaultParams: SimulationParams = {
    baslangic_cap: 85.0,
    cap_azalma_orani: 0.038,
    tesvik_miktari: 50000,
    taban_fiyat: 20,
    tavan_fiyat: 150,
    fiyat_katsayi: 300,
    ab_skdm: 82,
    dogal_buyume: 0.02,
    seed: 42,
    bitis_yili: 2035,
    tesvik_katsayi: 1.0
  };

  const scenarioDefaults = scenarioType !== "CUSTOM" ? REFERENCE_SCENARIOS_CFG[scenarioType] : {};
  const actualParams = {
    ...defaultParams,
    ...scenarioDefaults,
    ...paramsOverride
  };

  const isKarbonVergisi = scenarioType === "Karbon_Vergisi" || (scenarioType === "CUSTOM" && actualParams.baslangic_cap >= 9000 && actualParams.fiyat_katsayi === 0);
  const isBau = scenarioType === "BAU" || (scenarioType === "CUSTOM" && actualParams.baslangic_cap >= 9000 && !isKarbonVergisi);

  const startYear = 2025;
  const endYear = actualParams.bitis_yili;
  const results: SimulationResultRow[] = [];

  // Seed'e bağlı tekrarlanabilir pseudo-random sayı üreteci (Python seed simülasyonu)
  let seedVal = actualParams.seed;
  const random = () => {
    const x = Math.sin(seedVal++) * 10000;
    return x - Math.floor(x);
  };

  const randomUniform = (min: number, max: number) => min + random() * (max - min);

  // Ajanları ve başlangıç emisyon sapmalarını oluştur (+/- 10%)
  const plantStates: PlantSimState[] = GERCEK_KOMUR_SANTRALLERI.map((p) => {
    const deviation = randomUniform(0.90, 1.10);
    const startEm = p.emisyon_mt;
    const currentEm = startEm * deviation;

    return {
      id: p.id,
      tesis_adi: p.tesis_adi,
      yakit: p.yakit,
      kapasite_mw: p.kapasite_mw,
      emisyon: currentEm,
      baslangic_emisyon: startEm,
      komisyon_yili: p.komisyon_yili,
      lisans_bitis: p.lisans_bitis,
      durum: "Aktif",
      yatirim_durumu: null,
      kalan_yatirim_suresi: 0,
      emisyon_azalma_potansiyeli: 0,
      toplam_maliyet: 0,
      uygulanan_teknolojiler: new Set<string>()
    };
  });

  let cumulativeEtsRevenue = 0;
  let cumulativeTaxRevenue = 0;

  for (let year = startYear; year <= endYear; year++) {
    const t = year - startYear;
    const cap = actualParams.baslangic_cap * Math.pow(1 - actualParams.cap_azalma_orani, t);

    // Karbon Fiyatı
    let carbonPrice = 0;
    if (isBau) {
      carbonPrice = 0;
    } else if (isKarbonVergisi) {
      carbonPrice = KARBON_VERGISI_PATIKASI[year] !== undefined ? KARBON_VERGISI_PATIKASI[year] : KARBON_VERGISI_PATIKASI[2035];
    } else {
      if (year < PILOT_BASLANGIC) {
        carbonPrice = 0;
      } else {
        let totalActiveEmissions = 0;
        plantStates.forEach((ps) => {
          if (ps.durum !== "Kapali") {
            totalActiveEmissions += ps.emisyon;
          }
        });

        if (cap > 0 && totalActiveEmissions > 0) {
          const deficit = Math.max(0.0, (totalActiveEmissions - cap) / cap);
          const rawPrice = actualParams.taban_fiyat + deficit * actualParams.fiyat_katsayi;
          carbonPrice = Math.max(actualParams.taban_fiyat, Math.min(actualParams.tavan_fiyat, rawPrice));
        } else {
          carbonPrice = actualParams.taban_fiyat;
        }
      }
    }

    // Aktif durum metriklerini ve emisyonu topla
    let totalYearlyEmissions = 0;
    let numAktif = 0;
    let numDonusum = 0;
    let numTemiz = 0;
    let numKapali = 0;

    plantStates.forEach((ps) => {
      if (ps.durum === "Kapali") {
        numKapali++;
      } else {
        totalYearlyEmissions += ps.emisyon;
        if (ps.durum === "Aktif") numAktif++;
        else if (ps.durum === "Donusum") numDonusum++;
        else if (ps.durum === "Temiz") numTemiz++;
      }
    });

    // Kamu Geliri Raporlaması
    if (!isBau && !isKarbonVergisi && year >= TAM_UYGULAMA) {
      const acikOran = 1.0 - UYGULAMA_UCRETSIZ_ORAN; // 30% açık artırma
      cumulativeEtsRevenue += cap * acikOran * carbonPrice;
    }
    if (isKarbonVergisi && carbonPrice > 0) {
      cumulativeTaxRevenue += totalYearlyEmissions * carbonPrice;
    }

    results.push({
      Yil: year,
      Toplam_Emisyon: totalYearlyEmissions,
      Cap: (isBau || isKarbonVergisi) ? NaN : cap,
      Karbon_Fiyati: carbonPrice,
      ETS_Gelir_MEUR: cumulativeEtsRevenue,
      Vergi_Gelir_MEUR: cumulativeTaxRevenue,
      Aktif_Tesis: numAktif,
      Donusum_Tesis: numDonusum,
      Temiz_Tesis: numTemiz,
      Kapali_Tesis: numKapali
    });

    // Bir sonraki yıl için ajan durumlarını güncelle
    // Ajanların rastgele çalışma sırasını taklit et
    const shuffledStates = [...plantStates];
    for (let k = shuffledStates.length - 1; k > 0; k--) {
      const r = Math.floor(random() * (k + 1));
      const temp = shuffledStates[k];
      shuffledStates[k] = shuffledStates[r];
      shuffledStates[r] = temp;
    }

    shuffledStates.forEach((ps) => {
      if (ps.durum === "Kapali") {
        return;
      }

      // Lisans bitiş yılı kontrolü
      if (year >= ps.lisans_bitis) {
        ps.durum = "Kapali";
        ps.emisyon = 0;
        return;
      }

      // Karbon fiyatı aktif değilse (BAU veya pilot öncesi) doğal büyüme gerçekleşir
      if (carbonPrice === 0) {
        ps.emisyon *= (1.0 + actualParams.dogal_buyume);
        return;
      }

      // Yatırım süresi geri sayımı
      if (ps.kalan_yatirim_suresi > 0) {
        ps.kalan_yatirim_suresi -= 1;
        if (ps.kalan_yatirim_suresi === 0) {
          ps.emisyon *= (1.0 - ps.emisyon_azalma_potansiyeli);
          ps.durum = "Temiz";
        }
        ps.toplam_maliyet += ps.emisyon * carbonPrice;
        return;
      }

      // Yatırım kararı
      if (ps.durum === "Aktif" || ps.durum === "Temiz") {
        const enUygun = getEnUygunYatirim(ps, carbonPrice, year, actualParams.tesvik_katsayi || 1.0);
        if (enUygun) {
          ps.yatirim_durumu = enUygun.teknoloji;
          ps.kalan_yatirim_suresi = enUygun.sure;
          ps.emisyon_azalma_potansiyeli = enUygun.potansiyel;
          ps.uygulanan_teknolojiler.add(enUygun.teknoloji);
          ps.durum = "Donusum";
        } else if (ps.durum === "Aktif") {
          // Ekonomik Kapanış Eşiği
          const yillikMaliyet = ps.emisyon * carbonPrice;
          const esikMaliyet = ps.baslangic_emisyon * 100.0;
          if (yillikMaliyet > esikMaliyet) {
            ps.durum = "Kapali";
            ps.emisyon = 0;
          }
        }
      }

      ps.toplam_maliyet += ps.emisyon * carbonPrice;
    });
  }

  return results;
}
