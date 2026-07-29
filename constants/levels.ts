export interface LevelData {
  id: number;
  letters: string[];
  targetWords: string[];
}

export const GAME_LEVELS: LevelData[] = [
  {
    id: 1,
    letters: ["K", "A", "L", "E", "M"],
    targetWords: ["KALEM", "KALE", "ELMA", "LAKE", "KEL"],
  },
  {
    id: 2,
    letters: ["S", "E", "V", "G", "İ"],
    targetWords: ["SEVGİ", "SEVİ", "GİSİ", "EVSİ"],
  },
  {
    id: 3,
    letters: ["T", "A", "K", "I", "M"],
    targetWords: ["TAKIM", "ATIK", "TAKTI", "ATIM", "ATK"],
  },
  {
    id: 4,
    letters: ["G", "Ü", "N", "E", "Ş"],
    targetWords: ["GÜNEŞ", "GÜNE", "EŞÜN"],
  },
  {
    id: 5,
    letters: ["D", "E", "N", "İ", "Z"],
    targetWords: ["DENİZ", "DİNZE", "EZİN", "DİZ"],
  },
];