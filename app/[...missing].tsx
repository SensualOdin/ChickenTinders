import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-4">
      <Text className="text-6xl mb-4">🍗</Text>
      <Text className="text-3xl font-bold text-primary mb-2">404</Text>
      <Text className="text-xl font-semibold text-textDark mb-4">
        This chicken flew the coop
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8">
        The page you're looking for doesn't exist.
      </Text>

      <Link href="/" asChild>
        <Pressable className="bg-primary px-8 py-4 rounded-xl active:scale-95">
          <Text className="text-white text-lg font-bold">
            Go Home
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
