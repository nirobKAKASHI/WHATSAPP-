import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { getSurah, type Ayah } from '../../lib/quran';
import { AudioControls } from '../../components/AudioControls';
import { GlassCard } from '../../components/GlassCard';
import { useTranslation } from 'react-i18next';
import { addAyahCard } from '../../lib/srs';
import { downloadAyah, getLocalUriIfExists, removeAyah } from '../../lib/downloads';

export default function SurahScreen() {
	const params = useLocalSearchParams<{ id: string }>();
	const surahNumber = Number(params.id);
	const { t, i18n } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [ayahs, setAyahs] = useState<Ayah[]>([]);
	const [surahName, setSurahName] = useState('');

	useEffect(() => {
		getSurah(surahNumber, i18n.language).then((data) => {
			setSurahName(data.englishName);
			setAyahs(data.ayahs);
			setLoading(false);
		});
	}, [surahNumber, i18n.language]);

	const header = useMemo(() => (
		<View style={styles.headerWrap}>
			<Text style={styles.title}>{surahName}</Text>
			<Text style={styles.subtitle}>{t('surah.subtitle')}</Text>
		</View>
	), [surahName, t]);

	if (loading) return <View style={styles.center}><ActivityIndicator color="#fff" /></View>;

	return (
		<View style={styles.container}>
			<FlatList
				ListHeaderComponent={header}
				data={ayahs}
				keyExtractor={(a) => String(a.numberInSurah)}
				renderItem={({ item }) => (
					<GlassCard style={styles.row}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={styles.ayahNum}>{item.numberInSurah}</Text>
							<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
								<Pressable style={styles.deckBtn} onPress={() => addAyahCard(surahNumber, item.numberInSurah)}>
									<Text style={styles.deckTxt}>Add to Deck</Text>
								</Pressable>
								<DownloadToggle surah={surahNumber} ayah={item.numberInSurah} />
								<AudioControls surah={surahNumber} ayah={item.numberInSurah} />
							</View>
						</View>
						<Text style={styles.ar}>{item.text}</Text>
						<Text style={styles.tr}>{item.translation}</Text>
						<Text style={styles.vocab}>{t('ayah.vocab_placeholder')}</Text>
					</GlassCard>
				)}
			/>
		</View>
	);
}

function DownloadToggle({ surah, ayah }: { surah: number; ayah: number }) {
	const [has, setHas] = useState<boolean | null>(null);
	useEffect(() => { (async () => setHas(!!(await getLocalUriIfExists(surah, ayah))))(); }, [surah, ayah]);
	const onToggle = async () => {
		if (has) { await removeAyah(surah, ayah); setHas(false); }
		else { await downloadAyah(surah, ayah); setHas(true); }
	};
	return (
		<Pressable style={styles.deckBtn} onPress={onToggle}>
			<Text style={styles.deckTxt}>{has ? 'Remove' : 'Download'}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 12 },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	headerWrap: { padding: 8, marginBottom: 8 },
	title: { fontFamily: 'Inter_700Bold', fontSize: 20, color: 'white' },
	subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'white', opacity: 0.85 },
	row: { padding: 14, gap: 10 },
	ayahNum: { color: 'white', opacity: 0.8, fontFamily: 'Inter_600SemiBold' },
	ar: { color: 'white', fontSize: 18, fontFamily: 'Inter_700Bold' },
	tr: { color: 'white', fontFamily: 'Inter_400Regular' },
	vocab: { color: 'white', opacity: 0.8, fontFamily: 'Inter_400Regular' },
	deckBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12 },
	deckTxt: { color: 'white', fontFamily: 'Inter_600SemiBold' },
});
