import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { exchangeCodeForToken } from "../utils/exchangeCodeForToken";

WebBrowser.maybeCompleteAuthSession();
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const clientId = process.env.EXPO_PUBLIC_TEST_SPOTIFY_CLIENT_ID || '';
const scopes = [
  'user-read-email',
  'user-read-private',
  'playlist-read-private',
];


export default function ProfileScreen() {

  const redirectUri = AuthSession.makeRedirectUri({});
  console.log('redirect', redirectUri)

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes,
      redirectUri,
      responseType: 'code',
      usePKCE: true,
    },
    discovery
  );
  const codeVerifier = request?.codeVerifier;
  
  const router = useRouter();
  useEffect(() => {
    if (response?.type === 'success') {
      const code = response.params.code;
      exchangeCodeForToken(code, codeVerifier);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.profileImage}
      />
      <Text style={styles.title}>Profil</Text>

      <TouchableOpacity
        onPress={() => router.push("/auth/register")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/auth/login")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => promptAsync()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Se connecter avec Spotify</Text>
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
