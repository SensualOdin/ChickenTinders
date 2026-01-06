import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
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
        <Pressable onPress={() => router.push('/my-groups')} className="mt-4">
          <Text className="text-primary">Go Back to My Groups</Text>
        </Pressable>
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
              onPress={() => router.push('/my-groups')}
              className="mb-4 self-start"
            >
              <Text className="text-primary text-base">← Back to My Groups</Text>
            </Pressable>

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
            <View>
              <Text className="text-textDark font-medium mb-2">Group Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Friday Night Crew, Work Lunch, Family Dinners"
                placeholderTextColor="#9B7653"
                className="bg-surface border border-accent/20 rounded-xl px-4 py-4 text-textDark text-base"
              />
              <Text className="text-textMuted text-xs mt-2">
                Just a name for your group - you'll set location/preferences when starting each session
              </Text>
            </View>

            {/* Members */}
            <View>
              <Text className="text-textDark font-medium mb-2">Members</Text>

              {/* Add Member Input */}
              <View className="flex-row gap-2 mb-3">
                <TextInput
                  value={newMemberName}
                  onChangeText={setNewMemberName}
                  placeholder="Add new member"
                  placeholderTextColor="#9B7653"
                  onSubmitEditing={addMember}
                  className="flex-1 bg-surface border border-accent/20 rounded-xl px-4 py-3 text-textDark"
                />
                <Pressable
                  onPress={addMember}
                  className="bg-secondary px-6 py-3 rounded-xl active:scale-95"
                >
                  <Text className="text-dark font-semibold">Add</Text>
                </Pressable>
              </View>

              {/* Members List */}
              {members.length > 0 ? (
                <View className="bg-surface border border-accent/20 rounded-xl p-4 gap-2">
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
                </View>
              ) : (
                <View className="bg-surface border border-accent/20 rounded-xl p-6">
                  <Text className="text-textMuted text-center text-sm">
                    No members added yet
                  </Text>
                </View>
              )}
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className="bg-primary px-6 py-4 rounded-2xl active:scale-95 shadow-elevated mt-4"
            >
              {saving ? (
                <ActivityIndicator color="#FFF5E1" />
              ) : (
                <Text className="text-surface text-center font-semibold text-base">
                  Save Changes
                </Text>
              )}
            </Pressable>

            {/* Cancel Button */}
            <Pressable
              onPress={() => router.push('/my-groups')}
              className="py-3 items-center"
            >
              <Text className="text-textLight text-base">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
