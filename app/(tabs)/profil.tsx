import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Örnek Aktivite Matrisi Verisi (Son 4 ay)
const MONTHS = ["EYLÜL", "EKİM", "KASIM", "ARALIK"];
const ACTIVITY_GRID = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  level: Math.floor(Math.random() * 4), // 0: yok, 1: düşük, 2: orta, 3: yüksek
}));

export default function ProfilEkrani() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header & Ayarlar Butonu */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Profil</Text>
          <TouchableOpacity style={styles.settingsIconBtn} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={22} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        {/* Profil Kartı & Seviye Rozeti */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarInner}>
              <Ionicons name="moon" size={36} color="#EAB308" />
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>SEVİYE 42</Text>
            </View>
          </View>
          <Text style={styles.userName}>Kelimeler Efendisi</Text>
          <Text style={styles.userSubtitle}>Gece kuşları kulübü üyesi</Text>
        </View>

        {/* Metrik Kartı 1: Toplam Puan */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Ionicons name="star" size={18} color="#EAB308" />
            <Text style={styles.metricTitle}>TOPLAM PUAN</Text>
          </View>
          <Text style={styles.metricMainValue}>128,450</Text>
          <View style={styles.metricTrend}>
            <Ionicons name="trending-up" size={14} color="#22C55E" />
            <Text style={styles.metricTrendText}>Bu hafta +2.4k</Text>
          </View>
        </View>

        {/* Metrik Kartı 2: Bulunan Kelime */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Ionicons name="book-outline" size={18} color="#38BDF8" />
            <Text style={styles.metricTitle}>BULUNAN KELİME</Text>
          </View>
          <Text style={styles.metricMainValue}>3,842</Text>
          <Text style={styles.metricSubInfo}>En uzun kelime: Muvaffakiyet</Text>
        </View>

        {/* Metrik Kartı 3: Seri (Streak) */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeaderBetween}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="flame" size={18} color="#F97316" />
              <Text style={styles.metricTitle}>SERİ</Text>
            </View>
            <Text style={styles.streakHighlight}>14 GÜN</Text>
          </View>
          <View style={styles.streakBarsContainer}>
            {[40, 65, 30, 80, 50, 100, 70].map((height, idx) => (
              <View key={idx} style={styles.streakBarTrack}>
                <View
                  style={[
                    styles.streakBarFill,
                    { height: `${height}%` },
                    idx === 5 && styles.streakBarActive,
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Aktivite Geçmişi (Matrix Matris) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderBetween}>
            <Text style={styles.sectionTitle}>Aktivite Geçmişi</Text>
            <View style={styles.legendContainer}>
              <Text style={styles.legendText}>DÜŞÜK</Text>
              <View style={[styles.legendBox, { backgroundColor: "#1E293B" }]} />
              <View style={[styles.legendBox, { backgroundColor: "#334155" }]} />
              <View style={[styles.legendBox, { backgroundColor: "#0284C7" }]} />
              <View style={[styles.legendBox, { backgroundColor: "#38BDF8" }]} />
              <Text style={styles.legendText}>YÜKSEK</Text>
            </View>
          </View>

          <View style={styles.matrixGrid}>
            {ACTIVITY_GRID.map((item) => {
              let bg = "#1E293B";
              if (item.level === 1) bg = "#334155";
              if (item.level === 2) bg = "#0284C7";
              if (item.level === 3) bg = "#38BDF8";

              return (
                <View
                  key={item.id}
                  style={[styles.matrixCell, { backgroundColor: bg }]}
                />
              );
            })}
          </View>

          <View style={styles.monthsRow}>
            {MONTHS.map((m, idx) => (
              <Text key={idx} style={styles.monthText}>
                {m}
              </Text>
            ))}
          </View>
        </View>

        {/* Başarımlar (Achievements) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Başarımlar</Text>

          <View style={styles.achievementsRow}>
            <View style={styles.achievementItem}>
              <View style={[styles.badgeCircle, styles.badgeGold]}>
                <Ionicons name="ribbon" size={24} color="#020617" />
              </View>
              <Text style={styles.achievementName}>GECE BEKÇİSİ</Text>
            </View>

            <View style={styles.achievementItem}>
              <View style={[styles.badgeCircle, styles.badgeSilver]}>
                <Ionicons name="compass" size={24} color="#020617" />
              </View>
              <Text style={styles.achievementName}>KELİME AVCISI</Text>
            </View>

            <View style={styles.achievementItem}>
              <View style={[styles.badgeCircle, styles.badgeLocked]}>
                <Ionicons name="lock-closed" size={20} color="#64748B" />
              </View>
              <Text style={styles.achievementNameLocked}>KİTAP KURDU</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.showAllBtn} activeOpacity={0.8}>
            <Text style={styles.showAllBtnText}>TÜMÜNÜ GÖR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1120",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  topBarTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
  },
  settingsIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 15,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatarInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1E293B",
    borderWidth: 2,
    borderColor: "#EAB308",
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadge: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: "#EAB308",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: "#020617",
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  userSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  metricCard: {
    backgroundColor: "#161F32",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  metricHeaderBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metricTitle: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  metricMainValue: {
    color: "#EAB308",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  metricTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  metricTrendText: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "600",
  },
  metricSubInfo: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 6,
  },
  streakHighlight: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  streakBarsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 50,
    marginTop: 5,
  },
  streakBarTrack: {
    width: 24,
    height: "100%",
    backgroundColor: "#0F172A",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  streakBarFill: {
    width: "100%",
    backgroundColor: "#334155",
    borderRadius: 6,
  },
  streakBarActive: {
    backgroundColor: "#38BDF8",
  },
  sectionCard: {
    backgroundColor: "#161F32",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  sectionHeaderBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendText: {
    color: "#64748B",
    fontSize: 9,
    fontWeight: "700",
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  matrixGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "space-between",
  },
  matrixCell: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  monthsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 5,
  },
  monthText: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "700",
  },
  achievementsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  achievementItem: {
    alignItems: "center",
    gap: 8,
  },
  badgeCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeGold: {
    backgroundColor: "#EAB308",
  },
  badgeSilver: {
    backgroundColor: "#94A3B8",
  },
  badgeLocked: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  achievementName: {
    color: "#F8FAFC",
    fontSize: 10,
    fontWeight: "700",
  },
  achievementNameLocked: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "700",
  },
  showAllBtn: {
    backgroundColor: "#0F172A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  showAllBtnText: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
  },
});