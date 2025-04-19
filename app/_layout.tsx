// app/_layout.js
import React from "react";
import { Stack } from "expo-router";
import { SpotifyTokenProvider } from "./SpotifyTokenContext";

export default function RootLayout() {
  return (
    <SpotifyTokenProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SpotifyTokenProvider>
  );
}
