import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

type SparkleEffectProps = {
  show: boolean;
};

const Sparkle = ({ delay }: { delay: number }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) })
      )
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 400 })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle]} className="absolute">
      <View className="w-3 h-3 bg-yellow-400 rounded-full" />
    </Animated.View>
  );
};

export function SparkleEffect({ show }: SparkleEffectProps) {
  if (!show) return null;

  // Create sparkles in a circular pattern
  const sparkles = [
    { top: 0, left: 50, delay: 0 },
    { top: 20, left: 80, delay: 50 },
    { top: 50, left: 100, delay: 100 },
    { top: 80, left: 80, delay: 150 },
    { top: 100, left: 50, delay: 200 },
    { top: 80, left: 20, delay: 250 },
    { top: 50, left: 0, delay: 300 },
    { top: 20, left: 20, delay: 350 },
  ];

  return (
    <View className="absolute inset-0 items-center justify-center pointer-events-none">
      {sparkles.map((pos, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            top: `${pos.top}%`,
            left: `${pos.left}%`,
          }}
        >
          <Sparkle delay={pos.delay} />
        </View>
      ))}
    </View>
  );
}
