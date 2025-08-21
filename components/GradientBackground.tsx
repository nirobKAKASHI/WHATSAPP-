import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { usePrefs } from '../lib/prefs';

export function GradientBackground() {
	const theme = usePrefs((s) => s.theme);
	if (theme === 'amoled') {
		return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />;
	}
	return (
		<LinearGradient
			colors={["#0F2027", "#203A43", "#2C5364"]}
			style={StyleSheet.absoluteFill}
			start={{ x: 0.2, y: 0 }}
			end={{ x: 1, y: 1 }}
		/>
	);
}
