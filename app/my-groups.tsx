import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../lib/contexts/AuthContext';
import { getSavedGroups, deleteSavedGroup, SavedGroup } from '../lib/api/savedGroups';
import { haptic } from '../lib/utils';

export default function MyGroupsPage() {
  const router = useRouter();
  const { profile, isGuest } = useAuth();
  const [groups, setGroups] = useState<SavedGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect guests to sign up
  useEffect(() => {
    if (!loading && isGuest) {
      toast.error('Please sign up to save groups');
      router.replace('/auth/signup');
    }
  }, [isGuest, loading, router]);

  // Load saved groups
  useEffect(() => {
    if (profile && !isGuest) {
      loadGroups();
    }
  }, [profile, isGuest]);

  const loadGroups = async () => {
    if (!profile) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getSavedGroups(profile.id);
      setGroups(data);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load your groups');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (!confirm(`Delete "${groupName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteSavedGroup(groupId);
      toast.success('Group deleted');
      haptic.success();
      await loadGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
      haptic.error();
    }
  };

  const handleStartSession = (group: SavedGroup) => {
    // Navigate to create page with just the group info
    router.push({
      pathname: '/create',
      params: {
        savedGroupId: group.id,
        savedGroupName: group.name,
      },
    });
  };

  const getPriceLabel = (tier: number) => {
    return '$'.repeat(tier);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#A91D3A" />
        <Text className="text-textMuted mt-4">Loading your groups...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Toaster position="top-center" />

      <ScrollView className="flex-1">
        <View className="max-w-app mx-auto w-full px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Pressable
              onPress={() => router.push('/account')}
              className="mb-4 self-start"
            >
              <Text className="text-primary text-base">← Back to Account</Text>
            </Pressable>

            <Text className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display' }}>
              My Groups
            </Text>
            <Text className="text-textMuted text-base">
              Save your regular dining crews and quickly start new sessions. Each session creates a shareable group code.
            </Text>
          </View>

          {/* Create New Group Button */}
          <Pressable
            onPress={() => router.push('/my-groups/create')}
            className="bg-primary px-6 py-4 rounded-2xl mb-6 active:scale-95 shadow-card"
          >
            <Text className="text-surface text-center font-semibold text-base">
              + Create New Group
            </Text>
          </Pressable>

          {/* Groups List */}
          {groups.length === 0 ? (
            <View className="bg-surface rounded-2xl p-8 shadow-soft border border-accent/10">
              <Text className="text-6xl text-center mb-4">🍽️</Text>
              <Text className="text-xl font-semibold text-textDark text-center mb-2">
                No saved groups yet
              </Text>
              <Text className="text-textMuted text-center">
                Create a group to quickly start sessions with your regular dining crew
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {groups.map((group) => (
                <View
                  key={group.id}
                  className="bg-surface rounded-2xl p-6 shadow-card border border-accent/10"
                >
                  {/* Group Header */}
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                      <Text className="text-2xl font-bold text-primary mb-1" style={{ fontFamily: 'Playfair Display' }}>
                        {group.name}
                      </Text>
                      <Text className="text-textMuted text-sm">
                        {group.members?.length || 0} members
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => router.push(`/my-groups/edit/${group.id}`)}
                      className="bg-accent/10 px-4 py-2 rounded-lg active:scale-95"
                    >
                      <Text className="text-accent text-sm font-medium">Edit</Text>
                    </Pressable>
                  </View>

                  {/* Members Preview */}
                  {group.members && group.members.length > 0 && (
                    <View className="mb-4 pb-4 border-b border-accent/10">
                      <Text className="text-textMuted text-xs uppercase tracking-wide mb-2">
                        Members
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {group.members.slice(0, 5).map((member) => (
                          <View
                            key={member.id}
                            className="bg-secondary/10 px-3 py-1.5 rounded-full"
                          >
                            <Text className="text-textDark text-sm">
                              {member.display_name}
                            </Text>
                          </View>
                        ))}
                        {group.members.length > 5 && (
                          <View className="bg-accent/10 px-3 py-1.5 rounded-full">
                            <Text className="text-accent text-sm">
                              +{group.members.length - 5} more
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={() => handleStartSession(group)}
                      className="flex-1 bg-primary px-6 py-3 rounded-xl active:scale-95"
                    >
                      <Text className="text-surface text-center font-semibold">
                        Start Session
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteGroup(group.id, group.name)}
                      className="bg-surface border border-primary/30 px-4 py-3 rounded-xl active:scale-95"
                    >
                      <Text className="text-primary text-center">🗑️</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
