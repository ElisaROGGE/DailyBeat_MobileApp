import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { auth } from "../firebaseConfig";
import { SpotifyTokenProvider } from "./SpotifyTokenContext";

export default function RootLayout() {
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      console.log("Utilisateur connecté :", user);
    } else {
      console.log("Aucun utilisateur connecté");
      router.replace("/(tabs)/profile")
    }
  }, []);

  return (
    <SpotifyTokenProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SpotifyTokenProvider>
  );
}
