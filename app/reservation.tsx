import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ref, push, get, child } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export default function ReservationScreen() {
  const { service } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const saveReservation = async () => {
    if (!name || !date || !time) {
      alert("Popunite sva polja.");
      return;
    }

    try {
      const snapshot = await get(child(ref(database), "reservations"));

      if (snapshot.exists()) {
        const data = snapshot.val();

        const zauzetTermin = Object.values(data).some((reservation: any) => {
          return (
            reservation.service === service &&
            reservation.date === date &&
            reservation.time === time &&
            reservation.status !== "Odbijeno"
          );
        });

        if (zauzetTermin) {
          alert("Termin nije slobodan. Izaberite drugi datum ili vreme.");
          return;
        }
      }

      await push(ref(database, "reservations"), {
        name,
        service,
        date,
        time,
        status: "Na čekanju",
        createdAt: new Date().toISOString(),
      });

      alert("Rezervacija je uspešno sačuvana!");
      router.replace("/");
    } catch (error) {
      console.error("Greška:", error);
      alert("Greška pri upisu u Firebase.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zakazivanje termina</Text>

      <Text style={styles.service}>
        Usluga: <Text style={{ fontWeight: "bold" }}>{service}</Text>
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ime i prezime"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Datum (npr. 10.07.2026)"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Vreme (npr. 14:30)"
        value={time}
        onChangeText={setTime}
      />

      <Pressable style={styles.button} onPress={saveReservation}>
        <Text style={styles.buttonText}>Pošalji zahtev</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  service: { fontSize: 20, textAlign: "center", marginBottom: 25 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: "#d63384", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});