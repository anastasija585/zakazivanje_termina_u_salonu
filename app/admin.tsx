import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { ref, onValue, update, remove } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

type Reservation = {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  status: string;
};

export default function AdminScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const reservationsRef = ref(database, "reservations");

    const unsubscribe = onValue(reservationsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setReservations(list);
      } else {
        setReservations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const changeStatus = async (id: string, status: string) => {
    await update(ref(database, `reservations/${id}`), {
      status,
    });
  };

  const deleteReservation = async (id: string) => {
    await remove(ref(database, `reservations/${id}`));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin panel</Text>

      {reservations.length === 0 ? (
        <Text style={styles.empty}>Nema rezervacija.</Text>
      ) : (
        reservations.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.text}>Ime: {item.name}</Text>
            <Text style={styles.text}>Usluga: {item.service}</Text>
            <Text style={styles.text}>Datum: {item.date}</Text>
            <Text style={styles.text}>Vreme: {item.time}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>

            <Pressable
              style={[styles.button, styles.confirm]}
              onPress={() => changeStatus(item.id, "Potvrđeno")}
            >
              <Text style={styles.buttonText}>Potvrdi</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.reject]}
              onPress={() => changeStatus(item.id, "Odbijeno")}
            >
              <Text style={styles.buttonText}>Odbij</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.delete]}
              onPress={() => deleteReservation(item.id)}
            >
              <Text style={styles.buttonText}>Obriši</Text>
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
  button: { padding: 12, borderRadius: 8, marginTop: 8, alignItems: "center" },
  confirm: { backgroundColor: "#198754" },
  reject: { backgroundColor: "#dc3545" },
  delete: { backgroundColor: "#6c757d" },
  buttonText: { color: "white", fontWeight: "bold" },
});