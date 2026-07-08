import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { getData } from "../firebase/firebaseApi";

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

    loadServices();
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

  const totalDuration = selectedServices.reduce((sum, service) => {
    return sum + Number(service.duration || 0);
  }, 0);

  const totalPrice = selectedServices.reduce((sum, service) => {
    return sum + Number(String(service.price || "0").replace(/\D/g, ""));
  }, 0);

  const continueToReservation = () => {
    if (selectedServices.length === 0) {
      return;
    }

    router.push({
      pathname: "/reservation",
      params: {
        services: JSON.stringify(selectedServices),
        duration: totalDuration.toString(),
        price: totalPrice.toString(),
      },
    });
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1604654894610-df63bc536371",
      }}
      style={styles.background}
      imageStyle={{ opacity: 0.14 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Izaberite usluge</Text>
        <Text style={styles.subtitle}>Možete izabrati jednu ili više usluga.</Text>

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
              <View style={styles.cardTop}>
                <Text style={styles.serviceName}>{service.name}</Text>

                <View style={[styles.circle, isSelected && styles.selectedCircle]}>
                  <Text style={styles.check}>{isSelected ? "✓" : ""}</Text>
                </View>
              </View>

              <Text style={styles.info}>Cena: {service.price || "0"} RSD</Text>
              <Text style={styles.info}>Trajanje: {service.duration || "0"} min</Text>
            </Pressable>
          );
        })}

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Ukupno</Text>
          <Text style={styles.summaryText}>Trajanje: {totalDuration} min</Text>
          <Text style={styles.summaryText}>Cena: {totalPrice} RSD</Text>
        </View>

        <Pressable style={styles.button} onPress={continueToReservation}>
          <Text style={styles.buttonText}>Nastavi na zakazivanje</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#f6eee8" },
  container: { padding: 24, paddingBottom: 40 },
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
    marginBottom: 25,
    marginTop: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#5d4037",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "#e0c8bd",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  selectedCard: {
    borderColor: "#8a5f52",
    backgroundColor: "#ead8cf",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 21,
    fontWeight: "700",
    color: "#4e342e",
    marginBottom: 8,
  },
  info: {
    fontSize: 15,
    color: "#6d4c41",
    marginTop: 3,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#8a5f52",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: { backgroundColor: "#8a5f52" },
  check: { color: "white", fontWeight: "bold" },
  summary: {
    backgroundColor: "#8a5f52",
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
    marginBottom: 18,
  },
  summaryTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryText: {
    color: "white",
    fontSize: 16,
    marginBottom: 3,
  },
  button: {
    backgroundColor: "#8a5f52",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  backButton: {
  position: "absolute",
  top: 45,
  left: 25,
  zIndex: 10,
},

backText: {
  fontSize: 32,
  color: "#8a5f52",
  fontWeight: "600",
},
});