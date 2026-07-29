import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase Proje Konfigürasyonun (Firebase Console -> Project Settings kısmından alınır)
const firebaseConfig = {
  apiKey: "AIzaSyAigW18wnMhvMxCDwEpMoCojwXGKVjHf90",
  authDomain: "uysal-kelimeler.firebaseapp.com",
  projectId: "uysal-kelimeler",
  storageBucket: "uysal-kelimeler.firebasestorage.app",
  messagingSenderId: "789404525790",
  appId: "1:789404525790:web:49dca56dd0582dc33b0e4f",
};

// React Native / Expo tarafında çift initialize olmasını önleyen güvenli başlatma
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);