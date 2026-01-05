import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Image, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useGroup } from '../../lib/hooks/useGroup';
import { detectMatches, saveMatches, getMatches, MatchResult } from '../../lib/utils/matches';
import { getMockRestaurants } from '../../lib/api/mock-restaurants';
import { ConfettiCelebration } from '../../components/animations/ConfettiCelebration';
import { ResultsCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../../components/ui/Avatar';

type SwipeStatus = {
  user_id: string;
  swipe_count: number;
  display_name: string;
};

export default function ResultsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { group, members } = useGroup(id || '');

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [swipeStatus, setSwipeStatus] = useState<SwipeStatus[]>([]);
  const [allMembersFinished, setAllMembersFinished] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Track swipe progress for all members
  useEffect(() => {
    if (!id || members.length === 0) return;

    // Stop polling if matches are already loaded
    if (matches.length > 0) {
      console.log('Matches already loaded, skipping polling setup');
      return;
    }

    let pollInterval: NodeJS.Timeout;
    let subscription: any;

    const fetchSwipeStatus = async () => {
      try {
        // Get the total number of restaurants to swipe through
        const totalRestaurants = getMockRestaurants().length;

        // Get swipe counts for each member
        const { data: swipes, error: swipeError } = await supabase
          .from('swipes')
          .select('user_id')
          .eq('group_id', id);

        if (swipeError) throw swipeError;

        // Build status map
        const statusMap: SwipeStatus[] = members.map((member) => {
          const userSwipes = swipes?.filter((s) => s.user_id === member.user_id) || [];
          return {
            user_id: member.user_id,
            swipe_count: userSwipes.length,
            display_name: member.user.display_name,
          };
        });

        setSwipeStatus(statusMap);

        // Mark initial load as complete so we can show the waiting room
        setInitialLoadComplete(true);

        // Check if all members have finished swiping (swiped on ALL restaurants)
        const allFinished = statusMap.every((status) => status.swipe_count >= totalRestaurants);
        console.log('Swipe status check:', {
          allFinished,
          totalRestaurants,
          statusMap
        });

        // If all members finished, trigger match detection using callback to avoid stale closure
        if (allFinished) {
          setAllMembersFinished((prev) => {
            console.log('Checking allMembersFinished:', { prev, allFinished });
            if (!prev) {
              console.log('Setting allMembersFinished to true');
              return true;
            }
            return prev;
          });
        }
      } catch (err) {
        console.error('Error fetching swipe status:', err);
      }
    };

    fetchSwipeStatus();

    // Set up polling as fallback (check every 2 seconds)
    pollInterval = setInterval(() => {
      console.log('Polling for swipe updates...');
      fetchSwipeStatus();
    }, 2000);

    // Subscribe to swipe changes for real-time updates
    subscription = supabase
      .channel(`results-swipes-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'swipes',
          filter: `group_id=eq.${id}`,
        },
        (payload) => {
          console.log('Swipe change detected!', payload);
          fetchSwipeStatus();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to swipes for group:', id);
        }
      });

    return () => {
      console.log('Cleaning up: unsubscribing and stopping polling');
      if (pollInterval) clearInterval(pollInterval);
      if (subscription) subscription.unsubscribe();
    };
  }, [id, members, matches.length]);

  // Load/detect matches when all members finish
  useEffect(() => {
    if (!id || !group || !allMembersFinished) return;

    const loadMatches = async () => {
      try {
        console.log('All members finished, detecting matches...');
        setLoading(true);

        // First check if matches already exist
        const existingMatches = await getMatches(id);

        if (existingMatches.length > 0) {
          console.log('Found existing matches:', existingMatches.length);
          setMatches(existingMatches);
          setLoading(false);
          return;
        }

        // No existing matches, detect them
        console.log('No existing matches, running detection...');
        setDetecting(true);
        const allRestaurants = getMockRestaurants();
        const detectedMatches = await detectMatches(id, allRestaurants);

        console.log('Detected matches:', detectedMatches.length);

        if (detectedMatches.length > 0) {
          await saveMatches(id, detectedMatches);
          setMatches(detectedMatches);
          toast.success('🎉 Matches found!');
          setShowConfetti(true);
          // Hide confetti after animation
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          // No matches found, set empty array to trigger "no matches" UI
          setMatches([]);
        }

        setDetecting(false);
      } catch (err: any) {
        console.error('Error loading matches:', err);
        toast.error('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [id, group, allMembersFinished]);

  const handleGetDirections = (restaurant: MatchResult['restaurant_data']) => {
    const address = restaurant.location.display_address.join(', ');
    const query = encodeURIComponent(`${restaurant.name} ${address}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;

    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  // Show loading only if we haven't loaded initial status yet or if we're detecting matches
  if (!initialLoadComplete || (loading && allMembersFinished)) {
    return (
      <ScrollView className="flex-1 bg-background">
        <Toaster position="top-center" />
        <View className="max-w-app mx-auto w-full px-4 py-6">
          <View className="items-center mb-6">
            <ActivityIndicator size="large" color="#E53935" />
            <Text className="text-gray-600 mt-4">
              {detecting ? 'Finding your matches...' : 'Loading results...'}
            </Text>
          </View>
          <ResultsCardSkeleton />
          <ResultsCardSkeleton />
        </View>
      </ScrollView>
    );
  }

  if (matches.length === 0) {
    // Check if people are still swiping
    const totalRestaurants = getMockRestaurants().length;
    const stillSwiping = swipeStatus.filter((s) => s.swipe_count < totalRestaurants);
    const finishedSwiping = swipeStatus.filter((s) => s.swipe_count >= totalRestaurants);

    if (stillSwiping.length > 0) {
      // Show waiting state with progress
      return (
        <ScrollView className="flex-1 bg-background">
          <Toaster position="top-center" />
          <View className="max-w-app mx-auto w-full px-4 py-8">
            <View className="items-center mb-8">
              <Text className="text-6xl mb-4">⏳</Text>
              <Text className="text-2xl font-bold text-textDark mb-2 text-center">
                Waiting for Everyone...
              </Text>
              <Text className="text-base text-gray-600 text-center">
                Results will appear automatically when all members finish swiping
              </Text>
            </View>

            {/* Progress Card */}
            <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
              <Text className="text-lg font-bold text-textDark mb-3">
                Swipe Progress
              </Text>

              {/* Finished Members */}
              {finishedSwiping.length > 0 && (
                <>
                  <Text className="text-sm font-semibold text-success mb-2">
                    ✅ Finished ({finishedSwiping.length})
                  </Text>
                  <View className="gap-2 mb-4">
                    {finishedSwiping.map((status) => (
                      <View key={status.user_id} className="flex-row items-center gap-2">
                        <Avatar name={status.display_name} size="small" />
                        <Text className="text-sm text-gray-700">{status.display_name}</Text>
                        <Text className="text-xs text-gray-500">
                          ({status.swipe_count} swipes)
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* Still Swiping Members */}
              <Text className="text-sm font-semibold text-orange-600 mb-2">
                ⏳ Still Swiping ({stillSwiping.length})
              </Text>
              <View className="gap-2">
                {stillSwiping.map((status) => (
                  <View key={status.user_id} className="flex-row items-center gap-2">
                    <Avatar name={status.display_name} size="small" />
                    <Text className="text-sm text-gray-700">{status.display_name}</Text>
                    <ActivityIndicator size="small" color="#E53935" />
                  </View>
                ))}
              </View>
            </View>

            {/* Info Box */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Text className="text-sm text-blue-900 font-semibold mb-2">
                💡 Tip
              </Text>
              <Text className="text-sm text-blue-800">
                This page will automatically refresh when everyone finishes swiping.
                No need to manually reload!
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    // Everyone finished but no matches
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <Toaster position="top-center" />
        <Text className="text-6xl mb-4">😕</Text>
        <Text className="text-2xl font-bold text-textDark mb-2 text-center">
          No Matches Found
        </Text>
        <Text className="text-base text-gray-600 text-center mb-6">
          You and your friends didn't match on any restaurants. Try again with different preferences!
        </Text>
        <Pressable
          onPress={() => router.push('/')}
          className="bg-primary px-6 py-3 rounded-xl active:scale-95"
        >
          <Text className="text-white font-semibold">Create New Group</Text>
        </Pressable>
      </View>
    );
  }

  const unanimousMatches = matches.filter(m => m.is_unanimous);
  const hasUnanimous = unanimousMatches.length > 0;

  return (
    <ScrollView className="flex-1 bg-background">
      <Toaster position="top-center" />
      {showConfetti && <ConfettiCelebration />}
      <View className="max-w-app mx-auto w-full px-4 py-6">
        {/* Celebration Header */}
        <View className="items-center mb-6">
          <Text className="text-6xl mb-4">🎉</Text>
          <Text className="text-3xl font-bold text-primary mb-2">
            {matches.length} {matches.length === 1 ? 'Match' : 'Matches'} Found!
          </Text>
          <Text className="text-base text-gray-600">
            {members.length} {members.length === 1 ? 'person' : 'people'} agreed on {matches.length} {matches.length === 1 ? 'restaurant' : 'restaurants'}
          </Text>
        </View>

        {/* All Matches */}
        {matches.map((match, index) => (
          <View
            key={match.restaurant_id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4"
          >
            {/* Badge for unanimous matches */}
            {match.is_unanimous && (
              <View className="absolute top-4 right-4 bg-yellow-500 px-3 py-1 rounded-full z-10">
                <Text className="text-white text-xs font-bold">⭐ UNANIMOUS</Text>
              </View>
            )}

            {/* Restaurant Image */}
            {match.restaurant_data.image_url ? (
              <Image
                source={{ uri: match.restaurant_data.image_url }}
                className="w-full h-48"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-48 bg-gray-200 items-center justify-center">
                <Text className="text-6xl">🍽️</Text>
              </View>
            )}

            {/* Restaurant Details */}
            <View className="p-5">
              <Text className="text-2xl font-bold text-textDark mb-2">
                {match.restaurant_data.name}
              </Text>

              <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-base text-gray-700">
                  {match.restaurant_data.categories[0]?.title}
                </Text>
                <Text className="text-base text-gray-400">•</Text>
                <Text className="text-base font-semibold text-primary">
                  {match.restaurant_data.price || '$$'}
                </Text>
              </View>

              <View className="flex-row items-center gap-4 mb-3">
                <View className="flex-row items-center gap-1">
                  <Text className="text-lg">⭐</Text>
                  <Text className="text-sm font-semibold text-gray-700">
                    {match.restaurant_data.rating}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-lg">📍</Text>
                  <Text className="text-sm text-gray-700">
                    {(match.restaurant_data.distance / 1609.34).toFixed(1)} mi
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-gray-600 mb-4">
                {match.restaurant_data.location.display_address.join(', ')}
              </Text>

              {/* Get Directions Button */}
              <Pressable
                onPress={() => handleGetDirections(match.restaurant_data)}
                className="bg-success py-3 rounded-xl items-center active:scale-95"
              >
                <Text className="text-white text-base font-bold">
                  🗺️ Get Directions
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* Create New Group */}
        <View className="mt-6 mb-4">
          <Text className="text-center text-base text-gray-600 mb-4">
            Planning another group dinner?
          </Text>
          <Pressable
            onPress={() => router.push('/')}
            className="bg-secondary py-4 rounded-xl items-center active:scale-95"
          >
            <Text className="text-white text-lg font-bold">
              Create New Group
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
