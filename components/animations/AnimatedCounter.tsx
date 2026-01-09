import { useEffect } from 'react';
import { Text, TextProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedCounterProps extends Omit<TextProps, 'children'> {
  end: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 1000,
  className,
  ...textProps
}: AnimatedCounterProps) {
  const count = useSharedValue(0);

  useEffect(() => {
    count.value = withTiming(end, {
      duration,
      easing: Easing.out(Easing.quad),
    });
  }, [end, duration]);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: Math.floor(count.value).toString(),
    } as any;
  });

  return (
    <AnimatedText
      {...textProps}
      className={className}
      animatedProps={animatedProps}
    />
  );
}
