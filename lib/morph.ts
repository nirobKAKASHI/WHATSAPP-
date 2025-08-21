export type MorphToken = {
	text: string;
	root?: string;
	lemma?: string;
	pos?: string;
	gloss_en?: string;
	gloss_sw?: string;
};

// Placeholder tokenizer: split by space and return stubs
export function tokenizeAyah(ayahArabic: string, lang: 'en' | 'sw'):
	Array<MorphToken> {
	return ayahArabic.split(/\s+/).map((t) => ({
		text: t,
		root: undefined,
		lemma: undefined,
		pos: undefined,
		gloss_en: undefined,
		gloss_sw: undefined,
	}));
}
