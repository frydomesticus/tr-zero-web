import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  tr: {
    translation: {
      navbar: {
        about: "Proje Hakkında",
        simulator: "Araştırma / Simülatör",
        documents: "Belgeler",
        bibliography: "Kaynakça",
        contact: "İletişim"
      },
      header: {
        school: "ANKARA YILDIRIM BEYAZIT ÜNİVERSİTESİ",
        department: "ENDÜSTRİ MÜHENDİSLİĞİ BÖLÜMÜ",
        ataturkAlt: "Atatürk ve Türk Bayrağı",
        yuzyilAlt: "Türkiye Yüzyılı"
      },
      about: {
        title: "AYBÜ Endüstri Mühendisliği Lisans Bitirme Projesi",
        summaryTitle: "Proje Özeti (Tez Özet - Abstract)",
        summary1: "Türkiye'nin 2053 net sıfır emisyon hedefleri ve Avrupa Birliği Sınırda Karbon Düzenleme Mekanizması (SKDM) uyum süreci, sanayi ve enerji üretim yapısında köklü değişiklikler gerektirmektedir. Bu bitirme projesi kapsamında, Türkiye elektrik üretim sektöründeki en büyük 13 kömür termik santralinin bağımsız ajanlar olarak modellendiği Ajan-Tabanlı Simülasyon (ABM) modeli ve Karar Destek Sistemi (TR-ETS) geliştirilmiştir.",
        summary2: "Simülasyon motorumuz, santrallerin yeşil teknoloji yatırımlarını (Kazan verimliliği, CCS, GES hibritleşmesi vb.) karbon fiyat koridorları, yıllık kota azaltımları (Cap Decay) ve devlet teşvik mekanizmaları kapsamında yıllık periyotlarla analiz eder. Elde edilen sonuçlar, karar vericilerin en efektif azaltım politikasını seçmesine yardımcı olmayı amaçlayan bilimsel bir altyapı sunmaktadır.",
        keywords: "Anahtar Kelimeler: Ajan-Tabanlı Modelleme (ABM), Emisyon Ticaret Sistemi (ETS), Marjinal Azaltım Maliyet Eğrisi (MAC), Enerji Politikası.",
        cardTitle: "PROJE KÜNYESİ",
        advisor: "DANIŞMAN HOCA:",
        advisorName: "Dr. Öğr. Üyesi Deniz Efendioğlu",
        team: "PROJE EKİBİ (YAZARLAR):",
        period: "AKADEMİK DÖNEM:",
        periodValue: "2025 - 2026 Eğitim-Öğretim Yılı"
      },
      documents: {
        title: "Akademik Çıktılar (Tez & Sunum Raporları)",
        t1_label: "LİSANS TEZİ (2. DÖNEM)",
        t1_status: "NİHAİ",
        t1_title: "AYBÜ Endüstri Mühendisliği Lisans Tez Raporu",
        t1_desc: "Ajan-Tabanlı Modelleme ile Türkiye ETS Simülasyonu ve Karar Destek Sistemi Tezi (Nihai Rapor).",
        t1_btn: "YAKINDA SİZLERLE OLACAK ⌛",
        
        t2_label: "SUNUM DOSYASI (2. DÖNEM)",
        t2_status: "NİHAİ",
        t2_title: "Bitirme Projesi 2. Dönem Sunumu",
        t2_desc: "Projenin tamamlanmış simülasyon aşamalarını, politika çıktılarını ve senaryo karşılaştırmalarını içeren nihai savunma sunumu.",
        t2_btn: "YAKINDA SİZLERLE OLACAK ⌛",

        t3_label: "LİSANS TEZİ (1. DÖNEM)",
        t3_status: "DOCX (133 KB)",
        t3_title: "Bitirme Projesi 1. Dönem Tez Raporu",
        t3_desc: "Ajan-Tabanlı Türkiye ETS Simülasyonu ve Karar Destek Sistemi 1. Dönem Raporu (Tasarım ve Ön Bulgular).",
        t3_btn: "TEZ RAPORUNU İNDİR (.DOCX)",

        t4_label: "SUNUM DOSYASI (1. DÖNEM)",
        t4_status: "PDF (10.5 MB)",
        t4_title: "Bitirme Projesi 1. Dönem Sunumu",
        t4_desc: "Tez literatür taraması, metodoloji tasarımı ve ilk simülasyon sonuçlarını içeren savunma sunumu.",
        t4_btn: "SUNUM DOSYASINI İNDİR (.PDF)",

        libraryTitle: "Resmi Mevzuat, Kanunlar & Anlaşmalar Kütüphanesi",
        libraryDesc: "Bu portalda çalışan simülasyon modelleri, T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı İklim Değişikliği Başkanlığı tarafından hazırlanan yönetmelik taslakları ve uluslararası sözleşmeler ile tam uyumlu olarak tasarlanmıştır. İlgili yasal dayanak belgelerini aşağıdan inceleyebilirsiniz:",
        downloadBtn: "BELGEYİ İNDİR ⬇",

        docNames: {
          iklimKanunu: "İklim Kanunu Taslağı",
          seraGazi: "Sera Gazı Takip Yönetmeliği",
          trEts: "TR-ETS Yönetmelik Taslağı",
          denklestirme: "Denkleştirme Yönetmeliği",
          paris: "Paris Anlaşması",
          bmIklim: "BM İklim Çerçeve Sözleşmesi"
        },
        docDescs: {
          iklimKanunu: "Sera gazı azaltım kotaları ve Karbon Piyasası Kurulu yapısını düzenleyen İklim Kanunu taslak metni.",
          seraGazi: "Tesis bazlı sera gazı emisyonlarının izlenmesi, raporlanması ve doğrulanması (MRV) mevzuatı.",
          trEts: "Türkiye Emisyon Ticaret Sistemi tahsisat ve borsa kurallarını içeren yönetmelik taslağı.",
          denklestirme: "Karbon piyasalarında kredilendirme ve offset (denkleştirme) mekanizmalarına ait teknik esaslar.",
          paris: "Küresel ısınmayı 1.5°C ile sınırlandırma hedeflerini içeren uluslararası Paris Anlaşması metni.",
          bmIklim: "BMİDÇS (UNFCCC) resmi Türkçe ana sözleşme metni."
        }
      },
      bibliography: {
        title: "Proje Kaynakçası (Literatür Bankası)",
        desc: "Ajan-Tabanlı Türkiye ETS Simülasyonu ve Karar Destek Sistemi projesinin metodolojik tasarımında, matematiksel arka planında ve politika analizlerinde faydalanılan geniş akademik literatür havuzudur. İlgili makalelere aşağıdaki tematik klasörler üzerinden Google Drive aracılığıyla erişebilirsiniz:",
        openBtn: "AÇ ↗",
        folder1: {
          name: "KARBON EMİSYON MODELLEME YAKLAŞIMLARI",
          desc: "Küresel ve ulusal ölçekte emisyon tahmin modelleri, sektörel salınım senaryoları ve simülasyon metodolojilerini içeren akademik çalışmalar."
        },
        folder2: {
          name: "KARBON FİYATLANDIRMA VE ETS (EMİSYON TİCARET SİSTEMLERİ)",
          desc: "Emisyon ticaret sistemlerinin (ETS) teorik yapısı, karbon vergisi, cap-and-trade piyasaları ve fiyat istikrar mekanizmaları üzerine literatür."
        },
        folder3: {
          name: "AJAN TABANLI MODELLEME (ABM) - İKLİM VE ENERJİ",
          desc: "Enerji piyasaları ve iklim politikalarında ajan-tabanlı modelleme (ABM) uygulamaları, davranışsal iktisat ve simülasyon teorisi."
        },
        folder4: {
          name: "TÜRKİYE'DE KARBON EMİSYONLARI VE POLİTİKA ÇALIŞMALARI",
          desc: "Türkiye'nin net-sıfır emisyon hedefleri, iklim kanunu taslakları, ulusal kalkınma planları ve sektörel azaltım potansiyeli makaleleri."
        },
        folder5: {
          name: "HİBRİT MODELLEME VE TEKNOLOJİ YAYILIMI",
          desc: "Sanayide temiz teknoloji yatırımları, dekarbonizasyon teknolojilerinin (CCS, GES, verimlilik) yayılımı ve dekarbonizasyon modelleri."
        }
      },
      contact: {
        title: "İletişim ve Yerleşke Bilgileri",
        deptTitle: "BÖLÜM BİLGİLERİ",
        schoolName: "Ankara Yıldırım Beyazıt Üniversitesi",
        facultyName: "Mühendislik ve Doğa Bilimleri Fakültesi",
        deptName: "Endüstri Mühendisliği Bölümü",
        addressTitle: "Yerleşke Adresi",
        addressDesc: "15 Temmuz Şehitleri Yerleşkesi, Ayvalı Mah., Gazze Cad., 150. Sokak, Antares AVM Yanı Etlik, Keçiören / Ankara",
        websiteTitle: "Web Sitesi",
        phoneTitle: "Telefon",
        visitorInfo: "💡 Ziyaretçi Bilgisi: Bölümümüz 15 Temmuz Şehitleri Yerleşkesi A Blok binası 3. katında yer almaktadır. Toplu taşıma ile Etlik Metro / Otobüs güzergahları kullanılarak ulaşım sağlanabilir.",
        mapTitle: "📍 İNTERAKTİF HARİTA",
        streetViewTitle: "📷 CANLI SOKAK GÖRÜNÜMÜ (STREET VIEW)",
        streetViewDate: "Keçiören/Ankara · Nis 2024",
        streetViewTooltipFull: "Tam Ekranda Göster",
        streetViewTooltipMaps: "Google Haritalar'da Aç",
        streetViewGoogle: "© 2026 Google",
        streetViewBack: "Geri Dön",
        streetViewGoLive: "Haritalarda Canlı Gör",
        streetViewClose: "Kapat",
        streetViewWalk: "Google Haritalar'da Yürü ↗",
        streetViewTitleText: "Gazze Caddesi",
        streetViewSubText: "Ankara Yıldırım Beyazıt Üniversitesi, 15 Temmuz Yerleşkesi",
        streetViewImageDate: "Görüntü tarihi: Nis 2024 © 2026 Google"
      },
      footer: {
        title: "TR-ETS v5.0 | SIMULATION OF AGENT-BASED EMISSION TRADING SYSTEM OF TURKEY",
        subtitle: "Endüstri Mühendisliği Karar Analizi Bitirme Tezi · Haziran 2026",
        authors: "İbrahim Hakkı Keleş · Oğuz Gökdemir · Melis Mağden",
        advisor: "Akademik Danışman: Dr. Deniz Efendioğlu (Ankara Yıldırım Beyazıt Üniversitesi)"
      },
      simulator: {
        categoryText: "ELEKTRİK ÜRETİM SEKTÖRÜ (KÖMÜR YAKITLI TERMİK SANTRALLER)",
        mainTitle: "TR-ETS: TÜRKİYE'NİN AJAN-TABANLI EMİSYON TİCARET SİSTEMİ SİMÜLASYONU",
        subDesc: "Bu Karar Destek Sistemi; AYBÜ Endüstri Mühendisliği bünyesinde İbrahim Hakkı Keleş, Oğuz Gökdemir ve Melis Mağden tarafından Dr. Deniz Efendioğlu danışmanlığında geliştirilen Ajan-Tabanlı Türkiye ETS Simülasyon modelidir.",
        scopeTitle: "SİMÜLASYON KAPSAMI",
        scopePlants: "Kömür Santralleri:",
        scopeRegion: "Pilot Bölge:",
        scopeSolver: "Çözüm Motoru:",
        scopeSolverValue: "Ajan-Tabanlı",
        academicModeTitle: "Akademik Değerlendirme Modu:",
        academicModeDesc: "Bu interaktif panel, gerçek termik santral emisyon profillerini ve Türkiye Marjinal Azaltım Maliyetleri (MAC) eğrisini temel alan Monte Carlo ajan tabanlı model motorunu çalıştırır. Simülasyon, tavan/taban fiyat istikrar mekanizmaları ve CBAM (SKDM) maliyet yüklerini anlık çözer.",
        subtabs: {
          comparison: "Senaryo Karşılaştırma",
          nir: "Mevcut Durum (NIR)",
          custom: "Kendi ETS'nizi Tasarlayın",
          policy: "Politika Çıktıları",
          technical: "Teknik Detaylar / MAC"
        },
        comparison: {
          summaryDesc: "Aşağıdaki grafiklerde, Türkiye elektrik üretim sektörü (kömür termik santralleri) için 5 farklı alternatif politika senaryosunun 2035 yılına kadar olan projeksiyonları karşılaştırılmaktadır.",
          emissionsTitle: "Sektörel CO₂ Emisyon Patikaları (MtCO₂)",
          priceTitle: "Karbon Fiyat Patikaları (€/tCO₂)",
          kpiReduction: "Emisyon Azaltımı (Referansa Göre)",
          kpiSiki: "Sıkı ETS Senaryosu",
          kpiSubsidized: "Teşvikli ETS Senaryosu",
          chartBau: "BAU (Politikasız)",
          chartSoft: "Yumuşak ETS (Yıllık %2)",
          chartTight: "Sıkı ETS (Yıllık %4)",
          chartSubsidized: "Teşvikli Sıkı ETS",
          chartTax: "Karbon Vergisi (IMF Patikası)",
          legendCap: "Emisyon Kotası (Cap)",
          noPolicy: "Azaltım politikası yok",
          maxPrice: "Maks. Karbon Fiyatı",
          tightScenarioCeil: "Sıkı senaryo tavanı",
          cleanPlantRatio: "Temiz Tesis Oranı",
          tightScenarioRatio: "Sıkı senaryo dönüşüm oranı",
          unitMt: "BİRİM: Mt CO₂",
          unitEur: "BİRİM: EUR / TON",
          summaryReportTitle: "Senaryo Karşılaştırmalı Özet Raporu (Hedef Yıl: 2035)",
          tableHeaderScenario: "Senaryo",
          tableHeaderEmissions: "Emisyon 2035 (Mt)",
          tableHeaderBauReduction: "BAU Azaltımı (%)",
          tableHeaderMaxPrice: "Maksimum Fiyat (€ / t)",
          tableHeaderCumulativeEts: "Kümülatif ETS Geliri (M€)",
          tableHeaderCumulativeTax: "Kümülatif Vergi Geliri (M€)",
          tableHeaderTransformed: "Dönüşen Tesis",
          tableHeaderClosed: "Kapanan Tesis",
          descBau: "Mevcut trend akışı",
          descSoft: "Düşük azalma trendi",
          descTight: "Hızlı dekarbonizasyon tavanı",
          descSubsidized: "Teknoloji destekli mekanizma",
          descTax: "Sabit vergi rejimi",
          cumulativeEmissionsTitle: "BAU'YA GÖRE KÜMÜLATİF EMİSYON AZALTIM PERFORMANSI",
          periodEndRevenueTitle: "DÖNEM SONU KAMU VE ETS FON BİRİKİMİ (M€)",
          etsAuctionRevenue: "ETS İHALE GELİRİ",
          directCarbonTax: "DOĞRUDAN KARBON VERGİSİ"
        },
        nir: {
          leftTitle: "Türkiye Sera Gazı Emisyon Dağılımı (TÜİK Envanteri)",
          rightTitle: "Pilot Bölge Ajan Yerleşim Haritası (10 İl)",
          totalLabel: "Son Bildirilen Toplam Sera Gazı (LULUCF Hariç):",
          energyLabel: "Enerji Sektörü Emisyonu (Tesisler Dahil):",
          industrialLabel: "Industrial Processes (IPPU):",
          agricultureLabel: "Tarım Sektörü Emisyonu:",
          wasteLabel: "Atık Yönetimi Emisyonu:",
          sectorEnergy: "Enerji (%71.8)",
          sectorIppu: "IPPU (%13.0)",
          sectorAgri: "Tarım (%12.2)",
          sectorWaste: "Atık (%3.0)",
          sourceInfo: "Kaynak: TÜİK 2026 Resmi Sera Gazı Emisyon İstatistikleri Haber Bülteni (Nisan 2026). Sektörel dağılımlar son bildirilen envanter yılı olan 2024 yılına aittir.",
          provinceRegion: "Bölge:",
          provinceSector: "Dominant Sektör:",
          provinceEmissions: "Tahmini ETS Kapsamı:",
          provinceSelectInfo: "Harita üzerinde renklendirilmiş illere tıklayarak detaylı bölgesel ETS kapsam tahminlerini ve ağır sanayi yapılarını inceleyebilirsiniz. Koyu teal renkli iller yüksek emisyon potansiyeline sahip pilot bölgelerdir."
        },
        custom: {
          controlsTitle: "İnteraktif Simülatör Kontrolleri",
          presetsLabel: "SENARYO ŞABLONLARI:",
          runBtn: "YENİ SİMÜLASYON KOŞ",
          exportBtn: "CSV OLARAK DIŞARI AKTAR 📥",
          runProgress: "SİMÜLASYON KOŞULUYOR...",
          warningSeed: "Farklı tohum (seed) değerleri Monte Carlo ajanlarının yatırım yapma kararlarındaki rassallığı (örneğin santralin arıza/bakım periyotları, finansman bulma süresi) simüle eder.",
          
          params: {
            startCap: "Başlangıç Emisyon Kotası (Cap):",
            capTooltip: "2025 yılı başlangıç kotası. Türkiye'de modellenen 13 büyük kömür santrali emisyon toplamına referans.",
            capDecay: "Yıllık Kota Azaltım Hızı (Cap Decay Rate):",
            decayTooltip: "Kotanın her yıl yüzde kaç azaltılacağı. Yüksek azaltım hızı emisyonları daha hızlı düşürür fakat karbon fiyatını yükseltir.",
            incentive: "Yenilenebilir Yatırım Teşvik Miktarı (TRY/MWh):",
            incTooltip: "Santrallere rüzgar/güneş hibrit yatırımları için devlet tarafından verilecek teşvik miktarı.",
            floorPrice: "Taban Karbon Fiyatı (€/tCO₂):",
            floorTooltip: "ETS piyasasında karbon fiyatının altına inemeyeceği taban seviye. Fiyat istikrarı sağlar.",
            ceilPrice: "Tavan Karbon Fiyatı (€/tCO₂):",
            ceilTooltip: "Karbon fiyatının çıkabileceği maksimum sınır. Sanayiciyi aşırı yüksek maliyetten korur.",
            elasticity: "Piyasa Fiyat Hassasiyeti (Fiyat Katsayısı):",
            elasticityTooltip: "Kota açığının fiyatı ne kadar agresif tetikleyeceğini belirleyen katsayı.",
            cbam: "Avrupa Birliği SKDM (CBAM) Fiyatı (€/t):",
            cbamTooltip: "Sınırda karbon düzenleme mekanizmasında öngörülen AB-ETS karbon fiyatı. Dış ticaret risklerini hesaplar.",
            growth: "Doğal Emisyon Büyüme Hızı (Yıllık %):",
            growthTooltip: "Ekonomik büyümeye bağlı olarak elektrik talebinin ve emisyonların yıllık doğal artış hızı.",
            seed: "Monte Carlo Tohumu (Random Seed):",
            seedTooltip: "Ajan tabanlı stokastik kararların tekrarlanabilirliğini sağlayan rastgelelik değeri."
          },

          resultsTitle: "Özel Tasarım Senaryo Çıktıları (2025 - 2035)",
          kpiCumulativeEts: "Kümülatif ETS Kamu Geliri",
          kpiCumulativeTax: "Kümülatif Karbon Vergisi Geliri",
          kpiEmissionsRed: "Emisyon Azaltım Başarısı",
          kpiCompareBau: "Referans BAU'ya Göre Azaltım:",
          kpiYear: "2035 Emisyonu:",
          kpiPrice: "2035 Karbon Fiyatı:",
          chartEmissions: "Yıllık Emisyon Seviyeleri (MtCO₂)",
          chartPrice: "Karbon Fiyatı Patikası (€/tCO₂)",
          chartStatus: "Tesis Durum Dağılımları (13 Santral)",
          legendCap: "Emisyon Kotası (Cap)",
          legendEmissions: "Toplam Emisyon (Özel)",
          legendPrice: "Karbon Fiyatı (Özel)",
          
          plantStatus: {
            active: "Aktif (Linyit/İthal)",
            transforming: "Dönüşümde (Yatırım)",
            clean: "Temiz (Hibrit/CCS)",
            closed: "Kapatılmış"
          }
        },
        policy: {
          title: "Ajan Tabanlı Model Sonuçlarından Çıkarılan Politika Önerileri",
          recTitle: "KRİTİK POLİTİKA ÇIKARIMLARI VE ÖNERİLER",
          
          c1_title: "1. TEK BAŞINA KARBON FİYATI YETERSİZDİR (POLİTİKA KARIŞIMI EKSENİ)",
          c1_desc: "Simülasyon sonuçları, yüksek karbon fiyatlarının bile (örneğin €80 ve üzeri) eski santralleri tek başına temiz teknolojilere dönüştürmeye yetmediğini göstermektedir. Ancak karbon fiyatı ile entegre yürütülen yeşil yatırım teşvikleri (örneğin YEKDEM benzeri hibrit teşvikleri), santrallerin dönüşüm süresini ortalama %35 oranında kısaltmaktadır.",
          
          c2_title: "2. STRANDED ASSETS (ATIL SERMAYE RİSKİ)",
          c2_desc: "20 yaşın üzerindeki termik santraller (Soma B, Seyitömer, Kangal vb.), amortisman sürelerini tamamladıkları ve lisans bitiş yıllarına yaklaştıkları için karbon yakalama (CCS) gibi yüksek maliyetli yatırımlara girmemektedir. Bu tesisler karbon fiyatı yükseldiğinde dönüşmek yerine doğrudan ekonomik kapanış yapmaktadır. Bu durum elektrik arz güvenliğinde ani açıklara sebep olabilir.",
          
          c3_title: "3. HİBRİTLEŞME VE YENİLENEBİLİR ENERJİ ENTEGRASYONU",
          c3_desc: "Linyit ve ithal kömür tesislerinde kurulu güç kapasitelerinin bir kısmının rüzgar ve güneş enerjisi (RES/GES) hibrit yapılarına dönüştürülmesi, emisyonları düşürürken santralin liyakat sırası (merit-order) kâr marjını korumaktadır. Devlet teşviklerinin doğrudan GES/RES hibritleşmesine yönlendirilmesi emisyon hedeflerine ulaşmayı kolaylaştıracaktır.",
          
          footerNote: "Not: Bu çıkarımlar, 10 yıllık Monte Carlo simülasyon çıktılarının istatistiksel analizlerine ve Türkiye İklim Kanunu taslaklarındaki piyasa yapısına dayanmaktadır."
        },
        technical: {
          title: "Teknik Detaylar: Marjinal Azaltım Maliyet Eğrisi (MAC) ve Model Varsayımları",
          leftTitle: "Türkiye Elektrik Sektörü Azaltım Teknolojileri Maliyetleri (MAC)",
          rightTitle: "Karar Matrisi ve Matematiksel Mantık",
          curveDesc: "Aşağıdaki tabloda, simülasyondaki kömür yakıtlı santral ajanlarının yeşil yatırım kararlarında kullandıkları Marjinal Azaltım Maliyet Eğrisi (MAC) parametreleri yer almaktadır. Eksi maliyetler (MAC < 0) işletmeye doğrudan kazanç sağlayan verimlilik yatırımlarını gösterir.",
          
          headers: {
            sector: "YAKIT / SEKTÖR",
            tech: "AZALTIM TEKNOLOJİSİ",
            mac: "MARJİNAL MALİYET (MAC)",
            potential: "EMİSYON AZALTIM POTANSİYELİ",
            duration: "YATIRIM SÜRESİ"
          },
          
          mathTitle: "Santral Ajanlarının Yatırım Karar Formülasyonu",
          math1: "Simülasyonda her santral ajanı t yılında yatırım faydasını hesaplar:",
          math2: "Eğer en yüksek net fayda > 0 ise ajan yatırım kararı alır, durumunu 'Dönüşüm' olarak günceller ve emisyonunu düşürmek için inşaat süresi boyunca bekler. Eğer karbon maliyeti santralin yıllık kâr marjını tamamen silerse santral ekonomik kapanış ('Kapalı') kararı alır.",
          
          citationsTitle: "Akademik Literatür Referansları",
          cite1: "Aşıcı, A. A. (2024). 'Türkiye'nin Karbon Fiyatlandırma Politikaları ve Emisyon Ticaret Sistemi Tasarımı'. İTÜ İklim Değişikliği Merkezi Raporu.",
          cite2: "Kat, G., Gungor, A. & Sari, R. (2024). 'Decarbonizing Turkey's Power Sector: An Agent-Based Simulation of ETS and Subsidies'. Energy Economics, 131, 107382.",
          cite3: "Bassart-i-Loré, P. (2026). 'Hybrid policy mixes in emission markets: Interactions between carbon prices and green subsidies'. Technological Forecasting and Social Change, 222, 124372.",
          cite4: "Wang, Y. et al. (2025). 'Wait-and-see behaviors of heavy emitters under pilot carbon pricing schemes'. Energy Policy, 194, 114120."
        }
      }
    }
  },
  en: {
    translation: {
      navbar: {
        about: "About Project",
        simulator: "Research / Simulator",
        documents: "Documents",
        bibliography: "Bibliography",
        contact: "Contact"
      },
      header: {
        school: "ANKARA YILDIRIM BEYAZIT UNIVERSITY",
        department: "DEPARTMENT OF INDUSTRIAL ENGINEERING",
        ataturkAlt: "Atatürk and Turkish Flag",
        yuzyilAlt: "Century of Türkiye"
      },
      about: {
        title: "AYBU Industrial Engineering Graduation Thesis Project",
        summaryTitle: "Project Abstract",
        summary1: "Turkey's 2053 net-zero emission targets and the European Union's Carbon Border Adjustment Mechanism (CBAM) alignment process demand fundamental changes in industrial and energy structures. Within the scope of this graduation project, an Agent-Based Simulation (ABM) model and Decision Support System (TR-ETS) have been developed, where the 13 largest coal-fired thermal power plants in Turkey's power sector are modeled as autonomous agents.",
        summary2: "Our simulation engine analyzes power plants' green technology investments (boiler efficiency, CCS, solar/wind hybrid integrations, etc.) on an annual basis under carbon price corridors, annual quota decay (Cap Decay), and governmental subsidy mechanisms. The resulting outputs provide a scientific framework aiming to assist decision-makers in choosing the most effective mitigation policy.",
        keywords: "Keywords: Agent-Based Modeling (ABM), Emission Trading System (ETS), Marginal Abatement Cost Curve (MAC), Energy Policy.",
        cardTitle: "PROJECT CREDITS",
        advisor: "ADVISOR:",
        advisorName: "Asst. Prof. Dr. Deniz Efendioğlu",
        team: "PROJECT TEAM (AUTHORS):",
        period: "ACADEMIC PERIOD:",
        periodValue: "2025 - 2026 Academic Year"
      },
      documents: {
        title: "Academic Outputs (Thesis & Presentation Reports)",
        t1_label: "BACHELOR THESIS (TERM 2)",
        t1_status: "FINAL",
        t1_title: "AYBU Industrial Engineering Bachelor Thesis Report",
        t1_desc: "Turkey ETS Simulation with Agent-Based Modeling and Decision Support System Thesis (Final Report).",
        t1_btn: "AVAILABLE SOON ⌛",
        
        t2_label: "PRESENTATION FILE (TERM 2)",
        t2_status: "FINAL",
        t2_title: "Graduation Project Term 2 Presentation",
        t2_desc: "Final defense presentation covering completed simulation stages, policy outputs, and scenario comparisons of the project.",
        t2_btn: "AVAILABLE SOON ⌛",

        t3_label: "BACHELOR THESIS (TERM 1)",
        t3_status: "DOCX (133 KB)",
        t3_title: "Graduation Project Term 1 Thesis Report",
        t3_desc: "Agent-Based Turkey ETS Simulation and Decision Support System Term 1 Report (Design and Preliminary Findings).",
        t3_btn: "DOWNLOAD THESIS REPORT (.DOCX)",

        t4_label: "PRESENTATION FILE (TERM 1)",
        t4_status: "PDF (10.5 MB)",
        t4_title: "Graduation Project Term 1 Presentation",
        t4_desc: "Defense presentation including thesis literature review, methodology design, and initial simulation results.",
        t4_btn: "DOWNLOAD PRESENTATION (.PDF)",

        libraryTitle: "Official Legislation, Laws & Treaties Library",
        libraryDesc: "The simulation models operating on this portal are designed in full alignment with the draft regulations prepared by the Climate Change Presidency of the Ministry of Environment, Urbanization and Climate Change of the Republic of Turkey and international treaties. You can review the relevant legal reference documents below:",
        downloadBtn: "DOWNLOAD DOCUMENT ⬇",

        docNames: {
          iklimKanunu: "Draft Climate Law",
          seraGazi: "Greenhouse Gas Monitoring Regulation",
          trEts: "Draft TR-ETS Regulation",
          denklestirme: "Offsetting Regulation",
          paris: "Paris Agreement",
          bmIklim: "UN Framework Convention on Climate Change"
        },
        docDescs: {
          iklimKanunu: "Draft Climate Law text regulating greenhouse gas reduction quotas and the structure of the Carbon Market Board.",
          seraGazi: "Legislation for monitoring, reporting, and verification (MRV) of installation-level greenhouse gas emissions.",
          trEts: "Draft regulation containing allocation and exchange rules of the Turkish Emission Trading System.",
          denklestirme: "Technical principles regarding crediting and offset mechanisms in carbon markets.",
          paris: "International Paris Agreement text containing goals to limit global warming to 1.5°C.",
          bmIklim: "UNFCCC official Turkish main convention text."
        }
      },
      bibliography: {
        title: "Project Bibliography (Literature Bank)",
        desc: "A wide academic literature repository utilized in the methodological design, mathematical background, and policy analysis of the Agent-Based Turkey ETS Simulation and Decision Support System project. You can access the relevant articles via Google Drive through the following thematic folders:",
        openBtn: "OPEN ↗",
        folder1: {
          name: "CARBON EMISSION MODELING APPROACHES",
          desc: "Academic studies containing emission forecasting models, sectoral emission scenarios, and simulation methodologies at global and national scales."
        },
        folder2: {
          name: "CARBON PRICING AND ETS (EMISSION TRADING SYSTEMS)",
          desc: "Literature on the theoretical framework of emission trading systems (ETS), carbon taxes, cap-and-trade markets, and price stability mechanisms."
        },
        folder3: {
          name: "AGENT-BASED MODELING (ABM) - CLIMATE & ENERGY",
          desc: "Agent-based modeling (ABM) applications, behavioral economics, and simulation theory in energy markets and climate policies."
        },
        folder4: {
          name: "CARBON EMISSIONS AND POLICY STUDIES IN TURKEY",
          desc: "Articles on Turkey's net-zero emission targets, climate law drafts, national development plans, and sectoral mitigation potentials."
        },
        folder5: {
          name: "HYBRID MODELING AND TECHNOLOGY DIFFUSION",
          desc: "Clean technology investments in industry, diffusion of decarbonization technologies (CCS, solar/wind, energy efficiency), and decarbonization models."
        }
      },
      contact: {
        title: "Contact and Campus Information",
        deptTitle: "DEPARTMENT INFO",
        schoolName: "Ankara Yildirim Beyazit University",
        facultyName: "Faculty of Engineering and Natural Sciences",
        deptName: "Department of Industrial Engineering",
        addressTitle: "Campus Address",
        addressDesc: "15 Temmuz Sehitleri Campus, Ayvali Mah., Gazze Cad., 150. Sokak, Next to Antares Mall, Etlik, Kecioren / Ankara, Turkey",
        websiteTitle: "Web Site",
        phoneTitle: "Phone",
        visitorInfo: "💡 Visitor Info: Our department is located on the 3rd floor of Block A in the 15 Temmuz Sehitleri Campus. Access is available via public transit using the Etlik Metro / Bus routes.",
        mapTitle: "📍 INTERACTIVE MAP",
        streetViewTitle: "📷 LIVE STREET VIEW",
        streetViewDate: "Kecioren/Ankara · Apr 2024",
        streetViewTooltipFull: "Show Fullscreen",
        streetViewTooltipMaps: "Open in Google Maps",
        streetViewGoogle: "© 2026 Google",
        streetViewBack: "Go Back",
        streetViewGoLive: "View Live on Maps",
        streetViewClose: "Close",
        streetViewWalk: "Walk on Google Maps ↗",
        streetViewTitleText: "Gazze Street",
        streetViewSubText: "Ankara Yildirim Beyazit University, 15 Temmuz Campus",
        streetViewImageDate: "Image date: Apr 2024 © 2026 Google"
      },
      footer: {
        title: "TR-ETS v5.0 | SIMULATION OF AGENT-BASED EMISSION TRADING SYSTEM OF TURKEY",
        subtitle: "Industrial Engineering Decision Analysis Graduation Thesis · June 2026",
        authors: "Ibrahim Hakki Keles · Oguz Gokdemir · Melis Magden",
        advisor: "Academic Advisor: Dr. Deniz Efendioglu (Ankara Yildirim Beyazit University)"
      },
      simulator: {
        categoryText: "ELECTRICITY GENERATION SECTOR (COAL-FIRED THERMAL POWER PLANTS)",
        mainTitle: "TR-ETS: SIMULATION OF AGENT-BASED EMISSION TRADING SYSTEM OF TURKEY",
        subDesc: "This Decision Support System is an Agent-Based Turkey ETS Simulation model developed under the Department of Industrial Engineering at AYBU by Ibrahim Hakki Keles, Oguz Gokdemir, and Melis Magden, supervised by Dr. Deniz Efendioglu.",
        scopeTitle: "SIMULATION SCOPE",
        scopePlants: "Coal Power Plants:",
        scopePlantsValue: "13 Units",
        scopeRegion: "Pilot Region:",
        scopeRegionValue: "10 Critical Cities",
        scopeSolver: "Solver Engine:",
        scopeSolverValue: "Agent-Based",
        academicModeTitle: "Academic Assessment Mode:",
        academicModeDesc: "This interactive dashboard runs a Monte Carlo agent-based model engine based on real thermal power plant emission profiles and Turkey's Marginal Abatement Cost (MAC) curve. The simulation solves price stability corridors (floor/ceiling prices) and CBAM (border carbon adjustment) burdens dynamically.",
        subtabs: {
          comparison: "Scenario Comparison",
          nir: "Current Status (NIR)",
          custom: "Design Your Own ETS",
          policy: "Policy Outcomes",
          technical: "Technical Details / MAC"
        },
        comparison: {
          summaryDesc: "The charts below compare 2035 projections for 5 different alternative policy scenarios in the Turkish electricity generation sector (coal-fired thermal power plants).",
          emissionsTitle: "Sectoral CO₂ Emission Pathways (MtCO₂)",
          priceTitle: "Carbon Price Pathways (€/tCO₂)",
          kpiReduction: "Emission Reduction (vs. Reference)",
          kpiSiki: "Tight ETS Scenario",
          kpiSubsidized: "Subsidized ETS Scenario",
          chartBau: "BAU (No Policy)",
          chartSoft: "Soft ETS (Annual 2%)",
          chartTight: "Tight ETS (Annual 4%)",
          chartSubsidized: "Subsidized Tight ETS",
          chartTax: "Carbon Tax (IMF Pathway)",
          legendCap: "Emission Cap",
          noPolicy: "No mitigation policy",
          maxPrice: "Max. Carbon Price",
          tightScenarioCeil: "Tight scenario ceiling",
          cleanPlantRatio: "Clean Plant Ratio",
          tightScenarioRatio: "Tight scenario conversion ratio",
          unitMt: "UNIT: Mt CO₂",
          unitEur: "UNIT: EUR / TON",
          summaryReportTitle: "Scenario Comparison Summary Report (Target Year: 2035)",
          tableHeaderScenario: "Scenario",
          tableHeaderEmissions: "Emissions 2035 (Mt)",
          tableHeaderBauReduction: "BAU Reduction (%)",
          tableHeaderMaxPrice: "Maximum Price (€ / t)",
          tableHeaderCumulativeEts: "Cumulative ETS Revenue (M€)",
          tableHeaderCumulativeTax: "Cumulative Tax Revenue (M€)",
          tableHeaderTransformed: "Transformed Units",
          tableHeaderClosed: "Closed Units",
          descBau: "Current trend baseline",
          descSoft: "Low reduction trajectory",
          descTight: "Rapid decarbonization ceiling",
          descSubsidized: "Technology-supported mechanism",
          descTax: "Fixed tax regime",
          cumulativeEmissionsTitle: "CUMULATIVE EMISSION REDUCTION PERFORMANCE VS. BAU",
          periodEndRevenueTitle: "PERIOD-END PUBLIC & ETS FUND ACCUMULATION (M€)",
          etsAuctionRevenue: "ETS AUCTION REVENUE",
          directCarbonTax: "DIRECT CARBON TAX"
        },
        nir: {
          leftTitle: "Turkey Greenhouse Gas Emission Distribution (TurkStat Inventory)",
          rightTitle: "Pilot Region Agent Settlement Map (10 Provinces)",
          totalLabel: "Last Reported Total GHG (Excl. LULUCF):",
          energyLabel: "Energy Sector Emissions (Incl. Power Plants):",
          industrialLabel: "Industrial Processes (IPPU):",
          agricultureLabel: "Agriculture Sector Emissions:",
          wasteLabel: "Waste Management Emissions:",
          sectorEnergy: "Energy (71.8%)",
          sectorIppu: "IPPU (13.0%)",
          sectorAgri: "Agriculture (12.2%)",
          sectorWaste: "Waste (3.0%)",
          sourceInfo: "Source: TurkStat 2026 Official Greenhouse Gas Emission Statistics Press Release (April 2026). Sectoral distributions correspond to the latest reported inventory year 2024.",
          provinceRegion: "Region:",
          provinceSector: "Dominant Sector:",
          provinceEmissions: "Est. ETS Scope:",
          provinceSelectInfo: "Click on colored provinces on the map to review detailed regional ETS scope estimates and heavy industrial structures. Darker teal provinces indicate high-emission potential pilot regions."
        },
        custom: {
          controlsTitle: "Interactive Simulator Controls",
          presetsLabel: "SCENARIO PRESETS:",
          runBtn: "RUN NEW SIMULATION",
          exportBtn: "EXPORT TO CSV 📥",
          runProgress: "RUNNING SIMULATION...",
          warningSeed: "Different seed values simulate the stochastic behavior of Monte Carlo agents' investment decisions (e.g., power plant maintenance cycles, financing search duration).",
          
          params: {
            startCap: "Initial Emission Cap:",
            capTooltip: "Initial cap for year 2025. Aligned with the estimated emissions total of the 13 large coal plants modeled.",
            capDecay: "Annual Cap Decay Rate:",
            decayTooltip: "The annual percentage reduction of the quota. Higher decay rates drop emissions faster but drive carbon prices up.",
            incentive: "Renewable Investment Subsidy (TRY/MWh):",
            incTooltip: "Subsidy amount provided by the government to power plants for hybrid solar/wind investments.",
            floorPrice: "Carbon Floor Price (€/tCO₂):",
            floorTooltip: "The minimum price limit for the carbon market. Ensures price stability.",
            ceilPrice: "Carbon Ceiling Price (€/tCO₂):",
            ceilTooltip: "The maximum limit carbon prices can reach. Protects industry against extreme cost shocks.",
            elasticity: "Market Price Sensitivity (Price Coefficient):",
            elasticityTooltip: "A multiplier that defines how aggressively quota deficits trigger carbon prices.",
            cbam: "EU Border Adjustment (CBAM) Price (€/t):",
            cbamTooltip: "The projected EU-ETS carbon price for border adjustments. Calculates trade exposure risks.",
            growth: "Natural Emission Growth Rate (Annual %):",
            growthTooltip: "Natural annual growth rate of power demand and emissions driven by economic growth.",
            seed: "Monte Carlo Seed (Random Seed):",
            seedTooltip: "Ensures reproducibility of stochastic agent-based decisions."
          },

          resultsTitle: "Custom Scenario Outcomes (2025 - 2035)",
          kpiCumulativeEts: "Cumulative ETS Revenue",
          kpiCumulativeTax: "Cumulative Carbon Tax Revenue",
          kpiEmissionsRed: "Emission Reduction Success",
          kpiCompareBau: "Reduction vs. Reference BAU:",
          kpiYear: "2035 Emission:",
          kpiPrice: "2035 Carbon Price:",
          chartEmissions: "Annual Emission Levels (MtCO₂)",
          chartPrice: "Carbon Price Pathway (€/tCO₂)",
          chartStatus: "Installation Status Distribution (13 Plants)",
          legendCap: "Emission Cap",
          legendEmissions: "Total Emission (Custom)",
          legendPrice: "Carbon Price (Custom)",
          
          plantStatus: {
            active: "Active (Lignite/Imported)",
            transforming: "Transforming (Investment)",
            clean: "Clean (Hybrid/CCS)",
            closed: "Decommissioned"
          }
        },
        policy: {
          title: "Policy Recommendations Derived from Agent-Based Model Outcomes",
          recTitle: "CRITICAL POLICY OUTCOMES AND RECOMMENDATIONS",
          
          c1_title: "1. CARBON PRICE ALONE IS INSUFFICIENT (POLICY MIX COMPONENT)",
          c1_desc: "Simulation outputs show that even high carbon prices (e.g., €80 and above) are not enough to transition older power plants to clean technologies on their own. However, green investment subsidies implemented in tandem with carbon prices (similar to hybrid incentives under YEKDEM) shorten the average transition duration of power plants by 35%.",
          
          c2_title: "2. STRANDED ASSETS RISK",
          c2_desc: "Coal power plants older than 20 years (such as Soma B, Seyitomer, Kangal) do not engage in high-cost investments like Carbon Capture and Storage (CCS) because they have completed their amortization periods and are close to their license expiry years. These facilities choose to decommission directly rather than transition when carbon prices rise. This could trigger unexpected electricity supply gaps.",
          
          c3_title: "3. HYBRIDIZATION AND RENEWABLE ENERGY INTEGRATION",
          c3_desc: "Converting a portion of installed capacity in lignite and imported coal power plants into wind and solar hybrid structures (WPP/SPP) reduces emissions while maintaining plants' merit-order profit margins. Directing state incentives specifically towards hybridization will ease the path to emission targets.",
          
          footerNote: "Note: These recommendations are based on statistical analyses of 10-year Monte Carlo simulation outputs and the market structure in Turkey's Draft Climate Law."
        },
        technical: {
          title: "Technical Details: Marginal Abatement Cost Curve (MAC) and Model Assumptions",
          leftTitle: "Turkey Power Sector Abatement Technology Costs (MAC)",
          rightTitle: "Decision Matrix and Mathematical Logic",
          curveDesc: "The table below displays the Marginal Abatement Cost Curve (MAC) parameters used by the coal-fired plant agents in their green investment decisions. Negative costs (MAC < 0) represent efficiency investments that provide direct financial savings to the plant.",
          
          headers: {
            sector: "FUEL / SECTOR",
            tech: "ABATEMENT TECHNOLOGY",
            mac: "MARGINAL COST (MAC)",
            potential: "EMISSION REDUCTION POTENTIAL",
            duration: "INVESTMENT DURATION"
          },
          
          mathTitle: "Investment Decision Formulation of Plant Agents",
          math1: "In the simulation, each plant agent calculates the investment utility at year t:",
          math2: "If the highest net utility > 0, the agent makes an investment decision, updates its state to 'Transforming', and waits for the duration of construction to reduce its emissions. If carbon costs completely wipe out the plant's annual profit margin, the plant decides on economic decommissioning ('Closed').",
          
          citationsTitle: "Academic Literature Citations",
          cite1: "Asici, A. A. (2024). 'Carbon Pricing Policies and Emission Trading System Design for Turkey'. ITU Climate Change Center Report.",
          cite2: "Kat, G., Gungor, A. & Sari, R. (2024). 'Decarbonizing Turkey's Power Sector: An Agent-Based Simulation of ETS and Subsidies'. Energy Economics, 131, 107382.",
          cite3: "Bassart-i-Loré, P. (2026). 'Hybrid policy mixes in emission markets: Interactions between carbon prices and green subsidies'. Technological Forecasting and Social Change, 222, 124372.",
          cite4: "Wang, Y. et al. (2025). 'Wait-and-see behaviors of heavy emitters under pilot carbon pricing schemes'. Energy Policy, 194, 114120."
        }
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "tr", // default language is always Turkish as requested
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
