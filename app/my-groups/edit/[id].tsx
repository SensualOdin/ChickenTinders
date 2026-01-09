import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../lib/contexts/AuthContext';
import {
  getSavedGroup,
  updateSavedGroup,
  addSavedGroupMember,
  removeSavedGroupMember,
  SavedGroup,
  SavedGroupMember,
} from '../../../lib/api/savedGroups';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { haptic } from '../../../lib/utils';

type Member = SavedGroupMember & { _isNew?: boolean };

export default function EditSavedGroupPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, isGuest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [group, setGroup] = useState<SavedGroup | null>(null);

  const [name, setName] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');

  // Redirect guests
  if (isGuest) {
    router.replace('/auth/signup');
    return null;
  }

  useEffect(() => {
    if (id) {
      loadGroup();
    }
  }, [id]);

  const loadGroup = async () => {
    try {
      setLoading(true);
      const data = await getSavedGroup(id);
      if (data) {
        setGroup(data);
        setName(data.name);
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error loading group:', error);
      toast.error('Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  const addMember = () => {
    if (!newMemberName.trim()) {
      toast.error('Please enter a member name');
      return;
    }

    const newMember: Member = {
      id: `temp_${Date.now()}`,
      saved_group_id: id,
      display_name: newMemberName.trim(),
      email: null,
      dietary_tags: [],
      created_at: new Date().toISOString(),
      _isNew: true,
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
    haptic.light();
  };

  const removeMember = async (member: Member) => {
    if (member._isNew) {
      // Just remove from local state
      setMembers(members.filter((m) => m.id !== member.id));
    } else {
      // Remove from database
      try {
        await removeSavedGroupMember(member.id);
        setMembers(members.filter((m) => m.id !== member.id));
        toast.success('Member removed');
        haptic.light();
      } catch (error) {
        console.error('Error removing member:', error);
        toast.error('Failed to remove member');
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    try {
      setSaving(true);

      // Update group name only (ZIP/radius/price are deprecated)
      await updateSavedGroup(id, {
        name: name.trim(),
      });

      // Add new members
      const newMembers = members.filter((m) => m._isNew);
      for (const member of newMembers) {
        await addSavedGroupMember(id, {
          display_name: member.display_name,
          email: member.email || undefined,
          dietary_tags: member.dietary_tags,
        });
      }

      toast.success('Group updated!');
      haptic.success();
      router.push('/my-groups');
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Failed to update group');
      haptic.error();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#A91D3A" />
        <Text className="text-textMuted mt-4">Loading group...</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-textMuted">Group not found</Text>
        <Button
          href="/my-groups"
          variant="primary"
          size="md"
          className="mt-4"
        >
          Go Back to My Groups
        </Button>
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
            <Button
              href="/my-groups"
              variant="ghost"
              size="sm"
              className="mb-4 self-start -ml-2"
            >
              ← Back to My Groups
            </Button>

            <Text className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display' }}>
              Edit Group
            </Text>
            <Text className="text-textMuted text-base">
              Update your saved group name and members
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
              <Text className="text-textDark font-medium mb-2">Members</Text>

              {/* Add Member Input */}
              <View className="flex-row gap-2 mb-3">
                <View className="flex-1">
                  <Input
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                    placeholder="Add new member"
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
                      <View className="flex-1">
                        <Text className="text-textDark">{member.display_name}</Text>
                        {member._isNew && (
                          <Text className="text-secondary text-xs">New</Text>
                        )}
                      </View>
                      <Pressable
                        onPress={() => removeMember(member)}
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

            {/* Save Button */}
            <Button
              onPress={handleSave}
              disabled={saving}
              loading={saving}
              variant="primary"
              size="lg"
              fullWidth
              className="mt-4"
            >
              Save Changes
            </Button>

            {/* Cancel Button */}
            <Button
              href="/my-groups"
              variant="ghost"
              size="md"
              fullWidth
            >
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
