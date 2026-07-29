import { Slot } from "expo-router";
import { View, StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <Slot />
    </View>
  );
}