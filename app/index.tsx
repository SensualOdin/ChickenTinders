import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function LandingPage() {
  return (
    <View className="flex-1 bg-background">
      {/* Container with max-width for desktop */}
      <View className="flex-1 max-w-app mx-auto w-full px-4">

        {/* Hero Section */}
        <View className="flex-1 justify-center items-center">
          {/* Logo */}
          <View className="mb-8">
            <Text className="text-6xl mb-4 text-center">🍗</Text>
            <Text className="text-4xl font-bold text-primary text-center">
              ChickenTinders
            </Text>
          </View>

          {/* Tagline */}
          <Text className="text-2xl font-semibold text-textDark text-center mb-2">
            Swipe Right on Dinner
          </Text>
          <Text className="text-base text-gray-600 text-center mb-12 px-4">
            No more group chat chaos. Swipe, match, eat.
          </Text>

          {/* CTA Button */}
          <Link href="/create" asChild>
            <Pressable className="bg-primary px-8 py-4 rounded-xl active:scale-95 transition-transform">
              <Text className="text-white text-lg font-bold">
                Create Group
              </Text>
            </Pressable>
          </Link>

          {/* Trust Signal */}
          <Text className="text-sm text-gray-500 mt-6">
            🚫 No app download. No sign-up. Just food.
          </Text>
        </View>

        {/* Footer */}
        <View className="py-6 flex-row justify-center gap-6">
          <Link href="/privacy">
            <Text className="text-sm text-gray-500 underline">Privacy</Text>
          </Link>
          <Link href="/terms">
            <Text className="text-sm text-gray-500 underline">Terms</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
