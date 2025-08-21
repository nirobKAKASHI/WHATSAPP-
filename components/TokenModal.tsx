import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { GlassCard } from './GlassCard';

type Props = {
	visible: boolean;
	onClose: () => void;
	data?: { text: string; root?: string; lemma?: string; pos?: string; gloss?: string } | null;
};

export function TokenModal({ visible, onClose, data }: Props) {
	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View style={styles.backdrop}>
				<GlassCard style={styles.card}>
					<Text style={styles.title}>{data?.text}</Text>
					<Text style={styles.row}>Root: {data?.root ?? '—'}</Text>
					<Text style={styles.row}>Lemma: {data?.lemma ?? '—'}</Text>
					<Text style={styles.row}>POS: {data?.pos ?? '—'}</Text>
					<Text style={styles.row}>Gloss: {data?.gloss ?? '—'}</Text>
					<View style={{ height: 12 }} />
					<Pressable style={styles.btn} onPress={onClose}><Text style={styles.btnTxt}>Close</Text></Pressable>
				</GlassCard>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.5)' },
	card: { padding: 20, width: '100%' },
	title: { color: 'white', fontFamily: 'Inter_700Bold', fontSize: 20, marginBottom: 8 },
	row: { color: 'white', fontFamily: 'Inter_400Regular' },
	btn: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, alignSelf: 'flex-end' },
	btnTxt: { color: 'white', fontFamily: 'Inter_600SemiBold' },
});
