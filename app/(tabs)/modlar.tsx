import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GameMode {
  id: string;
  title: string;
  description: string;
  rules: string[];
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  unlocked: boolean;
  minLevel?: number;
}

const GAME_MODES: GameMode[] = [
  {
    id: "classic",
    title: "Klasik Seviyeler",
    description: "Sırayla ilerleyen, seviye bazlı standart kelime bulmaca deneyimi.",
    rules: ["Süre sınırı yoktur.", "İpucu kullanımı serbesttir.", "Her kelime altın kazandırır."],
    icon: "play-circle",
    color: "#EAB308",
    unlocked: true,
  },
  {
    id: "time_attack",
    title: "Zamana Karşı Yarış",
    description: "60 saniye içinde bulabildiğin kadar kelime bul, bonus altın kazan!",
    rules: ["Süre 60 saniyedir.", "Hızlı kelimeler ekstra +5 saniye verir.", "Yüksek puan çarpanı aktiftir."],
    icon: "timer-outline",
    color: "#EF4444",
    unlocked: true,
  },
  {
    id: "daily",
    title: "Günlük Bulmaca",
    description: "Her gün yenilenen özel bulmacayı çöz, büyük ödülü kap.",
    rules: ["Günde sadece 1 kez oynanabilir.", "Tamamlandığında +250 Altın verir.", "Her gece 00:00'da yenilenir."],
    icon: "calendar-outline",
    color: "#38BDF8",
    unlocked: true,
  },
  {
    id: "hardcore",
    title: "Efsane Mod (Yakında)",
    description: "İpucu yok, süre sınırı var! Sadece gerçek kelime ustaları için.",
    rules: ["İpucu butonu kapalıdır.", "Hata yapma hakkı 3'tür.", "Açmak için Bölüm 5'e ulaşın."],
    icon: "skull-outline",
    color: "#A855F7",
    unlocked: false,
    minLevel: 5,
  },
];

export default function ModlarEkrani() {
  const [activeModalMode, setActiveModalMode] = useState<GameMode | null>(null);

  const handleCardPress = (mode: GameMode) => {
    if (!mode.unlocked) {
      Alert.alert(
        "Kilitli Mod!",
        `Bu modu açmak için en az Bölüm ${mode.minLevel} seviyesine ulaşmalısınız.`,
        [{ text: "Anladım" }]
      );
      return;
    }
    // Ana menüye kaçışı engellemek için doğrudan iç durum (state) modalı tetiklenir
    setActiveModalMode(mode);
  };

  const handleStartGame = () => {
    if (!activeModalMode) return;

    const modeTitle = activeModalMode.title;
    setActiveModalMode(null);

    if (activeModalMode.id === "classic") {
      Alert.alert("Bilgi", "Klasik mod varsayılan 'Oyun' sekmesinde aktif durumdadır.");
    } else {
      Alert.alert(
        "Mod Hazırlanıyor 🚀",
        `"${modeTitle}" oynanış motoru hazırlanıyor! Çok yakında özel kurallarıyla burada yarışacaksınız.`,
        [{ text: "Tamam" }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="game-controller-outline" size={24} color="#EAB308" />
        <Text style={styles.headerTitle}>OYUN MODLARI</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Farklı oyun modlarını keşfedin, ekstra altınlar ve rozetler kazanın!
        </Text>

        <View style={styles.modesGrid}>
          {GAME_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, !mode.unlocked && styles.lockedCard]}
              activeOpacity={0.8}
              onPress={() => handleCardPress(mode)}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${mode.color}20` }]}>
                  <Ionicons name={mode.icon} size={28} color={mode.color} />
                </View>

                {!mode.unlocked ? (
                  <View style={styles.lockBadge}>
                    <Ionicons name="lock-closed" size={14} color="#94A3B8" />
                    <Text style={styles.lockText}>Bölüm {mode.minLevel}</Text>
                  </View>
                ) : (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeText}>AKTİF</Text>
                  </View>
                )}
              </View>

              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDesc}>{mode.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Moda Özel Detay ve Başlatma Modalı (Stitch UI Dark overlay) */}
      <Modal
        visible={!!activeModalMode}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModalMode(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {activeModalMode && (
              <>
                <View style={[styles.iconBox, { backgroundColor: `${activeModalMode.color}20`, alignSelf: "center" }]}>
                  <Ionicons name={activeModalMode.icon} size={36} color={activeModalMode.color} />
                </View>

                <Text style={styles.modalTitle}>{activeModalMode.title}</Text>
                <Text style={styles.modalDesc}>{activeModalMode.description}</Text>

                <View style={styles.rulesContainer}>
                  <Text style={styles.rulesTitle}>MOD KURALLARI:</Text>
                  {activeModalMode.rules.map((rule, idx) => (
                    <View key={idx} style={styles.ruleRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#EAB308" />
                      <Text style={styles.ruleText}>{rule}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.startBtn} activeOpacity={0.85} onPress={handleStartGame}>
                  <Text style={styles.startBtnText}>MODU BAŞLAT</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveModalMode(null)}>
                  <Text style={styles.closeBtnText}>Kapat</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    justify: "center",
    gap: 10,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#0F172A",
  },
  headerTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modesGrid: {
    gap: 16,
  },
  modeCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  lockedCard: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: "row",
    justify: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justify: "center",
  },
  activeBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  activeText: {
    color: "#22C55E",
    fontSize: 10,
    fontWeight: "900",
  },
  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#020617",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  lockText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
  },
  modeTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  modeDesc: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
  },
  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  modalTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 6,
  },
  modalDesc: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  rulesContainer: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 20,
    gap: 10,
  },
  rulesTitle: {
    color: "#EAB308",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 4,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ruleText: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "600",
  },
  startBtn: {
    backgroundColor: "#EAB308",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justify: "center",
    marginBottom: 10,
  },
  startBtnText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 1,
  },
  closeBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  closeBtnText: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 14,
  },
});