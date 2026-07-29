import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface GameMode {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string;
  color: string;
}

const GAME_MODES: GameMode[] = [
  {
    id: "time-attack",
    title: "Zamana Karşı",
    subtitle: "Hızlı düşün, süre bitmeden doğru kelimeyi bul.",
    icon: "timer-outline",
    color: "#38BDF8",
  },
  {
    id: "letter-limit",
    title: "Harf Kısıtlı",
    subtitle: "Sadece verilen özel harf kombinasyonlarıyla kelime üret.",
    icon: "text-outline",
    color: "#22C55E",
  },
  {
    id: "categories",
    title: "Kategoriler",
    subtitle: "Doğa, bilim, sanat ve tarih temalı özel kelime setleri.",
    icon: "shapes-outline",
    color: "#EAB308",
  },
];

export default function ModlarEkrani() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuIconBtn} activeOpacity={0.7}>
            <Ionicons name="menu-outline" size={24} color="#F8FAFC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modunu Seç</Text>
          <TouchableOpacity style={styles.settingsIconBtn} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={22} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        {/* Hero Banner (Stitch Sloganı) */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Zihnini dinlendirirken geliştir.</Text>
          <Text style={styles.heroSubtitle}>
            Hangi oyun modunda kelimelerini konuşturmak istersin?
          </Text>
        </View>

        {/* Oyun Modları Listesi */}
        <View style={styles.modesContainer}>
          {GAME_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={styles.modeCard}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBox, { backgroundColor: `${mode.color}15` }]}>
                <Ionicons name={mode.icon} size={26} color={mode.color} />
              </View>

              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#475569" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Günlük Mücadele Kartı (Daily Challenge) */}
        <View style={styles.dailyCard}>
          <View style={styles.dailyBadge}>
            <Ionicons name="sparkles" size={12} color="#EAB308" />
            <Text style={styles.dailyBadgeText}>GÜNLÜK MÜCADELE</Text>
          </View>

          <Text style={styles.dailyTitle}>Yıldızların Altında Kelimeler</Text>
          <Text style={styles.dailySubtitle}>
            Bugünkü özel ödülü ve ekstra altını kazanmak için hemen katıl.
          </Text>

          <TouchableOpacity style={styles.joinBtn} activeOpacity={0.9}>
            <Text style={styles.joinBtnText}>Katıl</Text>
            <Ionicons name="arrow-forward" size={16} color="#020617" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  menuIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  settingsIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#F8FAFC",
    lineHeight: 32,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  modesContainer: {
    gap: 14,
    marginBottom: 24,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
    gap: 14,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  modeSubtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  dailyCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    position: "relative",
  },
  dailyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(234, 179, 8, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  dailyBadgeText: {
    color: "#EAB308",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  dailyTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  dailySubtitle: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EAB308",
    paddingVertical: 12,
    borderRadius: 12,
  },
  joinBtnText: {
    color: "#020617",
    fontWeight: "800",
    fontSize: 14,
  },
});