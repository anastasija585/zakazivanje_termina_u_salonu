import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ref, push, get, child } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";
import { Calendar } from "react-native-calendars";

const salonStart = 9 * 60;
const salonEnd = 17 * 60;
const step = 30;

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (minutes: number) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const overlaps = (
  start1: number,
  end1: number,
  start2: number,
  end2: number
) => {
  return start1 < end2 && start2 < end1;
};

export default function ReservationScreen() {
  const { services, duration } = useLocalSearchParams();

  const selectedServices = services ? JSON.parse(services as string) : [];
  const totalDuration = Number(duration || 60);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [freeTimes, setFreeTimes] = useState<string[]>([]);

  useEffect(() => {
    const loadUserName = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      const snapshot = await get(child(ref(database), `users/${currentUser.uid}`));

      if (snapshot.exists()) {
        setName(snapshot.val().name);
      }
    };

    loadUserName();
  }, []);

  const calculateFreeTimes = async (selectedDate: string) => {
    const snapshot = await get(child(ref(database), "reservations"));
    const reservations = snapshot.exists() ? Object.values(snapshot.val()) : [];

    const possibleTimes: string[] = [];

    for (
      let start = salonStart;
      start + totalDuration <= salonEnd;
      start += step
    ) {
      const end = start + totalDuration;

      const isBusy = reservations.some((reservation: any) => {
        if (reservation.date !== selectedDate) return false;
        if (reservation.status === "Odbijeno") return false;

        const reservationStart = toMinutes(reservation.time);
        const reservationDuration = Number(reservation.duration || 60);
        const reservationEnd = reservationStart + reservationDuration;

        return overlaps(start, end, reservationStart, reservationEnd);
      });

      if (!isBusy) {
        possibleTimes.push(toTime(start));
      }
    }

    setFreeTimes(possibleTimes);
  };

  const saveReservation = async () => {
    if (!date || !time) {
      return;
    }

    await push(ref(database, "reservations"), {
      name,
      services: selectedServices,
      service: selectedServices.join(", "),
      date,
      time,
      duration: totalDuration,
      status: "Na čekanju",
      userId: auth.currentUser?.uid,
      createdAt: new Date().toISOString(),
    });

    router.replace("/user-home");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Zakazivanje termina</Text>

      <Text style={styles.text}>Korisnik: {name}</Text>

      <Text style={styles.text}>
        Usluge: {selectedServices.join(", ")}
      </Text>

      <Text style={styles.text}>
        Ukupno trajanje: {totalDuration} min
      </Text>

      <Text style={styles.sectionTitle}>Izaberite datum</Text>

      <Calendar
        minDate={new Date().toISOString().split("T")[0]}
        onDayPress={(day) => {
          setDate(day.dateString);
          setTime("");
          calculateFreeTimes(day.dateString);
        }}
        markedDates={{
          [date]: {
            selected: true,
            selectedColor: "#d63384",
          },
        }}
      />

      {date !== "" && (
        <>
          <Text style={styles.sectionTitle}>Slobodni termini</Text>

          {freeTimes.length === 0 ? (
            <Text style={styles.empty}>Nema slobodnih termina za izabrani datum.</Text>
          ) : (
            <View style={styles.timeContainer}>
              {freeTimes.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.timeButton,
                    time === item && styles.selectedTime,
                  ]}
                  onPress={() => setTime(item)}
                >
                  <Text style={styles.timeText}>{item}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </>
      )}

      <Pressable style={styles.button} onPress={saveReservation}>
        <Text style={styles.buttonText}>Pošalji zahtev</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 25, marginBottom: 15 },
  timeContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  timeButton: { backgroundColor: "#eee", padding: 12, borderRadius: 8, marginBottom: 10 },
  selectedTime: { backgroundColor: "#d63384" },
  timeText: { fontSize: 16 },
  empty: { fontSize: 16, textAlign: "center", marginTop: 10 },
  button: { backgroundColor: "#d63384", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 25, marginBottom: 30 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});