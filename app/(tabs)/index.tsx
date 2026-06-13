import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const PARKING_LOCATION_KEY = "parking-location";
const PARKING_HISTORY_KEY = "parking-history";

type ParkingLocation = {
  latitude: number;
  longitude: number;
  savedAt: string;
  address?: string;
};

export function formatAddress(
  address: Location.LocationGeocodedAddress | null,
) {
  if (!address) {
    return "Nieznany adres";
  }

  const streetWithNumber = [address.street, address.streetNumber]
    .filter(Boolean)
    .join(" ");

  const parts = [streetWithNumber, address.city].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Nieznany adres";
}

export default function Index() {
  const [locationText, setLocationText] = useState<string>(
    "Brak zapisanej lokalizacji",
  );
  const [location, setLocation] = useState<ParkingLocation | null>(null);

  const storeParkingLocation = async (value: ParkingLocation) => {
    try {
      await AsyncStorage.setItem(PARKING_LOCATION_KEY, JSON.stringify(value));
    } catch (e) {
      console.log("Błąd podczas zapisywania danych", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadLocation = async () => {
        try {
          const storedLocation =
            await AsyncStorage.getItem(PARKING_LOCATION_KEY);

          if (storedLocation) {
            const parsedLocation = JSON.parse(storedLocation);
            setLocation(parsedLocation);
            setLocationText("Zapisana lokalizacja: ");
          } else {
            setLocation(null);
            setLocationText("Brak zapisanej lokalizacji");
          }
        } catch (e) {
          console.log("Błąd podczas ładowania danych", e);
          setLocationText("Błąd podczas ładowania lokalizacji");
        }
      };

      loadLocation();
    }, []),
  );

  async function saveParkingLocation() {
    setLocationText("Pobieranie lokalizacji...");
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationText("Brak uprawnień do lokalizacji");
      return;
    }
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      let addressText = "Nieznany adres";

      try {
        const geocodedAddress = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        addressText = formatAddress(geocodedAddress[0] ?? null);
      } catch (e) {
        console.log("Błąd podczas pobierania adresu", e);
      }
      const parkingLocation: ParkingLocation = {
        latitude: latitude,
        longitude: longitude,
        savedAt: new Date().toISOString(),
        address: addressText,
      };
      await storeParkingLocation(parkingLocation);
      await addLocationToHistory(parkingLocation);
      setLocation(parkingLocation);
      setLocationText("Lokalizacja zapisana!");
    } catch (e) {
      setLocationText("Błąd podczas pobierania lokalizacji");
      console.log(e);
    }
  }

  async function addLocationToHistory(location: ParkingLocation) {
    try {
      const historyString = await AsyncStorage.getItem(PARKING_HISTORY_KEY);
      let history: ParkingLocation[] = historyString
        ? JSON.parse(historyString)
        : [];
      history = [location, ...history];
      await AsyncStorage.setItem(PARKING_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.log("Błąd podczas zapisywania historii", e);
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
        <Text style={styles.textLocation}>{locationText}</Text>
        {location?.address && (
          <Text style={styles.textLocation}>{location.address}</Text>
        )}
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
