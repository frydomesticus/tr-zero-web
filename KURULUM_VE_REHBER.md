# TR-ZERO Karbon Emisyonu & ETS Simülasyon Platformu Kurulum ve Entegrasyon Rehberi

Bu kılavuz, Türkiye Pilot Karbon Sınırlandırma ve Emisyon Ticaret Sistemi (ETS) Analiz Platformu (**TR-ZERO**) uygulamasının mimarisini, veri yapısını, simülasyon motoru matematiksel mantığını ve uygulamanın lokal/sunucu ortamlarında sıfırdan nasıl kurulup çoğaltılabileceğini (duplicate) detaylandırmaktadır.

---

## 1. Proje Özeti ve Amacı

TR-ZERO, Türkiye'nin sera gazı emisyon envanterini (NIR Raporları baz alınarak), sanayi yoğunluklu 10 pilot ilini ve 13 büyük kömür termik santralini modelleyen üst düzey bir politika karar destek aracıdır.

Sistem iki temel amaca hizmet eder:
1. **Tarihsel ve Mevcut Durum Analizi (NIR)**: Türkiye'nin 1990'dan günümüze emisyon gelişim trendlerini göstererek sektörel dağılım analizi sunar.
2. **Gelecek Senaryoları & Ajan-Tabanlı Simülasyon (ABM)**: Kullanıcının belirlediği kotalar (Cap), karbon taban/tavan fiyat koridorları, yeşil dönüşüm teşvikleri ve AB Sınırda Karbon Düzenleme Mekanizması (SKDM - CBAM) kapsamında emisyon azaltım patikalarını, fiyat gelişimini, kamu gelir birikimini ve santral düzeyindeki dönüşümleri eş zamanlı simüle eder.

---

## 2. Mimari ve Teknolojik Altyapı

Uygulama, modern web standartlarına sahip tam tip güvenli ve performans odaklı bir tek sayfa uygulaması (SPA) olarak tasarlanmıştır.

