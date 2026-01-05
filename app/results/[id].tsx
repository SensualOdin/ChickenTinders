import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Image, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useGroup } from '../../lib/hooks/useGroup';
import { detectMatches, saveMatches, getMatches, MatchResult } from '../../lib/utils/matches';
import { getMockRestaurants } from '../../lib/api/mock-restaurants';
import { ConfettiCelebration } from '../../components/animations/ConfettiCelebration';
import { ResultsCardSkeleton } from '../../components/ui/LoadingSkeleton';

export default function ResultsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { group, members } = useGroup(id || '');

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!id || !group) return;

    const loadMatches = async () => {
      try {
        setLoading(true);

        // First check if matches already exist
        const existingMatches = await getMatches(id);

        if (existingMatches.length > 0) {
          setMatches(existingMatches);
          setLoading(false);
          return;
        }

        // No existing matches, detect them
        setDetecting(true);
        const allRestaurants = getMockRestaurants();
        const detectedMatches = await detectMatches(id, allRestaurants);

        if (detectedMatches.length > 0) {
          await saveMatches(id, detectedMatches);
          setMatches(detectedMatches);
          toast.success('🎉 Matches found!');
          setShowConfetti(true);
          // Hide confetti after animation
          setTimeout(() => setShowConfetti(false), 3000);
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
  }, [id, group]);

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

  if (loading) {
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

  const topMatch = matches[0];
  const runnerUps = matches.slice(1);

  return (
    <ScrollView className="flex-1 bg-background">
      <Toaster position="top-center" />
      {showConfetti && <ConfettiCelebration />}
      <View className="max-w-app mx-auto w-full px-4 py-6">
        {/* Celebration Header */}
        <View className="items-center mb-6">
          <Text className="text-6xl mb-4">🎉</Text>
          {topMatch.is_unanimous ? (
            <>
              <Text className="text-3xl font-bold text-primary mb-2">
                UNANIMOUS!
              </Text>
              <Text className="text-base text-gray-600">
                Everyone super-liked this place! 🌟
              </Text>
            </>
          ) : (
            <>
              <Text className="text-3xl font-bold text-primary mb-2">
                It's a Match!
              </Text>
              <Text className="text-base text-gray-600">
                {members.length} {members.length === 1 ? 'person' : 'people'} agreed
              </Text>
            </>
          )}
        </View>

        {/* Winner Card */}
        <View className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
          {topMatch.restaurant_data.image_url ? (
            <Image
              source={{ uri: topMatch.restaurant_data.image_url }}
              className="w-full h-64"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-64 bg-gray-200 items-center justify-center">
              <Text className="text-6xl">🍽️</Text>
            </View>
          )}

          <View className="p-6">
            <Text className="text-3xl font-bold text-textDark mb-2">
              {topMatch.restaurant_data.name}
            </Text>

            <View className="flex-row items-center gap-2 mb-4">
              <Text className="text-lg text-gray-700">
                {topMatch.restaurant_data.categories[0]?.title}
              </Text>
              <Text className="text-lg text-gray-400">•</Text>
              <Text className="text-lg font-semibold text-primary">
                {topMatch.restaurant_data.price || '$$'}
              </Text>
            </View>

            <View className="flex-row items-center gap-4 mb-4">
              <View className="flex-row items-center gap-1">
                <Text className="text-xl">⭐</Text>
                <Text className="text-base font-semibold text-gray-700">
                  {topMatch.restaurant_data.rating}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-xl">📍</Text>
                <Text className="text-base text-gray-700">
                  {(topMatch.restaurant_data.distance / 1609.34).toFixed(1)} mi
                </Text>
              </View>
            </View>

            <Text className="text-sm text-gray-600 mb-6">
              {topMatch.restaurant_data.location.display_address.join(', ')}
            </Text>

            {/* Get Directions Button */}
            <Pressable
              onPress={() => handleGetDirections(topMatch.restaurant_data)}
              className="bg-success py-4 rounded-xl items-center active:scale-95"
            >
              <Text className="text-white text-lg font-bold">
                🗺️ Get Directions
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Runner-ups */}
        {runnerUps.length > 0 && (
          <>
            <Text className="text-xl font-bold text-textDark mb-3">
              Also Great Options:
            </Text>
            {runnerUps.map((match, index) => (
              <View
                key={match.restaurant_id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
              >
                <View className="flex-row gap-3">
                  {match.restaurant_data.image_url ? (
                    <Image
                      source={{ uri: match.restaurant_data.image_url }}
                      className="w-20 h-20 rounded-lg"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-20 h-20 rounded-lg bg-gray-200 items-center justify-center">
                      <Text className="text-2xl">🍽️</Text>
                    </View>
                  )}

                  <View className="flex-1">
                    <Text className="text-lg font-bold text-textDark mb-1">
                      {match.restaurant_data.name}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm text-gray-600">
                        {match.restaurant_data.categories[0]?.title}
                      </Text>
                      <Text className="text-sm text-gray-400">•</Text>
                      <Text className="text-sm font-semibold text-primary">
                        {match.restaurant_data.price || '$$'}
                      </Text>
                      <Text className="text-sm text-gray-400">•</Text>
                      <Text className="text-sm text-gray-600">
                        ⭐ {match.restaurant_data.rating}
                      </Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() => handleGetDirections(match.restaurant_data)}
                  className="mt-3 py-2 border-2 border-success rounded-lg items-center active:scale-95"
                >
                  <Text className="text-success font-semibold">Get Directions</Text>
                </Pressable>
              </View>
            ))}
          </>
        )}

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
