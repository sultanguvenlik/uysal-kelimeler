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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Firebase Firestore & Auth
import { doc, onSnapshot, setDoc, increment } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";

interface MarketItem {
  id: string;
  title: string;
  coins: number;
  price: string;
  popular?: boolean;
}

const COIN_PACKAGES: MarketItem[] = [
  { id: "1", title: "Başlangıç Paketi", coins: 250, price: "₺19,99" },
  { id: "2", title: "Popüler Paket", coins: 1000, price: "₺59,99", popular: true },
  { id: "3", title: "Usta Paketi", coins: 3000, price: "₺149,99" },
  { id: "4", title: "Efsane Paket", coins: 7500, price: "₺299,99" },
];

export default function MarketEkrani() {
  const [user, setUser] = useState<User | null>(null);
  const [coins, setCoins] = useState<number>(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setCoins(docSnap.data().coins || 0);
          }
        });

        return () => unsubscribeDoc();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleBuyPackage = async (pack: MarketItem) => {
    if (!user) {
      Alert.alert("Hata", "Lütfen önce giriş yapın.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);

      await setDoc(
        userDocRef,
        {
          coins: increment(pack.coins),
        },
        { merge: true }
      );

      Alert.alert(
        "Satın Alma Başarılı! 🎉",
        `Tebrikler! Hesabınıza +${pack.coins} Altın tanımlandı.`,
        [{ text: "Harika" }]
      );
    } catch (error) {
      Alert.alert("Hata", "İşlem sırasında bir sorun oluştu.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MARKET</Text>
        <View style={styles.coinBadge}>
          <Ionicons name="flash" size={16} color="#EAB308" />
          <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Altın Paketleri</Text>
        <Text style={styles.sectionSub}>İpuçları satın almak ve seviyeleri hızla geçmek için altın yükleyin.</Text>

        <View style={styles.packageGrid}>
          {COIN_PACKAGES.map((item) => (
            <View
              key={item.id}
              style={[styles.packageCard, item.popular && styles.popularCard]}
            >
              {item.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>EN POPÜLER</Text>
                </View>
              )}

              <Ionicons name="flash" size={32} color="#EAB308" style={styles.packIcon} />
              <Text style={styles.packTitle}>{item.title}</Text>
              <Text style={styles.packCoins}>+{item.coins.toLocaleString()} Altın</Text>

              <TouchableOpacity
                style={styles.buyBtn}
                activeOpacity={0.85}
                onPress={() => handleBuyPackage(item)}
              >
                <Text style={styles.buyBtnText}>{item.price}</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  headerTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
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
    fontSize: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
  },
  sectionSub: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },
  packageGrid: {
    gap: 16,
  },
  packageCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    alignItems: "center",
    position: "relative",
  },
  popularCard: {
    borderColor: "#EAB308",
    backgroundColor: "#0F172A",
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    backgroundColor: "#EAB308",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "#020617",
    fontSize: 10,
    fontWeight: "900",
  },
  packIcon: {
    marginBottom: 8,
  },
  packTitle: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
  },
  packCoins: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 6,
  },
  buyBtn: {
    backgroundColor: "#EAB308",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buyBtnText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 15,
  },
});