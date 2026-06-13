import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const PARKING_HISTORY_KEY = "parking-history";

type ParkingLocation = {
  latitude: number;
  longitude: number;
  savedAt: string;
  address?: string;
};

export default function History() {
  const [history, setHistory] = useState<ParkingLocation[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadHistory = async () => {
        try {
          const storedHistory = await AsyncStorage.getItem(PARKING_HISTORY_KEY);

          if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);
            setHistory(parsedHistory);
          } else {
            setHistory([]);
          }
        } catch (e) {
          console.log("Błąd podczas ładowania historii", e);
        }
      };

      loadHistory();
    }, []),
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Historia parkowania</Text>
        <FlatList
          ListEmptyComponent={() => <Text>Brak historii parkowania</Text>}
          data={history}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.address}>
                Adres: {item.address ?? "Nieznany adres"}
              </Text>
              <Text style={styles.savedAt}>
                Zapisano: {new Date(item.savedAt).toLocaleString()}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => item.savedAt + "-" + index}
        />
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
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  address: {
    fontSize: 16,
  },
  savedAt: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});
