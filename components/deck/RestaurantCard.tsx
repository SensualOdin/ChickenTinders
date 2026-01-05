import { View, Text, Image, Pressable } from 'react-native';
import { YelpBusiness } from '../../lib/api/yelp';

type RestaurantCardProps = {
  restaurant: YelpBusiness;
  onLike?: () => void;
  onDislike?: () => void;
  onSuperLike?: () => void;
  showButtons?: boolean;
};

export function RestaurantCard({
  restaurant,
  onLike,
  onDislike,
  onSuperLike,
  showButtons = true,
}: RestaurantCardProps) {
  // Format distance from meters to miles
  const distanceInMiles = (restaurant.distance / 1609.34).toFixed(1);

  // Get primary cuisine type
  const cuisine = restaurant.categories[0]?.title || 'Restaurant';

  // Format price tier
  const price = restaurant.price || '$$';

  return (
    <View className="w-full h-full bg-white rounded-3xl overflow-hidden shadow-xl">
      {/* Restaurant Image */}
      {restaurant.image_url ? (
        <Image
          source={{ uri: restaurant.image_url }}
          className="w-full h-96"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-96 bg-gray-200 items-center justify-center">
          <Text className="text-6xl">🍽️</Text>
        </View>
      )}

      {/* Restaurant Info */}
      <View className="p-6">
        <Text className="text-3xl font-bold text-textDark mb-2">
          {restaurant.name}
        </Text>

        {/* Cuisine and Price */}
        <View className="flex-row items-center gap-2 mb-3">
          <Text className="text-lg text-gray-700">{cuisine}</Text>
          <Text className="text-lg text-gray-400">•</Text>
          <Text className="text-lg font-semibold text-primary">{price}</Text>
        </View>

        {/* Rating and Distance */}
        <View className="flex-row items-center gap-4 mb-4">
          <View className="flex-row items-center gap-1">
            <Text className="text-xl">⭐</Text>
            <Text className="text-base font-semibold text-gray-700">
              {restaurant.rating}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-xl">📍</Text>
            <Text className="text-base text-gray-700">
              {distanceInMiles} mi
            </Text>
          </View>
        </View>

        {/* Address */}
        <Text className="text-sm text-gray-600 mb-6">
          {restaurant.location.display_address.join(', ')}
        </Text>

        {/* Action Buttons (Fallback) */}
        {showButtons && (
          <View className="flex-row justify-between gap-4">
            <Pressable
              onPress={onDislike}
              className="flex-1 bg-gray-200 py-4 rounded-xl items-center active:scale-95"
            >
              <Text className="text-3xl">✗</Text>
              <Text className="text-sm font-semibold text-gray-700 mt-1">
                Nope
              </Text>
            </Pressable>

            <Pressable
              onPress={onSuperLike}
              className="flex-1 bg-secondary py-4 rounded-xl items-center active:scale-95"
            >
              <Text className="text-3xl">⭐</Text>
              <Text className="text-sm font-semibold text-white mt-1">
                Super Like
              </Text>
            </Pressable>

            <Pressable
              onPress={onLike}
              className="flex-1 bg-success py-4 rounded-xl items-center active:scale-95"
            >
              <Text className="text-3xl">♥</Text>
              <Text className="text-sm font-semibold text-white mt-1">
                Like
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
