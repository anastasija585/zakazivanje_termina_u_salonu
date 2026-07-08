import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { getData, postData, patchData, deleteData } from "../firebase/firebaseApi";

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

  const loadServices = async () => {
    try {
      const data = await getData("services");

      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setServices(list);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Greška pri učitavanju usluga:", error);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const saveService = async () => {
    if (!name || !price || !duration) {
      return;
    }

    if (editingId) {
      await patchData(`services/${editingId}`, {
        name,
        price,
        duration,
      });

      setEditingId(null);
    } else {
      await postData("services", {
        name,
        price,
        duration,
      });
    }

    setName("");
    setPrice("");
    setDuration("");

    await loadServices();
  };

  const editService = (service: Service) => {
    setEditingId(service.id);
    setName(service.name);
    setPrice(service.price || "");
    setDuration(service.duration || "");
  };

  const deleteService = async (id: string) => {
    await deleteData(`services/${id}`);
    await loadServices();
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1604654894610-df63bc536371",
      }}
      style={styles.background}
      imageStyle={{ opacity: 0.12 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.push("/admin")}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.title}>Usluge</Text>
        <Text style={styles.subtitle}>Dodavanje i izmena usluga u salonu</Text>

        <View style={styles.formBox}>
          <TextInput
            style={styles.input}
            placeholder="Naziv usluge"
            placeholderTextColor="#9a7b70"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Cena usluge"
            placeholderTextColor="#9a7b70"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Trajanje u minutima, npr. 60"
            placeholderTextColor="#9a7b70"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />

          <Pressable style={styles.addButton} onPress={saveService}>
            <Text style={styles.buttonText}>
              {editingId ? "Sačuvaj izmenu" : "Dodaj uslugu"}
            </Text>
          </Pressable>
        </View>

        {services.map((service) => (
          <View key={service.id} style={styles.card}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.text}>Cena: {service.price || "Nije uneta"} RSD</Text>
            <Text style={styles.text}>
              Trajanje: {service.duration || "Nije uneto"} min
            </Text>

            <View style={styles.row}>
              <Pressable
                style={styles.outlineButton}
                onPress={() => editService(service)}
              >
                <Text style={styles.outlineButtonText}>Izmeni</Text>
              </Pressable>

              <Pressable
                style={styles.outlineButton}
                onPress={() => deleteService(service.id)}
              >
                <Text style={styles.outlineButtonText}>Obriši</Text>
              </Pressable>
            </View>
          </View>
        ))}
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
    fontSize: 34,
    fontWeight: "700",
    color: "#6b3f35",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#5d4037",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },
  formBox: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e0c8bd",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#b99b8f",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 13,
    marginBottom: 12,
    fontSize: 15,
    color: "#4e342e",
  },
  addButton: {
    backgroundColor: "#8a5f52",
    paddingVertical: 14,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 5,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderWidth: 1,
    borderColor: "#e0c8bd",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },
  serviceName: {
    fontSize: 21,
    fontWeight: "700",
    color: "#4e342e",
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: "#6d4c41",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#8a5f52",
    backgroundColor: "#f6eee8",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
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
    marginBottom: 15,
  },
  backText: {
    fontSize: 26,
    color: "#8a5f52",
    fontWeight: "700",
  },
});