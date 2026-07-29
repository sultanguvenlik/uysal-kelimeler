import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase Proje Yapılandırmanız
const firebaseConfig = {
  apiKey: "AIzaSyAigW18wnMhvMxCDwEpMoCojwXGKVjHf90",
  authDomain: "uysal-kelimeler.firebaseapp.com",
  projectId: "uysal-kelimeler",
  storageBucket: "uysal-kelimeler.firebasestorage.app",
  messagingSenderId: "789404525790",
  appId: "1:789404525790:web:49dca56dd0582dc33b0e4f",
};

// Uygulama daha önce başlatıldıysa yenisini oluşturma (Singleton Pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth Durumunu Cihaz Hafızasında Saklama (Persistence)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);