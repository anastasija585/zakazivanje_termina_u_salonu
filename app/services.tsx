import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

type Service = {
  id: string;
  name: string;
  price?: string;
  duration?: string;
};

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

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

  const toggleService = (service: Service) => {
    const alreadySelected = selectedServices.some(
      (item) => item.id === service.id
    );

    if (alreadySelected) {
      setSelectedServices(
        selectedServices.filter((item) => item.id !== service.id)
      );
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const continueToReservation = () => {
    if (selectedServices.length === 0) {
      return;
    }

    const totalDuration = selectedServices.reduce((sum, service) => {
      return sum + Number(service.duration || 0);
    }, 0);

    const serviceNames = selectedServices.map((service) => service.name);

    router.push({
      pathname: "/reservation",
      params: {
        services: JSON.stringify(serviceNames),
        duration: totalDuration.toString(),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Izaberite usluge</Text>

      {services.length === 0 && (
        <Text style={styles.empty}>Nema dostupnih usluga.</Text>
      )}

      {services.map((service) => {
        const isSelected = selectedServices.some(
          (item) => item.id === service.id
        );

        return (
          <Pressable
            key={service.id}
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={() => toggleService(service)}
          >
            <Text style={styles.serviceName}>{service.name}</Text>

            {service.price ? (
              <Text style={styles.price}>Cena: {service.price} RSD</Text>
            ) : null}
          </Pressable>
        );
      })}

      <Pressable style={styles.button} onPress={continueToReservation}>
        <Text style={styles.buttonText}>Nastavi na zakazivanje</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  empty: { textAlign: "center", marginTop: 20, fontSize: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  selectedCard: {
    borderColor: "#d63384",
    backgroundColor: "#fde2ef",
  },
  serviceName: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  price: { fontSize: 16 },
  button: {
    backgroundColor: "#d63384",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});