import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const { width } = Dimensions.get("window");
const WHEEL_SIZE = width * 0.7;
const RADIUS = WHEEL_SIZE / 2 - 35;
const CENTER = WHEEL_SIZE / 2;

const LEVELS = [
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
];

export default function OyunEkrani() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel = LEVELS[currentLevelIndex];

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(100);
  const [hints, setHints] = useState<string[]>([]);
  const [savingScore, setSavingScore] = useState(false);

  // Harf Seçme
  const handleLetterPress = (index: number) => {
    if (!selectedIndices.includes(index)) {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  // Seçimi Temizleme
  const handleClear = () => {
    setSelectedIndices([]);
  };

  // Skoru Firebase Firestore'a Kaydetme Motoru
  const saveScoreToFirebase = async (finalScore: number) => {
    try {
      setSavingScore(true);
      await addDoc(collection(db, "scores"), {
        name: "Abdullah",
        score: finalScore,
        level: currentLevel.id,
        createdAt: serverTimestamp(),
      });
      setSavingScore(false);
    } catch (error) {
      console.log("Skor Firebase'e kaydedilemedi:", error);
      setSavingScore(false);
    }
  };

  // Kelime Kontrolü
  const handleSubmit = () => {
    const formedWord = selectedIndices
      .map((i) => currentLevel.letters[i])
      .join("");

    if (
      currentLevel.targetWords.includes(formedWord) &&
      !foundWords.includes(formedWord)
    ) {
      const updatedFound = [...foundWords, formedWord];
      setFoundWords(updatedFound);
      const newScore = score + formedWord.length * 20;
      setScore(newScore);

      // Bölüm Tamamlandı mı?
      if (updatedFound.length === currentLevel.targetWords.length) {
        saveScoreToFirebase(newScore);
        Alert.alert("Tebrikler Abdullah! 🎉", "Bölümü tamamladın, skorun Liderlik Tablosuna işlendi!", [
          { text: "Sonraki Bölüm", onPress: nextLevel },
        ]);
      }
    }
    setSelectedIndices([]);
  };

  // Sonraki Bölüm
  const nextLevel = () => {
    if (currentLevelIndex + 1 < LEVELS.length) {
      setCurrentLevelIndex((prev) => prev + 1);
      setFoundWords([]);
      setSelectedIndices([]);
      setHints([]);
    } else {
      Alert.alert("Efsane!", "Mevcut tüm bölümleri bitirdin.");
    }
  };

  // İpucu Satın Alma
  const handleUseHint = () => {
    if (score < 50) {
      Alert.alert("Yetersiz Puan", "İpucu almak için en az 50 puan gerekli.");
      return;
    }
    const uncollected = currentLevel.targetWords.filter(
      (w) => !foundWords.includes(w) && !hints.includes(w)
    );
    if (uncollected.length > 0) {
      setScore((s) => s - 50);
      setHints((prev) => [...prev, uncollected[0]]);
    }
  };

  const currentFormedWord = selectedIndices
    .map((i) => currentLevel.letters[i])
    .join("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bilgi Barı */}
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Bölüm {currentLevel.id}</Text>
        </View>

        <View style={styles.scoreContainer}>
          {savingScore ? (
            <ActivityIndicator size="small" color="#EAB308" />
          ) : (
            <Ionicons name="flash" size={18} color="#EAB308" />
          )}
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Bulunacak Kelimeler Izgarası */}
      <View style={styles.puzzleArea}>
        <Text style={styles.puzzleTitle}>BULUNAN KELİMELER</Text>
        <View style={styles.wordsGrid}>
          {currentLevel.targetWords.map((word, idx) => {
            const isFound = foundWords.includes(word);
            const isHinted = hints.includes(word);
            return (
              <View
                key={idx}
                style={[
                  styles.wordCard,
                  isFound && styles.wordCardFound,
                  isHinted && !isFound && styles.wordCardHinted,
                ]}
              >
                <Text
                  style={[
                    styles.wordText,
                    isFound && styles.wordTextFound,
                    isHinted && !isFound && styles.wordTextHinted,
                  ]}
                >
                  {isFound
                    ? word
                    : isHinted
                    ? word[0] + " • ".repeat(word.length - 1)
                    : "• ".repeat(word.length).trim()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Seçilmekte Olan Kelime Göstergesi */}
      <View style={styles.currentWordContainer}>
        <Text style={styles.currentWordText}>
          {currentFormedWord || "Harfleri Seçin"}
        </Text>
      </View>

      {/* Dairesel Harf Seçim Çarkı */}
      <View style={styles.wheelWrapper}>
        <View style={styles.wheel}>
          {currentLevel.letters.map((letter, index) => {
            const angle =
              (index * (2 * Math.PI)) / currentLevel.letters.length - Math.PI / 2;
            const x = CENTER + RADIUS * Math.cos(angle);
            const y = CENTER + RADIUS * Math.sin(angle);
            const isSelected = selectedIndices.includes(index);

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.6}
                onPress={() => handleLetterPress(index)}
                style={[
                  styles.letterButton,
                  {
                    left: x - 26,
                    top: y - 26,
                  },
                  isSelected && styles.letterButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.letterText,
                    isSelected && styles.letterTextSelected,
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Kontrol ve Aksiyon Butonları */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleClear}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={22} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>KONTROL ET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleUseHint}
          activeOpacity={0.8}
        >
          <Ionicons name="bulb-outline" size={22} color="#EAB308" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  levelBadge: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  levelText: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 14,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  scoreText: {
    color: "#EAB308",
    fontWeight: "800",
    fontSize: 15,
  },
  puzzleArea: {
    marginTop: 10,
    alignItems: "center",
  },
  puzzleTitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  wordsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  wordCard: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  wordCardFound: {
    backgroundColor: "#1E293B",
    borderColor: "#EAB308",
  },
  wordCardHinted: {
    borderColor: "#38BDF8",
  },
  wordText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 2,
  },
  wordTextFound: {
    color: "#EAB308",
  },
  wordTextHinted: {
    color: "#38BDF8",
  },
  currentWordContainer: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  currentWordText: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 4,
  },
  wheelWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: "#0F172A",
    borderWidth: 2,
    borderColor: "#1E293B",
    position: "relative",
  },
  letterButton: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  letterButtonSelected: {
    backgroundColor: "#EAB308",
    borderColor: "#FACC15",
  },
  letterText: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
  },
  letterTextSelected: {
    color: "#020617",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  submitButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EAB308",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#020617",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1,
  },
});