import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function UserHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Korisnički panel</Text>
      <Text style={styles.subtitle}>Uspešno ste prijavljeni.</Text>

      <Pressable style={styles.button} onPress={() => router.push("/services")}>
        <Text style={styles.buttonText}>Zakaži termin</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("/my-reservations")}
      >
        <Text style={styles.buttonText}>Moji termini</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 15 },
  subtitle: { fontSize: 18, marginBottom: 30 },
  button: { backgroundColor: "#d63384", width: "80%", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 15 },
  secondaryButton: { backgroundColor: "#0d6efd" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});