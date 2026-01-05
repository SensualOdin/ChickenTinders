import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useGroup } from '../../lib/hooks/useGroup';
import { Avatar } from '../../components/ui/Avatar';
import { copyToClipboard, vibrate, formatPriceTier } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { getUserId, setUserId, getDisplayName, setDisplayName } from '../../lib/storage';

export default function LobbyPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { group, members, loading, error } = useGroup(id || '');
  const [joining, setJoining] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');

  // Check if current user is in the group, if not prompt to join
  useEffect(() => {
    const checkMembership = async () => {
      if (!group || loading) return;

      const userId = await getUserId();
      console.log('Checking membership:', { userId, membersCount: members.length });

      if (!userId) {
        // New user, prompt for name
        console.log('No userId found, showing name prompt');
        setShowNamePrompt(true);
        return;
      }

      // Check if user is already a member
      const isMember = members.some((m) => m.user_id === userId);
      console.log('Is member?', isMember);

      if (!isMember && members.length > 0) {
        // Existing user but not in this group, auto-join
        console.log('Auto-joining group');
        await joinGroup(userId);
      }
    };

    checkMembership();
  }, [group, members, loading]);

  const joinGroup = async (userId: string) => {
    if (!id || joining) return;

    try {
      setJoining(true);

      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: id,
          user_id: userId,
        });

      if (joinError) throw joinError;

      toast.success('Joined the group!');
      vibrate();
    } catch (err: any) {
      console.error('Error joining group:', err);
      toast.error(err.message || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  const handleJoinWithName = async () => {
    if (!tempName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      setJoining(true);

      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          display_name: tempName.trim(),
          dietary_tags: [],
        })
        .select()
        .single();

      if (userError) throw userError;

      // Save to local storage
      await setUserId(newUser.id);
      await setDisplayName(tempName.trim());

      // Join the group
      await joinGroup(newUser.id);
      setShowNamePrompt(false);
    } catch (err: any) {
      console.error('Error creating user:', err);
      toast.error(err.message || 'Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const handleCopyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const success = await copyToClipboard(url);

    if (success) {
      toast.success('Link copied! 🎉');
      vibrate();
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleStartSwiping = () => {
    // TODO: Navigate to swipe screen
    router.push(`/swipe/${id}`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#E53935" />
        <Text className="text-gray-600 mt-4">Loading lobby...</Text>
      </View>
    );
  }

  if (error || !group) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <Text className="text-6xl mb-4">😕</Text>
        <Text className="text-2xl font-bold text-textDark mb-2">Group Not Found</Text>
        <Text className="text-base text-gray-600 text-center mb-6">
          {error || 'This group doesn\'t exist or has expired.'}
        </Text>
        <Pressable
          onPress={() => router.push('/')}
          className="bg-primary px-6 py-3 rounded-xl active:scale-95"
        >
          <Text className="text-white font-semibold">Go Home</Text>
        </Pressable>
      </View>
    );
  }

  // Name prompt modal
  if (showNamePrompt) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <Toaster position="top-center" />
        <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
          <Text className="text-2xl font-bold text-textDark mb-2">Join Group</Text>
          <Text className="text-base text-gray-600 mb-6">
            Enter your name to join the group
          </Text>
          <input
            type="text"
            placeholder="Your name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-base mb-4"
            maxLength={50}
            autoFocus
          />
          <Pressable
            onPress={handleJoinWithName}
            disabled={joining}
            className={`bg-primary py-3 rounded-xl items-center active:scale-95 ${
              joining ? 'opacity-50' : ''
            }`}
          >
            {joining ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Join Group</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  const canStartSwiping = members.length >= 2;

  return (
    <ScrollView className="flex-1 bg-background">
      <Toaster position="top-center" />
      <View className="max-w-app mx-auto w-full px-4 py-6">
        {/* Header */}
        <View className="items-center mb-6">
          <Text className="text-6xl mb-4">🍗</Text>
          <Text className="text-3xl font-bold text-primary mb-1">Lobby: {id}</Text>
          <Text className="text-base text-gray-600">Waiting for friends...</Text>
        </View>

        {/* Group Settings */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-textDark mb-3">Group Settings</Text>
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">📍</Text>
              <Text className="text-base text-gray-700">
                Zip: {group.zip_code} • {group.radius} miles
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">💰</Text>
              <Text className="text-base text-gray-700">
                Price: {formatPriceTier(group.price_tier)}
              </Text>
            </View>
          </View>
        </View>

        {/* Members */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-textDark">
              Members ({members.length})
            </Text>
            {!canStartSwiping && (
              <Text className="text-sm text-gray-500">Need 2+ to start</Text>
            )}
          </View>
          <View className="gap-3">
            {members.map((member) => (
              <View key={member.id} className="flex-row items-center gap-3">
                <Avatar name={member.user.display_name} size="medium" />
                <View className="flex-1">
                  <Text className="text-base font-semibold text-textDark">
                    {member.user.display_name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Joined {new Date(member.joined_at).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Copy Link Button */}
        <Pressable
          onPress={handleCopyLink}
          className="bg-secondary py-4 rounded-xl items-center active:scale-95 mb-3"
        >
          <Text className="text-white text-lg font-bold">📋 Copy Invite Link</Text>
        </Pressable>

        {/* Start Swiping Button */}
        <Pressable
          onPress={handleStartSwiping}
          disabled={!canStartSwiping}
          className={`py-4 rounded-xl items-center active:scale-95 ${
            canStartSwiping
              ? 'bg-primary'
              : 'bg-gray-300'
          }`}
        >
          <Text
            className={`text-lg font-bold ${
              canStartSwiping ? 'text-white' : 'text-gray-500'
            }`}
          >
            {canStartSwiping ? '▶️ Start Swiping' : '⏳ Waiting for more people...'}
          </Text>
        </Pressable>

        {/* Back Button */}
        <Pressable
          onPress={() => router.push('/')}
          className="py-3 items-center mt-4"
        >
          <Text className="text-gray-600 text-base">← Back to Home</Text>
        </Pressable>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
