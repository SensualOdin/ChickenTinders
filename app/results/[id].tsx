import { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, Linking, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGroup } from '../../lib/hooks/useGroup';
import { detectMatches, saveMatches, getMatches, MatchResult } from '../../lib/utils/matches';
import { getMockRestaurants } from '../../lib/api/mock-restaurants';
import { ConfettiCelebration } from '../../components/animations/ConfettiCelebration';
import { AnimatedCounter } from '../../components/animations/AnimatedCounter';
import { ResultsCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InfoCard } from '../../components/ui/InfoCard';
import { Container } from '../../components/layout/Container';
import { Stack } from '../../components/layout/Stack';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../../components/ui/Avatar';
import { haptic } from '../../lib/utils';
import { analytics } from '../../lib/monitoring/analytics';

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

          // Track matches found
          const unanimousCount = detectedMatches.filter(m => m.is_unanimous).length;
          analytics.matchesFound(id, detectedMatches.length, unanimousCount);

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

  const handleGetDirections = useCallback((restaurant: MatchResult['restaurant_data']) => {
    const address = restaurant.location.display_address.join(', ');
    const query = encodeURIComponent(`${restaurant.name} ${address}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;

    // Track directions opened
    analytics.directionsOpened(restaurant.id, restaurant.name);

    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  }, []);

  const handleShare = useCallback(async () => {
    try {
      const matchList = matches
        .map((m) => `• ${m.restaurant_data.name}`)
        .join('\n');

      const message = `We found ${matches.length} ${matches.length === 1 ? 'match' : 'matches'} on ChickenTinders! 🎉\n\n${matchList}`;

      await Share.share({
        message,
        title: 'ChickenTinders Match Results',
      });

      // Track successful share (Share.share resolves even on cancel, so this might track cancels too)
      if (id) {
        analytics.matchShared(id, matches.length);
      }

      haptic.light();
    } catch (error: any) {
      console.error('Error sharing:', error);
      // User cancelled or error occurred
    }
  }, [matches, id]);

  // Show loading only if we haven't loaded initial status yet or if we're detecting matches
  if (!initialLoadComplete || (loading && allMembersFinished)) {
    return (
      <ScrollView className="flex-1 bg-background">
        <Toaster position="top-center" />
        <Container padding="md" className="py-6">
          <View className="items-center mb-6">
            <ActivityIndicator size="large" color="#E53935" />
            <Text className="text-gray-600 mt-4">
              {detecting ? 'Finding your matches...' : 'Loading results...'}
            </Text>
          </View>
          <ResultsCardSkeleton />
          <ResultsCardSkeleton />
        </Container>
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
          <Container padding="md" className="py-8">
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
            <Card variant="default" padding="md" className="mb-4">
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
            </Card>

            {/* Info Box */}
            <InfoCard
              variant="info"
              title="Tip"
              emoji="💡"
            >
              This page will automatically refresh when everyone finishes swiping.
              No need to manually reload!
            </InfoCard>
          </Container>
        </ScrollView>
      );
    }

    // Everyone finished but no matches
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <Toaster position="top-center" />
        <Container size="md" className="items-center">
          <Stack spacing="lg" className="items-center">
            <Text className="text-8xl">😕</Text>
            <View>
              <Text className="text-3xl font-bold text-textDark mb-2 text-center">
                No Matches Found
              </Text>
              <Text className="text-base text-textMuted text-center">
                You and your friends didn't match on any restaurants.
              </Text>
            </View>
            <InfoCard variant="warning" emoji="💡" title="Tip" className="w-full">
              Try adjusting your search radius, price preferences, or dietary restrictions to find more options everyone can agree on.
            </InfoCard>
            <Button
              href="/"
              variant="primary"
              size="lg"
              fullWidth
            >
              Start New Group
            </Button>
          </Stack>
        </Container>
      </View>
    );
  }

  // Memoize expensive calculations
  const unanimousMatches = useMemo(() => matches.filter(m => m.is_unanimous), [matches]);
  const hasUnanimous = unanimousMatches.length > 0;

  return (
    <ScrollView className="flex-1 bg-background">
      <Toaster position="top-center" />
      {showConfetti && <ConfettiCelebration />}
      <Container padding="md" className="py-6">
        {/* Celebration Header */}
        <View className="items-center mb-6">
          <Text className="text-6xl mb-4">🎉</Text>
          <View className="flex-row items-baseline gap-2 mb-2">
            <AnimatedCounter
              end={matches.length}
              className="text-3xl font-bold text-primary"
              duration={1200}
            />
            <Text className="text-3xl font-bold text-primary">
              {matches.length === 1 ? 'Match' : 'Matches'} Found!
            </Text>
          </View>
          <Text className="text-base text-gray-600 mb-4">
            {members.length} {members.length === 1 ? 'person' : 'people'} agreed on {matches.length} {matches.length === 1 ? 'restaurant' : 'restaurants'}
          </Text>

          {/* Share Button */}
          <Button
            onPress={handleShare}
            variant="secondary"
            size="md"
            icon="share-alt"
          >
            Share Results
          </Button>
        </View>

        {/* All Matches */}
        {matches.map((match, index) => (
          <Animated.View
            key={match.restaurant_id}
            entering={FadeInDown.delay(index * 150).duration(600)}
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
              <Button
                onPress={() => handleGetDirections(match.restaurant_data)}
                variant="primary"
                size="md"
                fullWidth
                icon="location-arrow"
                className="bg-success active:bg-success/80"
              >
                Get Directions
              </Button>
            </View>
          </Animated.View>
        ))}

        {/* Create New Group */}
        <View className="mt-6 mb-4">
          <Text className="text-center text-base text-gray-600 mb-4">
            Planning another group dinner?
          </Text>
          <Button
            href="/"
            variant="secondary"
            size="lg"
            fullWidth
          >
            Create New Group
          </Button>
        </View>
      </Container>
    </ScrollView>
  );
}
