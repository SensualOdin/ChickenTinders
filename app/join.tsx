import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { BackButton } from '../components/navigation/BackButton';

export default function JoinPage() {
  const router = useRouter();
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      toast.error('Please enter a group code');
      return;
    }

    const upperCode = groupCode.trim().toUpperCase();

    try {
      setLoading(true);

      // Check if group exists (id IS the group code)
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', upperCode)
        .single();

      if (groupError || !group) {
        toast.error('Group not found. Check your code and try again.');
        setLoading(false);
        return;
      }

      // Check if group is expired (24 hours) or not in valid state
      const expiresAt = new Date(group.expires_at);
      if (expiresAt < new Date()) {
        toast.error('This group has expired');
        setLoading(false);
        return;
      }

      // Check if group is still joinable (not matched/expired)
      if (group.status === 'expired') {
        toast.error('This group has expired');
        setLoading(false);
        return;
      }

      if (group.status === 'matched') {
        // Still allow joining to see results
        router.push(`/results/${group.id}`);
        setLoading(false);
        return;
      }

      // Redirect to lobby
      router.push(`/lobby/${group.id}`);
      setLoading(false);
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Toaster position="top-center" />

      <View className="flex-1 max-w-app mx-auto w-full px-4 py-8">
        {/* Header */}
        <View className="mb-8">
          <BackButton variant="text" label="Back to Home" />

          <Text className="text-3xl font-bold text-primary mb-2">
            Join a Group
          </Text>
          <Text className="text-base text-textMuted">
            Enter the 6-character group code to join your friends
          </Text>
        </View>

        {/* Form */}
        <View>
          {/* Group Code Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-textDark mb-2">
              Group Code
            </Text>
            <TextInput
              value={groupCode}
              onChangeText={setGroupCode}
              placeholder="e.g., CHKN22"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={6}
              className="bg-white border-2 border-cream-dark rounded-xl px-4 py-4 text-lg font-mono text-textDark focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Text className="text-xs text-gray-500 mt-1">
              Ask your friend for the group code
            </Text>
          </View>

          {/* Join Button */}
          <Pressable
            onPress={handleJoinGroup}
            disabled={loading || !groupCode.trim()}
            className={`py-4 rounded-full items-center ${
              loading || !groupCode.trim()
                ? 'bg-surface opacity-50'
                : 'bg-primary active:scale-95 active:bg-primary-dark'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Join Group
              </Text>
            )}
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-sm text-gray-500">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Create Group Alternative */}
          <View className="items-center">
            <Text className="text-sm text-gray-600 mb-4">
              Don't have a group code?
            </Text>
            <Pressable
              onPress={() => router.push('/create')}
              className="border-2 border-primary px-6 py-3 rounded-xl active:scale-95"
            >
              <Text className="text-primary text-base font-semibold">
                Create Your Own Group
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Info Box */}
        <View className="mt-8 bg-accent/10 border-2 border-accent rounded-xl p-4">
          <Text className="text-sm text-accent-dark font-semibold mb-2">
            💡 How it works
          </Text>
          <Text className="text-sm text-textDark">
            1. Get the 6-character code from your friend{'\n'}
            2. Enter it above to join their group{'\n'}
            3. Enter your name in the lobby{'\n'}
            4. Start swiping when everyone's ready!
          </Text>
        </View>
      </View>
    </View>
  );
}
