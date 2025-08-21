import { Tabs } from 'expo-router';

export default function TabsLayout() {
	return (
		<Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'white', tabBarStyle: { backgroundColor: 'rgba(0,0,0,0.2)', position: 'absolute', borderTopWidth: 0 } }}>
			<Tabs.Screen name="index" options={{ title: 'Home' }} />
			<Tabs.Screen name="surah/index" options={{ title: 'Surahs' }} />
			<Tabs.Screen name="memorize/index" options={{ title: 'Memorize' }} />
			<Tabs.Screen name="vocab/index" options={{ title: 'Vocab' }} />
			<Tabs.Screen name="settings/index" options={{ title: 'Settings' }} />
			<Tabs.Screen name="search/index" options={{ title: 'Search' }} />
		</Tabs>
	);
}
