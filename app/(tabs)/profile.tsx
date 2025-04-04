import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";

const SCOPES = "user-read-email user-read-private";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${
  process.env.EXPO_PUBLIC_TEST_SPOTIFY_CLIENT_ID
}&response_type=code&redirect_uri=${encodeURIComponent(
  process.env.EXPO_PUBLIC_TEST_SPOTIFY_REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}`;

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.profileImage}
      />
      <Text style={styles.title}>Profil</Text>

      <TouchableOpacity
        onPress={() => router.replace("auth/register")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#1db954",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoText: {
    marginTop: 20,
    color: "#ffffff",
  },
});
