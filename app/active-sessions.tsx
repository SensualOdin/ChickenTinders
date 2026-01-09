import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { getUserId } from '../lib/storage';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatPriceTier } from '../lib/utils';
import { RESTAURANT_LIMIT } from '../lib/constants';

type GroupWithStatus = {
  id: string;
  zip_code: string;
  radius: number;
  price_tier: number;
  status: string;
  created_at: string;
  expires_at: string;
  joined_at: string;
  swipe_count: number;
  total_members: number;
};

export default function ActiveSessionsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActiveSessions();
  }, []);

  const loadActiveSessions = async () => {
    try {
      setLoading(true);
      setError('');

      const userId = await getUserId();
      if (!userId) {
        toast.error('Please enter your name to view active sessions');
        router.push('/');
        return;
      }

      // Get groups the user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select(`
          joined_at,
          group:groups (
            id,
            zip_code,
            radius,
            price_tier,
            status,
            created_at,
            expires_at
          )
        `)
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) {
        setGroups([]);
        return;
      }

      // Get swipe counts and member counts for each group
      const groupsWithStatus: GroupWithStatus[] = await Promise.all(
        memberData.map(async (item: any) => {
          const group = item.group;

          // Get swipe count for this user in this group
          const { count: swipeCount } = await supabase
            .from('swipes')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
            .eq('user_id', userId);

          // Get total member count
          const { count: memberCount } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);

          return {
            id: group.id,
            zip_code: group.zip_code,
            radius: group.radius,
            price_tier: group.price_tier,
            status: group.status,
            created_at: group.created_at,
            expires_at: group.expires_at,
            joined_at: item.joined_at,
            swipe_count: swipeCount || 0,
            total_members: memberCount || 0,
          };
        })
      );

      // Filter out expired groups and sort by most recent
      const activeGroups = groupsWithStatus.filter((group) => {
        const expiresAt = new Date(group.expires_at);
        return expiresAt > new Date();
      });

      setGroups(activeGroups);
    } catch (err: any) {
      console.error('Error loading sessions:', err);
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupPress = (groupId: string) => {
    router.push(`/lobby/${groupId}`);
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#E53935" />
        <Text className="text-gray-600 mt-4">Loading your sessions...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Toaster position="top-center" />
      <View className="max-w-app mx-auto w-full px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-textDark mb-2">Active Sessions</Text>
          <Text className="text-base text-gray-600">
            Your in-progress groups (expire in 24 hours)
          </Text>
        </View>

        {/* Error State */}
        {error && (
          <View className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4">
            <Text className="text-red-800">{error}</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && groups.length === 0 && (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Text className="text-6xl mb-4">🍗</Text>
            <Text className="text-xl font-bold text-textDark mb-2 text-center">
              No active sessions
            </Text>
            <Text className="text-base text-gray-600 mb-6 text-center">
              Create a new group or join with a code to get started
            </Text>
            <View className="flex-row gap-3">
              <Button href="/create" variant="primary" size="md">
                Create Group
              </Button>
              <Button href="/join" variant="outline" size="md">
                Join Group
              </Button>
            </View>
          </View>
        )}

        {/* Groups List */}
        {groups.length > 0 && (
          <View className="gap-4">
            {groups.map((group) => {
              const totalRestaurants = RESTAURANT_LIMIT;
              const hasFinished = group.swipe_count >= totalRestaurants;
              const isSwiping = group.swipe_count > 0 && !hasFinished;

              return (
                <Pressable
                  key={group.id}
                  onPress={() => handleGroupPress(group.id)}
                  className="bg-white rounded-2xl p-4 shadow-sm active:scale-98"
                >
                  {/* Header */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xl font-bold text-textDark font-mono">
                        {group.id.toUpperCase()}
                      </Text>
                      {hasFinished && (
                        <Badge variant="primary" size="sm" icon="✓">
                          Finished
                        </Badge>
                      )}
                      {isSwiping && (
                        <Badge variant="success" size="sm">
                          In Progress
                        </Badge>
                      )}
                    </View>
                    <Text className="text-xs text-gray-500">
                      ⏰ {getTimeRemaining(group.expires_at)}
                    </Text>
                  </View>

                  {/* Details */}
                  <View className="gap-2 mb-3">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base">📍</Text>
                      <Text className="text-sm text-gray-700">
                        {group.zip_code} • {group.radius} miles
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base">💰</Text>
                      <Text className="text-sm text-gray-700">
                        {formatPriceTier(group.price_tier)}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base">👥</Text>
                      <Text className="text-sm text-gray-700">
                        {group.total_members} {group.total_members === 1 ? 'member' : 'members'}
                      </Text>
                    </View>
                  </View>

                  {/* Progress */}
                  <View className="border-t border-gray-200 pt-3 flex-row items-center justify-between">
                    <Text className="text-sm text-gray-600">
                      {hasFinished
                        ? '✅ You completed all swipes'
                        : isSwiping
                          ? `📱 ${group.swipe_count} of ${totalRestaurants} swipes`
                          : '⏳ Not started yet'}
                    </Text>
                    <Text className="text-sm font-semibold text-primary">
                      Rejoin →
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Back Button */}
        <Button
          href="/"
          variant="ghost"
          size="md"
          fullWidth
          className="mt-6"
        >
          ← Back to Home
        </Button>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
