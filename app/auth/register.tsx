import React, { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Title,
  ActivityIndicator,
} from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      // Créer un utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      console.log(userId, "userId")

      // Stocker l'utilisateur dans Firestore
      await setDoc(doc(firestore, "users", userId), {
        username: username,
        email: email,
        createdAt: new Date(),
      });

      console.log("Compte créé avec succès !");
      router.replace("/auth/login")
    } catch (err) {
      console.log(
        "Erreur lors de la création de l'utilisateur dans Firestore : ",
        err
      );
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Inscription</Title>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            label="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
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
            onPress={handleRegister}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator animating={true} color="#fff" />
            ) : (
              "S'inscrire"
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
