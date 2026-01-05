import { View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function PrivacyPage() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="max-w-app mx-auto w-full px-4 py-8">
        <Link href="/" className="text-primary mb-4">
          ← Back
        </Link>
        <Text className="text-3xl font-bold text-textDark mb-6">Privacy Policy</Text>
        <Text className="text-base text-gray-700 mb-4">
          Your privacy is important to us. ChickenTinders is designed to minimize data collection.
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          We collect only the information necessary to match you with restaurants:
          your display name, location (zip code), and swipe preferences.
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          Groups automatically expire after 24 hours. We do not sell your data to third parties.
        </Text>
        <Text className="text-sm text-gray-500 mt-8">
          Last updated: January 2026
        </Text>
      </View>
    </ScrollView>
  );
}
