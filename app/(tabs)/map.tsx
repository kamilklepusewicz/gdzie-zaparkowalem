import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const PARKING_LOCATION_KEY = "parking-location";

const USE_TEST_USER_LOCATION = false;

const TEST_USER_LOCATION: UserLocation = {
  latitude: 51.0765,
  longitude: 17.034,
};

type ParkingLocation = {
  latitude: number;
  longitude: number;
  savedAt: string;
  address?: string;
};

type UserLocation = {
  latitude: number;
  longitude: number;
};

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371000;
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function Map() {
  const [location, setLocation] = useState<ParkingLocation | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  function getRegion(location: ParkingLocation) {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  useEffect(() => {
    if (location && userLocation) {
      mapRef.current?.fitToCoordinates(
        [
          {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        ],
        {
          edgePadding: {
            top: 80,
            right: 80,
            bottom: 140,
            left: 80,
          },
          animated: true,
        },
      );
    } else if (location) {
      mapRef.current?.animateToRegion(getRegion(location), 500);
    }
  }, [location, userLocation]);

  useFocusEffect(
    useCallback(() => {
      const loadLocation = async () => {
        try {
          const storedLocation =
            await AsyncStorage.getItem(PARKING_LOCATION_KEY);

          if (storedLocation) {
            const parsedLocation = JSON.parse(storedLocation);
            setLocation(parsedLocation);
          } else {
            setLocation(null);
          }
        } catch (e) {
          console.log("Błąd podczas ładowania lokalizacji", e);
          setLocation(null);
        }
      };
      loadLocation();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let subscription: Location.LocationSubscription | null = null;
      const startWatchingUserLocation = async () => {
        if (USE_TEST_USER_LOCATION) {
          setUserLocation(TEST_USER_LOCATION);
          return;
        }
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Brak uprawnień do lokalizacji");
          return;
        }
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
          },
          (currentLocation) => {
            setUserLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            });
          },
        );
      };
      startWatchingUserLocation();
      return () => {
        subscription?.remove();
      };
    }, []),
  );

  const distance =
    location && userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude,
          location.longitude,
        )
      : null;

  const distanceText =
    distance === null
      ? "Pobieranie lokalizacji użytkownika..."
      : distance < 1000
        ? `${Math.round(distance)} m od auta`
        : `${(distance / 1000).toFixed(2)} km od auta`;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {location == null ? (
          <Text>Brak zapisanej lokalizacji</Text>
        ) : (
          <MapView
            key={location.savedAt}
            ref={mapRef}
            initialRegion={getRegion(location)}
            style={styles.map}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={`Auto: ${location.address ?? "Nieznany adres"}`}
              description={`Zapisano: ${new Date(
                location.savedAt,
              ).toLocaleString()}`}
              pinColor={"#007AFF"}
              zIndex={1}
            ></Marker>
            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Twoja lokalizacja"
                pinColor="red"
                zIndex={2}
              />
            )}
            {userLocation && (
              <Polyline
                coordinates={[
                  {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  },
                  {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                ]}
                strokeColor="#007AFF"
                strokeWidth={4}
                zIndex={3}
              />
            )}
          </MapView>
        )}
        {location && (
          <View style={styles.distancePanel}>
            <Text style={styles.distanceText}>{distanceText}</Text>
          </View>
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
    backgroundColor: "#F5FCFF",
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  distancePanel: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  distanceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
