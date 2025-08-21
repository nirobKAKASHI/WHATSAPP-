import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'app.language';

const resources = {
	en: { translation: require('../locales/en.json') },
	sw: { translation: require('../locales/sw.json') },
};

export async function getInitialLanguage(): Promise<'en' | 'sw'> {
	try {
		const saved = await AsyncStorage.getItem(STORAGE_KEY);
		if (saved === 'en' || saved === 'sw') return saved;
		const device = Localization.getLocales?.()[0]?.languageCode ?? 'en';
		return device?.startsWith('sw') ? 'sw' : 'en';
	} catch {
		return 'en';
	}
}

export async function setLanguage(lang: 'en' | 'sw') {
	i18n.changeLanguage(lang);
	await AsyncStorage.setItem(STORAGE_KEY, lang);
}

i18n
	.use(initReactI18next)
	.init({
		compatibilityJSON: 'v3',
		resources,
		lng: 'en',
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
	});

getInitialLanguage().then((lng) => i18n.changeLanguage(lng));

export default i18n;
