import { ConfettiCelebration } from '../../components/animations/ConfettiCelebration';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import toast, { Toaster } from 'react-hot-toast';
import { useGroup } from '../../lib/hooks/useGroup';
import { SwipeableCard } from '../../components/deck/SwipeableCard';
import { RestaurantCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { BackButton } from '../../components/navigation/BackButton';
import { getRestaurantsForGroup, YelpBusiness } from '../../lib/api/yelp';
import { getMockRestaurants } from '../../lib/api/mock-restaurants';
import { supabase } from '../../lib/supabase';
import { getUserId } from '../../lib/storage';
import { haptic } from '../../lib/utils';
import { EmptyState } from '../../components/feedback/EmptyState';
import { analytics } from '../../lib/monitoring/analytics';

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
    console.log('SwipePage useEffect:', { group: !!group, groupLoading, loading });

    if (!group || groupLoading) {
      console.log('Waiting for group to load...', { hasGroup: !!group, groupLoading });
      return;
    }

    const loadRestaurants = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('Fetching restaurants for:', {
          zip: group.zip_code,
          radius: group.radius,
          price: group.price_tier,
        });

        const userId = await getUserId();
        if (!userId) {
          toast.error('User not found');
          return;
        }

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

        // Check for existing swipes to resume progress
        const { data: existingSwipes } = await supabase
          .from('swipes')
          .select('restaurant_id')
          .eq('group_id', id)
          .eq('user_id', userId);

        if (existingSwipes && existingSwipes.length > 0) {
          const swipedRestaurantIds = new Set(existingSwipes.map(s => s.restaurant_id));
          console.log(`User has already swiped on ${existingSwipes.length} restaurants`);

          // Find first unswipped restaurant
          const firstUnswippedIndex = businesses.findIndex(
            b => !swipedRestaurantIds.has(b.id)
          );

          if (firstUnswippedIndex >= 0) {
            setCurrentIndex(firstUnswippedIndex);
            console.log(`Resuming at index ${firstUnswippedIndex}`);
          } else {
            // All restaurants already swiped, return to lobby
            console.log('All restaurants already swiped, returning to lobby');
            setTimeout(() => {
              router.push(`/lobby/${id}`);
            }, 500);
            return;
          }
        }

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

  const handleSwipe = useCallback(async (isLiked: boolean, isSuperLike: boolean = false) => {
    if (!id || swiping || currentIndex >= restaurants.length) return;

    const restaurant = restaurants[currentIndex];
    const userId = await getUserId();

    if (!userId) {
      toast.error('User not found');
      return;
    }

    try {
      setSwiping(true);

      // Check if swipe already exists
      const { data: existingSwipe } = await supabase
        .from('swipes')
        .select('id')
        .eq('group_id', id)
        .eq('user_id', userId)
        .eq('restaurant_id', restaurant.id)
        .single();

      if (existingSwipe) {
        // Swipe already exists, skip to next card
        console.log('Swipe already exists, skipping to next card');
        setCurrentIndex(currentIndex + 1);

        if (currentIndex + 1 >= restaurants.length) {
          setTimeout(() => {
            router.push(`/lobby/${id}`);
          }, 500);
        }
        return;
      }

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

      // Track analytics
      if (isLiked) {
        analytics.restaurantLiked(restaurant.id, restaurant.name, isSuperLike);
      } else {
        analytics.restaurantDisliked(restaurant.id, restaurant.name);
      }

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
        // All done! Go back to lobby to wait for others
        setTimeout(() => {
          router.push(`/lobby/${id}`);
        }, 500);
      }
    } catch (err: any) {
      console.error('Error saving swipe:', err);
      toast.error('Failed to save swipe');
    } finally {
      setSwiping(false);
    }
  }, [id, swiping, currentIndex, restaurants, router]);

  const handleLike = useCallback(() => handleSwipe(true, false), [handleSwipe]);
  const handleDislike = useCallback(() => handleSwipe(false, false), [handleSwipe]);
  const handleSuperLike = useCallback(() => handleSwipe(true, true), [handleSwipe]);

  if (groupLoading || loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-background">
          <Toaster position="top-center" />

        {/* Header */}
        <View className="bg-white/90 px-4 py-4 shadow-sm z-20 backdrop-blur-sm">
          <View className="max-w-app mx-auto w-full">
            <View className="flex-row items-center justify-between mb-3">
              <BackButton variant="icon" />
              <Text className="text-base font-semibold text-gray-700">
                Loading...
              </Text>
            </View>
            <View className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <View className="h-full bg-gray-300 w-1/4 animate-pulse" />
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
        <View className="flex-1 bg-background">
          <EmptyState
            icon="😕"
            title="No Restaurants Found"
            description={error || "We couldn't find any restaurants matching your preferences. Try adjusting your filters or search radius."}
            action={{
              label: 'Adjust Preferences',
              onPress: () => router.back(),
            }}
            secondaryAction={{
              label: 'Start Over',
              onPress: () => router.push('/'),
            }}
          />
        </View>
      </GestureHandlerRootView>
    );
  }

  if (currentIndex >= restaurants.length) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-background items-center justify-center px-4 relative">
          <ConfettiCelebration />
          <View className="bg-white p-8 rounded-3xl shadow-soft items-center w-full max-w-sm z-10">
            <Text className="text-6xl mb-6 animate-bounce">⏱️</Text>
            <Text className="text-2xl font-bold text-textDark mb-3 text-center" style={{ fontFamily: 'Playfair Display' }}>
              Waiting for friends...
            </Text>
            <Text className="text-base text-textMuted text-center mb-8 leading-relaxed">
              You've swiped through all available restaurants! Hang tight while your group catches up.
            </Text>
            <View className="flex-row items-center gap-3 bg-accent/20 px-6 py-3 rounded-full">
              <ActivityIndicator size="small" color="#8B2635" />
              <Text className="text-primary font-medium">Checking for matches...</Text>
            </View>
          </View>
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
      <View className="bg-white/90 px-4 py-4 shadow-sm z-20 backdrop-blur-sm">
        <View className="max-w-app mx-auto w-full">
          <View className="flex-row items-center justify-between mb-3">
            <BackButton variant="icon" />
            <View className="items-end">
              <Text className="text-xs font-semibold text-primary uppercase tracking-wider">
                Restaurants Found
              </Text>
              <Text className="text-lg font-bold text-textDark" style={{ fontFamily: 'Playfair Display' }}>
                {currentIndex + 1} <Text className="text-gray-400 text-sm font-normal">of</Text> {restaurants.length}
              </Text>
            </View>
          </View>
          {/* Progress Bar */}
          <View className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </View>

      {/* Card Stack Container */}
      <View className="flex-1 items-center py-4">
        <View className="w-full max-w-app px-4 flex-1 relative" style={{ maxHeight: 750 }}>
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

      {/* Action Buttons */}
      <View className="px-6 pb-8 pt-2 z-20">
        <View className="max-w-app mx-auto w-full flex-row justify-center items-center gap-8">
          
          {/* Pass Button */}
          <Pressable
            onPress={() => handleSwipe(false)}
            className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-elevated border border-gray-100 active:scale-90 transition-all"
          >
            <FontAwesome name="times" size={32} color="#EF4444" />
          </Pressable>

          {/* Super Like Button */}
          <Pressable
            onPress={() => handleSwipe(true, true)}
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-soft border border-gray-100 active:scale-90 transition-all -mt-8"
          >
            <FontAwesome name="star" size={20} color="#3B82F6" />
          </Pressable>

          {/* Like Button */}
          <Pressable
            onPress={() => handleSwipe(true)}
            className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-elevated border border-gray-100 active:scale-90 transition-all"
          >
            <FontAwesome name="heart" size={28} color="#22C55E" />
          </Pressable>

        </View>
      </View>
      </View>
    </GestureHandlerRootView>
  );
}
