import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface BackButtonProps {
  variant?: 'icon' | 'text';
  label?: string;
  onPress?: () => void;
}

export function BackButton({
  variant = 'icon',
  label = 'Back',
  onPress,
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (variant === 'text') {
    return (
      <Pressable onPress={handlePress} className="mb-4 active:scale-95">
        <Text className="text-primary text-base font-semibold">
          ← {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      className="w-10 h-10 bg-surface rounded-full items-center justify-center active:scale-95 shadow-soft border border-cream-dark"
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <FontAwesome name="chevron-left" size={16} color="#6B4423" />
    </Pressable>
  );
}
