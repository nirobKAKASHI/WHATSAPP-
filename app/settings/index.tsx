import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LanguageToggle } from '../../components/LanguageToggle';
import { GlassCard } from '../../components/GlassCard';
import { RECITERS, usePrefs } from '../../lib/prefs';

export default function SettingsScreen() {
	const reciter = usePrefs((s) => s.reciter);
	const setReciter = usePrefs((s) => s.setReciter);
	return (
		<View style={styles.container}>
			<GlassCard style={{ padding: 20 }}>
				<Text style={styles.title}>Settings</Text>
				<View style={{ height: 12 }} />
				<LanguageToggle />
				<View style={{ height: 20 }} />
				<Text style={styles.section}>Reciter</Text>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
					{RECITERS.map((r) => (
						<Pressable key={r.id} onPress={() => setReciter(r.id)} style={[styles.pill, reciter === r.id && styles.pillActive]}>
							<Text style={styles.pillText}>{r.label}</Text>
						</Pressable>
					))}
				</View>
			</GlassCard>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { color: 'white', fontFamily: 'Inter_700Bold', fontSize: 20 },
	section: { color: 'white', fontFamily: 'Inter_600SemiBold', marginBottom: 8 },
	pill: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)' },
	pillActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
	pillText: { color: 'white', fontFamily: 'Inter_400Regular' },
});
