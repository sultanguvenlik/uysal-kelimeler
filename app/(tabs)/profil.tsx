import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Firebase Firestore Servisleri
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ProfilEkrani() {
  const [username, setUsername] = useState("Abdullah");
  const [newUsername, setNewUsername] = useState("");
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userDocRef = doc(db, "users", "demo_user_id");

    // Firestore'dan canlı dinleme
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || "Abdullah");
        setCoins(data.coins || 0);
        setCurrentLevel(data.currentLevel || 1);
      }
    });

    return () => unsubscribe();
  }, []);

  // İsmi Firestore'da Güncelleme
  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Hata", "Lütfen geçerli bir kullanıcı adı girin.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", "demo_user_id");
      await setDoc(
        userDocRef,
        { username: newUsername.trim() },
        { merge: true }
      );

      setIsEditing(false);
      setNewUsername("");
      Alert.alert("Başarılı! 🎉", "Kullanıcı adınız başarıyla güncellendi.");
    } catch (error) {
      Alert.alert("Hata", "Kullanıcı adı güncellenirken bir sorun oluştu.");
    }
  };

  // İlerlemeyi Sıfırlama (Reset Progress)
  const handleResetProgress = () => {
    Alert.alert(
      "Hesabı Sıfırla",
      "Tüm seviye ilerlemeniz ve puanlarınız varsayılan değere döndürülecek. Emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sıfırla",
          style: "destructive",
          onPress: async () => {
            try {
              const userDocRef = doc(db, "users", "demo_user_id");
              await setDoc(
                userDocRef,
                { coins: 1000, currentLevel: 1 },
                { merge: true }
              );
              Alert.alert("Sıfırlandı", "İlerlemeniz başarıyla sıfırlandı.");
            } catch (error) {
              Alert.alert("Hata", "Sıfırlama işlemi başarısız oldu.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROFİL</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profil Kartı */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#EAB308" />
          </View>

          {isEditing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Yeni İsim..."
                placeholderTextColor="#64748B"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveUsername}>
                <Ionicons name="checkmark" size={20} color="#020617" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={20} color="#F8FAFC" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.usernameRow}>
              <Text style={styles.usernameText}>{username}</Text>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Ionicons name="pencil" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.userRole}>Oyuncu ID: demo_user_id</Text>
        </View>

        {/* İstatistikler */}
        <Text style={styles.sectionTitle}>İstatistikler</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="flash" size={24} color="#EAB308" />
            <Text style={styles.statValue}>{coins.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Toplam Altın</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="trophy" size={24} color="#38BDF8" />
            <Text style={styles.statValue}>{currentLevel}</Text>
            <Text style={styles.statLabel}>Aktif Seviye</Text>
          </View>
        </View>

        {/* Aksiyonlar */}
        <Text style={styles.sectionTitle}>Ayarlar & İşlemler</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleResetProgress}>
            <Ionicons name="refresh-circle-outline" size={22} color="#EF4444" />
            <Text style={styles.resetBtnText}>İlerlemeyi Sıfırla (Test)</Text>
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
    alignItems: "center",
    justify: "center",
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  avatarContainer: {
    marginBottom: 8,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  usernameText: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
  },
  userRole: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  input: {
    backgroundColor: "#020617",
    color: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#334155",
    width: 150,
  },
  saveBtn: {
    backgroundColor: "#EAB308",
    padding: 8,
    borderRadius: 10,
  },
  cancelBtn: {
    backgroundColor: "#334155",
    padding: 8,
    borderRadius: 10,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
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
    marginVertical: 4,
  },
  statLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  actionContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  resetBtnText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 14,
  },
});