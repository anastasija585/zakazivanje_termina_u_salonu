import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function LoginScreen() {
  const { role } = useLocalSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // ADMIN
      if (role === "admin") {
        if (email === "admin@salon.rs") {
          
          router.replace("/admin");
        } else {
          
        }
      }
      // KORISNIK
      else {
        
        router.replace("/user-home");
      }
    } catch (error: any) {
      console.error(error);
      
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {role === "admin" ? "Prijava administratora" : "Prijava korisnika"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Lozinka"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={loginUser}>
        <Text style={styles.buttonText}>Prijavi se</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#198754",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});