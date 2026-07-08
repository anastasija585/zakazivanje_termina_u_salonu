import { View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1604654894610-df63bc536371" }}
      style={styles.background}
      imageStyle={{ opacity: 0.28 }}
    >
      <View style={styles.container}>


        <Text style={styles.title}>Salon za nokte</Text>
        <Text style={styles.subtitle}>Zakazivanje termina u salonu</Text>

        <Pressable style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Prijava</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push("/register")}>
          <Text style={styles.buttonText}>Registracija</Text>
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
    alignItems: "center",
    padding: 30,
  },
  icon: {
    fontSize: 64,
    color: "#8a5f52",
    marginBottom: 15,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#4e342e",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#5d4037",
    marginBottom: 45,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#8a5f52",
    width: "70%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});