function pad3(n: number): string {
	return String(n).padStart(3, '0');
}

export function getAyahAudioUrl(surah: number, ayah: number): string {
	// EveryAyah Alafasy per-ayah MP3s, e.g., 001001.mp3
	return `https://everyayah.com/data/Alafasy_128kbps/${pad3(surah)}${pad3(ayah)}.mp3`;
}
