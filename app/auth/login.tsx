import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Title,
  ActivityIndicator,
} from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../firebaseConfig";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
  
    try {
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Utilisateur connecté :", userCredential.user);
  
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
          {/* <Button onPress={() => navigation.goBack()}>Retour</Button> */}
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
    backgroundColor: "#f2f2f2",
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
