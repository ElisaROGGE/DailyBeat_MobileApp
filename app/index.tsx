import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ Utilisateur toujours connecté :", user.uid);
        await AsyncStorage.setItem("userLoggedIn", "true");
        router.replace("/(tabs)");
      } else {
        const flag = await AsyncStorage.getItem("userLoggedIn");
        console.log("❌ Aucun utilisateur connecté. Flag:", flag);
        await AsyncStorage.removeItem("userLoggedIn");
        router.replace("/auth/login");
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
