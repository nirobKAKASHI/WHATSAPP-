import { View, Text, StyleSheet } from 'react-native';
import { LanguageToggle } from '../../components/LanguageToggle';
import { GlassCard } from '../../components/GlassCard';

export default function SettingsScreen() {
	return (
		<View style={styles.container}>
			<GlassCard style={{ padding: 20 }}>
				<Text style={styles.title}>Settings</Text>
				<View style={{ height: 12 }} />
				<LanguageToggle />
			</GlassCard>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { color: 'white', fontFamily: 'Inter_700Bold', fontSize: 20 },
});
