import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="register" options={{ title: "Inscription" }} />
      <Stack.Screen name="login" options={{ title: "Connexion" }} />
    </Stack>
  );
}
