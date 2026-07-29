import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfilEkrani() {
  const [playerName, setPlayerName] = useState("Abdullah");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  // Oyun Ayarları Durumu
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Oyuncu İstatistikleri (Dinamik/Mock Data)
  const userStats = {
    level: 4,
    currentXP: 750,
    nextLevelXP: 1000,
    totalCoins: 1250,
    highScore: 450,
    completedLevels: 12,
    totalWordsFound: 84,
  };

  const xpProgressPercent = (userStats.currentXP / userStats.nextLevelXP) * 100;

  const handleSaveName = () => {
    if (tempName.trim().length < 2) {
      Alert.alert("Hata", "İsim en az 2 karakter olmalıdır.");
      return;
    }
    setPlayerName(tempName.trim());
    setIsEditing(false);
    Alert.alert("Başarılı", "Oyuncu adın güncellendi!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Header */}
      <View style={styles.header}>
        <Ionicons name="person" size={24} color="#EAB308" />
        <Text style={styles.headerTitle}>Oyuncu Profili</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Oyuncu Kartı & Avatar */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {playerName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lvl {userStats.level}</Text>
            </View>
          </View>

          {/* İsim Düzenleme Alanı */}
          {isEditing ? (
            <View style={styles.nameEditRow}>
              <TextInput
                style={styles.nameInput}
                value={tempName}
                onChangeText={setTempName}
                autoFocus
                maxLength={15}
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveName}
              >
                <Ionicons name="checkmark" size={18} color="#020617" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.nameRow}
              onPress={() => {
                setTempName(playerName);
                setIsEditing(true);
              }}
            >
              <Text style={styles.playerName}>{playerName}</Text>
              <Ionicons name="pencil-sharp" size={16} color="#64748B" />
            </TouchableOpacity>
          )}

          <Text style={styles.playerRole}>Kelime Ustası</Text>

          {/* XP İlerleme Çubuğu */}
          <View style={styles.xpContainer}>
            <View style={styles.xpLabelRow}>
              <Text style={styles.xpLabel}>Seviye İlerlemesi</Text>
              <Text style={styles.xpValue}>
                {userStats.currentXP} / {userStats.nextLevelXP} XP
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${xpProgressPercent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* İstatistikler Grid */}
        <Text style={styles.sectionTitle}>İSTATİSTİKLER</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={24} color="#EAB308" />
            <Text style={styles.statValue}>
              {userStats.highScore.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>En Yüksek Skor</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
            <Text style={styles.statValue}>{userStats.completedLevels}</Text>
            <Text style={styles.statLabel}>Bölüm Tamamlandı</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={24} color="#38BDF8" />
            <Text style={styles.statValue}>{userStats.totalWordsFound}</Text>
            <Text style={styles.statLabel}>Bulunan Kelime</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flash-outline" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>
              {userStats.totalCoins.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Toplam Altın</Text>
          </View>
        </View>

        {/* Oyun Ayarları */}
        <Text style={styles.sectionTitle}>OYUN AYARLARI</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high-outline" size={20} color="#94A3B8" />
              <Text style={styles.settingText}>Ses Efektleri</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#1E293B", true: "#EAB308" }}
              thumbColor={soundEnabled ? "#020617" : "#94A3B8"}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="hardware-chip-outline" size={20} color="#94A3B8" />
              <Text style={styles.settingText}>Titreşim Feedback</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: "#1E293B", true: "#EAB308" }}
              thumbColor={vibrationEnabled ? "#020617" : "#94A3B8"}
            />
          </View>
        </View>
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
  profileCard: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justify: "center",
    borderWidth: 2,
    borderColor: "#EAB308",
  },
  avatarText: {
    color: "#EAB308",
    fontSize: 32,
    fontWeight: "900",
  },
  levelBadge: {
    position: "absolute",
    bottom: -4,
    backgroundColor: "#EAB308",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelBadgeText: {
    color: "#020617",
    fontSize: 10,
    fontWeight: "900",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playerName: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
  },
  nameEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameInput: {
    backgroundColor: "#1E293B",
    color: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "700",
    minWidth: 140,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#EAB308",
  },
  saveBtn: {
    backgroundColor: "#EAB308",
    padding: 8,
    borderRadius: 10,
  },
  playerRole: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 16,
  },
  xpContainer: {
    width: "100%",
  },
  xpLabelRow: {
    flexDirection: "row",
    justify: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  xpLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  xpValue: {
    color: "#EAB308",
    fontSize: 12,
    fontWeight: "800",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#1E293B",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#EAB308",
    borderRadius: 4,
  },
  sectionTitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  statValue: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
  },
  statLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  settingsGroup: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: "row",
    justify: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },
});