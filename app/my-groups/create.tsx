import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../lib/contexts/AuthContext';
import { createSavedGroup } from '../../lib/api/savedGroups';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { haptic } from '../../lib/utils';

type Member = {
  id: string;
  display_name: string;
  email: string;
  dietary_tags: string[];
};

export default function CreateSavedGroupPage() {
  const router = useRouter();
  const { profile, isGuest } = useAuth();

  const [name, setName] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect guests
  if (isGuest) {
    router.replace('/auth/signup');
    return null;
  }

  const addMember = () => {
    if (!newMemberName.trim()) {
      toast.error('Please enter a member name');
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      display_name: newMemberName.trim(),
      email: '',
      dietary_tags: [],
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
    haptic.light();
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    haptic.light();
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (!profile) {
      toast.error('Please log in to create a saved group');
      return;
    }

    try {
      setLoading(true);

      // Add logged-in user to members list if not already there
      const allMembers = [
        {
          display_name: profile.display_name,
          email: profile.email || undefined,
          dietary_tags: profile.dietary_tags || [],
        },
        ...members.map((m) => ({
          display_name: m.display_name,
          email: m.email || undefined,
          dietary_tags: m.dietary_tags,
        })),
      ];

      await createSavedGroup(profile.id, {
        name: name.trim(),
        zip_code: '', // Not used - set when starting session
        radius: 10, // Default
        price_tier: 2, // Default
        members: allMembers,
      });

      toast.success('Group created!');
      haptic.success();
      router.push('/my-groups');
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(error.message || 'Failed to create group');
      haptic.error();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Toaster position="top-center" />

      <ScrollView className="flex-1">
        <View className="max-w-app mx-auto w-full px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Button
              href="/my-groups"
              variant="ghost"
              size="sm"
              className="mb-4 self-start -ml-2"
            >
              ← Back to My Groups
            </Button>

            <Text className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display' }}>
              Create Group
            </Text>
            <Text className="text-textMuted text-base">
              Save a group for quick session starts
            </Text>
          </View>

          {/* Form */}
          <View className="gap-6">
            {/* Group Name */}
            <Input
              label="Group Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g., Friday Night Crew, Work Lunch, Family Dinners"
              helperText="Just a name for your group - you'll set location/preferences when starting each session"
              size="lg"
            />

            {/* Members */}
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-textDark font-medium">Members</Text>
                <Text className="text-textMuted text-xs">(Optional - you're automatically added)</Text>
              </View>

              {/* Add Member Input */}
              <View className="flex-row gap-2 mb-3">
                <View className="flex-1">
                  <Input
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                    placeholder="Add other member names"
                    onSubmitEditing={addMember}
                    size="md"
                  />
                </View>
                <Button
                  onPress={addMember}
                  variant="secondary"
                  size="md"
                >
                  Add
                </Button>
              </View>

              {/* Members List */}
              {members.length > 0 ? (
                <Card variant="surface" padding="md" className="gap-2">
                  {members.map((member) => (
                    <View
                      key={member.id}
                      className="flex-row justify-between items-center bg-background px-4 py-3 rounded-lg"
                    >
                      <Text className="text-textDark flex-1">{member.display_name}</Text>
                      <Pressable
                        onPress={() => removeMember(member.id)}
                        className="ml-2"
                      >
                        <Text className="text-primary text-lg">×</Text>
                      </Pressable>
                    </View>
                  ))}
                </Card>
              ) : (
                <Card variant="surface" padding="lg" className="items-center">
                  <Text className="text-textMuted text-center text-sm">
                    No members added yet
                  </Text>
                </Card>
              )}
            </View>

            {/* Create Button */}
            <Button
              onPress={handleCreate}
              disabled={loading}
              loading={loading}
              variant="primary"
              size="lg"
              fullWidth
              className="mt-4"
            >
              Create Group
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
