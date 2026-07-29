export interface LevelData {
  id: number;
  category: string;
  letters: string[];
  targetWords: string[];
  definitions: Record<string, string>; // Kelime ve anlamları eşleşmesi
}

export const GAME_CATEGORIES = [
  "Tüm Kategoriler",
  "Genel Kültür",
  "Edebiyat",
  "Osmanlıca",
  "İngilizce",
];

export const GAME_LEVELS: LevelData[] = [
  {
    id: 1,
    category: "Genel Kültür",
    letters: ["K", "A", "L", "E", "M"],
    targetWords: ["KALEM", "KALE", "ELMA", "LAKE", "KEL"],
    definitions: {
      KALEM: "Yazı yazmaya, çizim yapmaya yarayan araç.",
      KALE: "Düşman saldırılarına karşı korunmak için yapılan kalın duvarlı kule.",
      ELMA: "Gülgillerden, vitamini bol, yaygın meyve türü.",
      LAKE: "Çin cilasıyla cilalanmış veya parlak boya ile boyanmış ahşap.",
      KEL: "Saçı dökülmüş veya hiç saçı olmayan kimse.",
    },
  },
  {
    id: 2,
    category: "Genel Kültür",
    letters: ["S", "E", "V", "G", "İ"],
    targetWords: ["SEVGİ", "SEVİ", "EVSİ"],
    definitions: {
      SEVGİ: "İnsanı bir şeye veya bir kimseye karşı yakın ilgi ve bağlılık göstermeye yönelten duygu.",
      SEVİ: "Aşk, sevgi duygusu.",
      EVSİ: "Evcil, eve alışkın olan.",
    },
  },
  {
    id: 3,
    category: "Edebiyat",
    letters: ["T", "A", "K", "I", "M"],
    targetWords: ["TAKIM", "ATIK", "TAKTI", "ATIM", "ATK"],
    definitions: {
      TAKIM: "Birbirini tamamlayan veya aynı işte kullanılan nesnelerin / kişilerin bütünü.",
      ATIK: "Kullanım süresi dolmuş, çevreye atılan veya geri dönüştürülen madde.",
      TAKTI: "Taktik, izlenen özel yöntem.",
      ATIM: "Bir ateşli silahın tek seferde attığı mermi miktarı.",
      ATK: "Dokumacılıkta enlemesine atılan iplik zinciri.",
    },
  },
  {
    id: 4,
    category: "Osmanlıca",
    letters: ["K", "E", "L", "Â", "M"],
    targetWords: ["KELÂM", "KALEM", "KEL"],
    definitions: {
      KELÂM: "Söz, laf, düşünceyi ifade eden cümle. İlahiyat ilminde Tanrı'nın kelam sıfatı.",
      KALEM: "Yazı yazmaya yarayan kamış veya gereç.",
      KEL: "Saçsız, yaprakları dökülmüş.",
    },
  },
  {
    id: 5,
    category: "Osmanlıca",
    letters: ["H", "A", "Y", "A", "T"],
    targetWords: ["HAYAT", "HAYA", "TAYA", "TAY"],
    definitions: {
      HAYAT: "Canlılık, ömür, yaşam süresi. Osmanlı evlerinde avlu/giriş balkonu.",
      HAYA: "Utanma duygusu, ar, namus, edep.",
      TAYA: "Çocuk bakıcısı, mürebbiye.",
      TAY: "Bir yaşındaki at yavrusu.",
    },
  },
  {
    id: 6,
    category: "İngilizce",
    letters: ["S", "M", "A", "R", "T"],
    targetWords: ["SMART", "STAR", "ARTS", "MATS", "RAM"],
    definitions: {
      SMART: "Zeki, akıllı, şık.",
      STAR: "Yıldız, ünlü kimse.",
      ARTS: "Sanatlar, zanaatlar.",
      MATS: "Paspaslar, minderler.",
      RAM: "Koç, rastgele erişimli bellek (RAM).",
    },
  },
  {
    id: 7,
    category: "İngilizce",
    letters: ["D", "R", "E", "A", "M"],
    targetWords: ["DREAM", "READ", "MADE", "DEAR", "RED"],
    definitions: {
      DREAM: "Rüya, hayal etmek.",
      READ: "Okumak.",
      MADE: "Yapılmış, etmek (Make kelimesinin geçmiş zamanı).",
      DEAR: "Sevgili, değerli, pahalı.",
      RED: "Kırmızı renk.",
    },
  },
];