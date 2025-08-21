import AsyncStorage from '@react-native-async-storage/async-storage';

export type CardKey = { type: 'ayah'; surah: number; ayah: number };
export type ReviewRating = 0 | 3 | 4; // Again, Good, Easy

export interface ReviewCard {
	id: string; // e.g., ayah:2:255
	key: CardKey;
	intervalDays: number;
	ease: number; // SM-2 ease factor
	dueAt: number; // epoch ms
	reps: number;
}

const KEY_DECK = 'srs.deck.v1';

function toId(key: CardKey): string { return `${key.type}:${key.surah}:${key.ayah}`; }

export async function addAyahCard(surah: number, ayah: number) {
	const card: ReviewCard = {
		id: toId({ type: 'ayah', surah, ayah }),
		key: { type: 'ayah', surah, ayah },
		intervalDays: 0,
		ease: 2.5,
		dueAt: Date.now(),
		reps: 0,
	};
	const deck = await getDeck();
	deck[card.id] = deck[card.id] ?? card;
	await saveDeck(deck);
}

export async function getDueCards(limit = 20): Promise<ReviewCard[]> {
	const deck = await getDeck();
	const now = Date.now();
	return Object.values(deck)
		.filter((c) => c.dueAt <= now)
		.sort((a, b) => a.dueAt - b.dueAt)
		.slice(0, limit);
}

export async function review(card: ReviewCard, rating: ReviewRating): Promise<ReviewCard> {
	const easeDelta = rating === 0 ? -0.2 : rating === 4 ? 0.15 : 0;
	const nextEase = Math.max(1.3, card.ease + easeDelta);
	const nextInterval = rating === 0 ? 0.5 : card.reps === 0 ? 1 : Math.round(card.intervalDays * nextEase);
	const updated: ReviewCard = {
		...card,
		ease: nextEase,
		intervalDays: nextInterval,
		dueAt: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
		reps: card.reps + 1,
	};
	const deck = await getDeck();
	deck[updated.id] = updated;
	await saveDeck(deck);
	return updated;
}

async function getDeck(): Promise<Record<string, ReviewCard>> {
	const raw = await AsyncStorage.getItem(KEY_DECK);
	return raw ? JSON.parse(raw) : {};
}

async function saveDeck(deck: Record<string, ReviewCard>) {
	await AsyncStorage.setItem(KEY_DECK, JSON.stringify(deck));
}
