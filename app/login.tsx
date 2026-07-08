import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground } from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const snapshot = await get(ref(database, `users/${user.uid}`));

      if (!snapshot.exists()) {
        console.log("Korisnik nije pronađen u bazi.");
        return;
      }

      const data = snapshot.val();

      if (data.role === "administrator") {
        router.replace("/admin");
      } else {
        router.replace("/user-home");
      }

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1604654894610-df63bc536371" }}
      style={styles.background}
      imageStyle={{ opacity: 0.24 }}
    >
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>


        <Text style={styles.title}>Prijava</Text>
        <Text style={styles.subtitle}>Prijavite se na svoj nalog</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Unesite email"
          placeholderTextColor="#9a7b70"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Lozinka</Text>
        <TextInput
          style={styles.input}
          placeholder="Unesite lozinku"
          placeholderTextColor="#9a7b70"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={loginUser}>
          <Text style={styles.buttonText}>Prijavi se</Text>
        </Pressable>



        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <View style={styles.line} />
        </View>

        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.registerText}>
            Nemate nalog? <Text style={styles.bold}>Registrujte se</Text>
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
    padding: 28,
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 25,
  },
  backText: {
    fontSize: 32,
    color: "#4e342e",
  },
  icon: {
    fontSize: 58,
    color: "#4e342e",
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    color: "#4e342e",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#5d4037",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 35,
  },
  label: {
    color: "#4e342e",
    fontSize: 15,
    marginBottom: 7,
    marginLeft: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d7bdb2",
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    fontSize: 15,
    color: "#4e342e",
  },
  button: {
    backgroundColor: "#8a5f52",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  link: {
    color: "#7b4f43",
    textAlign: "center",
    marginTop: 25,
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#d7bdb2",
  },
  or: {
    marginHorizontal: 15,
    color: "#6d4c41",
  },
  registerText: {
    textAlign: "center",
    color: "#5d4037",
    fontSize: 15,
  },
  bold: {
    fontWeight: "700",
    color: "#8a5f52",
  },
});