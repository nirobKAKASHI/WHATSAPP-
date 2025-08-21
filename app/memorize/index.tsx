import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { useEffect, useState } from 'react';
import { getDueCards, review, type ReviewCard } from '../../lib/srs';

export default function MemorizeScreen() {
	const [queue, setQueue] = useState<ReviewCard[]>([]);
	const [show, setShow] = useState(false);

	useEffect(() => { (async () => setQueue(await getDueCards(1)))(); }, []);

	const current = queue[0];

	const onReveal = () => setShow(true);
	const onRate = async (rating: 0 | 3 | 4) => {
		if (!current) return;
		await review(current, rating);
		setShow(false);
		setQueue(await getDueCards(1));
	};

	return (
		<View style={styles.container}>
			<GlassCard style={{ padding: 20 }}>
				<Text style={styles.title}>Memorize</Text>
				{!current && <Text style={styles.sub}>No cards due.</Text>}
				{current && (
					<View style={{ gap: 12 }}>
						<Text style={styles.sub}>Ayah {current.key.surah}:{current.key.ayah}</Text>
						{!show ? (
							<Pressable style={styles.btn} onPress={onReveal}><Text style={styles.btnTxt}>Reveal</Text></Pressable>
						) : (
							<View style={{ flexDirection: 'row', gap: 8 }}>
								<Pressable style={styles.btn} onPress={() => onRate(0)}><Text style={styles.btnTxt}>Again</Text></Pressable>
								<Pressable style={styles.btn} onPress={() => onRate(3)}><Text style={styles.btnTxt}>Good</Text></Pressable>
								<Pressable style={styles.btn} onPress={() => onRate(4)}><Text style={styles.btnTxt}>Easy</Text></Pressable>
							</View>
						)}
					</View>
				)}
			</GlassCard>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { color: 'white', fontFamily: 'Inter_700Bold', fontSize: 20 },
	sub: { color: 'white', opacity: 0.85, fontFamily: 'Inter_400Regular' },
	btn: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12 },
	btnTxt: { color: 'white', fontFamily: 'Inter_600SemiBold' },
});
