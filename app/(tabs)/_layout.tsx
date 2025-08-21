import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
	return (
		<Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'white', tabBarStyle: { backgroundColor: 'rgba(0,0,0,0.2)', position: 'absolute', borderTopWidth: 0 } }}>
			<Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
			<Tabs.Screen name="surah/index" options={{ title: 'Surahs', tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} /> }} />
			<Tabs.Screen name="memorize/index" options={{ title: 'Memorize', tabBarIcon: ({ color, size }) => <Ionicons name="flash" color={color} size={size} /> }} />
			<Tabs.Screen name="vocab/index" options={{ title: 'Vocab', tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} /> }} />
			<Tabs.Screen name="search/index" options={{ title: 'Search', tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} /> }} />
			<Tabs.Screen name="settings/index" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} /> }} />
		</Tabs>
	);
}