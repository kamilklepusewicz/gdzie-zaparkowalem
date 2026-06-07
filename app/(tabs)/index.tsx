import * as Location from "expo-location";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [locationText, setLocationText] = useState<string>(
    "Brak zapisanej lokalizacji",
  );
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  async function saveParkingLocation() {
    setLocationText("Pobieranie lokalizacji...");
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationText("Brak uprawnień do lokalizacji");
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocationText("Lokalizacja zapisana!");
      setLocation(location);
    } catch (error) {
      setLocationText("Błąd podczas pobierania lokalizacji");
      console.log(error);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.textHeader}>Gdzie zaparkowałem?</Text>
        <Text style={styles.text}>Zapisz lokalizację auta</Text>
        <Pressable style={styles.pressable} onPress={saveParkingLocation}>
          <Text style={styles.textButton}>Zapisz pozycję</Text>
        </Pressable>
        <Text style={styles.textLocation}>
          {locationText}
          {location
            ? ` (${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)})`
            : ""}
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  textButton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  textHeader: {
    fontSize: 24,
    marginBottom: 10,
    color: "#333333",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666666",
  },
  textLocation: {
    fontSize: 16,
    marginTop: 20,
    color: "#333333",
  },
});
