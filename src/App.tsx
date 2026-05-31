import React, { useState, useMemo, useCallback, cloneElement } from "react";
import TurkeyMap from "turkey-map-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Map,
  HelpCircle,
  Sliders,
  TrendingDown,
  Landmark,
  Zap,
  Compass,
  RefreshCw,
  Layers,
  Download,
  Users,
  FileSpreadsheet,
  Globe,
  Settings,
  Scale,
  Award,
  ChevronRight,
  Database,
  BookOpen,
  FileText,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Linkedin,
  Folder
} from "lucide-react";
import {
  GERCEK_KOMUR_SANTRALLERI,
  PILOT_ILLER,
  SEKTOREL_EMISYONLAR,
  MAC_CURVE,
  PowerPlant,
  PilotProvince
} from "./data";
import { runSimulation, SimulationResultRow } from "./simulation";

// Custom Recharts Tooltip Components
const CustomEmissionsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xs border-2 border-[#1A1A1A] p-2.5 shadow-[4px_4px_0px_#1A1A1A] z-40 text-left text-[11px] w-[210px] font-mono pointer-events-none">
        <div className="font-extrabold text-center border-b border-zinc-300 pb-1 mb-1.5 text-zinc-900 bg-zinc-100 py-0.5 font-mono">
          YIL: {label}
        </div>
        <div className="space-y-1">
          {payload.map((item: any) => (
            <div key={item.name} className="flex justify-between items-center font-mono" style={{ color: item.stroke }}>
              <span className="font-semibold">{item.name.replace(" (Politikasız)", "").toUpperCase()}:</span>
              <span className="font-bold">{item.value.toFixed(1)} Mt</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomPriceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xs border-2 border-[#1A1A1A] p-2.5 shadow-[4px_4px_0px_#1A1A1A] z-40 text-left text-[11px] w-[210px] font-mono pointer-events-none">
        <div className="font-extrabold text-center border-b border-zinc-300 pb-1 mb-1.5 text-zinc-900 bg-zinc-100 py-0.5 font-mono">
          YIL: {label}
        </div>
        <div className="space-y-1">
          {payload.map((item: any) => (
            <div key={item.name} className="flex justify-between items-center font-mono" style={{ color: item.stroke }}>
              <span className="font-semibold">{item.name.toUpperCase()}:</span>
              <span className="font-bold">€{item.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomHistTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc: number, item: any) => acc + item.value, 0);
    return (
      <div className="bg-white/95 backdrop-blur-xs border-2 border-[#1A1A1A] p-2.5 shadow-[4px_4px_0px_#1A1A1A] z-40 text-left text-[11px] w-[210px] font-mono pointer-events-none">
        <div className="font-extrabold text-center border-b border-zinc-300 pb-1 mb-1.5 text-zinc-900 bg-zinc-100 py-0.5 font-mono">
          YIL: {label}
        </div>        <div className="space-y-1">
          {payload.map((item: any) => (
            <div key={item.name} className="flex justify-between items-center font-mono" style={{ color: item.stroke }}>
              <span className="font-semibold">{item.name === "Enerji Sektörü" ? "Enerji" : item.name === "Sanayi Prosesleri (IPPU)" ? "Sanayi (IPPU)" : "Tarım"}:</span>
              <span className="font-bold">{item.value.toFixed(1)} Mt</span>
            </div>
          ))}
          <div className="flex justify-between items-center border-t border-zinc-200 pt-1 mt-1 font-bold text-[#1A1A1A] font-mono">
            <span>Toplam:</span>
            <span>{total.toFixed(1)} Mt</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-xs border-2 border-[#1A1A1A] p-2.5 shadow-[4px_4px_0px_#1A1A1A] font-mono text-[11px] pointer-events-none">
        <strong className="block border-b border-zinc-300 pb-1 mb-1 text-[#1A1A1A]" style={{ color: data.color }}>
          {data.name.toUpperCase()} SEKTÖRÜ
        </strong>
        <div>Emisyon: <span className="font-bold">{data.value} Mt</span></div>
        <div>Oran: <span className="font-bold">{data.percent}</span></div>
      </div>
    );
  }
  return null;
};

const CustomSimEmTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const bauVal = payload.find((x: any) => x.name === "BAU Seyri")?.value || 0;
    const simVal = payload.find((x: any) => x.name === "Özel Simülasyon")?.value || 0;
    const capVal = payload.find((x: any) => x.name === "Cap Sınırı")?.value || 0;
    return (
      <div className="bg-white/95 backdrop-blur-xs border-2 border-[#1A1A1A] p-2.5 shadow-[4px_4px_0px_#1A1A1A] z-40 text-left text-[11px] w-[190px] font-mono pointer-events-none">
        <div className="font-extrabold text-center border-b border-zinc-300 pb-1 mb-1.5 text-zinc-900 bg-zinc-100 py-0.5 font-mono">
          YIL: {label}
        </div>
        <div className="space-y-1 font-mono">
          <div className="flex justify-between items-center text-zinc-500 font-mono">
            <span>Bau Seyri:</span>
            <span className="font-bold">{bauVal.toFixed(1)} Mt</span>
          </div>
          <div className="flex justify-between items-center text-teal-750 font-mono">
            <span>Simülasyon:</span>
            <span className="font-bold">{simVal.toFixed(1)} Mt</span>
          </div>
          <div className="flex justify-between items-center text-red-650 font-mono">
            <span>Cap Sınırı:</span>
            <span className="font-bold">{capVal.toFixed(1)} Mt</span>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-200 pt-1 mt-1 text-[10px] text-zinc-500 font-mono">
            <span>Net Fark:</span>
            <span className="font-bold text-emerald-705">
              -{(bauVal - simVal).toFixed(1)} Mt
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomSimPriceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-xs border-2 border-[#1A1A1A] p-2.5 shadow-[4px_4px_0px_#1A1A1A] z-40 text-left text-[11px] w-[180px] font-mono pointer-events-none">
        <div className="font-extrabold text-center border-b border-zinc-200 pb-1 mb-1 text-zinc-900 bg-zinc-100 py-0.5 font-mono">
          YIL: {label}
        </div>
        <div className="space-y-1 font-mono">
          <div className="flex justify-between items-center text-amber-800 font-mono">
            <span>Karbon Fiyatı:</span>
            <span className="font-bold">€{data["Karbon Fiyatı"].toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center text-amber-600 font-mono">
            <span>Taban Koridoru:</span>
            <span className="font-semibold">€{data["Taban Fiyat"].toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center text-red-650 font-mono">
            <span>Tavan Koridoru:</span>
            <span className="font-semibold">€{data["Tavan Fiyat"].toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-200 pt-1 mt-1 text-[10px] text-zinc-500 font-mono">
            <span>Kamu Geliri:</span>
            <span className="font-bold text-emerald-700 font-mono font-bold">
              {data["Kamu Geliri"].toFixed(0)} M€
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomPreventedTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const sikiVal = payload.find((x: any) => x.name === "Sıkı ETS")?.value || 0;
    const tesvikVal = payload.find((x: any) => x.name === "ETS + Teşvik")?.value || 0;
    return (
      <div className="bg-white/95 backdrop-blur-xs border-2 border-[#1A1A1A] p-2.5 shadow-[4px_4px_0px_#1A1A1A] z-40 text-left text-[11px] w-[180px] font-mono pointer-events-none">
        <div className="font-extrabold text-center border-b border-zinc-300 pb-1 mb-1.5 text-zinc-900 bg-zinc-100 py-0.5 font-mono">
          YIL: {label}
        </div>
        <div className="space-y-1 font-mono">
          <div className="flex justify-between items-center text-emerald-800 font-mono">
            <span>Sıkı ETS:</span>
            <span className="font-bold">{sikiVal.toFixed(1)} Mt</span>
          </div>
          <div className="flex justify-between items-center text-violet-700 font-mono">
            <span>ETS+Teşvik:</span>
            <span className="font-bold">{tesvikVal.toFixed(1)} Mt</span>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-200 pt-1 mt-1 text-[10px] text-zinc-500 font-mono">
            <span>Fazla Tasarruf:</span>
            <span className="font-extrabold text-[#10b981] font-mono">
              {(sikiVal - tesvikVal).toFixed(1)} Mt
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomRevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const sikiVal = payload.find((x: any) => x.name === "Sıkı ETS")?.value || 0;
    const vergiVal = payload.find((x: any) => x.name === "Karbon Vergisi")?.value || 0;
    return (
      <div className="bg-white/95 backdrop-blur-xs border-2 border-[#1A1A1A] p-2.5 shadow-[4px_4px_0px_#1A1A1A] z-40 text-left text-[11px] w-[185px] font-mono pointer-events-none">
        <div className="font-extrabold text-center border-b border-zinc-300 pb-1 mb-1.5 text-zinc-900 bg-zinc-100 py-0.5 font-mono">
          YIL: {label}
        </div>
        <div className="space-y-1 mt-1 font-mono">
          <div className="flex justify-between items-center text-emerald-800 font-mono">
            <span>Sıkı ETS:</span>
            <span className="font-bold">{sikiVal.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} M€</span>
          </div>
          <div className="flex justify-between items-center text-amber-700 font-mono">
            <span>Vergi:</span>
            <span className="font-bold">{vergiVal.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} M€</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Plate number lookup for pilot provinces (Option B Map integration)
const getPilotProvinceByPlate = (plate: number) => {
  switch (plate) {
    case 1: return PILOT_ILLER.find(p => p.Il_Adi === "Adana");
    case 6: return PILOT_ILLER.find(p => p.Il_Adi === "Ankara");
    case 16: return PILOT_ILLER.find(p => p.Il_Adi === "Bursa");
    case 27: return PILOT_ILLER.find(p => p.Il_Adi === "Gaziantep");
    case 31: return PILOT_ILLER.find(p => p.Il_Adi === "Hatay");
    case 33: return PILOT_ILLER.find(p => p.Il_Adi === "Mersin");
    case 35: return PILOT_ILLER.find(p => p.Il_Adi === "İzmir");
    case 41: return PILOT_ILLER.find(p => p.Il_Adi === "Kocaeli");
    case 46: return PILOT_ILLER.find(p => p.Il_Adi === "Kahramanmaraş");
    case 67: return PILOT_ILLER.find(p => p.Il_Adi === "Zonguldak");
    default: return undefined;
  }
};

// Province-specific thermal power plant mappings (Option B detailed stats)
const PROVINCE_POWER_PLANTS: Record<string, { plants: string; mw: number }> = {
  "Kocaeli": { plants: "Bulunmamaktadır (Sadece Ağır Sanayi)", mw: 0 },
  "Hatay": { plants: "İskenderun İSKEN", mw: 1320 },
  "Zonguldak": { plants: "Zonguldak Eren (ZETES)", mw: 2790 },
  "İzmir": { plants: "Bulunmamaktadır (Sadece Ağır Sanayi)", mw: 0 },
  "Adana": { plants: "Hunutlu & Tufanbeyli", mw: 1770 },
  "Kahramanmaraş": { plants: "Afşin-Elbistan A & B", mw: 2795 },
  "Bursa": { plants: "Bulunmamaktadır (Sadece Ağır Sanayi)", mw: 0 },
  "Ankara": { plants: "Çayırhan", mw: 620 },
  "Gaziantep": { plants: "Bulunmamaktadır (Sadece Ağır Sanayi)", mw: 0 },
  "Mersin": { plants: "Bulunmamaktadır (Sadece Ağır Sanayi)", mw: 0 }
};

export default function App() {
  // Main Tabs: 'hakkinda' | 'simulasyon' | 'belgeler' | 'kaynakca' | 'iletisim'
  const [mainActiveTab, setMainActiveTab] = useState<"hakkinda" | "simulasyon" | "belgeler" | "kaynakca" | "iletisim">("simulasyon");
  // Tabs: 'sonuclar' | 'mevcut' | 'tasarim' | 'politika' | 'teknik'
  const [activeTab, setActiveTab] = useState<"sonuclar" | "mevcut" | "tasarim" | "politika" | "teknik">("sonuclar");

  // Street View simulation states
  const [isStreetViewFullscreen, setIsStreetViewFullscreen] = useState(false);
  const [compassRotation, setCompassRotation] = useState(310);

  const handleStreetViewMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    setCompassRotation(angle);
  }, []);

  const handleStreetViewMouseLeave = useCallback(() => {
    setCompassRotation(310);
  }, []);
  
  // Custom Simulator Parameters State (Tab 3)
  const [cap, setCap] = useState<number>(85);
  const [azalma, setAzalma] = useState<number>(3.8); // % annual reduction
  const [tesvik, setTesvik] = useState<number>(50000); // TL/MW
  const [taban, setTaban] = useState<number>(20); // €/t
  const [tavan, setTavan] = useState<number>(150); // €/t
  const [katsayi, setKatsayi] = useState<number>(300); // price multiplier
  const [skdm, setSkdm] = useState<number>(82); // EU CBAM €/t
  const [buyume, setBuyume] = useState<number>(2.0); // BAU % annual growth
  const [seed, setSeed] = useState<number>(42);
  const [bitis, setBitis] = useState<number>(2035);

  // Province Highlight on Map (Tab 2)
  const [selectedProvince, setSelectedProvince] = useState<PilotProvince | null>(PILOT_ILLER[0]);

  // turkey-map-react city wrapper function for premium visual styling
  const renderCity = (cityComponent: React.ReactElement, cityData: any) => {
    const pilotProv = getPilotProvinceByPlate(cityData.plateNumber);
    const isSelected = selectedProvince && pilotProv && selectedProvince.id === pilotProv.id;

    let fill = "#f4f4f5"; // open gray background for passive cities
    let stroke = "#d4d4d8"; // light gray boundary for passive cities
    let strokeWidth = "1";
    let cursor = "default";

    if (pilotProv) {
      cursor = "pointer";
      if (isSelected) {
        fill = "#1a1a1a"; // premium charcoal black for active selected pilot province
        stroke = "#ffffff";
        strokeWidth = "2";
      } else {
        fill = "#0f766e"; // premium deep teal for pilot provinces
        stroke = "#ffffff";
        strokeWidth = "1.5";
      }
    }

    return cloneElement(cityComponent, {
      style: {
        fill,
        stroke,
        strokeWidth,
        cursor,
        transition: "all 0.2s ease",
      },
      className: pilotProv ? "hover:opacity-85 filter drop-shadow-sm" : "opacity-60 pointer-events-none"
    });
  };

  const handleCityClick = (cityData: any) => {
    const pilotProv = getPilotProvinceByPlate(cityData.plateNumber);
    if (pilotProv) {
      setSelectedProvince(pilotProv);
    }
  };

  // Interactive Hover states for all SVG Charts
  const [hoveredIndex1, setHoveredIndex1] = useState<number | null>(null); // For Comparative Trajectory & Price Charts (Tab 1)
  const [hoveredIndex3, setHoveredIndex3] = useState<number | null>(null); // For Historical Sektörel Emisyonlar (Tab 2)
  const [hoveredIndex4, setHoveredIndex4] = useState<number | null>(null); // For Custom Simulation Emissions & Price Charts (Tab 3)
  const [hoveredIndex6, setHoveredIndex6] = useState<number | null>(null); // For Tab 4 Cumulative Prevented & Revenue curves (Tab 4)

  // Run all 5 reference scenarios using seed 42 up to year 2035 for comparative analysis
  const referenceData = useMemo(() => {
    return {
      BAU: runSimulation("BAU", { seed: 42, bitis_yili: 2035 }),
      Yumusak_ETS: runSimulation("Yumusak_ETS", { seed: 42, bitis_yili: 2035 }),
      Siki_ETS: runSimulation("Siki_ETS", { seed: 42, bitis_yili: 2035 }),
      ETS_Tesvik: runSimulation("ETS_Tesvik", { seed: 42, bitis_yili: 2035 }),
      Karbon_Vergisi: runSimulation("Karbon_Vergisi", { seed: 42, bitis_yili: 2035 }),
    };
  }, []);

  // Run custom scenario dynamically on state changes
  const customData = useMemo(() => {
    return runSimulation("CUSTOM", {
      baslangic_cap: cap,
      cap_azalma_orani: azalma / 100,
      tesvik_miktari: tesvik,
      taban_fiyat: taban,
      tavan_fiyat: tavan,
      fiyat_katsayi: katsayi,
      ab_skdm: skdm,
      dogal_buyume: buyume / 100,
      seed: seed,
      bitis_yili: bitis
    });
  }, [cap, azalma, tesvik, taban, tavan, katsayi, skdm, buyume, seed, bitis]);

  // Dynamic BAU run matching custom parameters (growth, bitis, seed)
  const customBauData = useMemo(() => {
    return runSimulation("BAU", {
      dogal_buyume: buyume / 100,
      seed: seed,
      bitis_yili: bitis
    });
  }, [buyume, seed, bitis]);

  // 1. Scaler helpers for Tab 1 trajectory
  const allEmissions = useMemo(() => {
    return [
      ...referenceData.BAU,
      ...referenceData.Yumusak_ETS,
      ...referenceData.Siki_ETS,
      ...referenceData.ETS_Tesvik,
      ...referenceData.Karbon_Vergisi
    ].map(r => r.Toplam_Emisyon);
  }, [referenceData]);

  const emLimits = useMemo(() => {
    const maxVal = Math.max(...allEmissions, 120);
    const minVal = Math.min(...allEmissions, 20);
    const span = maxVal - minVal;
    return { minVal: Math.max(0, minVal - span * 0.05), maxVal: maxVal + span * 0.05 };
  }, [allEmissions]);

  const getEmY = useCallback((val: number) => {
    const denom = emLimits.maxVal - emLimits.minVal;
    if (denom === 0) return 50;
    const y = 100 - ((val - emLimits.minVal) / denom) * 100;
    return Math.max(0, Math.min(100, y));
  }, [emLimits]);

  // 2. Scaler helpers for Tab 1 Price
  const allPrices = useMemo(() => {
    return [
      ...referenceData.Yumusak_ETS,
      ...referenceData.Siki_ETS,
      ...referenceData.ETS_Tesvik,
      ...referenceData.Karbon_Vergisi
    ].map(r => r.Karbon_Fiyati);
  }, [referenceData]);

  const priceLimits = useMemo(() => {
    const maxVal = Math.max(...allPrices, 150);
    return { minVal: 0, maxVal: maxVal * 1.05 };
  }, [allPrices]);

  const getPriceY = useCallback((val: number) => {
    const denom = priceLimits.maxVal - priceLimits.minVal;
    if (denom === 0) return 50;
    const y = 100 - ((val - priceLimits.minVal) / denom) * 100;
    return Math.max(0, Math.min(100, y));
  }, [priceLimits]);

  // 3. Scaler helpers for Historical Sektörel Emisyon (Tab 2)
  const histEmLimits = useMemo(() => {
    const allVals = [
      ...SEKTOREL_EMISYONLAR.map(s => s.Enerji_Toplam),
      ...SEKTOREL_EMISYONLAR.map(s => s.IPPU_Toplam),
      ...SEKTOREL_EMISYONLAR.map(s => s.Tarim_Toplam)
    ];
    const maxVal = Math.max(...allVals, 400);
    return { minVal: 0, maxVal: maxVal * 1.05 };
  }, []);

  const getHistY = useCallback((val: number) => {
    const denom = histEmLimits.maxVal - histEmLimits.minVal;
    if (denom === 0) return 50;
    const y = 100 - ((val - histEmLimits.minVal) / denom) * 100;
    return Math.max(0, Math.min(100, y));
  }, [histEmLimits]);

  // 4. Scaler helpers for Custom Emissions (Tab 3)
  const customEmLimits = useMemo(() => {
    const allVals = [
      ...customData.map(r => r.Toplam_Emisyon),
      ...customData.map(r => r.Cap),
      ...customBauData.map(r => r.Toplam_Emisyon)
    ].filter(v => v !== undefined && !isNaN(v));
    const maxVal = allVals.length > 0 ? Math.max(...allVals, 120) : 150;
    const minVal = allVals.length > 0 ? Math.min(...allVals, 20) : 10;
    const span = maxVal - minVal;
    return { minVal: Math.max(0, minVal - span * 0.05), maxVal: maxVal + span * 0.05 };
  }, [customData, customBauData]);

  const getCustomEmY = useCallback((val: number) => {
    const denom = customEmLimits.maxVal - customEmLimits.minVal;
    if (denom === 0) return 50;
    const y = 100 - ((val - customEmLimits.minVal) / denom) * 100;
    return Math.max(0, Math.min(100, y));
  }, [customEmLimits]);

  // 5. Scaler helpers for Custom Prices (Tab 3)
  const customPriceLimits = useMemo(() => {
    const allVals = [
      ...customData.map(r => r.Karbon_Fiyati),
      taban,
      tavan
    ].filter(v => v !== undefined && !isNaN(v));
    const maxVal = allVals.length > 0 ? Math.max(...allVals, 100) : 300;
    return { minVal: 0, maxVal: maxVal * 1.05 };
  }, [customData, taban, tavan]);

  const getCustomPriceY = useCallback((val: number) => {
    const denom = customPriceLimits.maxVal - customPriceLimits.minVal;
    if (denom === 0) return 50;
    const y = 100 - ((val - customPriceLimits.minVal) / denom) * 100;
    return Math.max(0, Math.min(100, y));
  }, [customPriceLimits]);

  // 6. Scaler helpers for Tab 4 Cumulative Prevented & Revenue curves
  const preventLimits = useMemo(() => {
    const sikiSums: number[] = [];
    const tesvikSums: number[] = [];
    let sikiSum = 0;
    let tesvikSum = 0;
    for (let k = 0; k < referenceData.Siki_ETS.length; k++) {
      sikiSum += Math.max(0, referenceData.BAU[k].Toplam_Emisyon - referenceData.Siki_ETS[k].Toplam_Emisyon);
      tesvikSum += Math.max(0, referenceData.BAU[k].Toplam_Emisyon - referenceData.ETS_Tesvik[k].Toplam_Emisyon);
      sikiSums.push(sikiSum);
      tesvikSums.push(tesvikSum);
    }
    const maxVal = Math.max(...sikiSums, ...tesvikSums, 150);
    return { minVal: 0, maxVal: maxVal * 1.05, sikiSums, tesvikSums };
  }, [referenceData]);

  const getPreventY = useCallback((val: number) => {
    const denom = preventLimits.maxVal - preventLimits.minVal;
    if (denom === 0) return 50;
    const y = 100 - ((val - preventLimits.minVal) / denom) * 100;
    return Math.max(0, Math.min(100, y));
  }, [preventLimits]);

  const revenueLimits = useMemo(() => {
    const allVals = [
      ...referenceData.Siki_ETS.map(r => r.ETS_Gelir_MEUR),
      ...referenceData.Karbon_Vergisi.map(r => r.Vergi_Gelir_MEUR)
    ];
    const maxVal = Math.max(...allVals, 3500);
    return { minVal: 0, maxVal: maxVal * 1.05 };
  }, [referenceData]);

  const getRevenueY = useCallback((val: number) => {
    const denom = revenueLimits.maxVal - revenueLimits.minVal;
    if (denom === 0) return 50;
    const y = 100 - ((val - revenueLimits.minVal) / denom) * 100;
    return Math.max(0, Math.min(100, y));
  }, [revenueLimits]);

  // Pre-calculate Scenario Names & Colors for Plotting
  const scenarioColors: Record<string, string> = {
    "BAU (Politikasız)": "#94a3b8",
    "Yumuşak ETS": "#3b82f6",
    "Sıkı ETS": "#10b981",
    "ETS + Teşvik": "#8b5cf6",
    "Karbon Vergisi": "#f59e0b"
  };

  // Recharts specific pre-formatted datasets
  const chart1Data = useMemo(() => {
    return referenceData.BAU.map((r, i) => ({
      Yil: r.Yil,
      "BAU (Politikasız)": r.Toplam_Emisyon,
      "Yumuşak ETS": referenceData.Yumusak_ETS[i]?.Toplam_Emisyon,
      "Sıkı ETS": referenceData.Siki_ETS[i]?.Toplam_Emisyon,
      "ETS + Teşvik": referenceData.ETS_Tesvik[i]?.Toplam_Emisyon,
      "Karbon Vergisi": referenceData.Karbon_Vergisi[i]?.Toplam_Emisyon,
    }));
  }, [referenceData]);

  const chart2Data = useMemo(() => {
    return referenceData.Yumusak_ETS.map((r, i) => ({
      Yil: r.Yil,
      "Yumuşak ETS": r.Karbon_Fiyati,
      "Sıkı ETS": referenceData.Siki_ETS[i]?.Karbon_Fiyati,
      "ETS + Teşvik": referenceData.ETS_Tesvik[i]?.Karbon_Fiyati,
      "Karbon Vergisi": referenceData.Karbon_Vergisi[i]?.Karbon_Fiyati,
    }));
  }, [referenceData]);

  const customEmChartData = useMemo(() => {
    return customData.map((r, i) => ({
      Yil: r.Yil,
      "BAU Seyri": customBauData[i]?.Toplam_Emisyon,
      "Özel Simülasyon": r.Toplam_Emisyon,
      "Cap Sınırı": r.Cap,
    }));
  }, [customData, customBauData]);

  const customPriceChartData = useMemo(() => {
    return customData.map((r) => ({
      Yil: r.Yil,
      "Karbon Fiyatı": r.Karbon_Fiyati,
      "Taban Fiyat": taban,
      "Tavan Fiyat": tavan,
      "Kamu Geliri": Math.max(r.ETS_Gelir_MEUR, r.Vergi_Gelir_MEUR),
    }));
  }, [customData, taban, tavan]);

  const chart6Data = useMemo(() => {
    return referenceData.Siki_ETS.map((r, i) => ({
      Yil: r.Yil,
      "Sıkı ETS Tasarrufu": preventLimits.sikiSums[i],
      "ETS + Teşvik Tasarrufu": preventLimits.tesvikSums[i],
    }));
  }, [referenceData, preventLimits]);

  const chart7Data = useMemo(() => {
    return referenceData.Siki_ETS.map((r, i) => ({
      Yil: r.Yil,
      "Sıkı ETS": r.ETS_Gelir_MEUR,
      "Karbon Vergisi": referenceData.Karbon_Vergisi[i]?.Vergi_Gelir_MEUR,
    }));
  }, [referenceData]);

  const chart3Data = useMemo(() => {
    return SEKTOREL_EMISYONLAR.map((s) => ({
      Yil: s.Year,
      "Enerji Sektörü": s.Enerji_Toplam,
      "Sanayi Prosesleri (IPPU)": s.IPPU_Toplam,
      "Tarımsal Salınım": s.Tarim_Toplam,
    }));
  }, []);

  // 1. Generate on-the-fly CSV content for custom simulation download
  const handleDownloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Yil,Toplam_Emisyon_Mt,Cap_Mt,Karbon_Fiyati_EUR,ETS_Gelir_MEUR,Vergi_Gelir_MEUR,Aktif_Tesis,Donusum_Tesis,Temiz_Tesis,Kapali_Tesis\r\n";
    
    customData.forEach((row) => {
      const line = [
        row.Yil,
        row.Toplam_Emisyon.toFixed(3),
        row.Cap.toFixed(3),
        row.Karbon_Fiyati.toFixed(2),
        row.ETS_Gelir_MEUR.toFixed(2),
        row.Vergi_Gelir_MEUR.toFixed(2),
        row.Aktif_Tesis,
        row.Donusum_Tesis,
        row.Temiz_Tesis,
        row.Kapali_Tesis
      ].join(",");
      csvContent += line + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TR-ETS_Ozel_Senaryo_${bitis}_seed${seed}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Basic KPI parameters for TAB 1 (Comparative Scenario Results)
  const refSikiLast = referenceData.Siki_ETS[referenceData.Siki_ETS.length - 1];
  const refBauLast = referenceData.BAU[referenceData.BAU.length - 1];
  const sikiReductionPercent = ((refBauLast.Toplam_Emisyon - refSikiLast.Toplam_Emisyon) / refBauLast.Toplam_Emisyon * 100);
  const etsTesvikLast = referenceData.ETS_Tesvik[referenceData.ETS_Tesvik.length - 1];
  const etsTesvikReductionPercent = ((refBauLast.Toplam_Emisyon - etsTesvikLast.Toplam_Emisyon) / refBauLast.Toplam_Emisyon * 100);

  // Basic KPI parameters for TAB 3 (Interactive Simulation Outcomes)
  const customLast = customData[customData.length - 1];
  const customFirst = customData[0];
  const customBauLast = customBauData[customBauData.length - 1];
  const customReductionPercent = ((customBauLast.Toplam_Emisyon - customLast.Toplam_Emisyon) / customBauLast.Toplam_Emisyon * 100);
  const customChangeFromBase = ((customLast.Toplam_Emisyon - customFirst.Toplam_Emisyon) / customFirst.Toplam_Emisyon * 100);

  return (
    <div id="app-container" className="min-h-screen bg-[#F4F1EE] text-[#1A1A1A] antialiased font-sans flex flex-col justify-between p-4 md:p-8 lg:p-12">
      
      {/* 1. AYBÜ Header Section */}
      <header id="aybu-header" className="max-w-7xl w-full mx-auto bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] p-4 md:p-6 mb-8 shrink-0 flex flex-col gap-6">
        {/* Top Row: Logos & Branding */}
        <div className="flex flex-col md:flex-row w-full items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {/* Left Side: School Logo */}
          <div className="flex justify-center items-center select-none shrink-0">
            <img src="/aybu_logo_circular.png" alt="AYBÜ Logo" className="h-16 md:h-20 w-auto object-contain animate-pulse" />
          </div>

          {/* Center: Large Centered Professional Titles */}
          <div className="flex flex-col items-center text-center justify-center select-none max-w-xl">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wide text-[#1b355a] font-serif leading-tight">
              ANKARA YILDIRIM BEYAZIT ÜNİVERSİTESİ
            </h1>
            <div className="h-[2px] w-20 bg-[#00adc4] my-2 rounded-full" />
            <h2 className="text-xs md:text-sm lg:text-md text-[#00adc4] font-extrabold tracking-widest font-sans">
              ENDÜSTRİ MÜHENDİSLİĞİ BÖLÜMÜ
            </h2>
          </div>

          {/* Right Side: Atatürk Banner and Türkiye Yüzyılı */}
          <div className="flex justify-center items-center gap-4 shrink-0">
            <img src="/turkiye_yuzyili_new.png" alt="Türkiye Yüzyılı" className="h-14 md:h-16 w-auto object-contain" />
            <img src="/ataturk_flag_square.png" alt="Atatürk ve Türk Bayrağı" className="h-14 md:h-16 w-auto object-contain rounded-xs border border-zinc-200" />
          </div>
        </div>

        {/* Main School Navigation Bar */}
        <div className="border-t border-zinc-200 pt-4 flex flex-wrap gap-x-2 gap-y-2 text-xs font-bold uppercase tracking-wider justify-center items-center">
          <button
            onClick={() => setMainActiveTab("hakkinda")}
            className={`py-2 px-3 transition-colors cursor-pointer ${
              mainActiveTab === "hakkinda" ? "bg-[#1b355a] text-white" : "text-zinc-700 hover:text-[#00adc4]"
            }`}
          >
            Proje Hakkında
          </button>
          <span className="text-zinc-350 self-center">|</span>
          <button
            onClick={() => setMainActiveTab("simulasyon")}
            className={`py-2 px-3 transition-colors cursor-pointer ${
              mainActiveTab === "simulasyon" ? "bg-[#1b355a] text-white" : "text-zinc-700 hover:text-[#00adc4]"
            }`}
          >
            Araştırma / Simülatör
          </button>
          <span className="text-zinc-350 self-center">|</span>
          <button
            onClick={() => setMainActiveTab("belgeler")}
            className={`py-2 px-3 transition-colors cursor-pointer ${
              mainActiveTab === "belgeler" ? "bg-[#1b355a] text-white" : "text-zinc-700 hover:text-[#00adc4]"
            }`}
          >
            Belgeler
          </button>
          <span className="text-zinc-350 self-center">|</span>
          <button
            onClick={() => setMainActiveTab("kaynakca")}
            className={`py-2 px-3 transition-colors cursor-pointer ${
              mainActiveTab === "kaynakca" ? "bg-[#1b355a] text-white" : "text-zinc-700 hover:text-[#00adc4]"
            }`}
          >
            Kaynakça
          </button>
          <span className="text-zinc-350 self-center">|</span>
          <button
            onClick={() => setMainActiveTab("iletisim")}
            className={`py-2 px-3 transition-colors cursor-pointer ${
              mainActiveTab === "iletisim" ? "bg-[#1b355a] text-white" : "text-zinc-700 hover:text-[#00adc4]"
            }`}
          >
            İletişim
          </button>
        </div>
      </header>

      {/* Page Content based on mainActiveTab */}
      {mainActiveTab === "simulasyon" ? (
        <>
          {/* Orijinal Simülatör Başlığı ve Kapsam Tablosu */}
          <header id="hero-header" className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A] pb-6 mb-8 shrink-0 mt-4">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-[#1A1A1A]/80">AŞAMA 1 ODAK ALANI: ELEKTRİK ÜRETİM SEKTÖRÜ (KÖMÜR YAKITLI TERMİK SANTRALLER)</p>
              <h1 className="text-3xl md:text-5xl font-serif italic tracking-tight leading-none text-[#1A1A1A] font-bold">
                TR-ETS: <span className="not-italic font-bold uppercase tracking-normal">TÜRKİYE'NİN AJAN-TABANLI EMİSYON TİCARET SİSTEMİ SİMÜLASYONU</span>
              </h1>
              <p className="text-[#1A1A1A]/80 text-sm md:text-[15px] mt-6 max-w-3xl leading-loose font-light italic">
                Bu Karar Destek Sistemi; AYBÜ Endüstri Mühendisliği bünyesinde İbrahim Hakkı Keleş, Oğuz Gökdemir ve Melis Mağden tarafından 
                Dr. Deniz Efendioğlu danışmanlığında geliştirilen Ajan-Tabanlı Türkiye ETS Simülasyon modelidir.
              </p>
            </div>
            <div className="text-right flex flex-col gap-1.5 mt-6 md:mt-0 bg-white p-4 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] font-mono text-xs max-w-xs w-full">
              <span className="bg-[#1A1A1A] text-white px-2 py-1 font-bold uppercase tracking-wider text-center block leading-none">SİMÜLASYON KAPSAMI</span>
              <div className="flex justify-between gap-6 text-[11px] text-[#1A1A1A] border-b border-zinc-200 pb-1 pt-1">
                <span>Kömür Santralleri:</span>
                <span className="font-bold font-mono">{GERCEK_KOMUR_SANTRALLERI.length} Tesis</span>
              </div>
              <div className="flex justify-between gap-6 text-[11px] text-[#1A1A1A] border-b border-zinc-200 pb-1">
                <span>Pilot Bölge:</span>
                <span className="font-bold font-mono">10 Kritik İl</span>
              </div>
              <div className="flex justify-between gap-6 text-[11px] text-[#1A1A1A] pb-0.5">
                <span>Çözüm Motoru:</span>
                <span className="font-bold  font-mono">Ajan-Tabanlı</span>
              </div>
            </div>
          </header>
          {/* 3. Global Information Banner */}
          <div className="max-w-7xl w-full mx-auto mb-8 shrink-0">
            <div className="bg-white p-6 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex items-start gap-4">
              <Scale className="text-[#1A1A1A] shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-[#1A1A1A]/90 leading-relaxed italic">
                <strong>Akademik Değerlendirme Modu:</strong> Bu interaktif panel, gerçek termik santral emisyon profillerini ve Türkiye Marjinal Azaltım Maliyetleri (MAC) eğrisini temel alan Monte Carlo ajan tabanlı model motorunu çalıştırır. Simülasyon, tavan/taban fiyat istikrar mekanizmaları ve CBAM (SKDM) maliyet yüklerini anlık çözer.
              </div>
            </div>
          </div>

          {/* 4. Main Navigation Tabs */}
          <nav className="max-w-7xl w-full mx-auto mb-8 shrink-0">
            <div className="flex flex-wrap gap-2 border-b border-[#1A1A1A] pb-4 justify-center">
              {[
                { id: "sonuclar", label: "Senaryo Karşılaştırma", icon: BarChart3 },
                { id: "mevcut", label: "Mevcut Durum (NIR)", icon: Map },
                { id: "tasarim", label: "Kendi ETS'nizi Tasarlayın", icon: Sliders },
                { id: "politika", label: "Politika Çıktıları", icon: Compass },
                { id: "teknik", label: "Teknik Detaylar / MAC", icon: HelpCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider border transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-[#1A1A1A] text-[#F4F1EE] border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                        : "bg-white text-[#1A1A1A] border-zinc-300 hover:border-[#1A1A1A] hover:shadow-[1px_1px_0px_#1A1A1A]"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* 5. Active Tab Workspace */}
          <main className="max-w-7xl w-full mx-auto flex-1">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: SENARYO KARŞILAŞTIRMA */}
          {activeTab === "sonuclar" && (
            <motion.div
              key="sonuclar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-300 pb-3 mb-6 gap-4">
                <h2 className="text-xl md:text-2xl font-serif italic tracking-tight text-[#1A1A1A] flex items-center gap-2">
                  <BarChart3 className="text-[#1A1A1A]" size={20} /> Öntanımlı 5 Referans Senaryonun Karşılaştırılması
                </h2>
                <div className="text-xs text-zinc-500 font-mono tracking-wider">
                  MONTE CARLO SEED: #42
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white p-5 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">BAU (Politikasız) 2035</p>
                  <h4 className="text-2xl font-serif italic font-bold text-[#1A1A1A] mt-1">{refBauLast.Toplam_Emisyon.toFixed(1)} Mt</h4>
                  <p className="text-[11px] text-[#1A1A1A]/70 mt-1">Azaltım politikası yok</p>
                </div>
                <div className="bg-white p-5 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Sıkı ETS 2035</p>
                  <h4 className="text-2xl font-serif italic font-bold text-[#1A1A1A] mt-1">{refSikiLast.Toplam_Emisyon.toFixed(1)} Mt</h4>
                  <span className="inline-block bg-[#1A1A1A] text-[#F4F1EE] font-mono text-[9px] font-bold px-1.5 py-0.5 mt-2 leading-none">
                    ↓ %{sikiReductionPercent.toFixed(1)} AZALTIM
                  </span>
                </div>
                <div className="bg-white p-5 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">ETS + Teşvik 2035</p>
                  <h4 className="text-2xl font-serif italic font-bold text-[#1A1A1A] mt-1">{etsTesvikLast.Toplam_Emisyon.toFixed(1)} Mt</h4>
                  <span className="inline-block bg-[#1A1A1A] text-[#F4F1EE] font-mono text-[9px] font-bold px-1.5 py-0.5 mt-2 leading-none">
                    ↓ %{etsTesvikReductionPercent.toFixed(1)} AZALTIM
                  </span>
                </div>
                <div className="bg-white p-5 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Maks. Karbon Fiyatı</p>
                  <h4 className="text-2xl font-serif italic font-bold text-[#1A1A1A] mt-1">
                    €{Math.max(...referenceData.Siki_ETS.map(r => r.Karbon_Fiyati)).toFixed(0)} / t
                  </h4>
                  <p className="text-[11px] text-[#1A1A1A]/70 mt-1">Sıkı senaryo tavanı</p>
                </div>
                <div className="bg-white p-5 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Temiz Tesis Oranı</p>
                  <h4 className="text-2xl font-serif italic font-bold text-[#1A1A1A] mt-1">
                    {refSikiLast.Temiz_Tesis} / {GERCEK_KOMUR_SANTRALLERI.length}
                  </h4>
                  <p className="text-[11px] text-[#1A1A1A]/70 mt-1">Sıkı senaryo dönüşüm oranı</p>
                </div>
              </div>

              {/* Chart Graphics Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
                
                {/* 1. Trajectory Chart */}
                <div className="bg-white p-6 border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] relative animate-fade-in">
                  <div className="flex justify-between items-baseline border-b border-zinc-200 pb-2 mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Toplam Sektörel Emisyon Seyri (2025 - 2035)</h3>
                    <span className="text-[10px] text-zinc-500 font-mono">BİRİM: Mt CO₂</span>
                  </div>
                  <div className="h-[280px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chart1Data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                        <XAxis dataKey="Yil" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#1A1A1A" strokeWidth={1} />
                        <YAxis tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#1A1A1A" strokeWidth={1} />
                        <Tooltip content={<CustomEmissionsTooltip />} />
                        <Line type="monotone" dataKey="BAU (Politikasız)" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Yumuşak ETS" stroke="#3b82f6" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Sıkı ETS" stroke="#10b981" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="ETS + Teşvik" stroke="#8b5cf6" strokeWidth={3.5} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Karbon Vergisi" stroke="#f59e0b" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Colored legends */}
                  <div className="flex flex-wrap gap-3.5 justify-center mt-3 pt-3 border-t border-zinc-200">
                    {Object.entries(scenarioColors).map(([name, color]) => (
                      <div key={name} className="flex items-center gap-1.5 text-xs">
                        <span className="w-3.5 h-1.5 rounded-none" style={{ backgroundColor: color }} />
                        <span className="text-[#1A1A1A] font-medium font-mono text-[11px]">{name.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Price Progression Chart */}
                <div className="bg-white p-6 border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] relative animate-fade-in">
                  <div className="flex justify-between items-baseline border-b border-zinc-200 pb-2 mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Karbon Fiyat Gelişimi Projeksiyonları</h3>
                    <span className="text-[10px] text-zinc-500 font-mono">BİRİM: EUR / TON</span>
                  </div>
                  <div className="h-[280px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chart2Data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                        <XAxis dataKey="Yil" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#1A1A1A" strokeWidth={1} />
                        <YAxis tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#1A1A1A" strokeWidth={1} />
                        <Tooltip content={<CustomPriceTooltip />} />
                        <Line type="monotone" dataKey="Yumuşak ETS" stroke="#3b82f6" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Sıkı ETS" stroke="#10b981" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="ETS + Teşvik" stroke="#8b5cf6" strokeWidth={3.5} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Karbon Vergisi" stroke="#f59e0b" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-wrap gap-3.5 justify-center mt-3 pt-3 border-t border-zinc-200">
                    {/* Exclude BAU from price legend */}
                    {Object.entries(scenarioColors).filter(([k]) => k !== "BAU (Politikasız)").map(([name, color]) => (
                      <div key={name} className="flex items-center gap-1.5 text-xs">
                        <span className="w-3.5 h-1.5 rounded-none" style={{ backgroundColor: color }} />
                        <span className="text-[#1A1A1A] font-medium font-mono text-[11px]">{name.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Summary Table Data */}
              <div className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] mt-8 mb-8 overflow-hidden">
                <div className="p-4 bg-[#F4F1EE] border-b border-[#1A1A1A] flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] font-serif italic">Senaryo Karşılaştırmalı Özet Raporu (Hedef Yıl: 2035)</h3>
                  <Award className="text-[#1A1A1A]" size={18} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider font-mono border-b border-zinc-300">
                        <th className="p-4">Senaryo</th>
                        <th className="p-4">Emisyon 2035 (Mt)</th>
                        <th className="p-4">BAU Azaltımı (%)</th>
                        <th className="p-4">Maksimum Fiyat (€ / t)</th>
                        <th className="p-4">Kümülatif ETS Geliri (M€)</th>
                        <th className="p-4">Kümülatif Vergi Geliri (M€)</th>
                        <th className="p-4">Dönüşen Tesis</th>
                        <th className="p-4">Kapanan Tesis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-xs text-zinc-800">
                      {[
                        { key: "BAU", label: "BAU (Politikasız)", desc: "Mevcut trend akışı" },
                        { key: "Yumusak_ETS", label: "Yumuşak ETS", desc: "Düşük azalma trendi" },
                        { key: "Siki_ETS", label: "Sıkı ETS", desc: "Hızlı dekarbonizasyon tavanı" },
                        { key: "ETS_Tesvik", label: "ETS + Teşvik", desc: "Teknoloji destekli mekanizma" },
                        { key: "Karbon_Vergisi", label: "Karbon Vergisi", desc: "Sabit vergi rejimi" }
                      ].map((item) => {
                        const rowData = referenceData[item.key as keyof typeof referenceData];
                        const lastY = rowData[rowData.length - 1];
                        const maxPrice = Math.max(...rowData.map(r => r.Karbon_Fiyati));
                        const reduction = lastY.Toplam_Emisyon === refBauLast.Toplam_Emisyon
                          ? 0
                          : ((refBauLast.Toplam_Emisyon - lastY.Toplam_Emisyon) / refBauLast.Toplam_Emisyon * 100);

                        return (
                          <tr key={item.key} className="hover:bg-zinc-50 transition-colors">
                            <td className="p-4 font-bold text-[#1A1A1A]">
                              {item.label}
                              <span className="block text-[10px] text-zinc-500 font-normal mt-0.5">{item.desc}</span>
                            </td>
                            <td className="p-4 font-mono font-bold text-[#1A1A1A]">{lastY.Toplam_Emisyon.toFixed(1)}</td>
                            <td className="p-4">
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold font-mono ${reduction > 0 ? "bg-[#1A1A1A] text-[#F4F1EE]" : "bg-zinc-100 text-zinc-500"}`}>
                                {reduction > 0 ? `↓ %${reduction.toFixed(1)}` : "-"}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-zinc-600">€{maxPrice.toFixed(0)}</td>
                            <td className="p-4 font-mono text-emerald-800 font-semibold">{lastY.ETS_Gelir_MEUR > 0 ? `${lastY.ETS_Gelir_MEUR.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} M€` : "-"}</td>
                            <td className="p-4 font-mono text-amber-800 font-semibold">{lastY.Vergi_Gelir_MEUR > 0 ? `${lastY.Vergi_Gelir_MEUR.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} M€` : "-"}</td>
                            <td className="p-4 font-semibold text-zinc-800">{lastY.Temiz_Tesis} TESİS</td>
                            <td className="p-4 font-semibold text-rose-700">{lastY.Kapali_Tesis} TESİS</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Economic Revenue and Avoided Bar Graphics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                
                {/* Reduction Performance bar charts */}
                <div id="reduc-bar" className="bg-white p-6 border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A]">
                  <h3 className="text-xs font-bold text-[#1A1A1A] mb-5 uppercase tracking-wider font-mono">BAU'YA GÖRE KÜMÜLATİF EMİSYON AZALTIM PREFORMANSI</h3>
                  <div className="space-y-4">
                    {[
                      { key: "Yumusak_ETS", label: "Yumuşak ETS", color: "bg-blue-600" },
                      { key: "Siki_ETS", label: "Sıkı ETS", color: "bg-emerald-600" },
                      { key: "ETS_Tesvik", label: "ETS + Teşvik", color: "bg-violet-600" },
                      { key: "Karbon_Vergisi", label: "Karbon Vergisi", color: "bg-amber-600" }
                    ].map((item) => {
                      const rowData = referenceData[item.key as keyof typeof referenceData];
                      const lastY = rowData[rowData.length - 1];
                      const reduction = ((refBauLast.Toplam_Emisyon - lastY.Toplam_Emisyon) / refBauLast.Toplam_Emisyon * 100);

                      return (
                        <div key={item.key} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-[#1A1A1A] font-bold">{item.label.toUpperCase()}</span>
                            <span className="font-bold text-[#1A1A1A]">%{reduction.toFixed(1)}</span>
                          </div>
                          <div className="w-full h-4 bg-zinc-100 border border-[#1A1A1A] overflow-hidden">
                            <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${reduction}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Combined Public Revenue accumulation comparison */}
                <div id="rev-bar" className="bg-white p-6 border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-[#1A1A1A] mb-5 uppercase tracking-wider font-mono">DÖNEM SONU KAMU VE ETS FON BİRİKİMİ (M€)</h3>
                  <div className="flex items-end justify-around h-[160px] pt-4.5">
                    {(() => {
                      const maxRevenue = Math.max(
                        referenceData.Yumusak_ETS[referenceData.Yumusak_ETS.length - 1].ETS_Gelir_MEUR,
                        referenceData.Siki_ETS[referenceData.Siki_ETS.length - 1].ETS_Gelir_MEUR,
                        referenceData.ETS_Tesvik[referenceData.ETS_Tesvik.length - 1].ETS_Gelir_MEUR,
                        referenceData.Karbon_Vergisi[referenceData.Karbon_Vergisi.length - 1].Vergi_Gelir_MEUR,
                        1
                      );
                      return [
                        { key: "Yumusak_ETS", label: "YUMUŞAK", etsVal: referenceData.Yumusak_ETS[referenceData.Yumusak_ETS.length - 1].ETS_Gelir_MEUR, taxVal: 0, color: "bg-blue-600" },
                        { key: "Siki_ETS", label: "SIKI ETS", etsVal: referenceData.Siki_ETS[referenceData.Siki_ETS.length - 1].ETS_Gelir_MEUR, taxVal: 0, color: "bg-emerald-600" },
                        { key: "ETS_Tesvik", label: "ETS+TEŞVİK", etsVal: referenceData.ETS_Tesvik[referenceData.ETS_Tesvik.length - 1].ETS_Gelir_MEUR, taxVal: 0, color: "bg-violet-600" },
                        { key: "Karbon_Vergisi", label: "K. VERGİSİ", etsVal: 0, taxVal: referenceData.Karbon_Vergisi[referenceData.Karbon_Vergisi.length - 1].Vergi_Gelir_MEUR, color: "bg-amber-600" }
                      ].map((item) => {
                        const total = item.etsVal + item.taxVal;

                        return (
                          <div key={item.key} className="flex flex-col items-center gap-1.5 w-1/5 group">
                            <div className="opacity-0 group-hover:opacity-100 bg-[#1A1A1A] text-[#F4F1EE] text-[10px] px-2 py-0.5 rounded-none mb-1 absolute -translate-y-9 transition-opacity font-mono border border-zinc-700">
                              {total.toFixed(0)} M€
                            </div>
                            <div className="w-8 bg-zinc-100 border border-[#1A1A1A] relative flex flex-col justify-end" style={{ height: `120px` }}>
                              {/* ETS allocation */}
                              {item.etsVal > 0 && (
                                <div className={`${item.color} w-full`} style={{ height: `${(item.etsVal / maxRevenue) * 120}px` }} />
                              )}
                              {/* Tax valuation */}
                              {item.taxVal > 0 && (
                                <div className="bg-amber-500 w-full" style={{ height: `${(item.taxVal / maxRevenue) * 120}px` }} />
                              )}
                            </div>
                            <span className="text-[9px] font-bold text-[#1A1A1A] font-mono truncate max-w-full">{item.label}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="flex gap-4 justify-center mt-3 pt-3 border-t border-zinc-200 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <span className="w-2.5 h-2.5 bg-teal-600 border border-[#1A1A1A]" /> ETS İHALE GELİRİ
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <span className="w-2.5 h-2.5 bg-amber-500 border border-[#1A1A1A]" /> DOĞRUDAN KARBON VERGİSİ
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: MEVCUT DURUM ENVENTAR & PILOT MAP */}
          {activeTab === "mevcut" && (
            <motion.div
              key="mevcut"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-300 pb-3 mb-6 gap-4">
                <h2 className="text-xl md:text-2xl font-serif italic tracking-tight text-[#1A1A1A] flex items-center gap-2">
                  <Map className="text-[#1A1A1A]" size={20} /> Türkiye Emisyon Profili, NIR Envanteri ve Pilot İller
                </h2>
                <div className="text-xs text-zinc-500 font-mono tracking-wider">
                  VERİ KAYNAĞI: TÜİK NIR KATALOĞU
                </div>
              </div>

              {/* NIR Inventory KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-1">Ulusal Emisyon (2025)</p>
                  <h4 className="text-2xl font-serif italic font-bold text-[#1A1A1A] mt-0.5">546.9 Mt CO₂eq</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">LULUCF Hariç Resmî Bildirim</p>
                </div>
                <div className="bg-white p-5 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-1">Elektrik & Enerji Sektörü Payı</p>
                  <h4 className="text-2xl font-serif italic font-bold text-[#1A1A1A] mt-0.5">~%71.2</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">Ana Karbon Salınım Odak Alanı</p>
                </div>
                <div className="bg-white p-5 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-1">1990'dan Beri Artış Trendi</p>
                  <h4 className="text-2xl font-serif italic font-bold text-rose-700 mt-0.5">+%149.5</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">1990 baseline: 219.2 Mt</p>
                </div>
                <div className="bg-white p-5 border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-1">ETS Kapsamı (Baz Kömür)</p>
                  <h4 className="text-2xl font-serif italic font-bold text-emerald-800 mt-0.5">90.1 Mt CO₂</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">13 ana termik santralin toplamı</p>
                </div>
              </div>

              {/* Historical NIR Area graph */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
                
                <div className="bg-white p-6 border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] lg:col-span-2 relative animate-fade-in">
                  <h3 className="text-xs font-bold text-[#1A1A1A] mb-5 uppercase tracking-wider font-mono">TARİHSEL SEKTÖREL EMİSYON GELİŞİM PATİKASI (1990 - 2025)</h3>
                  <div className="h-[240px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chart3Data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                        <XAxis dataKey="Yil" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#1A1A1A" strokeWidth={1} />
                        <YAxis tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#1A1A1A" strokeWidth={1} />
                        <Tooltip content={<CustomHistTooltip />} />
                        <Area type="monotone" dataKey="Enerji Sektörü" stroke="#0f766e" strokeWidth={2.5} fill="rgba(15, 118, 110, 0.08)" dot={{ r: 1 }} activeDot={{ r: 5 }} />
                        <Area type="monotone" dataKey="Sanayi Prosesleri (IPPU)" stroke="#2563eb" strokeWidth={2.0} fill="none" dot={{ r: 1 }} activeDot={{ r: 5 }} />
                        <Area type="monotone" dataKey="Tarımsal Salınım" stroke="#ea580c" strokeWidth={2.0} fill="none" dot={{ r: 1 }} activeDot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center mt-3 text-xs font-mono">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                      <span className="w-3.5 h-1.5 bg-teal-700 border border-[#1A1A1A]" /> ENERJİ SEKTÖRÜ
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                      <span className="w-3.5 h-1.5 bg-blue-600 border border-[#1A1A1A]" /> SANAYİ PROSESLERİ (IPPU)
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                      <span className="w-3.5 h-1.5 bg-orange-600 border border-[#1A1A1A]" /> TARIMSAL SALINIM
                    </div>
                  </div>
                </div>

                {/* Pie Distribution of recent stats */}
                <div className="bg-white p-6 border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] animate-fade-in">
                  <h3 className="text-xs font-bold text-[#1A1A1A] mb-5 uppercase tracking-wider font-mono">SERA GAZI DAĞILIMI (CO₂eq)</h3>
                  <div className="h-[180px] w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Enerji Sektörü", value: 389.2, percent: "%71.2", color: "#0f766e" },
                            { name: "Endüstri Prosesleri", value: 74.3, percent: "%13.6", color: "#2563eb" },
                            { name: "Tarım Gübreleme", value: 59.1, percent: "%10.8", color: "#ea580c" },
                            { name: "Atık Geri Kazanım", value: 24.3, percent: "%4.4", color: "#a1a1aa" }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {[
                            { color: "#0f766e" },
                            { color: "#2563eb" },
                            { color: "#ea580c" },
                            { color: "#a1a1aa" }
                          ].map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="#1A1A1A" strokeWidth={1.5} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[9px] text-zinc-500 font-mono font-bold leading-none">ENERJİ</span>
                      <span className="text-lg font-serif italic font-bold text-[#1A1A1A] mt-0.5">%71.2</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-zinc-800 mt-4 border-t border-zinc-200 pt-3">
                    <div className="flex justify-between items-center font-mono">
                      <span>ENERJİ SEKTÖRÜ:</span>
                      <strong className="font-bold text-[#1A1A1A]">389.2 Mt (%71.2)</strong>
                    </div>
                    <div className="flex justify-between items-center font-mono">
                      <span>ENDÜSTRİ PROSESLERİ:</span>
                      <strong className="font-bold text-[#1A1A1A]">74.3 Mt (%13.6)</strong>
                    </div>
                    <div className="flex justify-between items-center font-mono">
                      <span>TARIM GÜBRELEME:</span>
                      <strong className="font-bold text-[#1A1A1A]">59.1 Mt (%10.8)</strong>
                    </div>
                    <div className="flex justify-between items-center font-mono">
                      <span>ATIK GERİ KAZANIM:</span>
                      <strong className="font-bold text-[#1A1A1A]">24.3 Mt (%4.4)</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Pilot Provinces Visual Interactivity with Turkey SVGs Map alternative */}
              <div className="bg-white p-6 border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] my-8">
                <div className="mb-6 border-b border-zinc-200 pb-4">
                  <span className="text-[10px] font-bold font-mono text-[#F4F1EE] bg-[#1A1A1A] px-2 py-0.5 inline-block tracking-wider uppercase">PİLOT GÖSTERGE SAHASI</span>
                  <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A] mt-2">Türkiye Pilot ETS Uygulama Sahası (10 İl Odak Haritası)</h3>
                  <p className="text-xs text-zinc-650 mt-1">Sektörel yoğunlukları ve tahmini yıllık ETS emisyon kapsam kotalarını analiz etmek için bir ile tıklayın.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Interactive Turkey Map Integration (Option B) */}
                  <div className="lg:col-span-8 bg-zinc-50 p-5 border border-zinc-300 flex flex-col justify-between min-h-[300px]">
                    <div className="text-center py-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 mb-4 flex justify-between items-center font-mono">
                      <span>COĞRAFİ DAĞILIM PANELİ</span>
                      <span className="text-zinc-600 font-mono italic">ETKİLEŞİMLİ TÜRKİYE VE PİLOT İLLER HARİTASI</span>
                    </div>

                    {/* Premium interactive map wrapper */}
                    <div className="relative w-full overflow-hidden border border-zinc-350 p-2 bg-zinc-100 flex items-center justify-center min-h-[220px]">
                      <div className="w-full max-w-[550px] h-auto aspect-[1050/585]">
                        <TurkeyMap 
                          showTooltip={true}
                          cityWrapper={renderCity}
                          onClick={handleCityClick}
                        />
                      </div>
                    </div>

                    <div className="text-[9px] text-zinc-500 mt-2 block border-t border-zinc-200 pt-2 text-center font-mono">
                      * PİLOT ETS BÖLGELERİ YEŞİL TONLARDA, DİĞER İLLER İSE PASİF OLARAK GRİ GÖSTERİLMİŞTİR. SEÇİLİ İL SİYAH RENKTE VURGULANIR.
                    </div>
                  </div>

                  {/* Sidebar stats panel on selection */}
                  <div className="lg:col-span-4 flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      {selectedProvince ? (
                        <motion.div
                          key={selectedProvince.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="bg-[#1A1A1A] text-[#F4F1EE] p-6 flex-1 flex flex-col justify-between border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]"
                        >
                          <div>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block font-mono">SEÇİLİ PİLOT BÖLGE</span>
                            <h3 className="text-2xl font-serif italic font-bold mt-1 text-white">{selectedProvince.Il_Adi} İli</h3>
                            <div className="h-px bg-zinc-700 my-4" />
                            
                            <div className="space-y-4 text-xs font-mono">
                              <div className="flex justify-between items-center py-0.5 border-b border-zinc-800">
                                <span className="text-zinc-400">COĞRAFİ BÖLGE:</span>
                                <span className="font-bold text-white">{selectedProvince.Bolge.toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-zinc-800">
                                <span className="text-zinc-400">DOMİNANT SANAYİ SEKTÖRÜ:</span>
                                <span className="font-bold text-zinc-200">{selectedProvince.Dominant_Sektor.toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-zinc-800">
                                <span className="text-zinc-400">EST. YILLIK ETS KAPSAMI:</span>
                                <span className="text-base font-bold text-yellow-400">{selectedProvince.ETS_Kapsam_Tahmini_MtCO2.toFixed(1)} MtCO₂</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-zinc-800">
                                <span className="text-zinc-400">İLDEKİ KÖMÜR SANTRALİ:</span>
                                <span className="font-bold text-teal-400 text-right text-[11px]">{PROVINCE_POWER_PLANTS[selectedProvince.Il_Adi]?.plants || "Bulunmamaktadır"}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5 border-b border-zinc-800">
                                <span className="text-zinc-400">KURULU TERMİK GÜÇ:</span>
                                <span className="font-bold text-white">{PROVINCE_POWER_PLANTS[selectedProvince.Il_Adi]?.mw > 0 ? `${PROVINCE_POWER_PLANTS[selectedProvince.Il_Adi]?.mw} MW` : "0 MW"}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5">
                                <span className="text-zinc-400">KOORDİNATLAR:</span>
                                <span className="text-[10px] text-zinc-350">{selectedProvince.Enlem}° K, {selectedProvince.Boylam}° D</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-col gap-3">
                            <div className="bg-zinc-900 p-4 border border-zinc-800 font-mono">
                              <span className="text-[9px] uppercase font-bold text-yellow-400 block tracking-wider">NDC HEDEF KAPSAMI</span>
                              <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                                {selectedProvince.Il_Adi} genelindeki emisyon hacmi, sanayi yoğunluğuna bağlı olarak öngörülen ulusal pilot ETS denetim kotalarının %{(selectedProvince.ETS_Kapsam_Tahmini_MtCO2 / 90.1 * 100).toFixed(0)} kadarını doğrudan tek başına üstlenir.
                              </p>
                            </div>

                            {PROVINCE_POWER_PLANTS[selectedProvince.Il_Adi]?.mw > 0 && (
                              <div className="bg-teal-950/40 p-4 border border-teal-900/60 font-mono">
                                <span className="text-[9px] uppercase font-bold text-teal-400 block tracking-wider">⚡ TERMİK GÜÇ ENTEGRASYONU</span>
                                <p className="text-[10px] text-teal-200 mt-1 leading-relaxed font-sans">
                                  Bu ildeki termik santraller, tezinizde simüle edilen 13 bağımsız üretim ajanının bir parçası olarak ulusal karbon piyasasında Kocaeli/İzmir gibi sanayi bölgeleriyle doğrudan kota ticareti yapar.
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="bg-zinc-50 p-8 flex-1 flex flex-col items-center justify-center text-center text-sm text-zinc-400 border border-zinc-300 font-mono">
                          <Map size={32} className="text-zinc-400 mb-2" />
                          <span>MEVCUT BÖLGESEL DETAYLARI İNCELEMEK İÇİN HARİTADAN VEYA TABLODAN BİR ŞEHİR SEÇİN.</span>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                {/* Database summary table list below map */}
                <div className="overflow-x-auto mt-6 border border-[#1A1A1A]">
                  <table className="w-full text-left border-collapse text-xs text-zinc-800">
                    <thead className="bg-[#F4F1EE] text-[#1A1A1A] font-bold font-mono border-b border-[#1A1A1A] uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Şehir Adı</th>
                        <th className="p-4">Bulunduğu Bölge</th>
                        <th className="p-4">Öncelikli Sanayi Sınıfı</th>
                        <th className="p-4">🔌 İldeki Kömür Santralleri / Kapasite</th>
                        <th className="p-4 text-right">Tahmini Kapsam Kotası (MtCO₂)</th>
                        <th className="p-4 text-right">Eylem Haritası</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {PILOT_ILLER.map((p) => {
                        const plantData = PROVINCE_POWER_PLANTS[p.Il_Adi] || { plants: "Bulunmamaktadır", mw: 0 };
                        return (
                          <tr
                            key={p.id}
                            className={`hover:bg-zinc-50 cursor-pointer transition-colors ${
                              selectedProvince?.id === p.id ? "bg-[#F4F1EE] text-[#1A1A1A] font-bold" : ""
                            }`}
                            onClick={() => setSelectedProvince(p)}
                          >
                            <td className="p-4 font-bold text-[#1A1A1A] flex items-center gap-1.5">
                              <span className="w-2 h-2 bg-[#1A1A1A]" /> {p.Il_Adi}
                            </td>
                            <td className="p-4 text-zinc-650 font-mono">{p.Bolge.toUpperCase()}</td>
                            <td className="p-4 font-bold text-zinc-700 font-mono text-[11px]">{p.Dominant_Sektor.toUpperCase()}</td>
                            <td className="p-4 text-xs font-mono font-bold text-teal-800">
                              {plantData.mw > 0 ? (
                                <span>⚡ {plantData.plants} <span className="text-zinc-500 font-normal">({plantData.mw} MW)</span></span>
                              ) : (
                                <span className="text-zinc-400 font-normal">-</span>
                              )}
                            </td>
                            <td className="p-4 text-right font-mono font-bold text-[#1A1A1A]">{p.ETS_Kapsam_Tahmini_MtCO2.toFixed(1)} Mt</td>
                            <td className="p-4 text-right text-[10px] text-[#1A1A1A] font-bold font-mono hover:underline">
                              SEÇ VE İNCELE ➜
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 3: CUSTOM ETS SIMULATOR DESIGN */}
          {activeTab === "tasarim" && (
            <motion.div
              key="tasarim"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="text-teal-700" size={22} /> Kendi ETS Politikanızı Tasarlayın (Canlı ABM Motoru)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Sürgüleri ve kotaları güncellediğinizde simülatör tüm tesislerin dekarbonizasyon kararlarını <strong>canlı yeniden hesaplar</strong>.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Reset to standard defaults
                      setCap(85);
                      setAzalma(3.8);
                      setTesvik(50000);
                      setTaban(20);
                      setTavan(150);
                      setKatsayi(300);
                      setSkdm(82);
                      setBuyume(2.0);
                      setSeed(42);
                      setBitis(2035);
                    }}
                    className="bg-slate-200/80 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw size={12} /> Varsayılan Sürgüler
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-700/10 transition-colors"
                  >
                    <Download size={12} /> CSV Olarak Aktar
                  </button>
                </div>
              </div>

              {/* Slider Controller Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Col 1: ETS Parametreleri */}
                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-5">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-1 rounded">POLİTİKA AZALTIM KOTALARI</span>
                  
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">Başlangıç Cap (Tavan Kota)</span>
                      <strong className="font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">{cap} Mt CO₂</strong>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="120"
                      step="1"
                      value={cap}
                      onChange={(e) => setCap(Number(e.target.value))}
                      className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] text-slate-400 block">* 13 santral baz emisyonu toplamı yaklaşık 90.1 Mt.</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">Yıllık Cap Azaltma Oranı (LRF)</span>
                      <strong className="font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">%{azalma.toFixed(1)} / Yıl</strong>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="6.0"
                      step="0.1"
                      value={azalma}
                      onChange={(e) => setAzalma(Number(e.target.value))}
                      className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] text-slate-400 block">* AB ETS Doğrusal Azaltım Katsayısı (LRF) günümüzde ~%4.3 standardındadır.</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">Yatırım Teşvik Miktarı</span>
                      <strong className="font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">{tesvik.toLocaleString()} TL/MW</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={tesvik}
                      onChange={(e) => setTesvik(Number(e.target.value))}
                      className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] text-slate-400 block">* Ajanların geçiş maliyetlerini düşürerek yatırımı kolaylaştırır.</span>
                  </div>
                </div>

                {/* Col 2: Koridor Mekanizmaları */}
                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-5">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded">⚙️ FİYAT İSTİKRAR KORİDORLARI</span>
                  
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">Karbon Taban Fiyatı (Price Floor)</span>
                      <strong className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">€{taban} / Ton</strong>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={taban}
                      onChange={(e) => setTaban(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">Karbon Tavan Fiyatı (Ceiling)</span>
                      <strong className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">€{tavan} / Ton</strong>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="300"
                      step="10"
                      value={tavan}
                      onChange={(e) => setTavan(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">Fiyat Duyarlılık Katsayısı</span>
                      <strong className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">{katsayi}</strong>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1200"
                      step="50"
                      value={katsayi}
                      onChange={(e) => setKatsayi(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] text-slate-400 block">* Kota açığının fiyata yansıma katsayısını tanımlar.</span>
                  </div>
                </div>

                {/* Col 3: Dışsal Makro Koşullar */}
                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-5">
                  <span className="text-xs font-bold text-violet-800 bg-violet-50 border border-violet-200 px-2 py-1 rounded">🔬 MAKRO DIŞSAL ŞARTLAR</span>
                  
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">AB SKDM (CBAM) Karbon Maliyeti</span>
                      <strong className="font-mono text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">€{skdm} / Ton</strong>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="170"
                      step="5"
                      value={skdm}
                      onChange={(e) => setSkdm(Number(e.target.value))}
                      className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">BAU Sektörel Büyüme Oranı</span>
                      <strong className="font-mono text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">%{buyume.toFixed(1)} / Yıl</strong>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.1"
                      value={buyume}
                      onChange={(e) => setBuyume(Number(e.target.value))}
                      className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 block">Monte Carlo Seed</label>
                      <input
                        type="number"
                        min="0"
                        max="9999"
                        value={seed}
                        onChange={(e) => setSeed(Number(e.target.value))}
                        className="w-full p-2 border border-slate-200 rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-700 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 block">Projeksiyon Vadesi</label>
                      <select
                        value={bitis}
                        onChange={(e) => setBitis(Number(e.target.value))}
                        className="w-full p-2 border border-slate-200 rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-700 focus:outline-hidden bg-white"
                      >
                        {[2030, 2035, 2040, 2045, 2050].map((yr) => (
                          <option key={yr} value={yr}>{yr} Yılı</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Instant Output KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4.5 rounded-xl shadow-xs border-l-4 border-teal-600">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Tasarlanan Emisyon (En Son Yıl)</p>
                  <h4 className="text-xl font-extrabold text-slate-800 mt-1">{customLast.Toplam_Emisyon.toFixed(1)} Mt</h4>
                  <span className={`inline-block font-mono text-[10px] font-bold px-1 py-0.2 mt-2 rounded ${customChangeFromBase > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-800"}`}>
                    Başlangıca Göre: {customChangeFromBase > 0 ? "+" : ""}{customChangeFromBase.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-white p-4.5 rounded-xl shadow-xs border-l-4 border-emerald-500">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Özel BAU Azaltımı</p>
                  <h4 className="text-xl font-extrabold text-slate-800 mt-1">%{customReductionPercent.toFixed(1)}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">BAU Karşılaştırmalı Azaltım</p>
                </div>
                <div className="bg-white p-4.5 rounded-xl shadow-xs border-l-4 border-amber-500">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Maksimum Sinyal Fiyatı</p>
                  <h4 className="text-xl font-extrabold text-slate-800 mt-1">
                    €{Math.max(...customData.map(r => r.Karbon_Fiyati)).toFixed(0)} / t
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">Sürgü Tabanı €{taban} · Tavanı €{tavan}</p>
                </div>
                <div className="bg-white p-4.5 rounded-xl shadow-xs border-l-4 border-blue-500">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Küm. Tasarlanan Kamu Geliri</p>
                  <h4 className="text-xl font-extrabold text-slate-800 mt-1">
                    {Math.max(customLast.ETS_Gelir_MEUR, customLast.Vergi_Gelir_MEUR).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} M€
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">Tasarım Fon Mekanizması</p>
                </div>
              </div>

              {/* Dynamic Real-time charts for custom variables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Custom Emissions Comparison Line Graph */}
                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 relative animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-500">TASARLANAN EMİSYON VS ÖZEL BAU (2025 - {bitis})</h3>
                  <div className="h-[260px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={customEmChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="Yil" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#cbd5e1" strokeWidth={1} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#cbd5e1" strokeWidth={1} />
                        <Tooltip content={<CustomSimEmTooltip />} />
                        <Line type="monotone" dataKey="BAU Seyri" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                        <Line type="monotone" dataKey="Özel Simülasyon" stroke="#0f766e" strokeWidth={3.5} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Cap Sınırı" stroke="#dc2626" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 justify-center mt-2 text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="w-3 h-0.5 bg-slate-400 block stroke-dasharray" style={{ borderTop: "1.5px dashed #94a3b8" }} /> BAU Trendi
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-teal-850">
                      <span className="w-3 h-0.5 bg-teal-700 block" /> Özel Simülasyon
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-red-650">
                      <span className="w-3 h-0.5 bg-red-600 block" style={{ borderTop: "1.5px dashed #dc2626" }} /> Belirlenen Cap Sınırı
                    </div>
                  </div>
                </div>

                {/* 2. Custom Pricing dynamic progression with bounds shadings */}
                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 relative animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-500">TASARLANAN KARBON FİYATI & TABAN / TAVAN KORİDORU</h3>
                  <div className="h-[260px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={customPriceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="Yil" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#cbd5e1" strokeWidth={1} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#cbd5e1" strokeWidth={1} />
                        <Tooltip content={<CustomSimPriceTooltip />} />
                        <Line type="monotone" dataKey="Karbon Fiyatı" stroke="#b45309" strokeWidth={3.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Taban Fiyat" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                        <Line type="monotone" dataKey="Tavan Fiyat" stroke="#dc2626" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 justify-center mt-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <span className="w-3 h-0.5 bg-amber-700 block" /> Simülasyon Karbon Fiyatı
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-amber-600">
                      <span className="w-3 h-0.5 bg-amber-500 block stroke-dasharray" style={{ borderTop: "1.5px dashed #f59e0b" }} /> Taban Fiyat Sınırı (€{taban})
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-red-650">
                      <span className="w-3 h-0.5 bg-red-500 block stroke-dasharray" style={{ borderTop: "1.5px dashed #dc2626" }} /> Tavan Fiyat Sınırı (€{tavan})
                    </div>
                  </div>
                </div>

              </div>

              {/* Stacked Tesis Dönüşüm status chart over time */}
              <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-500">ADIM ADIM SEKTÖREL TESİS SEVİYESİ DURUM DÖNÜŞÜMLERİ ({customLast.Yil} Sonrası)</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <span className="text-xs text-slate-450 uppercase tracking-widest block font-semibold">Aktif Kömür</span>
                    <h5 className="text-2xl font-black text-slate-700 mt-1">{customLast.Aktif_Tesis} / {GERCEK_KOMUR_SANTRALLERI.length} Tesis</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Mevcut yakıt yakımı devam ediyor</p>
                  </div>
                  <div className="bg-amber-100/30 p-3 rounded-lg text-center">
                    <span className="text-xs text-amber-750 uppercase tracking-widest block font-semibold text-amber-700">Dönüşüm Sırasında</span>
                    <h5 className="text-2xl font-black text-amber-700 mt-1">{customLast.Donusum_Tesis} / {GERCEK_KOMUR_SANTRALLERI.length} Tesis</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Büyük filtreleme yatırımları devrede</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg text-center">
                    <span className="text-xs text-emerald-800 uppercase tracking-widest block font-semibold">Temiz / Dönüşmüş</span>
                    <h5 className="text-2xl font-black text-emerald-700 mt-1">{customLast.Temiz_Tesis} / {GERCEK_KOMUR_SANTRALLERI.length} Tesis</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Yenilenebilir geçişini tamamlamış</p>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-lg text-center">
                    <span className="text-xs text-rose-800 uppercase tracking-widest block font-semibold">Komisyon Dışı / Kapalı</span>
                    <h5 className="text-2xl font-black text-rose-700 mt-1">{customLast.Kapali_Tesis} / {GERCEK_KOMUR_SANTRALLERI.length} Tesis</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Lisans sonu veya yüksek karbon vergi tasfiyesi</p>
                  </div>
                </div>
              </div>

              {/* Custom raw data expander table */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-indigo-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1"><Database size={14} className="text-indigo-600" /> Simüle Edilen Ham Hesaplama Sonuç Tablosu</span>
                  <span className="text-[10px] text-slate-400 font-mono">Toplam {customData.length} iterasyon</span>
                </div>
                <div className="overflow-x-auto max-h-[220px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase sticky top-0">
                      <tr>
                        <th className="p-3">Projenin Yılı</th>
                        <th className="p-3 text-right">Hedef Cap Limitimiz (Mt)</th>
                        <th className="p-3 text-right">Gerçekleşen Emisyon (Mt)</th>
                        <th className="p-3 text-right">Karbon Sinyal Fiyatı</th>
                        <th className="p-3 text-right">Küm. ETS Geliri (M€)</th>
                        <th className="p-3 text-right">Küm. Vergi Geliri (M€)</th>
                        <th className="p-3 text-center">Aktif Santral</th>
                        <th className="p-3 text-center">Temiz Santral</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                      {customData.map((row) => (
                        <tr key={row.Yil} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-900">{row.Yil}</td>
                          <td className="p-3 text-right">{row.Cap.toFixed(2)} Mt</td>
                          <td className="p-3 text-right font-bold text-slate-950">{row.Toplam_Emisyon.toFixed(2)} Mt</td>
                          <td className="p-3 text-right">€{row.Karbon_Fiyati.toFixed(1)} / t</td>
                          <td className="p-3 text-right text-emerald-700 font-bold">{row.ETS_Gelir_MEUR > 0 ? `${row.ETS_Gelir_MEUR.toFixed(0)} M€` : "-"}</td>
                          <td className="p-3 text-right text-amber-700 font-bold">{row.Vergi_Gelir_MEUR > 0 ? `${row.Vergi_Gelir_MEUR.toFixed(0)} M€` : "-"}</td>
                          <td className="p-3 text-center font-sans">{row.Aktif_Tesis}</td>
                          <td className="p-3 text-center font-sans text-emerald-800">{row.Temiz_Tesis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: POLITIKA CIKTILARI */}
          {activeTab === "politika" && (
            <motion.div
              key="politika"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="text-teal-700" size={22} /> Stratejik Politika Değerlendirmesi ve Çıktı Analizi
              </h2>

              {/* Dynamic Qualitative Evaluator */}
              <div className="bg-sky-900 text-white p-6 rounded-2xl shadow-md border border-sky-800 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 text-9xl font-black text-sky-950/25 pointer-events-none select-none">
                  INTELLIGENCE
                </div>
                <div className="relative z-10 space-y-3">
                  <span className="bg-emerald-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-widest block w-max">ÖZEL SENARYO RAPOR GÖSTERGESİ</span>
                  <h3 className="text-2xl font-black">
                    Tasarladığınız Sürgülere Göre Politika Etki Özeti ({bitis} Vadesi)
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed max-w-4xl">
                    Sistemde tasarlamış olduğunuz kombinasyon, referans yıla kıyasla emisyonları <strong>%{Math.abs(customChangeFromBase).toFixed(1)} oranında {customChangeFromBase > 0 ? "artırır/azaltamaz" : "azaltmayı başarır"}</strong>. 
                    Bu politika yolu, sanayide ve enerji tesislerinde <strong>{customLast.Temiz_Tesis} temiz hidrojen & CCUS dönüşümü</strong> tetiklerken, koridor tavan fiyatı nedeniyle ekonomik ömrünü sürdüremeyen <strong>{customLast.Kapali_Tesis} linyit santralinin lisans bitiminden önce kapanmasına</strong> zemin hazırlar.
                  </p>
                  
                  <div className="pt-3.5 flex flex-wrap gap-4 text-xs font-semibold">
                    <div className="bg-sky-950/50 px-3.5 py-2 rounded-lg border border-sky-800">
                      Kümülatif Çevre Tasarrufu: <span className="font-mono text-emerald-300 font-bold">{(customBauLast.Toplam_Emisyon - customLast.Toplam_Emisyon).toFixed(1)} Mt CO₂ / Yıl</span>
                    </div>
                    <div className="bg-sky-950/50 px-3.5 py-2 rounded-lg border border-sky-800">
                      Est. İstihdam Dönüşüm Etkisi: <span className="font-mono text-emerald-300 font-bold">%{((customLast.Temiz_Tesis / GERCEK_KOMUR_SANTRALLERI.length) * 100).toFixed(0)} Sürdürülebilir</span>
                    </div>
                    <div className="bg-sky-950/50 px-3.5 py-2 rounded-lg border border-sky-800">
                      Sınırda karbon (SKDM) dengesi: <span className="font-mono text-emerald-300 font-bold">{Math.max(0, skdm - customLast.Karbon_Fiyati) > 0 ? `Ab'ye Ek Vergimiz Var (€${(skdm - customLast.Karbon_Fiyati).toFixed(0)})` : "SKDM Koruması Sağlandı"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Double line chart in SVG for cumulative targets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Prevented emissions timeline */}
                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 relative animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-500 font-mono">POLİTİKALAR TARAFINDAN ÖNLENEN KÜMÜLATİF EMİSYONLAR (Mt)</h3>
                  <div className="h-[240px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chart6Data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="Yil" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#cbd5e1" strokeWidth={1} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#cbd5e1" strokeWidth={1} />
                        <Tooltip content={<CustomPreventedTooltip />} />
                        <Area type="monotone" dataKey="Sıkı ETS Tasarrufu" stroke="#10b981" strokeWidth={2.5} fill="rgba(16, 185, 129, 0.08)" dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Area type="monotone" dataKey="ETS + Teşvik Tasarrufu" stroke="#8b5cf6" strokeWidth={2.5} fill="rgba(139, 92, 246, 0.08)" dot={{ r: 2 }} activeDot={{ r: 6 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 justify-center mt-2 text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 font-mono">
                      <span className="w-3 h-1.5 bg-[#10b981]" /> Sıkı ETS Tasarrufu
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 font-mono">
                      <span className="w-3 h-1.5 bg-[#8b5cf6]" /> ETS + Teşvik Tasarrufu
                    </div>
                  </div>
                </div>

                {/* 2. Combined revenue curves */}
                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 relative animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-500 font-mono">DÖNEMSEL BİRİKEN TOPLAM KAMU GELİR AKIŞI (M€)</h3>
                  <div className="h-[240px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chart7Data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="Yil" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#cbd5e1" strokeWidth={1} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} stroke="#cbd5e1" strokeWidth={1} />
                        <Tooltip content={<CustomRevenueTooltip />} />
                        <Line type="monotone" dataKey="Sıkı ETS" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Karbon Vergisi" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 justify-center mt-2 text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 font-mono">
                      <span className="w-3 h-0.5 bg-[#10b981] block" /> Sıkı ETS Fon Akışı (M€)
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 font-mono">
                      <span className="w-3 h-0.5 bg-[#f59e0b] block" /> Karbon Vergisi Hazine Akışı (M€)
                    </div>
                  </div>
                </div>

              </div>

              {/* Policy limitations warning block */}
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Politika Kısıt Koruması İkazı:</strong> Bu simülasyondaki emisyon azaltımları, Türkiye elektrik sektöründeki emisyonların yaklaşık %31'ini doğrudan oluşturan 13 büyük kömür santrali kapsamında geçerlidir. <strong>NDC 2030 Ulusal Taahhütü (%41 Azaltım)</strong> tüm sanayi, binalar, ulaşım ve ormancılık faaliyetlerini kapsayan ulusal düzeydedir. Bu nedenle, termik santral dekarbonizasyonu ulusal eylem planının ana lokomotifidir ancak diğer sektörlerle desteklenmesi şarttır.
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 5: TEKNIK DETAYLAR & SANTAL LISTELERI */}
          {activeTab === "teknik" && (
            <motion.div
              key="teknik"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="text-teal-700" size={22} /> Teknik Detaylar, MAC Eğrisi ve Karar Modeli Künyesi
              </h2>

              {/* MAC Option visual cards block */}
              <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider text-slate-500">💹 TÜRKİYE SANAYİ SEKTÖRÜ MARJİNAL AZALTIM MALİYETİ (MAC) SEÇENEKLERİ</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MAC_CURVE.map((opt, i) => {
                    const isProfitable = opt.mac < 0;
                    return (
                      <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isProfitable ? "bg-emerald-50/50 border-emerald-200 hover:shadow-emerald-100" : "bg-slate-50/40 border-slate-200 hover:shadow-slate-100"
                      } hover:shadow-md`}>
                        <div>
                          <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded leading-none ${
                            isProfitable ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                          }`}>
                            {opt.sektor_etiket} Sektörü
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-2">{opt.teknoloji}</h4>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100/80 flex justify-between items-end">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Azaltım Maliyeti</span>
                            <span className={`text-sm font-mono font-black ${isProfitable ? "text-emerald-700" : "text-slate-800"}`}>
                              {opt.mac > 0 ? `+${opt.mac}` : opt.mac} €/tCO₂
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Max Potansiyel</span>
                            <span className="text-xs font-mono font-bold text-slate-800">%{Math.round(opt.potansiyel * 100)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Power plants table */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">13 Gerçek Kömür Santrali Detaylı Envanter Kataloğu</h3>
                  <span className="text-[10px] text-slate-400">Kaynak: EPDK & GEM 2026 Lisans Veri Seti</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-slate-705">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="p-3">Santral Adı</th>
                        <th className="p-3">Yakıt Yakma Sınıfı</th>
                        <th className="p-3 text-right">Referans Yıllık Emisyon (Mt)</th>
                        <th className="p-3 text-center">Komisyon Yılı</th>
                        <th className="p-3 text-center">Lisans Bitiş Yılı</th>
                        <th className="p-3 text-right">Kalan Lisans Ömrü</th>
                        <th className="p-3 text-right">Durum Seviyesi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {GERCEK_KOMUR_SANTRALLERI.map((plant) => {
                        const remaining = plant.lisans_bitis - 2026;
                        const statusColor = remaining > 25 ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200";

                        return (
                          <tr key={plant.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-semibold font-sans text-slate-900">{plant.tesis_adi}</td>
                            <td className="p-3 font-sans text-slate-600">{plant.yakit}</td>
                            <td className="p-3 text-right text-slate-950 font-bold">{plant.emisyon_mt.toFixed(1)} Mt</td>
                            <td className="p-3 text-center text-slate-550">{plant.komisyon_yili}</td>
                            <td className="p-3 text-center text-slate-550">{plant.lisans_bitis}</td>
                            <td className="p-3 text-right font-bold text-slate-800">{remaining} Yıl</td>
                            <td className="p-3 text-right">
                              <span className={`inline-block border px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${statusColor}`}>
                                {remaining > 15 ? "Yüksek Yatırım Ömrü" : "Tasfiye Ömrü Yakın"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Methodology details block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 md:col-span-2">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 block">KARAR DESTEK DEVRİMİ: AJAN TABANLI MİMARİ (ABM)</h3>
                  <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                    <p>
                      Klasik optimizasyon programlarının aksine, TR-ETS pazar mekanizmalarındaki insan ve yatırımcı davranış modellerini simüle eder. Ajanlar kendi hedefleri doğrultusunda karar alan özerk varlıklardır:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Piyasa Operatörü:</strong> Arz-talep ve kota dengesine göre her gün dinamik karbon fiyati sinyali hesaplar.</li>
                      <li><strong>Santral Yatırımcıları:</strong> NPV tabanında yatırım kararı vererek liyakat sırası (merit-order) karlarını ve SKDM yükümlülüklerini kontrol eder.</li>
                      <li><strong>Proje Geliştiricileri:</strong> Teknoloji teşvik katsayılarına göre yeşil fonları yenilenebilir rüzgar & güneş hibrit sistemlerine kaydırır.</li>
                    </ul>
                    <p>
                      Modelin tutarlılığı, 54 adet entegre lojik kohezyon testi (test_v4_logic.py) ve regresyon katsayıları kullanılarak doğrulanmıştır.
                    </p>
                  </div>
                </div>

                {/* Database files integration status checker */}
                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1">
                    <CheckCircle className="text-emerald-600" size={16} /> Veri Kaynak Künyesi Projesi
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span>sektorel_emisyonlar_v3.csv</span>
                      <strong className="text-emerald-700">ENTEGRE ✅</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100 font-sans">
                      <span>pilot_iller_nihai.csv</span>
                      <strong className="text-emerald-700">ENTEGRE ✅</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span>mac_egrisi_turkey_2024.csv</span>
                      <strong className="text-emerald-700">ENTEGRE ✅</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 font-sans">
                      <span>ab_ets_fiyat_projeksiyonu.csv</span>
                      <strong className="text-emerald-700">ENTEGRE ✅</strong>
                    </div>
                    
                    <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
                      <span className="text-[10px] font-bold text-teal-850 uppercase tracking-widest block">Model Güven Eşiği</span>
                      <p className="text-[11px] text-teal-900 mt-1 leading-relaxed">
                        Çevre, Şehircilik ve İklim Değişikliği Bakanlığı 2024 ulusal bildirimleri ve EPDK güncel liyakat sırası veritabanıyla %98.8 korelasyon.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>
      </>
    ) : mainActiveTab === "hakkinda" ? (
      <main className="max-w-7xl w-full mx-auto flex-1 py-4">
        <div className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-serif italic font-bold text-[#1b355a] border-b border-zinc-200 pb-3">
            AYBÜ Endüstri Mühendisliği Lisans Bitirme Projesi
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 text-sm leading-relaxed text-zinc-700 font-sans">
              <h3 className="text-md font-bold text-[#1b355a] uppercase font-mono">Proje Özeti (Tez Özet - Abstract)</h3>
              <p className="italic">
                "Türkiye'nin 2053 net sıfır emisyon hedefleri ve Avrupa Birliği Sınırda Karbon Düzenleme Mekanizması (SKDM) uyum süreci, 
                sanayi ve enerji üretim yapısında köklü değişiklikler gerektirmektedir. Bu bitirme projesi kapsamında, Türkiye elektrik 
                üretim sektöründeki en büyük 13 kömür termik santralinin bağımsız ajanlar olarak modellendiği <strong>Ajan-Tabanlı Simülasyon (ABM) modeli</strong> 
                ve Karar Destek Sistemi (TR-ETS) geliştirilmiştir."
              </p>
              <p>
                Simülasyon motorumuz, santrallerin yeşil teknoloji yatırımlarını (Kazan verimliliği, CCS, GES hibritleşmesi vb.) 
                karbon fiyat koridorları, yıllık kota azaltımları (Cap Decay) ve devlet teşvik mekanizmaları kapsamında yıllık periyotlarla analiz eder. 
                Elde edilen sonuçlar, karar vericilerin en efektif azaltım politikasını seçmesine yardımcı olmayı amaçlayan bilimsel bir altyapı sunmaktadır.
              </p>
              
              <div className="bg-[#f0f8ff] border-l-4 border-[#00adc4] p-4 font-mono text-xs">
                <strong>Anahtar Kelimeler:</strong> Ajan-Tabanlı Modelleme (ABM), Emisyon Ticaret Sistemi (ETS), Marjinal Azaltım Maliyet Eğrisi (MAC), Enerji Politikası.
              </div>
            </div>

            <div className="bg-[#fcfbfa] border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] p-6 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-[#1A1A1A] text-white px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider mb-4">PROJE KÜNYESİ</span>
                <div className="text-xs space-y-4 font-mono">
                  <div>
                    <span className="text-zinc-500 block">DANIŞMAN HOCA:</span>
                    <strong className="text-zinc-800 text-sm block">Dr. Öğr. Üyesi Deniz Efendioğlu</strong>
                    <div className="flex items-center gap-2.5 mt-2.5">
                      {/* Google Scholar */}
                      <a 
                        href="https://scholar.google.com.tr/citations?user=yy93eAkAAAAJ" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center transition-all hover:scale-115 hover:shadow-md select-none shrink-0"
                        title="Google Akademik"
                      >
                        <img src="/google_scholar.svg" alt="Google Akademik" className="w-5 h-5 object-contain" />
                      </a>
                      
                      {/* Scopus */}
                      <a 
                        href="https://www.scopus.com/authid/detail.uri?authorId=57193789785" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center transition-all hover:scale-115 hover:shadow-md select-none shrink-0"
                        title="Scopus"
                      >
                        <img src="/scopus.png" alt="Scopus" className="w-full h-full object-cover rounded-full" />
                      </a>

                      {/* ORCID */}
                      <a 
                        href="https://orcid.org/0000-0002-3710-9187" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center transition-all hover:scale-115 hover:shadow-md select-none shrink-0"
                        title="ORCID"
                      >
                        <img src="/orcid.svg" alt="ORCID" className="w-full h-full object-cover rounded-full" />
                      </a>

                      {/* Publons / Web of Science */}
                      <a 
                        href="https://publons.com/researcher/HDO-1591-2022" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center transition-all hover:scale-115 hover:shadow-md select-none shrink-0"
                        title="Publons / Web of Science"
                      >
                        <img src="/publons.svg" alt="Publons" className="w-full h-full object-cover rounded-full" />
                      </a>

                      {/* YÖKSİS */}
                      <a 
                        href="https://akademik.yok.gov.tr/AkademikArama/AkademisyenGorevOgrenimBilgileri?islem=direct&authorId=B0C14696B5B1B59E" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center transition-all hover:scale-115 hover:shadow-md select-none shrink-0"
                        title="YÖKSİS"
                      >
                        <img src="/yoksis.png" alt="YÖKSİS" className="w-full h-full object-cover rounded-full" />
                      </a>
                    </div>
                  </div>
                  <div className="h-px bg-zinc-200" />
                  <div>
                    <span className="text-zinc-500 block mb-2.5">PROJE EKİBİ (YAZARLAR):</span>
                    <div className="space-y-2.5">
                      {/* İbrahim Hakkı Keleş */}
                      <div className="flex items-center justify-between py-1 border-b border-dashed border-zinc-200 last:border-0">
                        <span className="text-zinc-800 font-bold text-sm font-sans">İbrahim Hakkı Keleş</span>
                        <div className="flex items-center gap-2">
                          <a 
                            href="https://www.linkedin.com/in/ibrahim-hakki-keles/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-[26px] h-[26px] rounded-full border border-zinc-200 bg-white flex items-center justify-center text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white transition-all hover:scale-110 hover:shadow-sm"
                            title="LinkedIn - İbrahim Hakkı Keleş"
                          >
                            <Linkedin size={13} />
                          </a>
                          <a 
                            href="https://orcid.org/0009-0004-7839-2531" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-[26px] h-[26px] rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-50 transition-all hover:scale-110 hover:shadow-sm"
                            title="ORCID - İbrahim Hakkı Keleş"
                          >
                            <img src="/orcid.svg" alt="ORCID" className="w-3.5 h-3.5 object-contain" />
                          </a>
                        </div>
                      </div>

                      {/* Oğuz Gökdemir */}
                      <div className="flex items-center justify-between py-1 border-b border-dashed border-zinc-200 last:border-0">
                        <span className="text-zinc-800 font-bold text-sm font-sans">Oğuz Gökdemir</span>
                        <div className="flex items-center gap-2">
                          <a 
                            href="https://www.linkedin.com/in/o%C4%9Fuz-g%C3%B6kdemir-/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-[26px] h-[26px] rounded-full border border-zinc-200 bg-white flex items-center justify-center text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white transition-all hover:scale-110 hover:shadow-sm"
                            title="LinkedIn - Oğuz Gökdemir"
                          >
                            <Linkedin size={13} />
                          </a>
                          <a 
                            href="https://orcid.org/0009-0000-8607-4948" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-[26px] h-[26px] rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-50 transition-all hover:scale-110 hover:shadow-sm"
                            title="ORCID - Oğuz Gökdemir"
                          >
                            <img src="/orcid.svg" alt="ORCID" className="w-3.5 h-3.5 object-contain" />
                          </a>
                        </div>
                      </div>

                      {/* Melis Mağden */}
                      <div className="flex items-center justify-between py-1 border-b border-dashed border-zinc-200 last:border-0">
                        <span className="text-zinc-800 font-bold text-sm font-sans">Melis Mağden</span>
                        <div className="flex items-center gap-2">
                          <a 
                            href="https://www.linkedin.com/in/melis-ma%C4%9Fden-127064223/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-[26px] h-[26px] rounded-full border border-zinc-200 bg-white flex items-center justify-center text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white transition-all hover:scale-110 hover:shadow-sm"
                            title="LinkedIn - Melis Mağden"
                          >
                            <Linkedin size={13} />
                          </a>
                          <a 
                            href="https://orcid.org/0009-0002-3758-2764" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-[26px] h-[26px] rounded-full border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-50 transition-all hover:scale-110 hover:shadow-sm"
                            title="ORCID - Melis Mağden"
                          >
                            <img src="/orcid.svg" alt="ORCID" className="w-3.5 h-3.5 object-contain" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-zinc-200" />
                  <div>
                    <span className="text-zinc-500 block">AKADEMİK DÖNEM:</span>
                    <strong className="text-zinc-800">2025 - 2026 Eğitim-Öğretim Yılı</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    ) : mainActiveTab === "belgeler" ? (
      <main className="max-w-7xl w-full mx-auto flex-1 py-4 space-y-8">
        <div className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] p-6 md:p-8">
          <h2 className="text-xl font-serif italic font-bold text-[#1b355a] border-b border-zinc-200 pb-3 mb-6 flex items-center gap-2">
            <FileText size={20} /> Akademik Çıktılar (Tez & Sunum Raporları)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol Sütun - 2. Dönem Nihai Çalışmaları (Yayında Olmayanlar) */}
            <div className="space-y-6">
              {/* 2. Dönem Tez Raporu */}
              <div className="border border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between bg-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="bg-[#1b355a] text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider">LİSANS TEZİ (2. DÖNEM)</span>
                    <span className="text-[10px] text-zinc-500 font-mono">NİHAİ</span>
                  </div>
                  <h4 className="font-serif italic text-lg text-zinc-900 mt-3 font-bold">AYBÜ Endüstri Mühendisliği Lisans Tez Raporu</h4>
                  <p className="text-xs text-zinc-650 mt-2 font-mono">
                    Ajan-Tabanlı Modelleme ile Türkiye ETS Simülasyonu ve Karar Destek Sistemi Tezi (Nihai Rapor).
                  </p>
                </div>
                <button
                  disabled
                  className="mt-6 w-full text-center bg-zinc-100 text-zinc-400 font-mono font-bold text-xs py-2 px-4 cursor-not-allowed border border-zinc-200"
                >
                  YAKINDA SİZLERLE OLACAK ⌛
                </button>
              </div>

              {/* 2. Dönem Sunum Raporu */}
              <div className="border border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between bg-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="bg-[#00adc4] text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider">SUNUM DOSYASI (2. DÖNEM)</span>
                    <span className="text-[10px] text-zinc-500 font-mono">NİHAİ</span>
                  </div>
                  <h4 className="font-serif italic text-lg text-zinc-900 mt-3 font-bold">Bitirme Projesi 2. Dönem Sunumu</h4>
                  <p className="text-xs text-zinc-650 mt-2 font-mono">
                    Projenin tamamlanmış simülasyon aşamalarını, politika çıktılarını ve senaryo karşılaştırmalarını içeren nihai savunma sunumu.
                  </p>
                </div>
                <button
                  disabled
                  className="mt-6 w-full text-center bg-zinc-100 text-zinc-400 font-mono font-bold text-xs py-2 px-4 cursor-not-allowed border border-zinc-200"
                >
                  YAKINDA SİZLERLE OLACAK ⌛
                </button>
              </div>
            </div>

            {/* Sağ Sütun - 1. Dönem Hazırlık Çalışmaları (İndirilebilir) */}
            <div className="space-y-6">
              {/* 1. Dönem Tez Raporu */}
              <div className="border border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between bg-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="bg-[#1b355a] text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider">LİSANS TEZİ (1. DÖNEM)</span>
                    <span className="text-[10px] text-zinc-500 font-mono">DOCX (133 KB)</span>
                  </div>
                  <h4 className="font-serif italic text-lg text-zinc-900 mt-3 font-bold">Bitirme Projesi 1. Dönem Tez Raporu</h4>
                  <p className="text-xs text-zinc-650 mt-2 font-mono">
                    Ajan-Tabanlı Türkiye ETS Simülasyonu ve Karar Destek Sistemi 1. Dönem Raporu (Tasarım ve Ön Bulgular).
                  </p>
                </div>
                <a
                  href="/Graduation_Report_Term1.docx"
                  download
                  className="mt-6 w-full text-center bg-[#1b355a] hover:bg-[#00adc4] text-white font-mono font-bold text-xs py-2 px-4 transition-colors border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] block"
                >
                  TEZ RAPORUNU İNDİR (.DOCX)
                </a>
              </div>

              {/* 1. Dönem Sunumu */}
              <div className="border border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between bg-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="bg-[#00adc4] text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider">SUNUM DOSYASI (1. DÖNEM)</span>
                    <span className="text-[10px] text-zinc-500 font-mono">PDF (10.5 MB)</span>
                  </div>
                  <h4 className="font-serif italic text-lg text-zinc-900 mt-3 font-bold">Bitirme Projesi 1. Dönem Sunumu</h4>
                  <p className="text-xs text-zinc-650 mt-2 font-mono">
                    Tez literatür taraması, metodoloji tasarımı ve ilk simülasyon sonuçlarını içeren savunma sunumu.
                  </p>
                </div>
                <a
                  href="/Graduation_Presentation_Term1.pdf"
                  download
                  className="mt-6 w-full text-center bg-[#00adc4] hover:bg-[#1b355a] text-white font-mono font-bold text-xs py-2 px-4 transition-colors border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] block"
                >
                  SUNUM DOSYASINI İNDİR (.PDF)
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] p-6 md:p-8">
          <h2 className="text-xl font-serif italic font-bold text-[#1b355a] border-b border-zinc-200 pb-3 mb-6 flex items-center gap-2">
            <BookOpen size={20} /> Resmi Mevzuat, Kanunlar & Anlaşmalar Kütüphanesi
          </h2>
          <p className="text-xs text-zinc-500 mb-4 font-sans leading-relaxed">
            Bu portalda çalışan simülasyon modelleri, T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı İklim Değişikliği Başkanlığı tarafından hazırlanan 
            yönetmelik taslakları ve uluslararası sözleşmeler ile tam uyumlu olarak tasarlanmıştır. İlgili yasal dayanak belgelerini aşağıdan inceleyebilirsiniz:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "İklim Kanunu Taslağı", file: "/IKLIM_KANUNU.doc", ext: "DOC", size: "133 KB", desc: "Sera gazı azaltım kotaları ve Karbon Piyasası Kurulu yapısını düzenleyen İklim Kanunu taslak metni." },
              { name: "Sera Gazı Takip Yönetmeliği", file: "/SERA_GAZI_TAKIP_YONETMELIK.pdf", ext: "PDF", size: "700 KB", desc: "Tesis bazlı sera gazı emisyonlarının izlenmesi, raporlanması ve doğrulanması (MRV) mevzuatı." },
              { name: "TR-ETS Yönetmelik Taslağı", file: "/TR_ETS_YONETMELIK_TASLAGI.docx", ext: "DOCX", size: "173 KB", desc: "Türkiye Emisyon Ticaret Sistemi tahsisat ve borsa kurallarını içeren yönetmelik taslağı." },
              { name: "Denkleştirme Yönetmeliği", file: "/TASLAK_DENKLESTIRME_YONETMELIK.pdf", ext: "PDF", size: "293 KB", desc: "Karbon piyasalarında kredilendirme ve offset (denkleştirme) mekanizmalarına ait teknik esaslar." },
              { name: "Paris Anlaşması", file: "/PARIS_ANLASMASI.docx", ext: "DOCX", size: "18 KB", desc: "Küresel ısınmayı 1.5°C ile sınırlandırma hedeflerini içeren uluslararası Paris Anlaşması metni." },
              { name: "BM İklim Çerçeve Sözleşmesi", file: "/BM_IKLIM_DEGISIKLIGI_CERCEVE_SOZLESME.pdf", ext: "PDF", size: "122 KB", desc: "BMİDÇS (UNFCCC) resmi Türkçe ana sözleşme metni." }
            ].map((doc, idx) => (
              <div key={idx} className="border border-zinc-200 p-4 bg-zinc-50 flex flex-col justify-between hover:shadow-xs transition-shadow">
                <div>
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-zinc-500">
                    <span>{doc.ext} BELGESİ</span>
                    <span>{doc.size}</span>
                  </div>
                  <h5 className="font-bold text-zinc-800 text-sm mt-2">{doc.name}</h5>
                  <p className="text-[11px] text-zinc-650 mt-2 font-mono leading-relaxed">{doc.desc}</p>
                </div>
                <a
                  href={doc.file}
                  download
                  className="mt-4 text-center border border-zinc-300 hover:border-[#1A1A1A] hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 font-mono font-bold text-[10px] py-1.5 transition-colors"
                >
                  BELGEYİ İNDİR ⬇
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    ) : mainActiveTab === "kaynakca" ? (
      <main className="max-w-7xl w-full mx-auto flex-1 py-4 space-y-8">
        <div className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] p-6 md:p-8">
          <h2 className="text-xl font-serif italic font-bold text-[#1b355a] border-b border-zinc-200 pb-3 mb-6 flex items-center gap-2">
            <Folder size={20} className="text-[#00adc4]" /> Proje Kaynakçası (Literatür Bankası)
          </h2>
          
          <p className="text-xs text-zinc-500 mb-8 font-sans leading-relaxed">
            Ajan-Tabanlı Türkiye ETS Simülasyonu ve Karar Destek Sistemi projesinin metodolojik tasarımında, matematiksel arka planında ve politika analizlerinde faydalanılan geniş akademik literatür havuzudur. İlgili makalelere aşağıdaki tematik klasörler üzerinden Google Drive aracılığıyla erişebilirsiniz:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "01",
                name: "KARBON EMİSYON MODELLEME YAKLAŞIMLARI",
                desc: "Küresel ve ulusal ölçekte emisyon tahmin modelleri, sektörel salınım senaryoları ve simülasyon metodolojilerini içeren akademik çalışmalar.",
                link: "https://drive.google.com/drive/folders/153X_-j4qc4om6GiXY-e5kGz7PNNF4Pp_?usp=sharing"
              },
              {
                id: "02",
                name: "KARBON FİYATLANDIRMA VE ETS (EMİSYON TİCARET SİSTEMLERİ)",
                desc: "Emisyon ticaret sistemlerinin (ETS) teorik yapısı, karbon vergisi, cap-and-trade piyasaları ve fiyat istikrar mekanizmaları üzerine literatür.",
                link: "https://drive.google.com/drive/folders/1OWego7b_U4xew-gHpiJyR7HpmnkPTt4H?usp=drive_link"
              },
              {
                id: "03",
                name: "AJAN TABANLI MODELLEME (ABM) - İKLİM VE ENERJİ",
                desc: "Enerji piyasaları ve iklim politikalarında ajan-tabanlı modelleme (ABM) uygulamaları, davranışsal iktisat ve simülasyon teorisi.",
                link: "https://drive.google.com/drive/folders/182LcYraNGZC0nRXfV-XxJl43A5ngPVD3?usp=drive_link"
              },
              {
                id: "04",
                name: "TÜRKİYE'DE KARBON EMİSYONLARI VE POLİTİKA ÇALIŞMALARI",
                desc: "Türkiye'nin net-sıfır emisyon hedefleri, iklim kanunu taslakları, ulusal kalkınma planları ve sektörel azaltım potansiyeli makaleleri.",
                link: "https://drive.google.com/drive/folders/1LP6mCVv2opkn7O83VxlkOr7A9F5-iFBr?usp=drive_link"
              },
              {
                id: "05",
                name: "HİBRİT MODELLEME VE TEKNOLOJİ YAYILIMI",
                desc: "Sanayide temiz teknoloji yatırımları, dekarbonizasyon teknolojilerinin (CCS, GES, verimlilik) yayılımı ve dekarbonizasyon modelleri.",
                link: "https://drive.google.com/drive/folders/1peAzaXSDtUhdEIzOL9sS66c5SvQdPzbq?usp=drive_link"
              }
            ].map((folder) => (
              <div 
                key={folder.id} 
                className="bg-[#fcfbfa] border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] p-5 flex flex-col justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] transition-all min-h-[220px]"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <span className="w-9 h-9 rounded-xs bg-[#00adc4]/10 border border-[#00adc4]/20 flex items-center justify-center text-[#00adc4] shrink-0 mt-0.5 select-none">
                      <Folder size={18} />
                    </span>
                    <h4 className="font-serif italic text-[14px] text-zinc-900 font-bold leading-snug uppercase tracking-tight">
                      {folder.name}
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-650 mt-4 font-mono leading-relaxed">
                    {folder.desc}
                  </p>
                </div>
                <a
                  href={folder.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full text-center bg-[#1b355a] hover:bg-[#00adc4] text-white font-mono font-bold text-xs py-2 px-4 transition-colors border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] block uppercase"
                >
                  AÇ ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    ) : (
      <main className="max-w-7xl w-full mx-auto flex-1 py-4">
        <div className="bg-white border border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-serif italic font-bold text-[#1b355a] border-b border-zinc-200 pb-3">
            İletişim ve Yerleşke Bilgileri
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sol Kolon - Bölüm Bilgileri */}
            <div className="space-y-6">
              <div className="bg-[#fcfbfa] border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] p-5">
                <span className="bg-[#1b355a] text-white px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider block w-fit mb-4">
                  BÖLÜM BİLGİLERİ
                </span>
                <h3 className="font-serif italic font-bold text-[#1b355a] text-xl">Ankara Yıldırım Beyazıt Üniversitesi</h3>
                <p className="text-zinc-650 font-sans text-xs mt-1">Mühendislik ve Doğa Bilimleri Fakültesi</p>
                <p className="text-zinc-800 font-sans text-sm font-bold mt-1">Endüstri Mühendisliği Bölümü</p>
              </div>

              <div className="bg-[#fcfbfa] border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] p-5 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 text-[#00adc4] shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <strong className="text-zinc-800 text-xs font-mono uppercase tracking-wider block">Yerleşke Adresi</strong>
                    <p className="font-sans text-zinc-650 text-xs mt-1 leading-relaxed">
                      15 Temmuz Şehitleri Yerleşkesi, Ayvalı Mah., Gazze Cad., 150. Sokak, Antares AVM Yanı Etlik, Keçiören / Ankara
                    </p>
                  </div>
                </div>

                <div className="h-px bg-zinc-200" />

                <div className="flex gap-3">
                  <div className="mt-1 text-[#00adc4] shrink-0">
                    <Globe size={18} />
                  </div>
                  <div>
                    <strong className="text-zinc-800 text-xs font-mono uppercase tracking-wider block">Web Sitesi</strong>
                    <a href="https://aybu.edu.tr/endustrimuh" target="_blank" rel="noopener noreferrer" className="font-sans text-zinc-650 text-xs mt-1 hover:underline hover:text-[#1b355a] block font-mono">
                      aybu.edu.tr/endustrimuh
                    </a>
                  </div>
                </div>

                <div className="h-px bg-zinc-200" />

                <div className="flex gap-3">
                  <div className="mt-1 text-[#00adc4] shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <strong className="text-zinc-800 text-xs font-mono uppercase tracking-wider block">Telefon</strong>
                    <a href="tel:+903129062263" className="font-sans text-zinc-650 text-xs mt-1 hover:underline hover:text-[#1b355a] block font-bold font-mono">
                      +90 (312) 906 22 63
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#f5fbfd] border border-[#00adc4]/30 p-4 font-mono text-[11px] text-[#1b355a]/90 leading-relaxed shadow-sm">
                <strong>💡 Ziyaretçi Bilgisi:</strong> Bölümümüz 15 Temmuz Şehitleri Yerleşkesi A Blok binası 3. katında yer almaktadır. Toplu taşıma ile Etlik Metro / Otobüs güzergahları kullanılarak ulaşım sağlanabilir.
              </div>
            </div>

            {/* Sağ Kolon - Harita ve Canlı Sokak Görünümü */}
            <div className="space-y-6">
              {/* Harita */}
              <div className="bg-[#fcfbfa] border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] p-3 flex flex-col">
                <span className="bg-[#1b355a] text-white px-2 py-0.5 self-start font-mono text-[9px] font-bold uppercase tracking-wider mb-2">📍 İNTERAKTİF HARİTA</span>
                <iframe
                  title="AYBÜ 15 Temmuz Campus Map"
                  src="https://maps.google.com/maps?q=39.9708125,32.8184375(AYB%C3%9C%2015%20Temmuz%20Yerle%C5%9Fkesi%20-%20XRC9%2B89)&z=16&output=embed"
                  className="w-full h-56 border border-zinc-200"
                  allowFullScreen={true}
                  loading="lazy"
                />
              </div>

              {/* Sokak Görünümü (Street View) */}
              <div className="bg-[#fcfbfa] border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] p-3 flex flex-col">
                <span className="bg-[#00adc4] text-white px-2 py-0.5 self-start font-mono text-[9px] font-bold uppercase tracking-wider mb-2">📷 CANLI SOKAK GÖRÜNÜMÜ (STREET VIEW)</span>
                <div 
                  className="relative w-full h-56 border border-zinc-200 overflow-hidden cursor-crosshair select-none group"
                  onMouseMove={handleStreetViewMouseMove}
                  onMouseLeave={handleStreetViewMouseLeave}
                >
                  {/* Ana Görsel */}
                  <img
                    src="/aybu_street_view.png"
                    alt="AYBÜ 15 Temmuz Yerleşkesi Sokak Görünümü"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Sol Üst Adres Katmanı */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-black/65 backdrop-blur-xs px-2.5 py-1 text-white border border-white/10 text-[10px] max-w-[200px] pointer-events-none">
                    <div className="w-1.5 h-1.5 bg-[#00adc4] rounded-full animate-ping shrink-0" />
                    <div className="truncate">
                      <strong className="block text-white text-[10px] tracking-wide font-sans">Gazze Caddesi</strong>
                      <span className="text-[8px] text-zinc-300 block leading-tight font-sans">Keçiören/Ankara · Nis 2024</span>
                    </div>
                  </div>

                  {/* Sağ Üst Kontrol Grubu */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <button
                      onClick={() => setIsStreetViewFullscreen(true)}
                      className="bg-black/60 hover:bg-[#00adc4] text-white p-1.5 border border-white/10 hover:border-white transition-colors cursor-pointer"
                      title="Tam Ekranda Göster"
                    >
                      <Maximize2 size={12} />
                    </button>
                    <a
                      href="https://www.google.com/maps/place/XRC9%2B89+Ke%C3%A7i%C3%B6ren%2FAnkara/@39.9708125,32.8184375,17z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black/60 hover:bg-[#1b355a] text-white p-1.5 border border-white/10 hover:border-white transition-colors flex items-center justify-center"
                      title="Google Haritalar'da Aç"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Orta Yönlendirme Oku */}
                  <a
                    href="https://www.google.com/maps/place/XRC9%2B89+Ke%C3%A7i%C3%B6ren%2FAnkara/@39.9708125,32.8184375,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 flex flex-col items-center group/arrow cursor-pointer"
                  >
                    <div className="w-9 h-9 bg-[#00adc4]/30 border border-[#00adc4] group-hover/arrow:bg-[#00adc4]/70 group-hover/arrow:scale-110 transition-all rounded-full flex items-center justify-center shadow-md">
                      <ChevronRight className="text-white transform -rotate-90" size={16} />
                    </div>
                    <span className="bg-black/85 text-[8px] text-white px-1.5 py-0.5 mt-1 rounded-xs opacity-0 group-hover/arrow:opacity-100 transition-opacity font-mono whitespace-nowrap">
                      Haritada İlerle ↗
                    </span>
                  </a>

                  {/* Sol Alt Google Filigranı */}
                  <div className="absolute bottom-2 left-2 z-10 flex flex-col pointer-events-none">
                    <span className="text-white font-black text-sm tracking-tighter drop-shadow-sm select-none">
                      <span className="text-blue-500">G</span>
                      <span className="text-red-500">o</span>
                      <span className="text-yellow-500">o</span>
                      <span className="text-blue-500">g</span>
                      <span className="text-green-500">l</span>
                      <span className="text-red-500">e</span>
                    </span>
                    <span className="text-[7px] text-zinc-300 drop-shadow-xs leading-none">© 2026 Google</span>
                  </div>

                  {/* Sağ Alt Pusula ve Pegman */}
                  <div className="absolute bottom-2 right-2 z-10 flex items-end gap-2">
                    {/* Pusula */}
                    <div 
                      className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center relative shadow-md"
                      style={{ transform: `rotate(${compassRotation}deg)`, transition: 'transform 0.1s ease-out' }}
                      title="Bakış Açısı Pusulası"
                    >
                      <div className="w-1 h-5 relative flex flex-col justify-between">
                        <div className="w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-b-[10px] border-b-red-500" />
                        <div className="w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[10px] border-t-white" />
                      </div>
                      <span className="absolute top-0 text-[6px] text-red-500 font-bold" style={{ transform: `rotate(${-compassRotation}deg)` }}>N</span>
                    </div>

                    {/* Pegman */}
                    <div className="w-6 h-9 flex items-center justify-center cursor-grab hover:scale-110 active:cursor-grabbing transition-transform" title="Sokak Görünümü">
                      <svg className="w-6 h-9 drop-shadow-xs" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="10" r="5" fill="#FABB05" stroke="#FFFFFF" strokeWidth="1.5" />
                        <path d="M16 15V32M16 32L11 44M16 32L21 44M11 20H21" stroke="#FABB05" strokeWidth="3" strokeLinecap="round" />
                        <path d="M16 15V32M16 32L11 44M16 32L21 44M11 20H21" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )}

      {/* 5. Clean Professional Footer */}
      <footer id="app-footer" className="bg-white border-t border-slate-200 p-6 tracking-wide shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="text-center md:text-left">
            <p className="font-bold text-slate-800">TR-ETS v5.0 | SIMULATION OF AGENT-BASED EMISSION TRADING SYSTEM OF TURKEY</p>
            <p className="mt-0.5">Endüstri Mühendisliği Karar Analizi Bitirme Tezi · Haziran 2026</p>
          </div>
          <div className="text-center md:text-right font-sans">
            <p>İbrahim Hakkı Keleş · Oğuz Gökdemir · Melis Mağden</p>
            <p className="mt-0.5">Akademik Danışman: Dr. Deniz Efendioğlu (Ankara Yıldırım Beyazıt Üniversitesi)</p>
          </div>
        </div>
      </footer>

      {/* Tam Ekran Sokak Görünümü Modalı */}
      <AnimatePresence>
        {isStreetViewFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsStreetViewFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative bg-[#1A1A1A] border-2 border-white max-w-5xl w-full h-[80vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sol Üst Adres Bilgisi */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-2 text-white border border-white/20">
                <button 
                  onClick={() => setIsStreetViewFullscreen(false)}
                  className="hover:bg-white/20 p-1.5 transition-colors rounded-full text-white flex items-center justify-center"
                  title="Geri Dön"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h4 className="font-sans font-bold text-sm tracking-wide text-white">Gazze Caddesi</h4>
                  <p className="text-[10px] text-zinc-300">Ankara Yıldırım Beyazıt Üniversitesi, 15 Temmuz Yerleşkesi</p>
                  <span className="text-[9px] text-zinc-400">Google · Nisan 2024</span>
                </div>
              </div>

              {/* Sağ Üst Kapatma ve Harita Butonları */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <a
                  href="https://www.google.com/maps/place/XRC9%2B89+Ke%C3%A7i%C3%B6ren%2FAnkara/@39.9708125,32.8184375,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/60 hover:bg-black/80 backdrop-blur-md p-2 text-white border border-white/20 hover:border-white/50 transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
                  title="Google Haritalar'da Aç"
                >
                  <ExternalLink size={14} />
                  <span>Haritalarda Canlı Gör</span>
                </a>
                <button
                  onClick={() => setIsStreetViewFullscreen(false)}
                  className="bg-black/60 hover:bg-[#00adc4] backdrop-blur-md p-2 text-white border border-white/20 hover:border-white transition-colors cursor-pointer flex items-center justify-center"
                  title="Kapat"
                >
                  <Minimize2 size={16} />
                </button>
              </div>

              {/* Büyük Görsel Alanı */}
              <div 
                className="flex-1 w-full h-full relative cursor-crosshair overflow-hidden"
                onMouseMove={handleStreetViewMouseMove}
                onMouseLeave={handleStreetViewMouseLeave}
              >
                <img
                  src="/aybu_street_view.png"
                  alt="AYBÜ 15 Temmuz Yerleşkesi Sokak Görünümü"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
                
                {/* Gezinti Okları */}
                <a
                  href="https://www.google.com/maps/place/XRC9%2B89+Ke%C3%A7i%C3%B6ren%2FAnkara/@39.9708125,32.8184375,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-[#00adc4]/30 border-2 border-[#00adc4] group-hover:bg-[#00adc4]/60 group-hover:scale-110 transition-all rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <ChevronRight className="text-white transform -rotate-90 animate-bounce" size={24} />
                  </div>
                  <span className="bg-black/80 text-[10px] text-white px-2 py-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-mono whitespace-nowrap">
                    Google Haritalar'da Yürü ↗
                  </span>
                </a>

                {/* Google Logosu ve Telif */}
                <div className="absolute bottom-3 left-3 z-10 flex flex-col items-start gap-1">
                  <span className="text-white font-black text-xl tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                  </span>
                  <span className="text-[9px] text-zinc-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-sans">
                    Görüntü tarihi: Nis 2024 © 2026 Google
                  </span>
                </div>

                {/* Pusula ve Kontroller */}
                <div className="absolute bottom-4 right-4 z-10 flex items-end gap-3">
                  {/* Pegman */}
                  <div className="w-8 h-12 flex items-center justify-center cursor-grab hover:scale-110 transition-transform active:cursor-grabbing" title="Sokak Görünümü Pegman">
                    <svg className="w-8 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="10" r="5" fill="#FABB05" stroke="#FFFFFF" strokeWidth="1.5" />
                      <path d="M16 15V32M16 32L11 44M16 32L21 44M11 20H21" stroke="#FABB05" strokeWidth="3" strokeLinecap="round" />
                      <path d="M16 15V32M16 32L11 44M16 32L21 44M11 20H21" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Pusula Dairesi */}
                  <div className="flex flex-col gap-1 items-center">
                    <div 
                      className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center relative shadow-lg"
                      style={{ transform: `rotate(${compassRotation}deg)`, transition: 'transform 0.1s ease-out' }}
                      title="Pusula (Görüş Yönü)"
                    >
                      <div className="w-1.5 h-8 relative flex flex-col justify-between">
                        <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[16px] border-b-red-500" />
                        <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[16px] border-t-white" />
                      </div>
                      <span className="absolute top-0.5 text-[8px] text-red-500 font-bold select-none" style={{ transform: `rotate(${-compassRotation}deg)` }}>N</span>
                    </div>
                    
                    {/* Yakınlaştırma Tuşları */}
                    <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-md flex flex-col overflow-hidden text-white font-bold font-mono">
                      <button className="w-8 h-8 hover:bg-white/20 transition-colors flex items-center justify-center border-b border-white/10 text-sm">+</button>
                      <button className="w-8 h-8 hover:bg-white/20 transition-colors flex items-center justify-center text-sm">-</button>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
