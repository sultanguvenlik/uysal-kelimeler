import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Market Ürün Tipleri
interface PowerUpItem {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  price: number;
  iconColor: string;
}

interface CoinPackage {
  id: string;
  amount: number;
  priceTL: string;
  badge?: string;
  iconColor: string;
}

const POWER_UPS: PowerUpItem[] = [
  {
    id: "hint_single",
    name: "Tek Harf İpucu",
    description: "Bulamadığın kelimelerden rastgele bir harf açar.",
    icon: "bulb",
    price: 50,
    iconColor: "#EAB308",
  },
  {
    id: "shuffle_letters",
    name: "Harf Karıştırıcı",
    description: "Çemberdeki harflerin konumunu rastgele değiştirir.",
    icon: "shuffle",
    price: 20,
    iconColor: "#38BDF8",
  },
  {
    id: "bomb_remove",
    name: "Kelime Bombası",
    description: "Tablodaki en zor kelimelerden birini direkt açar.",
    icon: "flame",
    price: 150,
    iconColor: "#EF4444",
  },
  {
    id: "extra_time",
    name: "Ekstra Süre",
    description: "Zaman karşı yarış modlarında fazladan 30 saniye kazandırır.",
    icon: "time",
    price: 80,
    iconColor: "#10B981",
  },
];

const COIN_PACKAGES: CoinPackage[] = [
  {
    id: "coin_pack_1",
    amount: 500,
    priceTL: "₺29,99",
    iconColor: "#EAB308",
  },
  {
    id: "coin_pack_2",
    amount: 1500,
    priceTL: "₺79,99",
    badge: "POPÜLER",
    iconColor: "#F59E0B",
  },
  {
    id: "coin_pack_3",
    amount: 5000,
    priceTL: "₺199,99",
    badge: "%30 AVANTAJ",
    iconColor: "#EAB308",
  },
];

