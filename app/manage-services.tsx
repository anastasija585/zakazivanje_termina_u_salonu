import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { ref, push, onValue, update, remove } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

type Service = {
  id: string;
  name: string;
  price?: string;
  duration?: string;
};

export default function ManageServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const servicesRef = ref(database, "services");

    const unsubscribe = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setServices(list);
      } else {
        setServices([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveService = async () => {
    if (!name || !price || !duration) {
      return;
    }

    if (editingId) {
      await update(ref(database, `services/${editingId}`), {
        name,
        price,
        duration,
      });
      setEditingId(null);
    } else {
      await push(ref(database, "services"), {
        name,
        price,
        duration,
      });
    }

    setName("");
    setPrice("");
    setDuration("");
  };

  const editService = (service: Service) => {
    setEditingId(service.id);
    setName(service.name);
    setPrice(service.price || "");
    setDuration(service.duration || "");
  };

  const deleteService = async (id: string) => {
    await remove(ref(database, `services/${id}`));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upravljanje uslugama</Text>

      <TextInput
        style={styles.input}
        placeholder="Naziv usluge"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Cena usluge"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Trajanje u minutima, npr. 60"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <Pressable style={styles.addButton} onPress={saveService}>
        <Text style={styles.buttonText}>
          {editingId ? "Sačuvaj izmenu" : "Dodaj uslugu"}
        </Text>
      </Pressable>

      {services.map((service) => (
        <View key={service.id} style={styles.card}>
          <Text style={styles.text}>Naziv: {service.name}</Text>
          <Text style={styles.text}>Cena: {service.price || "Nije uneta"} RSD</Text>
          <Text style={styles.text}>Trajanje: {service.duration || "Nije uneto"} min</Text>

          <Pressable
            style={[styles.button, styles.editButton]}
            onPress={() => editService(service)}
          >
            <Text style={styles.buttonText}>Izmeni</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.deleteButton]}
            onPress={() => deleteService(service.id)}
          >
            <Text style={styles.buttonText}>Obriši</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  addButton: { backgroundColor: "#198754", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  card: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 15, marginBottom: 15 },
  text: { fontSize: 16, marginBottom: 5 },
  button: { padding: 12, borderRadius: 8, marginTop: 8, alignItems: "center" },
  editButton: { backgroundColor: "#0d6efd" },
  deleteButton: { backgroundColor: "#dc3545" },
  buttonText: { color: "white", fontWeight: "bold" },
});