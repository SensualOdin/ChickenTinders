import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../lib/contexts/AuthContext';
import { getSavedGroups, deleteSavedGroup, SavedGroup } from '../lib/api/savedGroups';
import { BackButton } from '../components/navigation/BackButton';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
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
        <Container padding="lg" className="py-8">
          <PageHeader
            title="My Groups"
            subtitle="Save your regular dining crews and quickly start new sessions. Each session creates a shareable group code."
            backButton={{ label: "Back to Account", href: "/account" }}
          />

          {/* Create New Group Button */}
          <Button
            href="/my-groups/create"
            variant="primary"
            size="lg"
            fullWidth
            className="mb-6"
          >
            + Create New Group
          </Button>

          {/* Groups List */}
          {groups.length === 0 ? (
            <Card variant="surface" padding="lg" className="items-center">
              <Text className="text-6xl text-center mb-4">🍽️</Text>
              <Text className="text-xl font-semibold text-textDark text-center mb-2">
                No saved groups yet
              </Text>
              <Text className="text-textMuted text-center">
                Create a group to quickly start sessions with your regular dining crew
              </Text>
            </Card>
          ) : (
            <View className="gap-4">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  variant="elevated"
                  padding="lg"
                >
                  {/* Group Header */}
                  <CardHeader
                    title={group.name}
                    subtitle={`${group.members?.length || 0} members`}
                    action={
                      <Button
                        href={`/my-groups/edit/${group.id}`}
                        variant="outline"
                        size="sm"
                        className="bg-accent/10 border-0"
                      >
                        Edit
                      </Button>
                    }
                  />

                  {/* Members Preview */}
                  {group.members && group.members.length > 0 && (
                    <View className="mb-4 pb-4 border-b border-accent/10">
                      <Text className="text-textMuted text-xs uppercase tracking-wide mb-2">
                        Members
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {group.members.slice(0, 5).map((member) => (
                          <Badge
                            key={member.id}
                            variant="secondary"
                            size="md"
                          >
                            {member.display_name}
                          </Badge>
                        ))}
                        {group.members.length > 5 && (
                          <Badge variant="default" size="md">
                            +{group.members.length - 5} more
                          </Badge>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Button
                        onPress={() => handleStartSession(group)}
                        variant="primary"
                        size="md"
                        fullWidth
                      >
                        Start Session
                      </Button>
                    </View>
                    <Button
                      onPress={() => handleDeleteGroup(group.id, group.name)}
                      variant="outline"
                      size="md"
                      className="px-4"
                    >
                      🗑️
                    </Button>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </Container>
      </ScrollView>
    </View>
  );
}
