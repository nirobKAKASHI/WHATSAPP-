import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../../components/GlassCard';

export default function MemorizeScreen() {
	return (
		<View style={styles.container}>
			<GlassCard style={{ padding: 20 }}>
				<Text style={styles.title}>Memorize</Text>
				<Text style={styles.sub}>SRS queue coming soon.</Text>
			</GlassCard>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { color: 'white', fontFamily: 'Inter_700Bold', fontSize: 20 },
	sub: { color: 'white', opacity: 0.85, fontFamily: 'Inter_400Regular' },
});
