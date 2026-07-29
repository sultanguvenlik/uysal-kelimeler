import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Cihaz ekran genişliği
const { width } = Dimensions.get("window");

export default function AnaMenuEkrani() {
  return (
    <SafeAreaView style={styles.container}>
      {/* React Native Öz (Native) StatusBar Kullanımı */}
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* Üst Bilgi Barı */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profileBadge}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeSubtitle}>Hoş Geldiniz</Text>
            <Text style={styles.welcomeTitle}>Uysal Kelimeler</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.scoreBadge} activeOpacity={0.8}>
          <Ionicons name="flash" size={18} color="#EAB308" />
          <Text style={styles.scoreText}>1,250</Text>
        </TouchableOpacity>
      </View>

      {/* Ana Orta Alan (Stitch İlhamlı Görsel) */}
      <View style={styles.mainContent}>
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <Ionicons name="book" size={80} color="#EAB308" />
          </View>
          {/* Logo altı parlama efekti */}
          <View style={styles.logoGlow} />
        </View>

        <Text style={styles.title}>Uysal Kelimeler</Text>
        <Text style={styles.description}>
          Gecenin sessizliğinde zihnini dinlendir, kelimelerin huzuruna yolculuk et.
        </Text>
      </View>

      {/* Oyuna Başla Butonu */}
      <TouchableOpacity style={styles.startButton} activeOpacity={0.9}>
        <Ionicons name="play" size={24} color="#020617" style={{ marginRight: 8 }} />
        <Text style={styles.startButtonText}>Oyuna Başla</Text>
      </TouchableOpacity>

      {/* Aile Skor Tablosu Ön İzleme Kartı */}
      <View style={styles.scorePreviewCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="people" size={20} color="#EAB308" />
          <Text style={styles.cardTitle}>Aile Skor Tablosu</Text>
          <Ionicons name="chevron-forward" size={18} color="#475569" style={{ marginLeft: "auto" }} />
        </View>

        {/* Skor Listesi */}
        <View style={styles.cardBody}>
          {[
            { rank: 1, name: "Zeynep", score: 1240 },
            { rank: 2, name: "Can", score: 980 },
            { rank: 3, name: "Elif", score: 850 },
          ].map((user, idx) => (
            <View key={idx} style={styles.scoreRow}>
              <Text style={[styles.scoreRank, user.rank === 1 && { color: "#EAB308" }]}>
                {user.rank}
              </Text>
              <Text style={styles.scoreName}>{user.name}</Text>
              <Text style={styles.scoreValue}>{user.score} p</Text>
            </View>
          ))}
        </View>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E293B",
    borderWidth: 2,
    borderColor: "#EAB308",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeTextContainer: {
    justifyContent: "center",
  },
  welcomeSubtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  welcomeTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreText: {
    color: "#EAB308",
    fontWeight: "800",
    fontSize: 15,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  logoWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#0F172A",
    borderWidth: 3,
    borderColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(234, 179, 8, 0.3)",
    transform: [{ scale: 1.15 }],
    opacity: 0.4,
    zIndex: -1,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  description: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: width * 0.1,
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#EAB308",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#FACC15",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  startButtonText: {
    color: "#020617",
    fontWeight: "800",
    fontSize: 18,
  },
  scorePreviewCard: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    paddingBottom: 12,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },
  cardBody: {
    gap: 10,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreRank: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 14,
    width: 20,
  },
  scoreName: {
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: 15,
  },
  scoreValue: {
    color: "#94A3B8",
    fontWeight: "700",
    fontSize: 13,
  },
});