import { useEffect } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { YelpBusiness } from '../../lib/api/yelp';

type SwipeableCardProps = {
  restaurant: YelpBusiness;
  onLike: () => void;
  onDislike: () => void;
  onSuperLike: () => void;
  isActive: boolean;
};

const SWIPE_THRESHOLD = 120;
const ROTATION_ANGLE = 30;

export function SwipeableCard({
  restaurant,
  onLike,
  onDislike,
  onSuperLike,
  isActive,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(isActive ? 1 : 0.95);
  const opacity = useSharedValue(isActive ? 1 : 0.8);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Animate when card becomes active
  useEffect(() => {
    scale.value = withSpring(isActive ? 1 : 0.95, { damping: 15 });
    opacity.value = withTiming(isActive ? 1 : 0.8);
  }, [isActive]);

  const panGesture = Gesture.Pan()
    .enabled(isActive)
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd(() => {
      const swipeRight = translateX.value > SWIPE_THRESHOLD;
      const swipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const swipeUp = translateY.value < -SWIPE_THRESHOLD;

      if (swipeUp) {
        // Super Like - swipe up
        translateY.value = withTiming(-1000, { duration: 300 });
        translateX.value = withTiming(0, { duration: 300 });
        runOnJS(onSuperLike)();
      } else if (swipeRight) {
        // Like - swipe right
        translateX.value = withTiming(1000, { duration: 300 });
        runOnJS(onLike)();
      } else if (swipeLeft) {
        // Dislike - swipe left
        translateX.value = withTiming(-1000, { duration: 300 });
        runOnJS(onDislike)();
      } else {
        // Return to center
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-200, 0, 200],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  // Animated overlays for visual feedback
  const likeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const nopeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const superLikeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const distanceInMiles = (restaurant.distance / 1609.34).toFixed(1);
  const cuisine = restaurant.categories[0]?.title || 'Restaurant';
  const price = restaurant.price || '$$';

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[animatedStyle]}
        className="absolute w-full h-full"
      >
        <View className="w-full h-full bg-white rounded-3xl shadow-xl" style={{ overflow: 'visible' }}>
          <View className="w-full h-full bg-white rounded-3xl overflow-hidden"  style={{ maxHeight: '100%' }}>
          {/* Like Overlay */}
          <Animated.View
            style={[likeOverlayStyle]}
            className="absolute top-12 left-8 z-10 bg-success px-6 py-3 rounded-2xl border-4 border-white rotate-12"
          >
            <Text className="text-white text-3xl font-black">LIKE</Text>
          </Animated.View>

          {/* Nope Overlay */}
          <Animated.View
            style={[nopeOverlayStyle]}
            className="absolute top-12 right-8 z-10 bg-gray-700 px-6 py-3 rounded-2xl border-4 border-white -rotate-12"
          >
            <Text className="text-white text-3xl font-black">NOPE</Text>
          </Animated.View>

          {/* Super Like Overlay */}
          <Animated.View
            style={[superLikeOverlayStyle]}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-secondary px-8 py-4 rounded-2xl border-4 border-white"
          >
            <Text className="text-white text-4xl font-black">SUPER LIKE ⭐</Text>
          </Animated.View>

          {/* Restaurant Image */}
          {restaurant.image_url ? (
            <Image
              source={{ uri: restaurant.image_url }}
              className="w-full h-72"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-72 bg-gray-200 items-center justify-center">
              <Text className="text-6xl">🍽️</Text>
            </View>
          )}

          {/* Restaurant Info */}
          <View className="p-4">
            <Text className="text-2xl font-bold text-textDark mb-2">
              {restaurant.name}
            </Text>

            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-base text-gray-700">{cuisine}</Text>
              <Text className="text-base text-gray-400">•</Text>
              <Text className="text-base font-semibold text-primary">{price}</Text>
            </View>

            <View className="flex-row items-center gap-4 mb-3">
              <View className="flex-row items-center gap-1">
                <Text className="text-lg">⭐</Text>
                <Text className="text-sm font-semibold text-gray-700">
                  {restaurant.rating}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-lg">📍</Text>
                <Text className="text-sm text-gray-700">
                  {distanceInMiles} mi
                </Text>
              </View>
            </View>

            <Text className="text-xs text-gray-600 mb-4">
              {restaurant.location.display_address.join(', ')}
            </Text>
          </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
