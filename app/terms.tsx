import { View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function TermsPage() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="max-w-app mx-auto w-full px-4 py-8">
        <Link href="/" className="text-primary mb-4">
          ← Back
        </Link>
        <Text className="text-3xl font-bold text-textDark mb-6">Terms of Service</Text>
        <Text className="text-base text-gray-700 mb-4">
          By using ChickenTinders, you agree to use the service responsibly.
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          ChickenTinders is provided "as is" without warranties. We are not responsible
          for your food choices or restaurant experiences.
        </Text>
        <Text className="text-base text-gray-700 mb-4">
          We reserve the right to terminate access for users who abuse the service.
        </Text>
        <Text className="text-sm text-gray-500 mt-8">
          Last updated: January 2026
        </Text>
      </View>
    </ScrollView>
  );
}
