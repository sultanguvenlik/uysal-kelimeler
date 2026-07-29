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
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Firebase Servisleri
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "../../firebaseConfig";

export default function ProfilEkrani() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("Oyuncu");
  const [newUsername, setNewUsername] = useState("");
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Oturum Durumunu Dinleme
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Kullanıcıya özel Firestore dokümanını dinle
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUsername(data.username || currentUser.displayName || "Oyuncu");
              setCoins(data.coins ?? 1000);
              setCurrentLevel(data.currentLevel ?? 1);
            } else {
              // İlk kez giriş yapan kullanıcıya varsayılan veri oluştur
              const initialName =
                currentUser.displayName ||
                `Oyuncu_${currentUser.uid.slice(0, 5)}`;
              setDoc(userDocRef, {
                username: initialName,
                coins: 1000,
                currentLevel: 1,
                email: currentUser.email || "misafir@uysal.com",
              });
            }
          },
          (error) => {
            console.error("Firestore Dinleme Hatası:", error);
          }
        );

        return () => unsubscribeDoc();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Misafir / Hızlı Giriş
  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      await signInAnonymously(auth);
    } catch (error: any) {
      setLoading(false);
      console.error("Giriş Hatası Detayı:", error);
      Alert.alert(
        "Giriş Hatası",
        error.message || "Giriş yapılırken bir sorun oluştu."
      );
    }
  };

  // Çıkış Yapma
  const handleSignOut = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: () => signOut(auth),
        },
      ]
    );
  };

  // İsim Güncelleme
  const handleSaveUsername = async () => {
    if (!newUsername.trim() || !user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { username: newUsername.trim() },
        { merge: true }
      );
      setIsEditing(false);
      setNewUsername("");
      Alert.alert("Başarılı! 🎉", "Profil isminiz güncellendi.");
    } catch (error) {
      Alert.alert("Hata", "İsim güncellenirken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#EAB308" />
      </SafeAreaView>
    );
  }

  // OTURUM AÇILMAMIŞSA: Giriş Seçenekleri Kartı
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>HESAP GİRİŞİ</Text>
        </View>

        <View style={styles.loginContainer}>
          <Ionicons name="shield-checkmark-sharp" size={72} color="#EAB308" />
          <Text style={styles.loginTitle}>İlerlemeni Güvenceye Al</Text>
          <Text style={styles.loginSub}>
            Kazanılan altınlar, kalınan seviyeler ve liderlik tablosu skorların kaybolmasın.
          </Text>

          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGuestLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={20} color="#020617" />
            <Text style={styles.googleBtnText}>Google İle Hızlı Giriş Yap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestBtn}
            onPress={handleGuestLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.guestBtnText}>Misafir Olarak Devam Et</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // OTURUM AÇILMIŞSA: Profil Paneli
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROFİLİM</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person-circle" size={80} color="#EAB308" />
          )}

          {isEditing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Yeni İsim..."
                placeholderTextColor="#64748B"
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveUsername}
              >
                <Ionicons name="checkmark" size={20} color="#020617" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsEditing(false)}
              >
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

          <Text style={styles.userRole}>UID: {user.uid.slice(0, 12)}...</Text>
        </View>

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

        <Text style={styles.sectionTitle}>Hesap Ayarları</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={styles.signOutBtnText}>Oturumu Kapat</Text>
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
  center: {
    justifyContent: "center",
    alignItems: "center",
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
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justify: "center",
    paddingHorizontal: 30,
    gap: 16,
  },
  loginTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  loginSub: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EAB308",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: "100%",
    justify: "center",
  },
  googleBtnText: {
    color: "#020617",
    fontWeight: "900",
    fontSize: 15,
  },
  guestBtn: {
    paddingVertical: 12,
  },
  guestBtnText: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 14,
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
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
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
  signOutBtnText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 14,
  },
});