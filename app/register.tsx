import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { putData } from "../firebase/firebaseApi";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    if (!name || !surname || !email || !password) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await putData(`users/${user.uid}`, {
        name,
        surname,
        email,
        role: "korisnik",
        createdAt: new Date().toISOString(),
      });

      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1604654894610-df63bc536371",
      }}
      style={styles.background}
      imageStyle={{ opacity: 0.18 }}
    >
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.replace("/")}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.title}>Registracija</Text>
        <Text style={styles.subtitle}>Kreirajte novi nalog</Text>

        <TextInput
          style={styles.input}
          placeholder="Unesite ime"
          placeholderTextColor="#9a7b70"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Unesite prezime"
          placeholderTextColor="#9a7b70"
          value={surname}
          onChangeText={setSurname}
        />

        <TextInput
          style={styles.input}
          placeholder="Unesite email"
          placeholderTextColor="#9a7b70"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Unesite lozinku"
          placeholderTextColor="#9a7b70"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={registerUser}>
          <Text style={styles.buttonText}>Registrujte se</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>
            Već imate nalog? <Text style={styles.bold}>Prijavite se</Text>
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f6eee8",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 34,
    fontWeight: "600",
    color: "#6b3f35",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#5d4037",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#b99b8f",
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 12,
    padding: 13,
    marginBottom: 12,
    fontSize: 16,
    color: "#4e342e",
  },
  button: {
    backgroundColor: "#8a5f52",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  loginText: {
    textAlign: "center",
    marginTop: 22,
    color: "#5d4037",
    fontSize: 15,
  },
  bold: {
    fontWeight: "bold",
    color: "#7b4f43",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  backText: {
    fontSize: 26,
    color: "#8a5f52",
    fontWeight: "600",
  },
});