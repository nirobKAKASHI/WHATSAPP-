import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAyahAudioUrl } from './audio';

const KEY = 'downloads.v1';

type DownloadIndex = Record<string, string>; // id -> localUri

function id(surah: number, ayah: number) { return `${surah}:${ayah}`; }

async function getIndex(): Promise<DownloadIndex> {
	const raw = await AsyncStorage.getItem(KEY);
	return raw ? JSON.parse(raw) : {};
}

async function saveIndex(idx: DownloadIndex) {
	await AsyncStorage.setItem(KEY, JSON.stringify(idx));
}

export async function getLocalUriIfExists(surah: number, ayah: number): Promise<string | null> {
	const idx = await getIndex();
	return idx[id(surah, ayah)] ?? null;
}

export async function downloadAyah(surah: number, ayah: number): Promise<string> {
	const remote = getAyahAudioUrl(surah, ayah);
	const fileName = `ayah_${surah}_${ayah}.mp3`;
	const dest = FileSystem.documentDirectory + fileName;
	const res = await FileSystem.downloadAsync(remote, dest);
	const idx = await getIndex();
	idx[id(surah, ayah)] = res.uri;
	await saveIndex(idx);
	return res.uri;
}

export async function removeAyah(surah: number, ayah: number) {
	const idx = await getIndex();
	const key = id(surah, ayah);
	const uri = idx[key];
	if (uri) {
		try { await FileSystem.deleteAsync(uri, { idempotent: true }); } catch {}
		delete idx[key];
		await saveIndex(idx);
	}
}