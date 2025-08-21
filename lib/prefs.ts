import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = 'dark' | 'amoled';
export type ReciterId = 'Alafasy_128kbps' | 'Husary_128kbps';

type PrefsState = {
	theme: ThemeName;
	reciter: ReciterId;
	setTheme: (t: ThemeName) => void;
	setReciter: (r: ReciterId) => void;
};

export const usePrefs = create<PrefsState>()(
	persist(
		(set) => ({
			theme: 'dark',
			reciter: 'Alafasy_128kbps',
			setTheme: (theme) => set({ theme }),
			setReciter: (reciter) => set({ reciter }),
		}),
		{ name: 'app.prefs.v1', getStorage: () => AsyncStorage as any }
	)
);

export const RECITERS: { id: ReciterId; label: string }[] = [
	{ id: 'Alafasy_128kbps', label: 'Mishary Alafasy (128kbps)' },
	{ id: 'Husary_128kbps', label: 'Mahmoud Khalil Al-Husary (128kbps)' },
];
