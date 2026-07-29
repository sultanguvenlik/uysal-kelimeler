export interface LevelData {
  id: number;
  category: string;
  letters: string[];
  targetWords: string[];
}

export const GAME_CATEGORIES = [
  "Tüm Kategoriler",
  "Genel Kültür",
  "Edebiyat",
  "Osmanlıca",
];

export const GAME_LEVELS: LevelData[] = [
  {
    id: 1,
    category: "Genel Kültür",
    letters: ["K", "A", "L", "E", "M"],
    targetWords: ["KALEM", "KALE", "ELMA", "LAKE", "KEL"],
  },
  {
    id: 2,
    category: "Genel Kültür",
    letters: ["S", "E", "V", "G", "İ"],
    targetWords: ["SEVGİ", "SEVİ", "EVSİ"],
  },
  {
    id: 3,
    category: "Edebiyat",
    letters: ["T", "A", "K", "I", "M"],
    targetWords: ["TAKIM", "ATIK", "TAKTI", "ATIM", "ATK"],
  },
  {
    id: 4,
    category: "Osmanlıca",
    letters: ["K", "E", "L", "Â", "M"],
    targetWords: ["KELÂM", "KALEM", "KEL"],
  },
  {
    id: 5,
    category: "Osmanlıca",
    letters: ["H", "A", "Y", "A", "T"],
    targetWords: ["HAYAT", "HAYA", "TAYA", "TAY"],
  },
];