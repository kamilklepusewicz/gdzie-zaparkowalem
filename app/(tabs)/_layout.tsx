import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabsLayout() {
  return (
  <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'green', tabBarInactiveTintColor: '#8E8E93' }}>
    <Tabs.Screen name="index" options={{ title: "Ekran Główny", tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} /> }} />
    <Tabs.Screen name="map" options={{ title: "Mapa", tabBarIcon: ({ color }) => <FontAwesome size={28} name="map" color={color} /> }} />
    <Tabs.Screen name="history" options={{ title: "Historia", tabBarIcon: ({ color }) => <FontAwesome size={28} name="history" color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: "Ustawienia", tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} /> }} />
  </Tabs>
  );
}
