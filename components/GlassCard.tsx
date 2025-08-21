import { BlurView } from 'expo-blur';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ style?: ViewStyle }>

export function GlassCard({ children, style }: Props) {
	return (
		<BlurView intensity={40} tint="dark" style={[styles.wrap, style]}>
			<View style={styles.inner}>
				{children}
			</View>
		</BlurView>
	);
}

const styles = StyleSheet.create({
	wrap: {
		borderRadius: 18,
		overflow: 'hidden',
		backgroundColor: 'rgba(255,255,255,0.06)'
	},
	inner: {
		borderRadius: 18,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.1)'
	}
});
