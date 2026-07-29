import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  score: number;
  isCurrentUser?: boolean;
}

export default function SkorEkrani() {
  const [filter, setFilter] = useState<"haftalik" | "genel">("haftalik");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Firestore Realtime Listener (Canlı Veri Dinleyici)
    // "scores" koleksiyonundan skora göre büyükten küçüğe ilk 20 kişiyi çeker
    const scoresRef = collection(db, "scores");
    const q = query(scoresRef, orderBy("score", "desc"), limit(20));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const users: LeaderboardUser[] = snapshot.docs.map((doc, index) => {
          const data = doc.data();
          return {
            id: doc.id,
            rank: index + 1,
            name: data.name || "İsimsiz Oyuncu",
            score: data.score || 0,
            isCurrentUser: data.name === "Abdullah", // Test amaçlı
          };
        });

        setLeaderboardData(users);
        setLoading(false);
      },
      (error) => {
        console.log("Firebase Veri Çekme Hatası:", error);
        setLoading(false);
      }
    );

    // Component unmount olduğunda dinleyiciyi kapatır (Memory Leak önleme)
    return () => unsubscribe();
  }, [filter]);

  const renderItem = ({ item }: { item: LeaderboardUser }) => {
    let rankColor = "#64748B";
    let badgeIcon = null;

    if (item.rank === 1) {
      rankColor = "#EAB308";
      badgeIcon = "trophy";
    } else if (item.rank === 2) {
      rankColor = "#94A3B8";
      badgeIcon = "medal";
    } else if (item.rank === 3) {
      rankColor = "#B45309";
      badgeIcon = "ribbon";
    }

    return (
      <View
        style={[
          styles.rankCard,
          item.isCurrentUser && styles.currentUserRankCard,
        ]}
      >
        <View style={styles.rankLeft}>
          <View style={styles.rankBadge}>
            {badgeIcon ? (
              <Ionicons name={badgeIcon as any} size={20} color={rankColor} />
            ) : (
              <Text style={styles.rankNumberText}>{item.rank}</Text>
            )}
          </View>
          <Text
            style={[
              styles.userNameText,
              item.isCurrentUser && styles.currentUserNameText,
            ]}
          >
            {item.name} {item.isCurrentUser && "(Siz)"}
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Ionicons name="flash" size={14} color="#EAB308" />
          <Text style={styles.scoreValueText}>{item.score}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Liderlik Tablosu</Text>
        <Text style={styles.headerSubtitle}>En yüksek skora sahip oyuncular</Text>
      </View>

      {/* Tab Filtreleri */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "haftalik" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("haftalik")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterText,
              filter === "haftalik" && styles.filterTextActive,
            ]}
          >
            Haftalık
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "genel" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("genel")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterText,
              filter === "genel" && styles.filterTextActive,
            ]}
          >
            Tüm Zamanlar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Yükleniyor Göstergesi veya Liste */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EAB308" />
        </View>
      ) : (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz kayıtlı skor bulunmuyor.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: "#1E293B",
  },
  filterText: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 14,
  },
  filterTextActive: {
    color: "#EAB308",
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
    gap: 10,
  },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  rankCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0F172A",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  currentUserRankCard: {
    borderColor: "#EAB308",
    backgroundColor: "#1E293B",
  },
  rankLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  rankNumberText: {
    color: "#94A3B8",
    fontWeight: "700",
    fontSize: 14,
  },
  userNameText: {
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: 15,
  },
  currentUserNameText: {
    color: "#EAB308",
    fontWeight: "700",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreValueText: {
    color: "#EAB308",
    fontWeight: "700",
    fontSize: 13,
  },
});