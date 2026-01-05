import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import toast, { Toaster } from 'react-hot-toast';
import { useGroup } from '../../lib/hooks/useGroup';
import { SwipeableCard } from '../../components/deck/SwipeableCard';
import { RestaurantCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { getRestaurantsForGroup, YelpBusiness } from '../../lib/api/yelp';
import { getMockRestaurants } from '../../lib/api/mock-restaurants';
import { supabase } from '../../lib/supabase';
import { getUserId } from '../../lib/storage';
import { haptic } from '../../lib/utils';

export default function SwipePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { group, members, loading: groupLoading } = useGroup(id || '');

  const [restaurants, setRestaurants] = useState<YelpBusiness[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [swiping, setSwiping] = useState(false);

  // Load restaurants when group is loaded
  useEffect(() => {
    if (!group || groupLoading) return;

    const loadRestaurants = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('Fetching restaurants for:', {
          zip: group.zip_code,
          radius: group.radius,
          price: group.price_tier,
        });

        // Use mock data for now (Yelp API requires server-side proxy due to CORS)
        const businesses = getMockRestaurants();

        // TODO: Replace with actual Yelp API call via Supabase Edge Function
        // const businesses = await getRestaurantsForGroup(
        //   group.zip_code,
        //   group.radius,
        //   group.price_tier,
        //   [] // TODO: Get dietary tags from all members
        // );

        if (businesses.length === 0) {
          setError('No restaurants found in your area. Try widening your search radius.');
          return;
        }

        console.log(`Found ${businesses.length} restaurants`);
        setRestaurants(businesses);
      } catch (err: any) {
        console.error('Error loading restaurants:', err);
        setError(err.message || 'Failed to load restaurants');
        toast.error('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [group, groupLoading]);

  const handleSwipe = async (isLiked: boolean, isSuperLike: boolean = false) => {
    if (!id || swiping || currentIndex >= restaurants.length) return;

    const restaurant = restaurants[currentIndex];
    const userId = await getUserId();

    if (!userId) {
      toast.error('User not found');
      return;
    }

    try {
      setSwiping(true);

      // Save swipe to database
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert({
          group_id: id,
          user_id: userId,
          restaurant_id: restaurant.id,
          is_liked: isLiked,
          is_super_like: isSuperLike,
        });

      if (swipeError) throw swipeError;

      // Haptic feedback with enhanced patterns
      if (isSuperLike) {
        haptic.superLike();
        toast.success('⭐ Super Liked!');
      } else if (isLiked) {
        haptic.success();
      } else {
        haptic.light();
      }

      // Move to next card
      setCurrentIndex(currentIndex + 1);

      // Check if this was the last card
      if (currentIndex + 1 >= restaurants.length) {
        // All done! Check for matches
        setTimeout(() => {
          router.push(`/results/${id}`);
        }, 500);
      }
    } catch (err: any) {
      console.error('Error saving swipe:', err);
      toast.error('Failed to save swipe');
    } finally {
      setSwiping(false);
    }
  };

  const handleLike = () => handleSwipe(true, false);
  const handleDislike = () => handleSwipe(false, false);
  const handleSuperLike = () => handleSwipe(true, true);

  if (groupLoading || loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-background">
          <Toaster position="top-center" />

        {/* Header */}
        <View className="bg-white px-4 py-3 shadow-sm z-20">
          <View className="max-w-app mx-auto w-full">
            <View className="flex-row items-center justify-between mb-2">
              <Pressable onPress={() => router.back()}>
                <Text className="text-primary text-base font-semibold">← Back</Text>
              </Pressable>
              <Text className="text-base font-semibold text-gray-700">
                Loading...
              </Text>
            </View>
            <View className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <View className="h-full bg-gray-300 w-1/4" />
            </View>
          </View>
        </View>

        {/* Skeleton Card */}
        <View className="flex-1 items-center justify-center">
          <View className="w-full max-w-app px-4">
            <RestaurantCardSkeleton />
          </View>
        </View>

        <View className="bg-white px-4 py-4 border-t border-gray-200 z-20">
          <View className="max-w-app mx-auto w-full">
            <Text className="text-center text-sm text-gray-600">
              Loading restaurants...
            </Text>
          </View>
        </View>
        </View>
      </GestureHandlerRootView>
    );
  }

  if (error) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-background items-center justify-center px-4">
        <Text className="text-6xl mb-4">😕</Text>
        <Text className="text-2xl font-bold text-textDark mb-2 text-center">
          No Restaurants Found
        </Text>
        <Text className="text-base text-gray-600 text-center mb-6">
          {error}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-xl active:scale-95"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
        </View>
      </GestureHandlerRootView>
    );
  }

  if (currentIndex >= restaurants.length) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-background items-center justify-center px-4">
        <Text className="text-6xl mb-4">✅</Text>
        <Text className="text-2xl font-bold text-textDark mb-2">
          All Done!
        </Text>
        <Text className="text-base text-gray-600 text-center mb-6">
          Checking for matches...
        </Text>
        <ActivityIndicator size="large" color="#E53935" />
        </View>
      </GestureHandlerRootView>
    );
  }

  const progress = ((currentIndex + 1) / restaurants.length) * 100;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        <Toaster position="top-center" />

      {/* Header */}
      <View className="bg-white px-4 py-3 shadow-sm z-20">
        <View className="max-w-app mx-auto w-full">
          <View className="flex-row items-center justify-between mb-2">
            <Pressable onPress={() => router.back()}>
              <Text className="text-primary text-base font-semibold">← Back</Text>
            </Pressable>
            <Text className="text-base font-semibold text-gray-700">
              {currentIndex + 1} of {restaurants.length}
            </Text>
          </View>
          {/* Progress Bar */}
          <View className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </View>

      {/* Card Stack Container */}
      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-app px-4 h-[600px] relative">
          {/* Show next 3 cards in stack */}
          {restaurants.slice(currentIndex, currentIndex + 3).map((restaurant, index) => (
            <View
              key={restaurant.id}
              className="absolute inset-0"
              style={{
                zIndex: 3 - index,
                transform: [
                  { scale: 1 - index * 0.03 },
                  { translateY: index * -8 },
                ],
              }}
            >
              <SwipeableCard
                restaurant={restaurant}
                onLike={handleLike}
                onDislike={handleDislike}
                onSuperLike={handleSuperLike}
                isActive={index === 0}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Swipe Hint */}
      <View className="bg-white px-4 py-4 border-t border-gray-200 z-20">
        <View className="max-w-app mx-auto w-full">
          <Text className="text-center text-sm text-gray-600 mb-2">
            {members.length} {members.length === 1 ? 'person' : 'people'} swiping together
          </Text>
          <Text className="text-center text-xs text-gray-500">
            👈 Swipe left to pass • Swipe right to like 👉 • Swipe up for super like 👆
          </Text>
        </View>
      </View>
      </View>
    </GestureHandlerRootView>
  );
}
