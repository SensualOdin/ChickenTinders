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
    <View className="w-full h-full bg-surface rounded-3xl overflow-hidden shadow-card">
      {/* Restaurant Image with gradient overlay */}
      <View className="relative">
        {restaurant.image_url ? (
          <Image
            source={{ uri: restaurant.image_url }}
            className="w-full h-96"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-96 bg-accent items-center justify-center">
            <Text className="text-7xl opacity-40">🍽️</Text>
          </View>
        )}
        {/* Subtle gradient overlay for better text readability */}
        <View className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
      </View>

      {/* Restaurant Info with refined spacing */}
      <View className="p-6 bg-surface">
        {/* Name with elegant typography */}
        <Text
          className="text-3xl font-bold text-textDark mb-3 tracking-tight leading-tight"
          style={{ fontFamily: 'Playfair Display' }}
        >
          {restaurant.name}
        </Text>

        {/* Cuisine and Price with refined styling */}
        <View className="flex-row items-center gap-3 mb-4">
          <Text className="text-base text-textMuted tracking-wide">{cuisine}</Text>
          <View className="w-1 h-1 rounded-full bg-textLight" />
          <Text className="text-base font-semibold text-secondary tracking-wider">{price}</Text>
        </View>

        {/* Rating and Distance with premium badges */}
        <View className="flex-row items-center gap-3 mb-5">
          <View className="flex-row items-center gap-2 bg-accent px-3 py-1.5 rounded-full">
            <Text className="text-base">⭐</Text>
            <Text className="text-sm font-semibold text-textDark">
              {restaurant.rating}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 bg-accent px-3 py-1.5 rounded-full">
            <Text className="text-base">📍</Text>
            <Text className="text-sm font-medium text-textDark">
              {distanceInMiles} mi
            </Text>
          </View>
        </View>

        {/* Address with refined typography */}
        <Text className="text-sm text-textLight mb-6 leading-relaxed">
          {restaurant.location.display_address.join(', ')}
        </Text>

        {/* Action Buttons with premium styling */}
        {showButtons && (
          <View className="flex-row justify-between gap-3">
            <Pressable
              onPress={onDislike}
              className="flex-1 bg-accent border border-accent-dark py-4 rounded-2xl items-center active:scale-95 transition-all shadow-soft"
            >
              <Text className="text-2xl mb-1">✗</Text>
              <Text className="text-xs font-medium text-textMuted tracking-wide uppercase">
                Pass
              </Text>
            </Pressable>

            <Pressable
              onPress={onSuperLike}
              className="flex-1 bg-secondary py-4 rounded-2xl items-center active:scale-95 transition-all shadow-elevated"
            >
              <Text className="text-2xl mb-1">⭐</Text>
              <Text className="text-xs font-semibold text-surface tracking-wide uppercase">
                Favorite
              </Text>
            </Pressable>

            <Pressable
              onPress={onLike}
              className="flex-1 bg-success py-4 rounded-2xl items-center active:scale-95 transition-all shadow-elevated"
            >
              <Text className="text-2xl mb-1">♥</Text>
              <Text className="text-xs font-semibold text-surface tracking-wide uppercase">
                Like
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
