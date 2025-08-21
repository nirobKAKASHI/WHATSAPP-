export type SearchResult = { surah: number; ayah: number; text: string; translation?: string };

export async function searchQuran(query: string, lang: 'en' | 'sw'): Promise<SearchResult[]> {
	if (!query.trim()) return [];
	const edition = lang === 'sw' ? 'sw.ali' : 'en.sahih';
	const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/${edition}`);
	const json = await res.json();
	if (!json?.data?.matches) return [];
	return json.data.matches.map((m: any) => ({ surah: m.surah.number, ayah: m.numberInSurah, text: m.text }));
}
