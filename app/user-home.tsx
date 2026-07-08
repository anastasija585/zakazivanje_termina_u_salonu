import { View, Text, StyleSheet, Pressable, ImageBackground, ScrollView } from "react-native";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function UserHomeScreen() {
  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1604654894610-df63bc536371" }}
      style={styles.background}
      imageStyle={{ opacity: 0.15 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <Pressable style={styles.smallButton} onPress={() => router.push("/my-reservations")}>
            <Text style={styles.smallButtonText}>Moji termini</Text>
          </Pressable>

          <Pressable style={styles.smallButtonOutline} onPress={logout}>
            <Text style={styles.smallButtonOutlineText}>Odjavi se</Text>
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Salon za nokte</Text>
          <Text style={styles.subtitle}>
            Dobro došli! Vaša lepota počinje ovde.
          </Text>
        </View>

        <Pressable style={styles.card} onPress={() => router.push("/services")}>
          <View>
            <Text style={styles.cardTitle}>Zakaži termin</Text>
            <Text style={styles.cardText}>
              Izaberite usluge, datum i slobodno vreme.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Radno vreme salona</Text>
          <Text style={styles.infoText}>Ponedeljak - Petak: 09:00 - 17:00</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f6eee8",
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
    marginBottom: 35,
  },
  smallButton: {
    backgroundColor: "#8a5f52",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  smallButtonText: {
    color: "white",
    fontWeight: "600",
  },
  smallButtonOutline: {
    borderWidth: 1,
    borderColor: "#8a5f52",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  smallButtonOutlineText: {
    color: "#8a5f52",
    fontWeight: "600",
  },
  header: {
    marginBottom: 30,
  },
  welcome: {
    fontSize: 18,
    color: "#6b3f35",
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#6b3f35",
  },
  subtitle: {
    fontSize: 17,
    color: "#5d4037",
    marginTop: 8,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 18,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e0c8bd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4e342e",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    color: "#6d4c41",
    maxWidth: 260,
  },
  arrow: {
    fontSize: 40,
    color: "#8a5f52",
  },
  infoBox: {
    marginTop: 12,
    backgroundColor: "#8a5f52",
    padding: 18,
    borderRadius: 18,
  },
  infoTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  infoText: {
    color: "white",
    fontSize: 15,
  },
});