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

export default function MarketEkrani() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* Header Bar: Başlık ve Altın Bakiyesi */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market</Text>
        <View style={styles.coinBadge}>
          <Ionicons name="disc" size={18} color="#EAB308" />
          <Text style={styles.coinText}>1.240 Altın</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Öne Çıkan Süper Fırsat Kartı (Gece Paketi) */}
        <View style={styles.promoCard}>
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>SÜPER FIRSAT</Text>
          </View>

          <Text style={styles.promoTitle}>Gece Paketi</Text>
          <Text style={styles.promoSubtitle}>
            20 İpucu, 10 Roket ve Kış Masalı teması bir arada!
          </Text>

          <TouchableOpacity style={styles.buyBtn} activeOpacity={0.85}>
            <Text style={styles.buyBtnText}>₺89,99 Satın Al</Text>
          </TouchableOpacity>
        </View>

        {/* Bölüm 1: İpuçları */}
        <Text style={styles.sectionTitle}>İpuçları</Text>
        <View style={styles.gridRow}>
          {/* Tekli İpucu */}
          <View style={styles.itemCard}>
            <View style={styles.itemIconBox}>
              <Ionicons name="bulb-outline" size={28} color="#38BDF8" />
            </View>
            <Text style={styles.itemTitle}>Tekli İpucu</Text>
            <TouchableOpacity style={styles.priceTag} activeOpacity={0.8}>
              <Text style={styles.priceText}>50</Text>
              <Ionicons name="disc" size={14} color="#EAB308" />
            </TouchableOpacity>
          </View>

          {/* 5'li Paket */}
          <View style={styles.itemCard}>
            <View style={styles.itemIconBox}>
              <Ionicons name="bulb" size={28} color="#EAB308" />
            </View>
            <Text style={styles.itemTitle}>5'li Paket</Text>
            <TouchableOpacity style={styles.priceTag} activeOpacity={0.8}>
              <Text style={styles.priceText}>200</Text>
              <Ionicons name="disc" size={14} color="#EAB308" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bölüm 2: Güçlendiriciler */}
        <Text style={styles.sectionTitle}>Güçlendiriciler</Text>
        <View style={styles.verticalList}>
          {/* Karıştır */}
          <View style={styles.horizontalCard}>
            <View style={[styles.iconBoxSmall, { backgroundColor: "rgba(34, 197, 94, 0.15)" }]}>
              <Ionicons name="shuffle" size={22} color="#22C55E" />
            </View>
            <View style={styles.cardTextGroup}>
              <Text style={styles.cardTitle}>Karıştır</Text>
              <Text style={styles.cardSubtitle}>Harfleri rastgele diz.</Text>
            </View>
            <TouchableOpacity style={styles.priceTag} activeOpacity={0.8}>
              <Text style={styles.priceText}>30</Text>
              <Ionicons name="disc" size={14} color="#EAB308" />
            </TouchableOpacity>
          </View>

          {/* Roket */}
          <View style={styles.horizontalCard}>
            <View style={[styles.iconBoxSmall, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
              <Ionicons name="rocket-outline" size={22} color="#EF4444" />
            </View>
            <View style={styles.cardTextGroup}>
              <Text style={styles.cardTitle}>Roket</Text>
              <Text style={styles.cardSubtitle}>3 rastgele harfi aç.</Text>
            </View>
            <TouchableOpacity style={styles.priceTag} activeOpacity={0.8}>
              <Text style={styles.priceText}>80</Text>
              <Ionicons name="disc" size={14} color="#EAB308" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bölüm 3: Özel Temalar */}
        <Text style={styles.sectionTitle}>Özel Temalar</Text>
        <View style={styles.verticalList}>
          <View style={styles.horizontalCard}>
            <View style={[styles.iconBoxSmall, { backgroundColor: "rgba(234, 179, 8, 0.15)" }]}>
              <Ionicons name="leaf-outline" size={22} color="#EAB308" />
            </View>
            <View style={styles.cardTextGroup}>
              <Text style={styles.cardTitle}>Sonbahar Rüzgarı</Text>
              <Text style={styles.cardSubtitle}>Sıcak tonlar ve düşen yapraklar.</Text>
            </View>
            <TouchableOpacity style={styles.priceTag} activeOpacity={0.8}>
              <Text style={styles.priceText}>400</Text>
              <Ionicons name="disc" size={14} color="#EAB308" />
            </TouchableOpacity>
          </View>

          <View style={styles.horizontalCard}>
            <View style={[styles.iconBoxSmall, { backgroundColor: "rgba(56, 189, 248, 0.15)" }]}>
              <Ionicons name="snow-outline" size={22} color="#38BDF8" />
            </View>
            <View style={styles.cardTextGroup}>
              <Text style={styles.cardTitle}>Kış Masalı</Text>
              <Text style={styles.cardSubtitle}>Kar taneleri ve huzurlu sessizlik.</Text>
            </View>
            <TouchableOpacity style={styles.priceTag} activeOpacity={0.8}>
              <Text style={styles.priceText}>600</Text>
              <Ionicons name="disc" size={14} color="#EAB308" />
            </TouchableOpacity>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  headerTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
  },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0F172A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  coinText: {
    color: "#EAB308",
    fontWeight: "800",
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  promoCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EAB308",
    marginBottom: 24,
  },
  promoBadge: {
    backgroundColor: "#EAB308",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  promoBadgeText: {
    color: "#020617",
    fontSize: 10,
    fontWeight: "900",
  },
  promoTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  promoSubtitle: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 16,
  },
  buyBtn: {
    backgroundColor: "#EAB308",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buyBtnText: {
    color: "#020617",
    fontWeight: "800",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 8,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  itemCard: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  itemIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  itemTitle: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  verticalList: {
    gap: 12,
    marginBottom: 20,
  },
  horizontalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
    gap: 12,
  },
  iconBoxSmall: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextGroup: {
    flex: 1,
  },
  cardTitle: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: "#64748B",
    fontSize: 12,
  },
  priceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    color: "#F8FAFC",
    fontWeight: "800",
    fontSize: 13,
  },
});