import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ref, push, get, child } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";
import { Calendar } from "react-native-calendars";

type Service = {
  id: string;
  name: string;
  price?: string;
  duration?: string;
};

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

const overlaps = (start1: number, end1: number, start2: number, end2: number) => {
  return start1 < end2 && start2 < end1;
};

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return formatDate(copy);
};

const getEndOfYear = () => {
  const year = new Date().getFullYear();
  return `${year}-12-31`;
};

const getDaysUntilEndOfYear = () => {
  const today = new Date();
  const end = new Date(today.getFullYear(), 11, 31);
  const diff = end.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

export default function ReservationScreen() {
  const { services, duration, price } = useLocalSearchParams();

  const selectedServices: Service[] = services ? JSON.parse(services as string) : [];
  const totalDuration = Number(duration || 60);
  const totalPrice = Number(price || 0);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [freeTimes, setFreeTimes] = useState<string[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      const userSnapshot = await get(child(ref(database), `users/${currentUser.uid}`));

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        setName(`${userData.name || ""} ${userData.surname || ""}`.trim());
      }

      const reservationsSnapshot = await get(child(ref(database), "reservations"));
      const reservationList = reservationsSnapshot.exists()
        ? Object.values(reservationsSnapshot.val())
        : [];

      setReservations(reservationList);
      markCalendarDates(reservationList);
    };

    loadData();
  }, []);

  const getFreeTimesForDate = (selectedDate: string, reservationList = reservations) => {
    const possibleTimes: string[] = [];

    for (let start = salonStart; start + totalDuration <= salonEnd; start += step) {
      const end = start + totalDuration;

      const isBusy = reservationList.some((reservation: any) => {
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

    return possibleTimes;
  };

  const markCalendarDates = (reservationList: any[]) => {
    const marks: any = {};
    const today = new Date();
    const numberOfDays = getDaysUntilEndOfYear();

    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = addDays(today, i);
      const free = getFreeTimesForDate(currentDate, reservationList);

      let color = "#8a5f52";

      if (free.length === 0) {
        color = "#b8a69e";
      } else if (free.length <= 2) {
        color = "#c89b7b";
      }

      marks[currentDate] = {
        customStyles: {
          container: {
            backgroundColor: color,
            borderRadius: 8,
          },
          text: {
            color: "white",
            fontWeight: "bold",
          },
        },
      };
    }

    setMarkedDates(marks);
  };

  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;

    setDate(selectedDate);
    setTime("");

    const times = getFreeTimesForDate(selectedDate);
    setFreeTimes(times);

    setMarkedDates({
      ...markedDates,
      [selectedDate]: {
        customStyles: {
          container: {
            backgroundColor: "#5d4037",
            borderRadius: 8,
          },
          text: {
            color: "white",
            fontWeight: "bold",
          },
        },
      },
    });
  };

  const saveReservation = async () => {
    if (!date || !time) {
      alert("Izaberite datum i vreme.");
      return;
    }

    await push(ref(database, "reservations"), {
      name,
      services: selectedServices,
      service: selectedServices.map((s: any) => s.name).join(", "),
      date,
      time,
      duration: totalDuration,
      price: totalPrice,
      status: "Na čekanju",
      userId: auth.currentUser?.uid,
      createdAt: new Date().toISOString(),
    });


    router.replace("/user-home");
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1604654894610-df63bc536371" }}
      style={styles.background}
      imageStyle={{ opacity: 0.13 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Zakazivanje termina</Text>
        <Text style={styles.subtitle}>Izaberite datum i slobodan termin.</Text>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Detalji zakazivanja</Text>
          <Text style={styles.summaryText}>Korisnik: {name}</Text>
          <Text style={styles.summaryText}>
            Usluge: {selectedServices.map((item) => item.name).join(", ")}
          </Text>
          <Text style={styles.summaryText}>Trajanje: {totalDuration} min</Text>
          <Text style={styles.summaryText}>Cena: {totalPrice} RSD</Text>
        </View>

        <Text style={styles.sectionTitle}>Izaberite datum</Text>



        <View style={styles.calendarBox}>
          <Calendar
            markingType="custom"
            minDate={formatDate(new Date())}
            maxDate={getEndOfYear()}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={{
              calendarBackground: "transparent",
              textSectionTitleColor: "#6b3f35",
              selectedDayBackgroundColor: "#5d4037",
              todayTextColor: "#8a5f52",
              dayTextColor: "#4e342e",
              monthTextColor: "#6b3f35",
              arrowColor: "#8a5f52",
            }}
          />
        </View>

        {date !== "" && (
          <>
            <Text style={styles.sectionTitle}>Slobodni termini za {date}</Text>

            {freeTimes.length === 0 ? (
              <Text style={styles.empty}>Nema slobodnih termina za izabrani datum.</Text>
            ) : (
              <View style={styles.timeContainer}>
                {freeTimes.map((item) => (
                  <Pressable
                    key={item}
                    style={[styles.timeButton, time === item && styles.selectedTime]}
                    onPress={() => setTime(item)}
                  >
                    <Text style={[styles.timeText, time === item && styles.selectedTimeText]}>
                      {item}
                    </Text>
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
  },
  title: {
    fontSize: 33,
    fontWeight: "700",
    textAlign: "center",
    color: "#6b3f35",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#5d4037",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
  },
  summary: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e0c8bd",
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4e342e",
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    color: "#6d4c41",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#4e342e",
    marginTop: 25,
    marginBottom: 12,
  },

  calendarBox: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e0c8bd",
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "#c8aaa0",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 10,
  },
  selectedTime: {
    backgroundColor: "#8a5f52",
  },
  timeText: {
    fontSize: 16,
    color: "#5d4037",
    fontWeight: "600",
  },
  selectedTimeText: {
    color: "white",
  },
  empty: {
    fontSize: 16,
    textAlign: "center",
    color: "#6d4c41",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#8a5f52",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});