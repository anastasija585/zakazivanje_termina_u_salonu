import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

type Service = {
  id: string;
  name: string;
  price?: string;
};

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Izaberite uslugu</Text>

      {services.map((service) => (
        <Pressable
          key={service.id}
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/reservation",
              params: { service: service.name },
            })
          }
        >
          <Text style={styles.buttonText}>
            {service.name}
            {service.price ? ` - ${service.price} RSD` : ""}
          </Text>
        </Pressable>
      ))}

      {services.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Nema dostupnih usluga.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#d63384",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});