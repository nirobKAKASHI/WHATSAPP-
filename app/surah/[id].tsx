import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { getSurah, type Ayah } from '../../lib/quran';
import { AudioControls } from '../../components/AudioControls';
import { GlassCard } from '../../components/GlassCard';
import { useTranslation } from 'react-i18next';
import { addAyahCard } from '../../lib/srs';
import { downloadAyah, getLocalUriIfExists, removeAyah } from '../../lib/downloads';
import { tokenizeAyah } from '../../lib/morph';
import { TokenModal } from '../../components/TokenModal';
import { toggleBookmark, isBookmarked, addNote } from '../../lib/notes';

export default function SurahScreen() {
	const params = useLocalSearchParams<{ id: string }>();
	const surahNumber = Number(params.id);
	const { t, i18n } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [ayahs, setAyahs] = useState<Ayah[]>([]);
	const [surahName, setSurahName] = useState('');
	const [wordByWord, setWordByWord] = useState(false);
	const [tokenModal, setTokenModal] = useState<{ text: string; root?: string; lemma?: string; pos?: string; gloss?: string } | null>(null);

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
			<View style={styles.toggleRow}>
				<Pressable style={styles.deckBtn} onPress={() => setWordByWord((v) => !v)}>
					<Text style={styles.deckTxt}>{wordByWord ? 'Hide Words' : 'Word by Word'}</Text>
				</Pressable>
			</View>
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
						{!wordByWord ? (
							<Text style={styles.ar}>{item.text}</Text>
						) : (
							<View style={styles.tokensWrap}>
								{tokenizeAyah(item.text, i18n.language === 'sw' ? 'sw' : 'en').map((tok, idx) => (
									<Pressable
										key={idx}
										style={styles.token}
										onPress={() => setTokenModal({ text: tok.text, root: tok.root, lemma: tok.lemma, pos: tok.pos, gloss: i18n.language === 'sw' ? tok.gloss_sw : tok.gloss_en })}
									>
										<Text style={styles.tokenTxt}>{tok.text}</Text>
									</Pressable>
								))}
							</View>
						)}
						<Text style={styles.tr}>{item.translation}</Text>
						<View style={{ flexDirection: 'row', gap: 8 }}>
							<BookmarkToggle surah={surahNumber} ayah={item.numberInSurah} />
							<NoteButton surah={surahNumber} ayah={item.numberInSurah} />
						</View>
					</GlassCard>
				)}
			/>
			<TokenModal visible={!!tokenModal} onClose={() => setTokenModal(null)} data={tokenModal} />
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

function BookmarkToggle({ surah, ayah }: { surah: number; ayah: number }) {
	const [bm, setBm] = useState(false);
	useEffect(() => { (async () => setBm(await isBookmarked(surah, ayah)))(); }, [surah, ayah]);
	const onToggle = async () => { await toggleBookmark(surah, ayah); setBm(await isBookmarked(surah, ayah)); };
	return (
		<Pressable style={styles.deckBtn} onPress={onToggle}>
			<Text style={styles.deckTxt}>{bm ? 'Bookmarked' : 'Bookmark'}</Text>
		</Pressable>
	);
}

function NoteButton({ surah, ayah }: { surah: number; ayah: number }) {
	const [saved, setSaved] = useState(false);
	const onAdd = async () => { await addNote(surah, ayah, 'Note'); setSaved(true); setTimeout(() => setSaved(false), 1200); };
	return (
		<Pressable style={styles.deckBtn} onPress={onAdd}>
			<Text style={styles.deckTxt}>{saved ? 'Saved' : 'Add Note'}</Text>
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
	tokensWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	token: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.12)' },
	tokenTxt: { color: 'white', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
	toggleRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
});