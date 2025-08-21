import AsyncStorage from '@react-native-async-storage/async-storage';

export type Bookmark = { surah: number; ayah: number; label?: string; createdAt: number };
export type Note = { surah: number; ayah: number; content: string; createdAt: number };

const KEY_BM = 'bookmarks.v1';
const KEY_NOTES = 'notes.v1';

function id(surah: number, ayah: number) { return `${surah}:${ayah}`; }

export async function listBookmarks(): Promise<Record<string, Bookmark>> {
	const raw = await AsyncStorage.getItem(KEY_BM);
	return raw ? JSON.parse(raw) : {};
}
export async function toggleBookmark(surah: number, ayah: number, label?: string) {
	const map = await listBookmarks();
	const key = id(surah, ayah);
	if (map[key]) delete map[key]; else map[key] = { surah, ayah, label, createdAt: Date.now() };
	await AsyncStorage.setItem(KEY_BM, JSON.stringify(map));
}
export async function isBookmarked(surah: number, ayah: number): Promise<boolean> {
	const map = await listBookmarks();
	return !!map[id(surah, ayah)];
}

export async function listNotes(): Promise<Record<string, Note[]>> {
	const raw = await AsyncStorage.getItem(KEY_NOTES);
	return raw ? JSON.parse(raw) : {};
}
export async function addNote(surah: number, ayah: number, content: string) {
	const map = await listNotes();
	const key = id(surah, ayah);
	map[key] = map[key] ?? [];
	map[key].push({ surah, ayah, content, createdAt: Date.now() });
	await AsyncStorage.setItem(KEY_NOTES, JSON.stringify(map));
}
export async function getNotes(surah: number, ayah: number): Promise<Note[]> {
	const map = await listNotes();
	return map[id(surah, ayah)] ?? [];
}
