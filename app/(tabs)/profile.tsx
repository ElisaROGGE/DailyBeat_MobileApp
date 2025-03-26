import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";

const SCOPES = "user-read-email user-read-private";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.EXPO_PUBLIC_TEST_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.EXPO_PUBLIC_TEST_SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

export default function ProfileScreen() {
  const [authCode, setAuthCode] = useState(null);

  // Fonction pour ouvrir la page Spotify
  const loginWithSpotify = async () => {
    await WebBrowser.openAuthSessionAsync(AUTH_URL);
  };

  // Fonction pour gérer la redirection et récupérer le `code`
  const handleDeepLink = (event) => {
    const url = event.url;
    console.log("URL reçue :", url);
    
    const codeMatch = url.match(/code=([^&]+)/);
    if (codeMatch) {
      const authCode = codeMatch[1];
      console.log("Code récupéré :", authCode);
      setAuthCode(authCode);
      sendCodeToBackend(authCode);
    }
  };

  // Fonction pour envoyer le code au backend
  const sendCodeToBackend = async (code) => {
    try {
      const response = await fetch("https://ton-backend.com/auth/spotify/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      console.log("Réponse du backend :", data);
    } catch (error) {
      console.error("Erreur lors de l'envoi du code :", error);
    }
  };

  // Écoute les URL ouvertes par l'application
  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profileImage} />
      <Text style={styles.title}>Profil</Text>

      <TouchableOpacity onPress={loginWithSpotify} style={styles.button}>
        <Text style={styles.buttonText}>Se connecter avec Spotify</Text>
      </TouchableOpacity>

      {authCode && <Text style={styles.infoText}>Code récupéré : {authCode}</Text>}
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
