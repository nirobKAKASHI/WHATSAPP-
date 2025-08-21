import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export function GradientBackground() {
	return (
		<LinearGradient
			colors={["#0F2027", "#203A43", "#2C5364"]}
			style={StyleSheet.absoluteFill}
			start={{ x: 0.2, y: 0 }}
			end={{ x: 1, y: 1 }}
		/>
	);
}
