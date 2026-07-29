import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isLocked: boolean;
  minLevel?: number;
  tag?: string;
}

const GAME_MODES: GameMode[] = [
  {
    id: "classic",
    title: "Klasik Mod",
    description: "Süre sınırı olmadan kendi hızında kelimeleri keşfet.",
    icon: "play-circle",
    color: "#10B981",
    isLocked: false,
    tag: "VARSAYILAN",
  },
  {
    id: "time_attack",
    title: "Zamana Karşı",
    description: "60 saniye içinde en fazla kelimeyi bularak rekor kır!",
    icon: "timer",
    color: "#EF4444",
    isLocked: false,
    tag: "HIZLI OYUN",
  },
  {
    id: "daily_puzzle",
    title: "Günlük Bulmaca",
    description: "Her gün yenilenen özel bulmacayı çöz, bonus altın kazan.",
    icon: "calendar",
    color: "#EAB308",
    isLocked: false,
    tag: "GÜNLÜK BONUS",
  },
  {
    id: "zen_mode",
    title: "Zen Modu",
    description: "Skor ve harf sınırı yok. Sadece rahatlatıcı kelime maratonu.",
    icon: "leaf",
    color: "#38BDF8",
    isLocked: true,
    minLevel: 5,
  },
  {
    id: "hardcore",
    title: "Uzman Modu",
    description: "İpucu ve karıştırıcı yok! Sadece en deneyimli oyuncular için.",
    icon: "skull",
    color: "#A855F7",
    isLocked: true,
    minLevel: 10,
  },
];

export default function ModlarEkrani() {
  const router = useRouter();

  const handleSelectMode = (mode: GameMode) => {
    if (mode.isLocked) {
      Alert.alert(
        "Mod Kilitli 🔒",
        `Bu modu açmak için Bölüm ${mode.minLevel} seviyesine ulaşmalısın.`
      );
      return;
    }

    // Oyun ekranına seçilen mod parametresiyle geçiş yapıyoruz
    router.push({
      pathname: "/(tabs)",
      params: { selectedMode: mode.id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Upper Header */}
      <View style={styles.header}>
        <Ionicons name="game-controller" size={24} color="#EAB308" />
        <Text style={styles.headerTitle}>Oyun Modları</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionSubtitle}>
          Tarzına uygun oyun modunu seç ve hemen oynamaya başla!
        </Text>

        {GAME_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.card, mode.isLocked && styles.cardLocked]}
            activeOpacity={0.85}
            onPress={() => handleSelectMode(mode)}
          >
            {/* Tag / Etiket */}
            {mode.tag && !mode.isLocked && (
              <View style={[styles.tagBadge, { backgroundColor: mode.color + "25" }]}>
                <Text style={[styles.tagText, { color: mode.color }]}>
                  {mode.tag}
                </Text>
              </View>
            )}

            {/* Kilit Bilgisi Etiketi */}
            {mode.isLocked && (
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={12} color="#94A3B8" />
                <Text style={styles.lockBadgeText}>Lvl {mode.minLevel}</Text>
              </View>
            )}

            <View style={styles.cardMain}>
              {/* Sol İkon */}
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: mode.isLocked ? "#1E293B" : mode.color + "15" },
                ]}
              >
                <Ionicons
                  name={mode.isLocked ? "lock-closed" : mode.icon}
                  size={32}
                  color={mode.isLocked ? "#64748B" : mode.color}
                />
              </View>

              {/* Detay Bilgileri */}
              <View style={styles.infoBox}>
                <Text style={[styles.modeTitle, mode.isLocked && styles.lockedText]}>
                  {mode.title}
                </Text>
                <Text style={styles.modeDesc}>{mode.description}</Text>
              </View>

              {/* Sağ Ok / Başlat Buton İkonu */}
              {!mode.isLocked && (
                <Ionicons name="chevron-forward" size={22} color="#475569" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionSubtitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
    position: "relative",
    overflow: "hidden",
  },
  cardLocked: {
    opacity: 0.6,
    borderColor: "#0F172A",
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justify: "center",
    marginRight: 16,
  },
  infoBox: {
    flex: 1,
    paddingRight: 8,
  },
  modeTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  lockedText: {
    color: "#94A3B8",
  },
  modeDesc: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
  },
  tagBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  lockBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  lockBadgeText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "800",
  },
});