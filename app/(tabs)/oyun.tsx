import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GAME_LEVELS } from "../../constants/levels";

// Firebase Firestore Servisleri
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const { width } = Dimensions.get("window");
const WHEEL_SIZE = Math.min(width * 0.72, 290);
const BUTTON_SIZE = 52;
const RADIUS = WHEEL_SIZE / 2 - BUTTON_SIZE / 2 - 16;

export default function OyunEkrani() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevelData = GAME_LEVELS[currentLevelIndex];

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [score, setScore] = useState(1150);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  
  // Bulunmamış kelimelerde ipucu ile açılan harflerin indislerini saklar { "KALEM": [0, 1] }
  const [revealedHints, setRevealedHints] = useState<Record<string, number[]>>({});

  const currentWord = selectedIndexes.map((i) => currentLevelData.letters[i]).join("");

  // Firestore Veritabanına Skoru ve Seviyeyi Senkronize Etme
  const syncProgressToFirestore = async (addedCoins: number, nextLevelNum: number) => {
    try {
      const userDocRef = doc(db, "users", "demo_user_id");

      await setDoc(
        userDocRef,
        {
          username: "Abdullah",
          coins: increment(addedCoins),
          currentLevel: nextLevelNum,
        },
        { merge: true }
      );
      console.log("Firestore senkronizasyonu BAŞARILI!");
    } catch (error) {
      console.log("Firestore Senkronizasyon Hatası:", error);
    }
  };

  // İpucu Kullanma Mantığı (Yukarıdaki Kutucukta Harf Açma)
  const handleUseHint = () => {
    const HINT_COST = 50;

    if (score < HINT_COST) {
      Alert.alert(
        "Yetersiz Altın!",
        "İpucu almak için en az 50 altınınız olmalıdır. Market sekmesinden altın bakiyesi ekleyebilirsiniz.",
        [{ text: "Tamam" }]
      );
      return;
    }

    // Henüz bulunmamış kelimeleri filtrele
    const uncompleteWords = currentLevelData.targetWords.filter(
      (w) => !foundWords.includes(w)
    );

    if (uncompleteWords.length === 0) {
      Alert.alert("Tebrikler!", "Bu bölümdeki tüm kelimeler zaten tamamlandı!");
      return;
    }

    // Tamamen açılmamış ilk kelimeyi bul
    let targetWordToHint = "";
    let charIndexToOpen = -1;

    for (const word of uncompleteWords) {
      const openedIndexes = revealedHints[word] || [];
      if (openedIndexes.length < word.length) {
        // Bu kelimede henüz açılmamış ilk harfin indeksini tespit et
        for (let i = 0; i < word.length; i++) {
          if (!openedIndexes.includes(i)) {
            targetWordToHint = word;
            charIndexToOpen = i;
            break;
          }
        }
      }
      if (targetWordToHint) break;
    }

    if (targetWordToHint && charIndexToOpen !== -1) {
      const currentWordHints = revealedHints[targetWordToHint] || [];
      const updatedHints = {
        ...revealedHints,
        [targetWordToHint]: [...currentWordHints, charIndexToOpen],
      };

      setRevealedHints(updatedHints);
      const newScore = score - HINT_COST;
      setScore(newScore);

      // Veritabanından -50 Altın Düş
      syncProgressToFirestore(-HINT_COST, currentLevelData.id);
    } else {
      Alert.alert("Bilgi", "Açılabilecek başka ipucu kalmadı!");
    }
  };

  const handleLetterPress = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleShuffle = () => {
    setSelectedIndexes([]);
  };

  const handleCheck = () => {
    if (!currentWord) return;

    if (currentLevelData.targetWords.includes(currentWord)) {
      if (!foundWords.includes(currentWord)) {
        const updatedFound = [...foundWords, currentWord];
        setFoundWords(updatedFound);
        const rewardCoins = currentWord.length * 10;
        setScore((prev) => prev + rewardCoins);

        // Bölümdeki TÜM kelimeler tamamlandı mı?
        if (updatedFound.length === currentLevelData.targetWords.length) {
          const nextLevelNumber = currentLevelData.id + 1;
          syncProgressToFirestore(rewardCoins + 100, nextLevelNumber);

          Alert.alert(
            "Bölüm Tamamlandı! 🎉",
            `Tebrikler Hazretleri! Bölüm ${currentLevelData.id} bitti, +100 Bonus Altın kazandınız!`,
            [
              {
                text: "Sonraki Bölüme Geç",
                onPress: () => {
                  if (currentLevelIndex + 1 < GAME_LEVELS.length) {
                    setCurrentLevelIndex((prev) => prev + 1);
                    setFoundWords([]);
                    setSelectedIndexes([]);
                    setRevealedHints({});
                  } else {
                    Alert.alert("Efsane!", "Mevcut tüm bölümleri başarıyla bitirdiniz!");
                  }
                },
              },
            ]
          );
        } else {
          syncProgressToFirestore(rewardCoins, currentLevelData.id);
          Alert.alert("Doğru! 👏", `"${currentWord}" kelimesini buldunuz! (+${rewardCoins} Altın)`);
        }
      } else {
        Alert.alert("Bilgi", "Bu kelimeyi zaten buldunuz!");
      }
      setSelectedIndexes([]);
    } else {
      Alert.alert("Hata ❌", "Geçersiz veya listede olmayan kelime.");
      setSelectedIndexes([]);
    }
  };

  // İpucu ve Bulunma durumuna göre kelime harflerini oluşturan render fonksiyonu
  const renderWordSlotText = (word: string) => {
    const isFound = foundWords.includes(word);

    if (isFound) {
      return word;
    }

    const hints = revealedHints[word] || [];
    return word
      .split("")
      .map((char, index) => (hints.includes(index) ? char : "•"))
      .join(" ");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Bölüm {currentLevelData.id}</Text>
        </View>

        <View style={styles.scoreBadge}>
          <Ionicons name="flash" size={16} color="#EAB308" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Bulunan / İpucu Verilen Kelimeler Izgarası */}
      <View style={styles.wordsContainer}>
        <Text style={styles.sectionHeader}>BULUNACAK KELİMELER</Text>
        <View style={styles.wordsGrid}>
          {currentLevelData.targetWords.map((word, idx) => {
            const isFound = foundWords.includes(word);
            const hasHints = (revealedHints[word] || []).length > 0;

            return (
              <View
                key={idx}
                style={[
                  styles.wordSlot,
                  isFound && styles.wordSlotActive,
                  !isFound && hasHints && styles.wordSlotHinted,
                ]}
              >
                <Text
                  style={[
                    styles.wordSlotText,
                    !isFound && hasHints && styles.wordSlotHintedText,
                  ]}
                >
                  {renderWordSlotText(word)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Seçilen Anlık Kelime */}
      <View style={styles.currentWordContainer}>
        <Text style={styles.currentWordTitle}>
          {currentWord ? currentWord : "Harfleri Seçin"}
        </Text>
      </View>

      {/* Dairesel Çark Area */}
      <View style={styles.wheelArea}>
        <View style={styles.wheelCircle}>
          {currentLevelData.letters.map((letter, index) => {
            const angle =
              (index * (360 / currentLevelData.letters.length) - 90) *
              (Math.PI / 180);
            const left =
              WHEEL_SIZE / 2 + RADIUS * Math.cos(angle) - BUTTON_SIZE / 2;
            const top =
              WHEEL_SIZE / 2 + RADIUS * Math.sin(angle) - BUTTON_SIZE / 2;
            const isSelected = selectedIndexes.includes(index);

            return (
              <TouchableOpacity
                key={`letter-${index}`}
                style={[
                  styles.letterButton,
                  { left, top },
                  isSelected && styles.letterButtonSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => handleLetterPress(index)}
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

      {/* Alt Aksiyon Butonları */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.iconCircleBtn}
          activeOpacity={0.8}
          onPress={handleShuffle}
        >
          <Ionicons name="refresh" size={22} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainActionBtn}
          activeOpacity={0.85}
          onPress={handleCheck}
        >
          <Text style={styles.mainActionBtnText}>KONTROL ET</Text>
        </TouchableOpacity>

        {/* İpucu Alma Butonu (50 Altın) */}
        <TouchableOpacity
          style={styles.iconCircleBtn}
          activeOpacity={0.8}
          onPress={handleUseHint}
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 20 : 0,
    justify: "space-between",
  },
  header: {
    flexDirection: "row",
    justify: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  badge: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  badgeText: {
    color: "#F8FAFC",
    fontWeight: "800",
    fontSize: 13,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0F172A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  scoreText: {
    color: "#EAB308",
    fontWeight: "900",
    fontSize: 15,
  },
  wordsContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sectionHeader: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  wordsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justify: "center",
    gap: 8,
  },
  wordSlot: {
    minWidth: 70,
    height: 42,
    backgroundColor: "#0F172A",
    borderRadius: 12,
    alignItems: "center",
    justify: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingHorizontal: 12,
  },
  wordSlotActive: {
    borderColor: "#EAB308",
    backgroundColor: "rgba(234, 179, 8, 0.15)",
  },
  wordSlotHinted: {
    borderColor: "#38BDF8",
    backgroundColor: "rgba(56, 189, 248, 0.1)",
  },
  wordSlotText: {
    color: "#EAB308",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
  wordSlotHintedText: {
    color: "#38BDF8",
  },
  currentWordContainer: {
    alignItems: "center",
    height: 36,
    justify: "center",
  },
  currentWordTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
  },
  wheelArea: {
    alignItems: "center",
    justify: "center",
    marginVertical: 10,
  },
  wheelCircle: {
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
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "#EAB308",
    alignItems: "center",
    justify: "center",
    elevation: 4,
  },
  letterButtonSelected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#EAB308",
  },
  letterText: {
    color: "#020617",
    fontSize: 20,
    fontWeight: "900",
  },
  letterTextSelected: {
    color: "#020617",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justify: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  iconCircleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justify: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  mainActionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EAB308",
    alignItems: "center",
    justify: "center",
  },
  mainActionBtnText: {
    color: "#020617",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },
});