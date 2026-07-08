import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground } from "react-native";
import { router } from "expo-router";
import { ref, onValue, remove } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";

type Reservation = {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
  userId?: string;
  duration?: number;
  price?: number;
};

export default function MyReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const reservationsRef = ref(database, "reservations");

    const unsubscribe = onValue(reservationsRef, (snapshot) => {
      const data = snapshot.val();
      const currentUser = auth.currentUser;

      if (data && currentUser) {
        const list = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter((item: any) => item.userId === currentUser.uid);

        setReservations(list);
      } else {
        setReservations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const cancelReservation = async (id: string) => {
    await remove(ref(database, `reservations/${id}`));
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1604654894610-df63bc536371" }}
      style={styles.background}
      imageStyle={{ opacity: 0.13 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.push("/user-home")}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.title}>Moji termini</Text>
        <Text style={styles.subtitle}>
          Ovde možete videti svoje zakazane termine.
        </Text>


        {reservations.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nemate zakazane termine.</Text>
            <Text style={styles.emptyText}>
              Vratite se nazad i zakažite novi termin u salonu.
            </Text>

            <Pressable style={styles.button} onPress={() => router.push("/user-home")}>
              <Text style={styles.buttonText}>Vrati se nazad</Text>
            </Pressable>
          </View>
        ) : (
          reservations.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.service}>{item.service}</Text>

              <Text style={styles.text}>Datum: {item.date}</Text>
              <Text style={styles.text}>Vreme: {item.time}</Text>
              <Text style={styles.text}>Trajanje: {item.duration || 0} min</Text>
              <Text style={styles.text}>Cena: {item.price || 0} RSD</Text>

              <View style={styles.statusBox}>
                <Text style={styles.status}>Status: {item.status}</Text>
              </View>

              <Pressable
                style={styles.cancelButton}
                onPress={() => cancelReservation(item.id)}
              >
                <Text style={styles.cancelText}>Otkaži termin</Text>
              </Pressable>
            </View>
          ))
        )}
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
    padding: 24,
    paddingBottom: 40,
    minHeight: "100%",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#6b3f35",
    textAlign: "center",
    marginTop: 25,
  },
  subtitle: {
    fontSize: 16,
    color: "#5d4037",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },
  emptyBox: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 18,
    padding: 25,
    borderWidth: 1,
    borderColor: "#e0c8bd",
    marginTop: 20,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#4e342e",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#6d4c41",
    textAlign: "center",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderWidth: 1,
    borderColor: "#e0c8bd",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  service: {
    fontSize: 21,
    fontWeight: "700",
    color: "#4e342e",
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: "#6d4c41",
    marginBottom: 6,
  },
  statusBox: {
    backgroundColor: "#ead8cf",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  status: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4e342e",
    textAlign: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#8a5f52",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f6eee8",
  },
  cancelText: {
    color: "#8a5f52",
    fontWeight: "700",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#8a5f52",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 13,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 15,
    marginBottom: 15,
  },

  backText: {
    fontSize: 26,
    color: "#8a5f52",
    fontWeight: "700",
  },
});