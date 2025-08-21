import { useTranslation } from 'react-i18next';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { setLanguage } from '../lib/i18n';

export function LanguageToggle() {
	const { i18n } = useTranslation();

	const onToggle = async () => {
		const next = i18n.language === 'sw' ? 'en' : 'sw';
		await setLanguage(next as 'en' | 'sw');
	};

	return (
		<View style={styles.wrap}>
			<Pressable onPress={onToggle} style={styles.btn}>
				<Text style={styles.text}>{i18n.language === 'sw' ? 'SW' : 'EN'}</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: { flexDirection: 'row' },
	btn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)' },
	text: { color: 'white', fontFamily: 'Inter_600SemiBold' },
});
