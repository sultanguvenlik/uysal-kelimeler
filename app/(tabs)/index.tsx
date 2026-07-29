import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617", justifyContent: "space-between", padding: 24 }}>
      {/* Üst Bilgi Alanı */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(251, 191, 36, 0.2)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(251, 191, 36, 0.4)", marginRight: 12 }}>
            <Ionicons name="sparkles" size={20} color="#fbbf24" />
          </View>
          <View>
            <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "500" }}>Hoş Geldiniz</Text>
            <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>Uysal Kelimeler</Text>
          </View>
        </View>

        {/* Skor / Enerji Butonu */}
        <TouchableOpacity 
          style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1e293b", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}
        >
          <Ionicons name="flash" size={16} color="#fbbf24" style={{ marginRight: 6 }} />
          <Text style={{ color: "#fbbf24", fontWeight: "bold", fontSize: 14 }}>1,250</Text>
        </TouchableOpacity>
      </View>

      {/* Orta Alan: Kahraman (Hero) Bölümü */}
      <View style={{ alignItems: "center" }}>
        <View style={{ width: 128, height: 128, borderRadius: 64, backgroundColor: "rgba(251, 191, 36, 0.15)", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(251, 191, 36, 0.3)", marginBottom: 24 }}>
          <Ionicons name="book" size={56} color="#fbbf24" />
        </View>
        
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#ffffff", textAlign: "center", letterSpacing: 0.5 }}>
          Uysal Kelimeler
        </Text>
        <Text style={{ color: "#94a3b8", fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20, paddingHorizontal: 16 }}>
          Ailece sözcüklerin sihirli yolculuğuna çıkın, kelime hazinenizi yarışarak geliştirin.
        </Text>
      </View>

      {/* Alt Aksiyon Butonları */}
      <View style={{ gap: 12, marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/oyun" as any)}
          style={{ width: "100%", backgroundColor: "#fbbf24", paddingVertical: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="play" size={20} color="#020617" style={{ marginRight: 8 }} />
          <Text style={{ color: "#020617", fontWeight: "bold", fontSize: 18 }}>Oyuna Başla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}