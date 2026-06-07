import { Text, StyleSheet, Pressable } from "react-native";
import {useState} from 'react';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [locationText, setLocationText] = useState("Brak zapisanej lokalizacji");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.textHeader}>Gdzie zaparkowałem?</Text>
        <Text style={styles.text}>Zapisz lokalizację auta</Text>
        <Pressable style={styles.pressable} onPress={() => setLocationText("Pozycja auta została zapisana!")}>
          <Text style={styles.textButton}>Zapisz pozycję</Text>
        </Pressable>
        <Text style={styles.textLocation}>{locationText}</Text>
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