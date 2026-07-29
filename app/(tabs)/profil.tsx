import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfilEkrani() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Üst Profil Kartı */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#EAB308" />
          </View>
          <Text style={styles.userName}>Abdullah</Text>
          <Text style={styles.userTitle}>Kelime Avcısı</Text>
        </View>

        {/* İstatistikler */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={20} color="#EAB308" />
            <Text style={styles.statValue}>2,100</Text>
            <Text style={styles.statLabel}>Toplam Puan</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-circle-outline" size={20} color="#38BDF8" />
            <Text style={styles.statValue}>14</Text>
            <Text style={styles.statLabel}>Çözülen Bölüm</Text>
          </View>
        </View>

        {/* Ayarlar Listesi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OYUN AYARLARI</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high-outline" size={20} color="#94A3B8" />
              <Text style={styles.settingLabel}>Ses Efektleri</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#1E293B", true: "#EAB308" }}
              thumbColor="#F8FAFC"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="hardware-chip-outline" size={20} color="#94A3B8" />
              <Text style={styles.settingLabel}>Titreşim</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: "#1E293B", true: "#EAB308" }}
              thumbColor="#F8FAFC"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color="#94A3B8" />
              <Text style={styles.settingLabel}>Bildirimler</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#1E293B", true: "#EAB308" }}
              thumbColor="#F8FAFC"
            />
          </View>
        </View>

        {/* Hakkında / Destek */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UYGULAMA</Text>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={20} color="#94A3B8" />
              <Text style={styles.settingLabel}>Hakkında</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#94A3B8" />
              <Text style={styles.settingLabel}>Gizlilik Politikası</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#475569" />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Uysal Kelimeler v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0F172A",
    borderWidth: 2,
    borderColor: "#EAB308",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  userTitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0F172A",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0F172A",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: 14,
  },
  versionText: {
    textAlign: "center",
    color: "#334155",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 30,
  },
});