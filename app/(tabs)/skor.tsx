import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

interface ScoreItem {
  id: string;
  name: string;
  score: number;
  level: number;
}

export default function SkorEkrani() {
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Firestore'dan skorları çekiyoruz
    const q = query(
      collection(db, "scores"),
      orderBy("score", "desc"),
      limit(50) // Her kullanıcının en yüksek skorunu süzebilmek için havuzu geniş tutuyoruz
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rawScores: ScoreItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Gizli Oyuncu",
          score: doc.data().score || 0,
          level: doc.data().level || 1,
        }));

        // Mükerrer Kayıt Engelleme: Her oyuncunun SADECE en yüksek skorunu filtreliyoruz
        const uniqueScoresMap = rawScores.reduce<Record<string, ScoreItem>>((acc, item) => {
          if (!acc[item.name] || acc[item.name].score < item.score) {
            acc[item.name] = item;
          }
          return acc;
        }, {});

        // Objeden diziye çevirip skora göre tekrar sıralıyoruz ve İlk 10'u alıyoruz
        const sortedUniqueScores = Object.values(uniqueScoresMap)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

        setScores(sortedUniqueScores);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error("Firestore skor çekme hatası:", error);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "#EAB308"; // 1. Altın
      case 1:
        return "#94A3B8"; // 2. Gümüş
      case 2:
        return "#B45309"; // 3. Bronz
      default:
        return "#1E293B"; // Diğerleri
    }
  };

  const renderScoreCard = ({ item, index }: { item: ScoreItem; index: number }) => {
    const isTopThree = index < 3;
    const badgeColor = getRankBadgeColor(index);

    return (
      <View style={[styles.card, isTopThree && styles.cardTopThree]}>
        <View style={[styles.rankBadge, { backgroundColor: badgeColor }]}>
          {index === 0 ? (
            <Ionicons name="trophy" size={16} color="#020617" />
          ) : (
            <Text
              style={[
                styles.rankBadgeText,
                isTopThree && { color: "#020617" },
              ]}
            >
              #{index + 1}
            </Text>
          )}
        </View>

        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerLevel}>Bölüm {item.level}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Ionicons name="flash" size={16} color="#EAB308" />
          <Text style={styles.scoreText}>{item.score.toLocaleString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Header - Android StatusBar Çakışması Engellendi */}
      <View style={styles.header}>
        <Ionicons name="trophy" size={24} color="#EAB308" />
        <Text style={styles.headerTitle}>Liderlik Tablosu</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EAB308" />
          <Text style={styles.loadingText}>Skorlar Yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item) => item.id}
          renderItem={renderScoreCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
              tintColor="#EAB308"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="podium-outline" size={48} color="#475569" />
              <Text style={styles.emptyText}>Henüz kayıtlı skor yok.</Text>
              <Text style={styles.emptySubText}>
                İlk skoru sen kaydetmek için oyunu oyna!
              </Text>
            </View>
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
    // Android cihazlarda üst çentik/sistem çubuğu taşmasını önler
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
  loadingContainer: {
    flex: 1,
    justify: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  cardTopThree: {
    borderColor: "#334155",
    backgroundColor: "#1E293B",
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justify: "center",
    marginRight: 14,
  },
  rankBadgeText: {
    color: "#F8FAFC",
    fontWeight: "900",
    fontSize: 14,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: "#F8FAFC",
    fontWeight: "800",
    fontSize: 16,
  },
  playerLevel: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
  },
  scoreContainer: {
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
  scoreText: {
    color: "#EAB308",
    fontWeight: "900",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justify: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubText: {
    color: "#64748B",
    fontSize: 13,
  },
});