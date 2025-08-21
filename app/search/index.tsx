import { useState } from 'react';
import { View, TextInput, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { searchQuran } from '../../lib/search';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import { GlassCard } from '../../components/GlassCard';

export default function SearchScreen() {
	const { i18n } = useTranslation();
	const [q, setQ] = useState('');
	const [results, setResults] = useState<Array<{ surah: number; ayah: number; text: string }>>([]);

	const onSubmit = async () => {
		const r = await searchQuran(q, i18n.language === 'sw' ? 'sw' : 'en');
		setResults(r);
	};

	return (
		<View style={styles.container}>
			<View style={styles.searchRow}>
				<TextInput placeholder="Search..." placeholderTextColor="#ddd" value={q} onChangeText={setQ} onSubmitEditing={onSubmit} style={styles.input} />
			</View>
			<FlatList
				data={results}
				keyExtractor={(item, idx) => `${item.surah}:${item.ayah}:${idx}`}
				renderItem={({ item }) => (
					<Link href={`/surah/${item.surah}`} asChild>
						<Pressable>
							<GlassCard style={{ padding: 14 }}>
								<Text style={styles.title}>Surah {item.surah}:{item.ayah}</Text>
								<Text style={styles.text}>{item.text}</Text>
							</GlassCard>
						</Pressable>
					</Link>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 12 },
	searchRow: { flexDirection: 'row', gap: 8 },
	input: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' },
	title: { color: 'white', fontFamily: 'Inter_700Bold' },
	text: { color: 'white', opacity: 0.9, fontFamily: 'Inter_400Regular' },
});
