import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function SwipePage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-background items-center justify-center px-4">
      <Text className="text-6xl mb-4">👆</Text>
      <Text className="text-3xl font-bold text-primary mb-2">
        Swipe Screen
      </Text>
      <Text className="text-base text-gray-600 text-center">
        Group: {id}
      </Text>
      <Text className="text-sm text-gray-500 mt-4 text-center">
        Tinder-style swiping coming in Phase 4...
      </Text>
    </View>
  );
}
