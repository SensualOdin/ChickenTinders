import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { BackButton } from '../components/navigation/BackButton';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { analytics } from '../lib/monitoring/analytics';

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
        analytics.groupJoined(group.id, upperCode);
        router.push(`/results/${group.id}`);
        setLoading(false);
        return;
      }

      // Track group joined
      analytics.groupJoined(group.id, upperCode);

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
            <Input
              label="Group Code"
              value={groupCode}
              onChangeText={setGroupCode}
              placeholder="e.g., CHKN22"
              autoCapitalize="characters"
              maxLength={6}
              helperText="Ask your friend for the group code"
              className="font-mono"
            />
          </View>

          {/* Join Button */}
          <Button
            onPress={handleJoinGroup}
            disabled={loading || !groupCode.trim()}
            loading={loading}
            variant="primary"
            size="lg"
            fullWidth
          >
            Join Group
          </Button>

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
            <Button
              href="/create"
              variant="outline"
              size="md"
            >
              Create Your Own Group
            </Button>
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
