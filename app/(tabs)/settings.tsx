import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const PARKING_LOCATION_KEY = "parking-location";
const PARKING_HISTORY_KEY = "parking-history";

export default function Settings() {
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
});
