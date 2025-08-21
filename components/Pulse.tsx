import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';

type Props = { size?: number; color?: string };

export function Pulse({ size = 220, color = 'rgba(255,255,255,0.08)' }: Props) {
	const scale = useSharedValue(0.8);
	const opacity = useSharedValue(0.8);

	useEffect(() => {
		scale.value = withRepeat(withTiming(1.1, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
		opacity.value = withRepeat(withTiming(0.3, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
	}, [opacity, scale]);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		opacity: opacity.value,
	}));

	return (
		<Animated.View style={[styles.circle, animStyle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />
	);
}

const styles = StyleSheet.create({
	circle: {
		position: 'absolute',
		alignSelf: 'center',
		top: -40,
	}
});
