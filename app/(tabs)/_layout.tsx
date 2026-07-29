import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Android ve iOS navigasyon tuşları çakışmaması için dinamik alt boşluk
  const bottomPadding = Platform.OS === "android" ? Math.max(insets.bottom, 12) + 8 : insets.bottom;
  const tabBarHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#EAB308", // Seçili sekme altın sarısı
        tabBarInactiveTintColor: "#64748B", // Pasif sekmeler gri
        tabBarStyle: {
          backgroundColor: "#020617", // Koyu tema arka planı
          borderTopColor: "#1E293B",
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      {/* 1. Ana Menü */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Menü",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-sharp" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Oyun */}
      <Tabs.Screen
        name="oyun"
        options={{
          title: "Oyun",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle-sharp" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Modlar */}
      <Tabs.Screen
        name="modlar"
        options={{
          title: "Modlar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller-sharp" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Skor */}
      <Tabs.Screen
        name="skor"
        options={{
          title: "Skor",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-sharp" size={size} color={color} />
          ),
        }}
      />

      {/* 5. Market */}
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-sharp" size={size} color={color} />
          ),
        }}
      />

      {/* 6. Profil */}
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}