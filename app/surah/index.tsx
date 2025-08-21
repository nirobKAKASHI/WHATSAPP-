import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchSurahList } from '../../lib/quran';
import { GlassCard } from '../../components/GlassCard';
import { useTranslation } from 'react-i18next';

export default function SurahListScreen() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [surahs, setSurahs] = useState<Array<{ number: number; englishName: string; name: string; revelationType: string }>>([]);

	useEffect(() => {
		fetchSurahList().then((data) => { setSurahs(data); setLoading(false); });
	}, []);

	if (loading) return <View style={styles.center}><ActivityIndicator color="#fff" /></View>;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{t('surah.title')}</Text>
			<FlatList
				data={surahs}
				keyExtractor={(item) => String(item.number)}
				renderItem={({ item }) => (
					<Link href={`/surah/${item.number}`} asChild>
						<Pressable>
							<GlassCard style={styles.row}>
								<Text style={styles.num}>{item.number}</Text>
								<View style={{ flex: 1 }}>
									<Text style={styles.name}>{item.englishName}</Text>
									<Text style={styles.meta}>{item.name} · {item.revelationType}</Text>
								</View>
							</GlassCard>
						</Pressable>
					</Link>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, gap: 12 },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	title: { fontFamily: 'Inter_700Bold', fontSize: 22, color: 'white', marginBottom: 12 },
	row: { padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center' },
	num: { width: 28, textAlign: 'center', color: 'white', fontFamily: 'Inter_600SemiBold' },
	name: { color: 'white', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
	meta: { color: 'white', opacity: 0.8, fontFamily: 'Inter_400Regular' },
});
