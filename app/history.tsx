import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../lib/contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPriceTier } from '../lib/utils';

type GroupHistory = {
  id: string;
  zip_code: string;
  radius: number;
  price_tier: number;
  status: string;
  created_at: string;
  member_count: number;
  has_matches: boolean;
};

export default function HistoryPage() {
  const router = useRouter();
  const { profile, isGuest, loading: authLoading } = useAuth();

  const [groups, setGroups] = useState<GroupHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile || isGuest) {
      setLoading(false);
      return;
    }

    loadGroupHistory();
  }, [profile, isGuest]);

  const loadGroupHistory = async () => {
    if (!profile) return;

    try {
      setLoading(true);

      // Get all groups the user has been a part of
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('group_id, joined_at')
        .eq('user_id', profile.id)
        .order('joined_at', { ascending: false });

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) {
        setGroups([]);
        return;
      }

      // Get group details
      const groupIds = memberData.map(m => m.group_id);
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .in('id', groupIds);

      if (groupError) throw groupError;

      // Get member counts for each group
      const { data: memberCounts, error: countError } = await supabase
        .from('group_members')
        .select('group_id')
        .in('group_id', groupIds);

      if (countError) throw countError;

      // Get match status for each group
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('group_id')
        .in('group_id', groupIds);

      if (matchError) throw matchError;

      // Combine data
      const history: GroupHistory[] = (groupData || []).map(group => {
        const memberCount = memberCounts?.filter(m => m.group_id === group.id).length || 0;
        const hasMatches = matchData?.some(m => m.group_id === group.id) || false;

        return {
          ...group,
          member_count: memberCount,
          has_matches: hasMatches,
        };
      });

      // Sort by created_at descending
      history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setGroups(history);
    } catch (error) {
      console.error('Error loading group history:', error);
      toast.error('Failed to load group history');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#E53935" />
        <Text className="text-gray-600 mt-4">Loading history...</Text>
      </View>
    );
  }

  // Guest user - encourage signup
  if (isGuest || !profile) {
    return (
      <View className="flex-1 bg-background">
        <Toaster position="top-center" />

        <View className="flex-1 max-w-app mx-auto w-full px-4 py-8 items-center justify-center">
          <Text className="text-6xl mb-4">🔒</Text>
          <Text className="text-2xl font-bold text-textDark mb-2 text-center">
            Sign In Required
          </Text>
          <Text className="text-base text-gray-600 text-center mb-6 px-4">
            Create an account to save and view your group history
          </Text>
          <Pressable
            onPress={() => router.push('/auth/signup')}
            className="bg-primary px-8 py-4 rounded-xl active:scale-95 mb-3"
          >
            <Text className="text-white text-lg font-bold">
              Create Account
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/auth/login')}
            className="border-2 border-secondary px-8 py-4 rounded-xl active:scale-95 mb-4"
          >
            <Text className="text-secondary text-lg font-bold">
              Sign In
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push('/account')}>
            <Text className="text-gray-600 text-base underline">
              Back to Account
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Toaster position="top-center" />

      <View className="max-w-app mx-auto w-full px-4 py-8">
        {/* Header */}
        <View className="mb-8">
          <Pressable onPress={() => router.push('/account')} className="mb-4">
            <Text className="text-primary text-base font-semibold">← Back to Account</Text>
          </Pressable>

          <Text className="text-6xl mb-4">📜</Text>
          <Text className="text-3xl font-bold text-primary mb-2">
            Group History
          </Text>
          <Text className="text-base text-gray-600">
            Your past ChickenTinders groups
          </Text>
        </View>

        {/* Groups List */}
        {groups.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-6xl mb-4">🍗</Text>
            <Text className="text-xl font-bold text-textDark mb-2 text-center">
              No Groups Yet
            </Text>
            <Text className="text-base text-gray-600 text-center mb-6 px-4">
              Create or join a group to start finding restaurants with friends!
            </Text>
            <Pressable
              onPress={() => router.push('/create')}
              className="bg-primary px-8 py-4 rounded-xl active:scale-95"
            >
              <Text className="text-white text-lg font-bold">
                Create Group
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-4">
            {groups.map((group) => {
              const date = new Date(group.created_at);
              const statusColor =
                group.status === 'matched' ? 'text-success' :
                group.status === 'expired' ? 'text-gray-500' :
                'text-secondary';

              const statusText =
                group.status === 'matched' ? 'Matched' :
                group.status === 'expired' ? 'Expired' :
                group.status === 'swiping' ? 'In Progress' :
                'Waiting';

              return (
                <Pressable
                  key={group.id}
                  onPress={() => {
                    if (group.status === 'matched') {
                      router.push(`/results/${group.id}`);
                    } else if (group.status !== 'expired') {
                      router.push(`/lobby/${group.id}`);
                    }
                  }}
                  className="bg-white rounded-2xl p-4 shadow-sm active:scale-98"
                >
                  {/* Group Code & Status */}
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-xl font-bold font-mono text-primary">
                      {group.id}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <View className={`w-2 h-2 rounded-full ${
                        group.status === 'matched' ? 'bg-success' :
                        group.status === 'expired' ? 'bg-gray-400' :
                        'bg-secondary'
                      }`} />
                      <Text className={`text-sm font-semibold ${statusColor}`}>
                        {statusText}
                      </Text>
                    </View>
                  </View>

                  {/* Group Details */}
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
                        {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
                      </Text>
                    </View>
                  </View>

                  {/* Date & Matches */}
                  <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <Text className="text-xs text-gray-500">
                      {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                    </Text>
                    {group.has_matches && (
                      <View className="bg-success px-2 py-1 rounded-lg">
                        <Text className="text-white text-xs font-semibold">
                          Has Matches
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
