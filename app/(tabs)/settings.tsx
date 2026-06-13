import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const PARKING_LOCATION_KEY = "parking-location";
const PARKING_HISTORY_KEY = "parking-history";
const DISTANCE_UNIT_KEY = "distance-unit";

type DistanceUnit = "metric" | "imperial";

export default function Settings() {
  const [isImperial, setIsImperial] = useState(false);

  const changeDistanceUnit = async (value: boolean) => {
    try {
      setIsImperial(value);

      const unit: DistanceUnit = value ? "imperial" : "metric";
      await AsyncStorage.setItem(DISTANCE_UNIT_KEY, unit);
    } catch (e) {
      console.log("Błąd podczas zapisywania jednostek", e);
      Alert.alert("Błąd", "Nie udało się zapisać ustawień jednostek.");
    }
  };

  const setImperialUnits = async () => {
    try {
      await AsyncStorage.setItem(DISTANCE_UNIT_KEY, "imperial");
      Alert.alert("Sukces", "Ustawiono jednostki: stopy/mile.");
    } catch (e) {
      console.log("Błąd podczas zapisywania jednostek", e);
      Alert.alert("Błąd", "Nie udało się zapisać jednostek.");
    }
  };

  const clearSavedLocation = async () => {
    try {
      await AsyncStorage.removeItem(PARKING_LOCATION_KEY);
      Alert.alert("Sukces", "Zapisana lokalizacja została wyczyszczona.");
    } catch (e) {
      console.log("Błąd podczas czyszczenia zapisanej lokalizacji", e);
      Alert.alert(
        "Błąd",
        "Wystąpił błąd podczas czyszczenia zapisanej lokalizacji.",
      );
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(PARKING_HISTORY_KEY);
      Alert.alert("Sukces", "Historia parkowania została wyczyszczona.");
    } catch (e) {
      console.log("Błąd podczas czyszczenia historii parkowania", e);
      Alert.alert(
        "Błąd",
        "Wystąpił błąd podczas czyszczenia historii parkowania.",
      );
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.removeItem(PARKING_HISTORY_KEY);
      await AsyncStorage.removeItem(PARKING_LOCATION_KEY);
      Alert.alert("Sukces", "Wszystkie dane zostały wyczyszczone.");
    } catch (e) {
      console.log("Błąd podczas czyszczenia wszystkich danych", e);
      Alert.alert(
        "Błąd",
        "Wystąpił błąd podczas czyszczenia wszystkich danych.",
      );
    }
  };

  function confirmClearAll() {
    Alert.alert(
      "Potwierdzenie",
      "Czy na pewno chcesz wyczyścić wszystkie dane? Ta operacja jest nieodwracalna.",
      [
        { text: "Anuluj", style: "cancel" },
        { text: "Wyczyść", style: "destructive", onPress: clearAll },
      ],
    );
  }

  useFocusEffect(
    useCallback(() => {
      const loadDistanceUnit = async () => {
        try {
          const storedUnit = await AsyncStorage.getItem(DISTANCE_UNIT_KEY);

          setIsImperial(storedUnit === "imperial");
        } catch (e) {
          console.log("Błąd podczas ładowania jednostek", e);
        }
      };

      loadDistanceUnit();
    }, []),
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Ustawienia</Text>
        <Pressable style={styles.pressable} onPress={clearSavedLocation}>
          <Text style={styles.pressableText}>Wyczyść zapisaną lokalizację</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={clearHistory}>
          <Text style={styles.pressableText}>Wyczyść historię parkowania</Text>
        </Pressable>
        <Pressable style={styles.pressableRemoveAll} onPress={confirmClearAll}>
          <Text style={styles.pressableText}>Wyczyść wszystkie dane</Text>
        </Pressable>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Jednostki dystansu</Text>
            <Text style={styles.settingDescription}>
              {isImperial ? "Stopy / mile" : "Metry / kilometry"}
            </Text>
          </View>

          <Switch value={isImperial} onValueChange={changeDistanceUnit} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 24,
  },
  pressable: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  pressableRemoveAll: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  pressableText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
