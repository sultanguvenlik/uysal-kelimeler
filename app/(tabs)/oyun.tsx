import React, { useEffect, useState } from "react";
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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { GAME_LEVELS, GAME_CATEGORIES, LevelData } from "../../constants/levels";

// Firebase Servisleri
import { doc, setDoc, increment, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";

const { width } = Dimensions.get("window");
const WHEEL_SIZE = Math.min(width * 0.65, 260);
const BUTTON_SIZE = 48;
const RADIUS = WHEEL_SIZE / 2 - BUTTON_SIZE / 2 - 12;

export default function OyunEkrani() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tüm Kategoriler");
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  // Kategoriye Göre Seviye Filtreleme
  const filteredLevels =
    selectedCategory === "Tüm Kategoriler"
      ? GAME_LEVELS
      : GAME_LEVELS.filter((lvl) => lvl.category === selectedCategory);

  const activeLevels = filteredLevels.length > 0 ? filteredLevels : GAME_LEVELS;
  const currentLevelData: LevelData =
    activeLevels[currentLevelIndex] || activeLevels[0];

  const [shuffledLetters, setShuffledLetters] = useState<string[]>(
    currentLevelData.letters
  );
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [score, setScore] = useState(1000);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [revealedHints, setRevealedHints] = useState<Record<string, number[]>>({});

  useEffect(() => {
    setShuffledLetters(currentLevelData.letters);
    setSelectedIndexes([]);
    setFoundWords([]);
    setRevealedHints({});
  }, [currentLevelIndex, selectedCategory]);

  const currentWord = selectedIndexes
    .map((i) => shuffledLetters[i])
    .join("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setScore(docSnap.data().coins ?? 1000);
          }
        });
        return () => unsubscribeDoc();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const syncProgressToFirestore = async (addedCoins: number, nextLevelNum: number) => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userDocRef,
        {
          coins: increment(addedCoins),
          currentLevel: nextLevelNum,
        },
        { merge: true }
      );
    } catch (error) {
      console.log("Firestore Senkronizasyon Hatası:", error);
    }
  };

  // Harfleri Karıştırma Mantığı
  const handleShuffleLetters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const shuffled = [...shuffledLetters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setSelectedIndexes([]);
  };

  // Seçili Harfleri Temizleme
  const handleClearSelection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIndexes([]);
  };

  // İpucu Kullanma Mantığı (Otomatik Bölüm Bitti Kontrollü)
  const handleUseHint = () => {
    const HINT_COST = 50;

    if (score < HINT_COST) {
      Alert.alert(
        "Yetersiz Altın!",
        "İpucu almak için en az 50 altınınız olmalıdır."
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const uncompleteWords = currentLevelData.targetWords.filter(
      (w) => !foundWords.includes(w)
    );

    if (uncompleteWords.length === 0) {
      Alert.alert("Tebrikler!", "Bu bölümdeki tüm kelimeler tamamlandı!");
      return;
    }

    let targetWord = "";
    let charIdxToOpen = -1;

    for (const word of uncompleteWords) {
      const opened = revealedHints[word] || [];
      if (opened.length < word.length) {
        for (let i = 0; i < word.length; i++) {
          if (!opened.includes(i)) {
            targetWord = word;
            charIdxToOpen = i;
            break;
          }
        }
      }
      if (targetWord) break;
    }

    if (targetWord && charIdxToOpen !== -1) {
      const openedList = [...(revealedHints[targetWord] || []), charIdxToOpen];
      const updatedHints = { ...revealedHints, [targetWord]: openedList };
      setRevealedHints(updatedHints);

      // İpucu ile KELİME TAMAMLANDI MI?
      let updatedFound = [...foundWords];
      if (openedList.length === targetWord.length) {
        updatedFound = [...foundWords, targetWord];
        setFoundWords(updatedFound);
      }

      // Bölüm Bitti mi?
      if (updatedFound.length === currentLevelData.targetWords.length) {
        const nextLevelNumber = currentLevelData.id + 1;
        syncProgressToFirestore(-HINT_COST + 100, nextLevelNumber);

        Alert.alert(
          "Bölüm Tamamlandı! 🎉",
          `Tebrikler Abdullah! Bölüm ${currentLevelData.id} bitti, +100 Bonus Altın kazandınız!`,
          [
            {
              text: "Sonraki Bölüme Geç",
              onPress: () => {
                if (currentLevelIndex + 1 < activeLevels.length) {
                  setCurrentLevelIndex((prev) => prev + 1);
                } else {
                  Alert.alert("Tebrikler!", "Kategorideki tüm bölümleri bitirdiniz!");
                }
              },
            },
          ]
        );
      } else {
        syncProgressToFirestore(-HINT_COST, currentLevelData.id);
      }
    }
  };

  const handleLetterPress = (index: number) => {
    Haptics.selectionAsync();
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleCheck = () => {
    if (!currentWord) return;

    if (currentLevelData.targetWords.includes(currentWord)) {
      if (!foundWords.includes(currentWord)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const updatedFound = [...foundWords, currentWord];
        setFoundWords(updatedFound);
        const rewardCoins = currentWord.length * 10;

        if (updatedFound.length === currentLevelData.targetWords.length) {
          const nextLevelNumber = currentLevelData.id + 1;
          syncProgressToFirestore(rewardCoins + 100, nextLevelNumber);

          Alert.alert(
            "Bölüm Tamamlandı! 🎉",
            `Tebrikler Abdullah! Bölüm ${currentLevelData.id} bitti, +100 Bonus Altın kazandınız!`,
            [
              {
                text: "Sonraki Bölüme Geç",
                onPress: () => {
                  if (currentLevelIndex + 1 < activeLevels.length) {
                    setCurrentLevelIndex((prev) => prev + 1);
                  } else {
                    Alert.alert("Efsane!", "Bu kategorideki tüm bölümleri başardınız!");
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Hata ❌", "Geçersiz kelime.");
      setSelectedIndexes([]);
    }
  };

  const renderWordSlotText = (word: string) => {
    const isFound = foundWords.includes(word);
    if (isFound) return word;

    const hints = revealedHints[word] || [];
    return word
      .split("")
      .map((char, index) => (hints.includes(index) ? char : "•"))
      .join(" ");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar & Skor */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Bölüm {currentLevelData.id} ({currentLevelData.category})
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Ionicons name="flash" size={16} color="#EAB308" />
          <Text style={styles.scoreText}>{score.toLocaleString()}</Text>
        </View>
      </View>

      {/* Kategori Seçim Bandı */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {GAME_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bulunacak Kelimeler Izgarası (Ferah Üst Alan) */}
      <ScrollView contentContainerStyle={styles.wordsContainer}>
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
      </ScrollView>

      {/* Alt Bölüm: Çark ve Aksiyon Butonları (Aşağıya Sabitlendi) */}
      <View style={styles.bottomSection}>
        {/* Anlık Seçilen Kelime */}
        <View style={styles.currentWordContainer}>
          <Text style={styles.currentWordTitle}>
            {currentWord ? currentWord : "Harfleri Seçin"}
          </Text>
        </View>

        {/* Dairesel Çark */}
        <View style={styles.wheelArea}>
          <View style={styles.wheelCircle}>
            {shuffledLetters.map((letter, index) => {
              const angle =
                (index * (360 / shuffledLetters.length) - 90) * (Math.PI / 180);
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

        {/* Alt Aksiyon Butonları (Karıştır - Kontrol Et - Sil - İpucu) */}
        <View style={styles.bottomBar}>
          {/* Karıştır */}
          <TouchableOpacity
            style={styles.iconCircleBtn}
            activeOpacity={0.8}
            onPress={handleShuffleLetters}
          >
            <Ionicons name="shuffle-sharp" size={22} color="#38BDF8" />
          </TouchableOpacity>

          {/* Temizle/Sil */}
          <TouchableOpacity
            style={styles.iconCircleBtn}
            activeOpacity={0.8}
            onPress={handleClearSelection}
          >
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>

          {/* Kontrol Et */}
          <TouchableOpacity
            style={styles.mainActionBtn}
            activeOpacity={0.85}
            onPress={handleCheck}
          >
            <Text style={styles.mainActionBtnText}>KONTROL ET</Text>
          </TouchableOpacity>

          {/* İpucu */}
          <TouchableOpacity
            style={styles.iconCircleBtn}
            activeOpacity={0.8}
            onPress={handleUseHint}
          >
            <Ionicons name="bulb-outline" size={22} color="#EAB308" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 20 : 0,
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
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  badgeText: {
    color: "#F8FAFC",
    fontWeight: "800",
    fontSize: 12,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0F172A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  scoreText: {
    color: "#EAB308",
    fontWeight: "900",
    fontSize: 14,
  },
  categoryBar: {
    paddingHorizontal: 15,
    marginVertical: 6,
  },
  categoryChip: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  categoryChipActive: {
    backgroundColor: "#EAB308",
    borderColor: "#EAB308",
  },
  categoryText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
  },
  categoryTextActive: {
    color: "#020617",
    fontWeight: "900",
  },
  wordsContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
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
    minWidth: 68,
    height: 40,
    backgroundColor: "#0F172A",
    borderRadius: 12,
    alignItems: "center",
    justify: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingHorizontal: 10,
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
    fontSize: 13,
    letterSpacing: 1,
  },
  wordSlotHintedText: {
    color: "#38BDF8",
  },
  bottomSection: {
    justify: "flex-end",
    paddingBottom: 15,
  },
  currentWordContainer: {
    alignItems: "center",
    height: 32,
    justify: "center",
  },
  currentWordTitle: {
    color: "#F8FAFC",
    fontSize: 20,
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
    fontSize: 18,
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
    gap: 8,
  },
  iconCircleBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justify: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  mainActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EAB308",
    alignItems: "center",
    justify: "center",
  },
  mainActionBtnText: {
    color: "#020617",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
});