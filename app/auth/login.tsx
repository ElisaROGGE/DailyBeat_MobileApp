import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button, Card, Title, ActivityIndicator } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as spotifyService from '../../services/spotify';

const getSpotifyToken = async (uid: string) => {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    console.log("Données de l'utilisateur :", userData);
    return {
      accessToken: userData.spotifyAccessToken,
      refreshToken: userData.spotifyRefreshToken,
      expiresAt: userData.spotifyExpiresAt,
    };
  } else {
    return null;
  }
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
  
    try {
      // Connexion de l'utilisateur
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Utilisateur connecté :", userCredential);
      await AsyncStorage.setItem("userLoggedIn", "true");

  
      const spotifyTokens = await getSpotifyToken(userCredential.user.uid);
  
      if (spotifyTokens) {
        const { accessToken, refreshToken, expiresAt } = spotifyTokens;
        console.log("Tokens Spotify récupérés :", spotifyTokens);
  
        // check if the token is still valid
        if (new Date().getTime() < expiresAt) {
          console.log("Token Spotify valide, utilisateur connecté à Spotify !");
          // store the tokens in AsyncStorage
          await AsyncStorage.setItem("spotify_access_token", accessToken);
          await AsyncStorage.setItem("spotify_refresh_token", refreshToken);
          await AsyncStorage.setItem("spotify_expires_at", expiresAt.toString());
        } else {
          console.log("Token Spotify expiré, besoin de rafraîchir.");
          // refresh the token
          await spotifyService.refreshToken(userCredential.user.uid).then(async (newTokens) => {
            console.log("Nouveaux tokens Spotify :", newTokens);
            await AsyncStorage.setItem("spotify_access_token", newTokens.accessToken);
            await AsyncStorage.setItem("spotify_refresh_token", newTokens.refreshToken);
            await AsyncStorage.setItem("spotify_expires_at", newTokens.expiresAt.toString());
          }).catch((error) => {
            console.error("Erreur lors du rafraîchissement du token Spotify :", error);
          });
        }
      } else {
        console.log("Pas de token Spotify trouvé pour cet utilisateur.");
      }
  
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Connexion</Title>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            autoCapitalize="none"
          />
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator animating={true} color="#fff" />
            ) : (
              "Se connecter"
            )}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
  card: {
    width: "80%",
    padding: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});
