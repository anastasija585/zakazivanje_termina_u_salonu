import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { ref, onValue, remove } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";

type Reservation = {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  status: string;
  userId?: string;
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
    alert("Termin je otkazan.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Moji termini</Text>

      {reservations.length === 0 ? (
        <Text style={styles.empty}>Nemate zakazane termine.</Text>
      ) : (
        reservations.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.text}>Usluga: {item.service}</Text>
            <Text style={styles.text}>Datum: {item.date}</Text>
            <Text style={styles.text}>Vreme: {item.time}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>

            <Pressable
              style={styles.cancelButton}
              onPress={() => cancelReservation(item.id)}
            >
              <Text style={styles.buttonText}>Otkaži termin</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  empty: { textAlign: "center", fontSize: 18 },
  card: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 15, marginBottom: 15 },
  text: { fontSize: 16, marginBottom: 5 },
  status: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  cancelButton: { backgroundColor: "#dc3545", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
});