export default function MarketEkrani() {
  const [userCoins, setUserCoins] = useState(1250);
  const [selectedItem, setSelectedItem] = useState<PowerUpItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Güçlendirici Satın Alma İşlemi
  const handleBuyPowerUp = (item: PowerUpItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    if (userCoins >= selectedItem.price) {
      setUserCoins((prev) => prev - selectedItem.price);
      Alert.alert(
        "Başarılı! 🎉",
        `"${selectedItem.name}" envanterine eklendi.`
      );
    } else {
      Alert.alert(
        "Yetersiz Bakiye ⚠️",
        "Bu ürünü almak için yeterli altınınız bulunmuyor. Marketten altın paketi alabilirsiniz."
      );
    }
    setModalVisible(false);
    setSelectedItem(null);
  };

  // Altın Paketi Satın Alma (In-App Purchase Mock)
  const handleBuyCoinPack = (pack: CoinPackage) => {
    Alert.alert(
      "Ödeme Onayı",
      `${pack.amount} Altın Paketini (${pack.priceTL}) satın almak istiyor musunuz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Satın Al",
          onPress: () => {
            setUserCoins((prev) => prev + pack.amount);
            Alert.alert("Tebrikler!", `${pack.amount} Altın bakiyenize eklendi.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar / Bakiye Alanı */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Oyun Marketi</Text>
        <View style={styles.coinBadge}>
          <Ionicons name="flash" size={18} color="#EAB308" />
          <Text style={styles.coinText}>{userCoins.toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTextWrapper}>
            <Text style={styles.bannerTitle}>ÖZEL GÜÇLERLE HIZLAN</Text>
            <Text style={styles.bannerSub}>
              Zorlandığın bölümleri ipuçlarıyla kolayca geç!
            </Text>
          </View>
          <Ionicons name="sparkles" size={48} color="#EAB308" />
        </View>

        {/* Bölüm 1: Güçlendiriciler */}
        <Text style={styles.sectionTitle}>GÜÇLENDİRİCİLER & İPUÇLARI</Text>
        {POWER_UPS.map((item) => (
          <View key={item.id} style={styles.card}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: item.iconColor + "15" },
              ]}
            >
              <Ionicons name={item.icon} size={28} color={item.iconColor} />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>

            <TouchableOpacity
              style={styles.buyButton}
              activeOpacity={0.8}
              onPress={() => handleBuyPowerUp(item)}
            >
              <Ionicons name="flash" size={14} color="#020617" />
              <Text style={styles.buyButtonText}>{item.price}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Bölüm 2: Altın Paketleri */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
          ALTIN PAKETLERİ
        </Text>
        <View style={styles.coinPacksRow}>
          {COIN_PACKAGES.map((pack) => (
            <View key={pack.id} style={styles.coinPackCard}>
              {pack.badge && (
                <View style={styles.packBadge}>
                  <Text style={styles.packBadgeText}>{pack.badge}</Text>
                </View>
              )}
              <Ionicons
                name="flash"
                size={36}
                color={pack.iconColor}
                style={{ marginTop: 8 }}
              />
              <Text style={styles.coinPackAmount}>
                {pack.amount.toLocaleString()}
              </Text>
              <Text style={styles.coinPackLabel}>ALTIN</Text>

              <TouchableOpacity
                style={styles.coinBuyBtn}
                activeOpacity={0.8}
                onPress={() => handleBuyCoinPack(pack)}
              >
                <Text style={styles.coinBuyBtnText}>{pack.priceTL}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Satın Alma Onay Modalı */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View
                  style={[
                    styles.modalIconBox,
                    { backgroundColor: selectedItem.iconColor + "20" },
                  ]}
                >
                  <Ionicons
                    name={selectedItem.icon}
                    size={40}
                    color={selectedItem.iconColor}
                  />
                </View>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalDesc}>{selectedItem.description}</Text>

                <View style={styles.modalPriceRow}>
                  <Text style={styles.modalPriceLabel}>Fiyat:</Text>
                  <View style={styles.modalPriceBadge}>
                    <Ionicons name="flash" size={16} color="#EAB308" />
                    <Text style={styles.modalPriceText}>
                      {selectedItem.price} Altın
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>İptal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    onPress={confirmPurchase}
                  >
                    <Text style={styles.modalConfirmText}>Satın Al</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    justify: "space-between",
    alignItems: "center",
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
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#334155",
  },
  coinText: {
    color: "#EAB308",
    fontWeight: "800",
    fontSize: 15,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  bannerContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justify: "space-between",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  bannerTextWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    color: "#F8FAFC",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  bannerSub: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  cardIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justify: "center",
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 16,
  },
  cardDesc: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAB308",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 4,
  },
  buyButtonText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 14,
  },
  coinPacksRow: {
    flexDirection: "row",
    justify: "space-between",
    gap: 10,
  },
  coinPackCard: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
    position: "relative",
  },
  packBadge: {
    position: "absolute",
    top: -10,
    backgroundColor: "#EAB308",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  packBadgeText: {
    color: "#020617",
    fontSize: 9,
    fontWeight: "900",
  },
  coinPackAmount: {
    color: "#F8FAFC",
    fontWeight: "900",
    fontSize: 18,
    marginTop: 8,
  },
  coinPackLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 12,
  },
  coinBuyBtn: {
    backgroundColor: "#1E293B",
    width: "100%",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  coinBuyBtnText: {
    color: "#38BDF8",
    fontWeight: "800",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.85)",
    justify: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  modalIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justify: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },
  modalDesc: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  modalPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  modalPriceLabel: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
  },
  modalPriceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  modalPriceText: {
    color: "#EAB308",
    fontWeight: "800",
    fontSize: 14,
  },
  modalActionRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: "#1E293B",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalCancelText: {
    color: "#F8FAFC",
    fontWeight: "800",
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: "#EAB308",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  modalConfirmText: {
    color: "#020617",
    fontWeight: "900",
  },
});