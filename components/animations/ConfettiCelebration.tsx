import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

type ConfettiPieceProps = {
  delay: number;
  startX: number;
  color: string;
};

const ConfettiPiece = ({ delay, startX, color }: ConfettiPieceProps) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(800, { duration: 2000, easing: Easing.out(Easing.cubic) })
    );
    translateX.value = withDelay(
      delay,
      withTiming(startX + (Math.random() - 0.5) * 200, { duration: 2000 })
    );
    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1
      )
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(1500, withTiming(0, { duration: 500 }))
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle]} className="absolute">
      <View className={`w-3 h-3 ${color}`} />
    </Animated.View>
  );
};

export function ConfettiCelebration() {
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-yellow-400',
    'bg-pink-400',
    'bg-purple-400',
  ];

  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 500,
    startX: Math.random() * 400 - 200,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <View className="absolute inset-0 items-center pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          delay={piece.delay}
          startX={piece.startX}
          color={piece.color}
        />
      ))}
    </View>
  );
}
