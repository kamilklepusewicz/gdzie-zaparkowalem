import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const PARKING_LOCATION_KEY = "parking-location";

type ParkingLocation = {
  latitude: number;
  longitude: number;
  savedAt: string;
};

export default function Index() {
  const [locationText, setLocationText] = useState<string>(
    "Brak zapisanej lokalizacji",
  );
  const [location, setLocation] = useState<ParkingLocation | null>(null);

  const storeData = async (value: ParkingLocation) => {
    try {
      await AsyncStorage.setItem(PARKING_LOCATION_KEY, JSON.stringify(value));
    } catch (e) {
      console.log("Błąd podczas zapisywania danych", e);
    }
  };

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem(PARKING_LOCATION_KEY);
        if (storedLocation) {
          const parsedLocation = JSON.parse(storedLocation);
          setLocation(parsedLocation);
          setLocationText("Zapisana lokalizacja:");
        }
      } catch (e) {
        console.log("Błąd podczas ładowania danych", e);
      }
    };
    loadLocation();
  }, []);

  async function saveParkingLocation() {
    setLocationText("Pobieranie lokalizacji...");
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationText("Brak uprawnień do lokalizacji");
      return;
    }
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const parkingLocation: ParkingLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        savedAt: new Date().toISOString(),
      };
      setLocationText("Lokalizacja zapisana!");
      await storeData(parkingLocation);
      setLocation(parkingLocation);
    } catch (e) {
      setLocationText("Błąd podczas pobierania lokalizacji");
      console.log(e);
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
            ? ` (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
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