### Kullanılan Teknolojiler
- **Framework & Derleyici**: [React 19](https://react.dev) + [Vite 6](https://vite.dev) (Hızlı derleme ve düşük bundle boyutu için)
- **Programlama Dili**: [TypeScript 5](https://www.typescriptlang.org) (Tam tip güvenliği ve veri modelleme kalitesi için)
- **Tasarım & CSS**: [Tailwind CSS v4](https://tailwindcss.com) (Utility-first yapısıyla doğrudan CSS yazmadan hızlı, responsive ve performanslı arayüz oluşturma)
- **Grafik & Görselleştirme**: [Recharts](https://recharts.org) (Dekoratif ve dinamik çizgi, alan, dilim grafikler için SVG tabanlı kütüphane)
- **İkon Seti**: [Lucide React](https://lucide.dev) (Vektörel, ölçeklenebilir ve modern ikon seti)

---

## 3. Dosya Yapısı ve Görev Bölümü

Uygulamanın kaynak dosyaları modüler bir mimaride organize edilmiştir:

```text
├── package.json               # Bağımlılıklar, kütüphaneler ve proje betikleri (scripts)
├── vite.config.ts            # Vite projesi derleme ve sunucu ayarları
├── src/
│   ├── main.tsx              # React uygulamasının DOM'a bağlandığı ana giriş noktası
│   ├── App.tsx               # Ana arayüz, sekmeler, etkileşimli grafikler ve UI logic'i
│   ├── data.ts               # Tarihsel veriler, santral envanteri ve MAC seçenekleri
│   ├── simulation.ts         # Ajan-Tabanlı Simülasyon Motoru (Matematiksel ABM algoritması)
│   └── index.css             # Tailwind v4 importları ve küresel stil özelleştirmeleri
```

---

## 4. Veri Modeli ve Yapısı (`src/data.ts`)

Uygulama, verilerini dışarıdan çekmek yerine **deterministik ve bilimsel referanslı gerçek veri setlerini** doğrudan `src/data.ts` içinde konumlandırarak sıfır gecikmeli (offline-first) bir deneyim sunmaktadır.

### A. Tarihsel Sektörel Emisyonlar (`SEKTOREL_EMISYONLAR`)
Türkiye'nin Ulusal Envanter Raporu (NIR) verilerine birebir sadık kalınarak oluşturulmuştur:
- Tarım, Enerji, Endüstri/Sanayi (IPPU) ve Atık sektörlerinin 1990 - 2025 yılları arasındaki tarihsel gelişimini içerir.
- Birim: **Mt CO₂eq** (Milyon Ton Karbon Eşdeğeri).

### B. 13 Gerçek Kömür Santrali Envanteri (`GERCEK_KOMUR_SANTRALLERI`)
EPDK ve Global Energy Monitor (GEM) 2026 lisans veri setlerinden üretilmiş olup aşağıdaki şemaya (schema) sahiptir:
```typescript
export interface PowerPlant {
  id: string;               // Benzersiz Kimlik
  tesis_adi: string;        // Santral Adı
  yakit: "Linyit" | "Ithal_Komur" | "Asfaltit"; // Yakıt Tipi
  emisyon_mt: number;       // Yıllık Karbon Salınımı (Mt)
  komisyon_yili: number;    // Devreye Giriş Yılı
  lisans_bitis: number;     // EPDK Lisans Bitiş Yılı
}
```

### C. Marjinal Azaltım Maliyet Eğrisi (`MAC_CURVE`)
Santrallerin yeşil dönüşüm kararı alırken kullandığı teknolojiler, bunların maliyetleri ve azaltım potansiyellerini temsil eder:
- Baca gazı atık ısı geri kazanımı, Biyokütle ko-firing, GES hibritleşmesi ve Karbon Yakalama ve Depolama (CCS) teknolojilerinin maliyetleri (**€/tCO₂**) ve kurulum süreleri tanımlanmıştır.

---

## 5. Simülasyon Motoru Mantığı (`src/simulation.ts`)

Simülasyon motoru, basit ve statik bir doğrusal projeksiyon yapmak yerine, **Ajan-Tabanlı Model (Agent-Based Modeling - ABM)** prensiplerini kullanır. Her bir kömür termik santrali bağımsız birer *karar alıcı ajan* olarak hareket eder.

```typescript
export interface SimulationParams {
  baslangic_cap: number;       // Başlangıç Karbon Kotası (Mt CO2)
  cap_azalma_orani: number;    // Kotaların Yıllık Azalma Katsayısı (0.00 - 0.06)
  tesvik_miktari: number;      // Dağıtılan Dönüşüm Teşvikleri (M€ eşdeğeri)
  taban_fiyat: number;         // Karbon Taban Fiyatı ($ / Ton)
  tavan_fiyat: number;         // Karbon Tavan Fiyatı ($ / Ton)
  fiyat_katsayi: number;       // Arz-Talep Dengesi Fiyat Hassasiyeti
  ab_skdm: number;             // AB Sınırda Karbon Düzenleme Mekanizması Fiyatı
  dogal_buyume: number;        // Politikasız Doğal Ekonomik Büyüme Oranı
  seed: number;                // Stokastik dalgalanmalar için tohum değeri
  bitis_yili: number;          // Projeksiyon Dönem Sonu (maks. 2045)
}
```

### Matematiksel Simülasyon Döngüsü (Yıllık İşleyiş):

1. **Kota Azaltımı (Cap Decay)**:
   Yıllık kotanın azaltılması hesaplanır:
   $$\text{Cap}_t = \text{Cap}_{baslangic} \times (1 - \text{cap\_azalma\_orani})^t$$

2. **Ajan Davranışları ve Durum Değişiklikleri**:
   13 kömür santralinin her biri için her yıl karar mekanizması işletilir. Santraller 4 durumdan birinde bulunur:
   - **Aktif (Kömürden Üretim)**: Yüksek karbon cezası öder.
   - **Donusum (Yatırım Aşaması)**: Teknoloji entegrasyon sürecindedir. Emisyonları geçici olarak aynı kalır ancak yatırım harcaması yapar.
   - **Temiz (Dönüşmüş Tesis)**: Belirlenen MAC teknolojisini kurmuş, emisyonlarını %15 ila %40 oranında azaltmış temiz tesis.
   - **Kapali (Kapatılmış Tesis)**: Çok yüksek karbon fiyatı veya lisans süresi dolması nedeniyle piyasadan çekilen tesis (sıfır emisyon).

   **Yatırım Karar Eşiği**:
   Eğer mevcut karbon fiyatı ve AB SKDM cezası, santralin uygulayabileceği en uygun MAC teknolojisi maliyetinden yüksekse ve devlet teşviki varsa, santral yatırıma başlar (**Aktif $\rightarrow$ Dönüşüm**).
   Yatırım süresi (örn: 3 yıl) bittiğinde tesis **Temiz** statüsüne geçer.
   Eğer karbon fiyatları santralin kârlılığını 4 yıl üst üste tamamen baltalarsa, tesis **Kapalı** statüsüne geçer.

3. **Karbon Fiyat Mekanizması**:
   Arz ve talep dengesine bağlı olarak borsada oluşacak fiyat dalgalanması simüle edilir:
   $$\text{Fiyat}_{ham} = \text{Taban} + \left( \frac{\text{Emisyon}_{toplam} - \text{Cap}}{\text{Cap}} \right) \times \text{fiyat\_katsayi}$$
   Elde edilen fiyat, belirlenen taban ve tavan sınırları arasına sıkıştırılır (clamping):
   $$\text{Fiyat}_{nihai} = \max(\text{Taban}, \min(\text{Tavan}, \text{Fiyat}_{ham}))$$

4. **Kamu Geliri Akışı (Revenue Generation)**:
   - **ETS Geliri**: Aşım yapılan emisyon başına karbon fiyatı üzerinden vergilendirme/tahsisat geliri oluşturulur.
   - **Karbon Vergisi Geliri**: Eğer Karbon Vergisi senaryosu seçilmişse, tüm emisyonlar üzerinden sabit bir vergi tarifesi uygulanarak doğrudan hazine akışına yazılır.

---

## 6. Projeyi Sıfırdan Çalıştırma & Çoğaltma Kılavuzu

Projeyi kendi bilgisayarınızda veya yeni bir sunucuda aynen çalıştırmak için aşağıdaki adımları sırasıyla uygulayabilirsiniz.

### Gereksinimler
- Bilgisayarınızda **Node.js** (Sürüm 18 veya üzeri önerilir) kurulu olmalıdır.
- Paket yöneticisi olarak **npm** (Node ile birlikte gelir) kullanılacaktır.

### Adım 1: Proje Klasörünü Hazırlama
Boş bir dizin oluşturun ve içine girin:
```bash
mkdir tr-zero-platform
cd tr-zero-platform
```

### Adım 2: Bağımlılık Dosyasını Oluşturma (`package.json`)
Aşağıdaki içeriği barındıran bir `package.json` dosyası oluşturun:

```json
{
  "name": "tr-zero-ets-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "recharts": "^3.8.1",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "tailwindcss": "^4.1.14",
    "typescript": "~5.8.2"
  }
}
```

### Adım 3: Vite Konfigürasyonunu Tanımlama (`vite.config.ts`)
Proje kök dizinine `vite.config.ts` adında bir dosya oluşturarak React ve Tailwind eklentilerini bağlayın:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
```

### Adım 4: TypeScript Ayarları (`tsconfig.json`)
TypeScript'in derleme kurallarını belirlemek için kök dizine bir `tsconfig.json` ekleyin:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### Adım 5: Ana HTML Şablonu (`index.html`)
Proje kök dizinine `index.html` dosyasını oluşturun ve ana betiği bağlayın:

```html
<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TR-ZERO: Türkiye Karbon Azaltım & ETS Karar Destek Platformu</title>
  </head>
  <body class="bg-[#F8F9FA] text-[#1A1A1A]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Adım 6: Dosyaları Kopyalama ve Derleme
- `src/` klasörü oluşturun.
- Bu proje içindeki `src/data.ts`, `src/simulation.ts`, `src/index.css`, `src/main.tsx` ve `src/App.tsx` kodlarını ilgili başlıklar altında oluşturduğunuz dosyalara yapıştırın.

Ardından terminalden proje kök klasöründeyken bağımlılıkları yükleyin ve yerel sunucuyu ayağa kaldırın:

```bash
# Bağımlılıkları yükleyin
npm install

# Yerel geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine gittiğinizde, temizlenmiş, emojisiz, tam profesyonel akademik temalı TR-ZERO Karar Destek Platformu çalışır durumda olacaktır!

---
*Hazırlayan: TR-ZERO Geliştirici Yapay Zeka Asistanı*
