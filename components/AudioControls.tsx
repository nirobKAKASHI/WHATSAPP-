import { useEffect, useRef, useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { getAyahAudioUrl } from '../lib/audio';
import { getLocalUriIfExists } from '../lib/downloads';

type Props = { surah: number; ayah: number };

export function AudioControls({ surah, ayah }: Props) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [rate, setRate] = useState(1);
	const soundRef = useRef<Audio.Sound | null>(null);

	useEffect(() => {
		return () => { if (soundRef.current) soundRef.current.unloadAsync(); };
	}, []);

	const getUrl = async () => {
		const local = await getLocalUriIfExists(surah, ayah);
		return local ?? getAyahAudioUrl(surah, ayah);
	};

	const onPlayPause = async () => {
		if (!soundRef.current) {
			const src = await getUrl();
			const { sound } = await Audio.Sound.createAsync({ uri: src }, { shouldPlay: true, rate });
			soundRef.current = sound;
			setIsPlaying(true);
			return;
		}
		const status = (await soundRef.current.getStatusAsync()) as AVPlaybackStatusSuccess;
		if (status.isPlaying) {
			await soundRef.current.pauseAsync();
			setIsPlaying(false);
		} else {
			await soundRef.current.playAsync();
			setIsPlaying(true);
		}
	};

	const onSlower = async () => {
		const next = Math.max(0.5, rate - 0.25);
		setRate(next);
		if (soundRef.current) await soundRef.current.setRateAsync(next, true);
	};

	const onFaster = async () => {
		const next = Math.min(1.5, rate + 0.25);
		setRate(next);
		if (soundRef.current) await soundRef.current.setRateAsync(next, true);
	};

	return (
		<View style={styles.row}>
			<Pressable style={styles.btn} onPress={onSlower}><Text style={styles.txt}>-</Text></Pressable>
			<Pressable style={styles.btn} onPress={onPlayPause}><Text style={styles.txt}>{isPlaying ? 'Pause' : 'Play'}</Text></Pressable>
			<Pressable style={styles.btn} onPress={onFaster}><Text style={styles.txt}>+</Text></Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
	btn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12 },
	txt: { color: 'white', fontFamily: 'Inter_600SemiBold' },
});
