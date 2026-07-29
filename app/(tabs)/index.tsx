import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Firebase Firestore Bağlantısı
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface UserProfile {
  username: string;
  coins: number;
  currentLevel: number;
}

export default function AnaMenuEkrani() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>({
    username: "Abdullah",
    coins: 1250,
    currentLevel: 25,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userDocRef = doc(db, "users", "demo_user_id");

    // Canlı Veri Dinleyicisi
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            username: data.username || "Abdullah",
            coins: data.coins ?? 1250,
            currentLevel: data.currentLevel ?? 25,
          });
        } else {
          // Doküman yoksa varsayılan veriyi Firestore'a ilk kez yaz
          setDoc(userDocRef, {
            username: "Abdullah",
            coins: 1250,
            currentLevel: 25,
          });
        }
        setLoading(false);
      },
      (error) => {
        console.log("Firestore Dinleme Hatası:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Header: Profil Özeti */}
      <View style={styles.header}>
        <View style={styles.userGreeting}>
          <Text style={styles.greetingSub}>HOŞ GELDİN</Text>
          <Text style={styles.greetingName}>{profile.username} 👋</Text>
        </View>

        <View style={styles.coinBadge}>
          <Ionicons name="flash" size={18} color="#EAB308" />
          <Text style={styles.coinText}>
            {loading ? "..." : profile.coins.toLocaleString()}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ana Hero Başlığı */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Zihnini dinlendirirken geliştir.</Text>
          <Text style={styles.heroSubtitle}>
            Hangi oyun modunda kelimelerini konuşturmak istersin?
          </Text>
        </View>

        {/* Hızlı Oyuna Başla (Büyük Karşılama Kartı) */}
        <TouchableOpacity
          style={styles.playCard}
          activeOpacity={0.88}
          onPress={() => router.push("/(tabs)/oyun")}
        >
          <View style={styles.playCardContent}>
            <View style={styles.playBadge}>
              <Text style={styles.playBadgeText}>Maceraya Devam Et</Text>
            </View>
            <Text style={styles.playCardTitle}>
              Bölüm {profile.currentLevel}
            </Text>
            <Text style={styles.playCardSub}>
              Kaldığın yerden hemen oynamaya başla!
            </Text>

            <View style={styles.playCardBtn}>
              <Text style={styles.playCardBtnText}>OYUNA BAŞLA</Text>
              <Ionicons name="arrow-forward" size={18} color="#020617" />
            </View>
          </View>
          <Ionicons
            name="game-controller-sharp"
            size={100}
            color="rgba(234, 179, 8, 0.15)"
            style={styles.cardBgIcon}
          />
        </TouchableOpacity>

        {/* Günlük Mücadele Banner */}
        <View style={styles.dailyCard}>
          <View style={styles.dailyHeader}>
            <Ionicons name="sparkles" size={20} color="#EAB308" />
            <Text style={styles.dailyBadgeText}>GÜNLÜK MÜCADELE</Text>
          </View>
          <Text style={styles.dailyTitle}>Yıldızların Altında Kelimeler</Text>
          <Text style={styles.dailySub}>
            Bugünkü özel ödülü ve ekstra altını kazanmak için hemen katıl.
          </Text>

          <TouchableOpacity
            style={styles.dailyBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/(tabs)/oyun")}
          >
            <Text style={styles.dailyBtnText}>Katıl</Text>
            <Ionicons name="arrow-forward" size={16} color="#020617" />
          </TouchableOpacity>
        </View>

        {/* Hızlı Erişim Menü Kartları */}
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridCard}
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/modlar")}
          >
            <View
              style={[
                styles.gridIconBox,
                { backgroundColor: "rgba(56, 189, 248, 0.15)" },
              ]}
            >
              <Ionicons name="apps-sharp" size={24} color="#38BDF8" />
            </View>
            <Text style={styles.gridCardTitle}>Oyun Modları</Text>
            <Text style={styles.gridCardSub}>Zamana karşı & Zen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/skor")}
          >
            <View
              style={[
                styles.gridIconBox,
                { backgroundColor: "rgba(234, 179, 8, 0.15)" },
              ]}
            >
              <Ionicons name="trophy-sharp" size={24} color="#EAB308" />
            </View>
            <Text style={styles.gridCardTitle}>Liderlik</Text>
            <Text style={styles.gridCardSub}>En yüksek skorlar</Text>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 20 : 0,
  },
  header: {
    flexDirection: "row",
    justify: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  userGreeting: {
    gap: 2,
  },
  greetingSub: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  greetingName: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
  },
  coinBadge: {
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
  coinText: {
    color: "#EAB308",
    fontWeight: "900",
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  heroTitle: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 32,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#94A3B8",
    fontSize: 14,
  },
  playCard: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EAB308",
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  playCardContent: {
    zIndex: 2,
  },
  playBadge: {
    backgroundColor: "rgba(234, 179, 8, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  playBadgeText: {
    color: "#EAB308",
    fontSize: 11,
    fontWeight: "800",
  },
  playCardTitle: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "900",
  },
  playCardSub: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  playCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EAB308",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    alignSelf: "flex-start",
  },
  playCardBtnText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 14,
  },
  cardBgIcon: {
    position: "absolute",
    right: -10,
    bottom: -10,
    zIndex: 1,
  },
  dailyCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 20,
  },
  dailyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  dailyBadgeText: {
    color: "#EAB308",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  dailyTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  dailySub: {
    color: "#64748B",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  dailyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justify: "center",
    gap: 6,
    backgroundColor: "#EAB308",
    paddingVertical: 10,
    borderRadius: 12,
  },
  dailyBtnText: {
    color: "#020617",
    fontWeight: "800",
    fontSize: 14,
  },
  gridContainer: {
    flexDirection: "row",
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  gridIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justify: "center",
    marginBottom: 12,
  },
  gridCardTitle: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "800",
  },
  gridCardSub: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },
});