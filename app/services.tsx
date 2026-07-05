import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

const services = [
  "Gel lak",
  "Izlivanje noktiju",
  "Korekcija",
  "Pedikir",
];

export default function ServicesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Izaberite uslugu</Text>

      {services.map((service) => (
        <Pressable
          key={service}
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/reservation",
              params: { service },
            })
          }
        >
          <Text style={styles.buttonText}>{service}</Text>
        </Pressable>
      ))}
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