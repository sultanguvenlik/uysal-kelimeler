import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Firebase Firestore Servisleri
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface UserLeaderboard {
  id: string;
  username: string;
  coins: number;
  currentLevel: number;
}

export default function SkorEkrani() {
  const [leaderboard, setLeaderboard] = useState<UserLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firestore "users" koleksiyonunu altından yükseğe doğru sırala ve ilk 10 kişiyi çek
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("coins", "desc"), limit(10));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const usersData: UserLeaderboard[] = [];
        snapshot.forEach((doc) => {
          usersData.push({
            id: doc.id,
            username: doc.data().username || "Oyuncu",
            coins: doc.data().coins || 0,
            currentLevel: doc.data().currentLevel || 1,
          });
        });
        setLeaderboard(usersData);
        setLoading(false);
      },
      (error) => {
        console.log("Liderlik tablosu çekme hatası:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const renderRankBadge = (rank: number) => {
    if (rank === 1) return <Ionicons name="trophy" size={22} color="#EAB308" />;
    if (rank === 2) return <Ionicons name="trophy" size={20} color="#94A3B8" />;
    if (rank === 3) return <Ionicons name="trophy" size={20} color="#B45309" />;
    return <Text style={styles.rankText}>#{rank}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="trophy-outline" size={26} color="#EAB308" />
        <Text style={styles.headerTitle}>LİDERLİK TABLOSU</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EAB308" />
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;

            return (
              <View
                style={[
                  styles.card,
                  isTopThree && styles.topThreeCard,
                  rank === 1 && styles.firstPlaceCard,
                ]}
              >
                <View style={styles.leftSection}>
                  <View style={styles.rankBadgeContainer}>{renderRankBadge(rank)}</View>
                  <View>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.levelInfo}>Bölüm {item.currentLevel}</Text>
                  </View>
                </View>

                <View style={styles.coinsBadge}>
                  <Ionicons name="flash" size={14} color="#EAB308" />
                  <Text style={styles.coinsText}>{item.coins.toLocaleString()}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justify: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 20,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justify: "space-between",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  topThreeCard: {
    borderColor: "rgba(234, 179, 8, 0.4)",
  },
  firstPlaceCard: {
    borderColor: "#EAB308",
    backgroundColor: "rgba(234, 179, 8, 0.08)",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  rankBadgeContainer: {
    width: 32,
    alignItems: "center",
    justify: "center",
  },
  rankText: {
    color: "#64748B",
    fontWeight: "800",
    fontSize: 15,
  },
  username: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "800",
  },
  levelInfo: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  coinsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#020617",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  coinsText: {
    color: "#EAB308",
    fontWeight: "900",
    fontSize: 14,
  },
});