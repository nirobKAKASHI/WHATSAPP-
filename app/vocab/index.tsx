import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../../components/GlassCard';

export default function VocabScreen() {
	return (
		<View style={styles.container}>
			<GlassCard style={{ padding: 20 }}>
				<Text style={styles.title}>Vocabulary</Text>
				<Text style={styles.sub}>Daily 10 review coming soon.</Text>
			</GlassCard>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { color: 'white', fontFamily: 'Inter_700Bold', fontSize: 20 },
	sub: { color: 'white', opacity: 0.85, fontFamily: 'Inter_400Regular' },
});
