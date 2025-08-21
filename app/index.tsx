import { Link } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { useTranslation } from 'react-i18next';
import { Pulse } from '../components/Pulse';

export default function HomeScreen() {
	const { t } = useTranslation();
	return (
		<View style={styles.container}>
			<Pulse />
			<View style={styles.header}>
				<Text style={styles.title}>Madarasa Quran</Text>
				<LanguageToggle />
			</View>
			<GlassCard style={styles.card}>
				<Text style={styles.cardTitle}>{t('home.learn_and_memorize')}</Text>
				<Text style={styles.cardSubtitle}>{t('home.tagline')}</Text>
				<Link href="/surah" asChild>
					<Pressable style={styles.cta}><Text style={styles.ctaText}>{t('home.browse_surahs')}</Text></Pressable>
				</Link>
			</GlassCard>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, gap: 16 },
	header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: 'white' },
	card: { padding: 20 },
	cardTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: 'white', marginBottom: 8 },
	cardSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'white', opacity: 0.85, marginBottom: 16 },
	cta: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14 },
	ctaText: { color: 'white', fontFamily: 'Inter_600SemiBold' },
});
