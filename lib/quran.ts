import AsyncStorage from '@react-native-async-storage/async-storage';

export type Ayah = {
	numberInSurah: number;
	text: string; // Arabic
	translation: string; // localized
};

const SURAH_LIST_KEY = 'quran.surahList.v1';
const SURAH_KEY = (n: number, lang: string) => `quran.surah.${n}.${lang}.v1`;

export async function fetchSurahList(): Promise<Array<{ number: number; englishName: string; name: string; revelationType: string }>> {
	const cached = await AsyncStorage.getItem(SURAH_LIST_KEY);
	if (cached) return JSON.parse(cached);
	const res = await fetch('https://api.alquran.cloud/v1/surah');
	const json = await res.json();
	const list = json.data.map((s: any) => ({ number: s.number, englishName: s.englishName, name: s.name, revelationType: s.revelationType }));
	await AsyncStorage.setItem(SURAH_LIST_KEY, JSON.stringify(list));
	return list;
}

export async function getSurah(number: number, lang: string): Promise<{ englishName: string; ayahs: Ayah[] }> {
	const key = SURAH_KEY(number, lang);
	const cached = await AsyncStorage.getItem(key);
	if (cached) return JSON.parse(cached);

	const [metaRes, arRes, trRes] = await Promise.all([
		fetch(`https://api.alquran.cloud/v1/surah/${number}`),
		fetch(`https://api.alquran.cloud/v1/surah/${number}`),
		fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/${lang === 'sw' ? 'sw.ali' : 'en.sahih'}`),
	]);
	const meta = await metaRes.json();
	const ar = await arRes.json();
	const tr = await trRes.json();

	const englishName = meta.data.englishName;
	const ayahs: Ayah[] = ar.data.ayahs.map((a: any, idx: number) => ({
		numberInSurah: a.numberInSurah,
		text: a.text,
		translation: tr.data[0]?.ayahs?.[idx]?.text ?? '',
	}));

	const payload = { englishName, ayahs };
	await AsyncStorage.setItem(key, JSON.stringify(payload));
	return payload;
}
