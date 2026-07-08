import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ImageBackground } from "react-native";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { ref, onValue, update, remove } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";

type Reservation = {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  status: string;
  duration?: number;
  price?: number;
};

export default function AdminScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editStatus, setEditStatus] = useState("");

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
    await update(ref(database, `reservations/${id}`), { status });
  };

  const deleteReservation = async (id: string) => {
    await remove(ref(database, `reservations/${id}`));
  };

  const startEdit = (item: Reservation) => {
    setEditingId(item.id);
    setEditDate(item.date);
    setEditTime(item.time);
    setEditStatus(item.status);
  };

  const saveEdit = async () => {
    if (!editingId || !editDate || !editTime || !editStatus) {
      alert("Popunite datum, vreme i status.");
      return;
    }

    await update(ref(database, `reservations/${editingId}`), {
      date: editDate,
      time: editTime,
      status: editStatus,
    });

    setEditingId(null);
    setEditDate("");
    setEditTime("");
    setEditStatus("");
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1604654894610-df63bc536371" }}
      style={styles.background}
      imageStyle={{ opacity: 0.12 }}
    >

      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.replace("/")}>
        </Pressable>

        <View style={styles.topRow}> </View>
        <View style={styles.topRow}>
          <Pressable style={styles.smallButton} onPress={() => router.push("/manage-services" as any)}>
            <Text style={styles.smallButtonText}>Usluge</Text>
          </Pressable>

          <Pressable style={styles.smallButtonOutline} onPress={logout}>
            <Text style={styles.smallButtonOutlineText}>Odjavi se</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Admin panel</Text>
        <Text style={styles.subtitle}>Pregled i upravljanje terminima</Text>

        {reservations.length === 0 ? (
          <Text style={styles.empty}>Nema rezervacija.</Text>
        ) : (
          reservations.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.text}>Usluga: {item.service}</Text>
              <Text style={styles.text}>Datum: {item.date}</Text>
              <Text style={styles.text}>Vreme: {item.time}</Text>
              <Text style={styles.text}>Trajanje: {item.duration || 0} min</Text>
              <Text style={styles.text}>Cena: {item.price || 0} RSD</Text>
              <Text style={styles.status}>Status: {item.status}</Text>

              {editingId === item.id ? (
                <View style={styles.editBox}>
                  <TextInput
                    style={styles.input}
                    placeholder="Datum npr. 2026-07-20"
                    placeholderTextColor="#9a7b70"
                    value={editDate}
                    onChangeText={setEditDate}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Vreme npr. 10:30"
                    placeholderTextColor="#9a7b70"
                    value={editTime}
                    onChangeText={setEditTime}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Status"
                    placeholderTextColor="#9a7b70"
                    value={editStatus}
                    onChangeText={setEditStatus}
                  />

                  <Pressable style={styles.mainButton} onPress={saveEdit}>
                    <Text style={styles.buttonText}>Sačuvaj izmenu</Text>
                  </Pressable>

                  <Pressable style={styles.outlineButton} onPress={() => setEditingId(null)}>
                    <Text style={styles.outlineButtonText}>Otkaži izmenu</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <View style={styles.actionRow}>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => changeStatus(item.id, "Potvrđeno")}
                    >
                      <Text style={styles.buttonText}>Potvrdi</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionButton}
                      onPress={() => changeStatus(item.id, "Odbijeno")}
                    >
                      <Text style={styles.buttonText}>Odbij</Text>
                    </Pressable>
                  </View>

                  <View style={styles.actionRow}>
                    <Pressable
                      style={styles.actionButtonLight}
                      onPress={() => startEdit(item)}
                    >
                      <Text style={styles.actionButtonLightText}>Izmeni</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionButtonLight}
                      onPress={() => deleteReservation(item.id)}
                    >
                      <Text style={styles.actionButtonLightText}>Obriši</Text>
                    </Pressable>
                  </View>
                </>
              )}
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
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
    marginBottom: 25,
  },
  smallButton: {
    backgroundColor: "#8a5f52",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  smallButtonText: {
    color: "white",
    fontWeight: "700",
  },
  smallButtonOutline: {
    borderWidth: 1,
    borderColor: "#8a5f52",
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  smallButtonOutlineText: {
    color: "#8a5f52",
    fontWeight: "700",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#6b3f35",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#5d4037",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },
  empty: {
    textAlign: "center",
    fontSize: 17,
    color: "#5d4037",
    marginTop: 30,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderWidth: 1,
    borderColor: "#e0c8bd",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  name: {
    fontSize: 21,
    fontWeight: "700",
    color: "#4e342e",
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: "#6d4c41",
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4e342e",
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#8a5f52",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonLight: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#8a5f52",
    backgroundColor: "#f6eee8",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonLightText: {
    color: "#8a5f52",
    fontWeight: "700",
  },
  editBox: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#b99b8f",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
    color: "#4e342e",
  },
  mainButton: {
    backgroundColor: "#8a5f52",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#8a5f52",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  outlineButtonText: {
    color: "#8a5f52",
    fontWeight: "700",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 10,
  },

  backText: {
    fontSize: 26,
    color: "#8a5f52",
    fontWeight: "600",
  },
});