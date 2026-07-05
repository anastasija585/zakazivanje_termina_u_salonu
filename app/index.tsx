import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salon za nokte</Text>
      <Text style={styles.subtitle}>
        Dobrodošli u aplikaciju za zakazivanje termina
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/services")}
      >
        <Text style={styles.buttonText}>Zakaži termin</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.adminButton]}
        onPress={() => router.push("/admin")}
      >
        <Text style={styles.buttonText}>Administrator</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#d63384",
    width: "80%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  adminButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});