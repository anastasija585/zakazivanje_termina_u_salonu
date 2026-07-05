import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salon za nokte</Text>
      <Text style={styles.subtitle}>Zakazivanje termina u salonu</Text>

      <Pressable style={styles.registerButton} onPress={() => router.push("/register")}>
        <Text style={styles.buttonText}>Registracija</Text>
      </Pressable>

      <Pressable style={styles.loginButton} onPress={() => router.push({ pathname: "/login", params: { role: "korisnik" } })}>
        <Text style={styles.buttonText}>Prijava korisnika</Text>
      </Pressable>

      <Pressable style={styles.adminButton} onPress={() => router.push({ pathname: "/login", params: { role: "admin" } })}>
        <Text style={styles.buttonText}>Prijava administratora</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 15 },
  subtitle: { fontSize: 18, textAlign: "center", marginBottom: 40 },
  registerButton: { backgroundColor: "#0d6efd", width: "80%", padding: 15, borderRadius: 10, marginBottom: 15, alignItems: "center" },
  loginButton: { backgroundColor: "#198754", width: "80%", padding: 15, borderRadius: 10, marginBottom: 15, alignItems: "center" },
  adminButton: { backgroundColor: "#6c757d", width: "80%", padding: 15, borderRadius: 10, marginBottom: 15, alignItems: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});