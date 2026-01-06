import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Slider } from '../components/ui/Slider';
import { PriceTierSelector } from '../components/ui/PriceTierSelector';
import { DietaryTagSelector } from '../components/ui/DietaryTagSelector';
import { supabase } from '../lib/supabase';
import { generateGroupCode, isValidZipCode, getExpirationTime } from '../lib/utils';
import { getUserId, setUserId, getDisplayName, setDisplayName, getDietaryTags, setDietaryTags } from '../lib/storage';
import { getSavedGroup } from '../lib/api/savedGroups';
import { useAuth } from '../lib/contexts/AuthContext';

export default function CreateGroupPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const params = useLocalSearchParams<{
    savedGroupId?: string;
    savedGroupName?: string;
    zipCode?: string;
    radius?: string;
    priceTier?: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedGroupName, setSavedGroupName] = useState<string | null>(null);

  // Form state
  const [displayName, setDisplayNameState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(10);
  const [priceTier, setPriceTier] = useState(2);
  const [dietaryTags, setDietaryTagsState] = useState<string[]>([]);

  // Pre-fill user name from profile
  useEffect(() => {
    if (profile?.display_name && !displayName) {
      setDisplayNameState(profile.display_name);
    }
    if (profile?.dietary_tags) {
      setDietaryTagsState(profile.dietary_tags);
    }
  }, [profile]);

  // Pre-fill from saved group if provided
  useEffect(() => {
    if (params.savedGroupId) {
      loadSavedGroup(params.savedGroupId);
    } else if (params.zipCode) {
      // Pre-fill from URL params
      setZipCode(params.zipCode);
      if (params.radius) setRadius(parseInt(params.radius));
      if (params.priceTier) setPriceTier(parseInt(params.priceTier));
      if (params.savedGroupName) setSavedGroupName(params.savedGroupName);
    }
  }, [params]);

  const loadSavedGroup = async (groupId: string) => {
    try {
      const group = await getSavedGroup(groupId);
      if (group) {
        setSavedGroupName(group.name);
        // Don't pre-fill ZIP/radius/price - user sets them each session
      }
    } catch (error) {
      console.error('Error loading saved group:', error);
    }
  };

  // Validation
  const [zipError, setZipError] = useState('');

  const validateZipCode = (zip: string) => {
    setZipCode(zip);
    if (zip.length === 5) {
      if (!isValidZipCode(zip)) {
        setZipError('Please enter a valid 5-digit zip code');
      } else {
        setZipError('');
      }
    } else {
      setZipError('');
    }
  };

  const handleCreateGroup = async () => {
    // Validation
    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!zipCode.trim()) {
      setError('Please enter a zip code');
      return;
    }

    if (!isValidZipCode(zipCode)) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Check if user exists, or create new user
      let userId = await getUserId();
      let userExists = false;

      if (userId) {
        // Verify user actually exists in database (handle stale localStorage)
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .single();
        
        if (existingUser) {
          userExists = true;
          // Update existing user profile
          await supabase
            .from('users')
            .update({ 
               display_name: displayName.trim(),
               dietary_tags: dietaryTags 
            })
            .eq('id', userId);
        }
      }

      if (!userId || !userExists) {
        // Create new user
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            display_name: displayName.trim(),
            dietary_tags: dietaryTags,
          })
          .select()
          .single();

        if (userError) throw userError;

        userId = newUser.id;
        await setUserId(userId);
      }

      // Save user preferences locally
      await setDisplayName(displayName.trim());
      await setDietaryTags(dietaryTags);

      // 2. Generate unique group code
      let groupCode = generateGroupCode();
      let attempts = 0;

      // Check if code already exists (retry up to 5 times)
      while (attempts < 5) {
        const { data: existingGroup } = await supabase
          .from('groups')
          .select('id')
          .eq('id', groupCode)
          .single();

        if (!existingGroup) break;

        groupCode = generateGroupCode();
        attempts++;
      }

      // 3. Create group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          id: groupCode,
          zip_code: zipCode,
          radius: radius,
          price_tier: priceTier,
          expires_at: getExpirationTime(),
          status: 'waiting',
          creator_id: userId,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // 4. Join the group as creator
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupCode,
          user_id: userId,
        });

      if (memberError) throw memberError;

      // 5. Navigate to lobby
      router.push(`/lobby/${groupCode}`);
    } catch (err: any) {
      console.error('Error creating group:', err);
      setError(err.message || 'Failed to create group. Please try again.');
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="max-w-app mx-auto w-full px-6 py-8">
        {/* Header with refined typography */}
        <View className="mb-8">
          <Text
            className="text-4xl font-bold text-textDark mb-3 tracking-tight"
            style={{ fontFamily: 'Playfair Display' }}
          >
            {savedGroupName ? 'Start Session' : 'Create Group'}
          </Text>
          <Text className="text-base text-textMuted leading-relaxed">
            {savedGroupName
              ? 'Enter your name and create a shareable group code'
              : 'Set your preferences and invite your friends'
            }
          </Text>
        </View>

        {/* Saved Group Banner */}
        {savedGroupName && (
          <View className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 mb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-xl">👥</Text>
              <Text className="text-textDark font-semibold">
                Starting Session: {savedGroupName}
              </Text>
            </View>
            <Text className="text-textMuted text-sm">
              Creating a one-time group code to share with your members. Your preferences are pre-filled from your saved group.
            </Text>
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View className="bg-red-50 border-l-4 border-primary rounded-xl p-4 mb-6 shadow-soft">
            <Text className="text-primary text-sm font-medium">{error}</Text>
          </View>
        )}

        {/* Form with refined styling */}
        <View className="gap-7">
          {/* Display Name */}
          <View>
            <Text className="text-sm font-semibold text-textDark mb-3 tracking-wide uppercase">
              Your Name
            </Text>
            <TextInput
              className="bg-surface border border-accent-dark rounded-2xl px-5 py-4 text-base text-textDark shadow-soft"
              placeholder="Enter your name"
              placeholderTextColor="#9B9490"
              value={displayName}
              onChangeText={setDisplayNameState}
              autoCapitalize="words"
              maxLength={50}
            />
          </View>

          {/* Zip Code */}
          <View>
            <Text className="text-sm font-semibold text-textDark mb-3 tracking-wide uppercase">
              Location
            </Text>
            <TextInput
              className={`bg-surface border rounded-2xl px-5 py-4 text-base text-textDark shadow-soft ${
                zipError ? 'border-primary' : 'border-accent-dark'
              }`}
              placeholder="Enter zip code (e.g., 10001)"
              placeholderTextColor="#9B9490"
              value={zipCode}
              onChangeText={validateZipCode}
              keyboardType="numeric"
              maxLength={5}
            />
            {zipError && (
              <Text className="text-primary text-sm mt-2 font-medium">{zipError}</Text>
            )}
          </View>

          {/* Radius Slider */}
          <Slider
            min={1}
            max={25}
            value={radius}
            onChange={setRadius}
            label="Search Radius"
            suffix=" miles"
          />

          {/* Price Tier */}
          <PriceTierSelector value={priceTier} onChange={setPriceTier} />

          {/* Dietary Tags */}
          <DietaryTagSelector
            selectedTags={dietaryTags}
            onChange={setDietaryTagsState}
          />

          {/* Create Button with premium styling */}
          <Pressable
            onPress={handleCreateGroup}
            disabled={loading}
            className={`bg-primary py-5 rounded-2xl items-center active:scale-95 transition-all shadow-elevated mt-2 ${
              loading ? 'opacity-60' : ''
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#F8F6F1" />
            ) : (
              <Text className="text-surface text-base font-semibold tracking-wide">
                Create Group
              </Text>
            )}
          </Pressable>

          {/* Cancel with refined style */}
          <Pressable
            onPress={() => router.push('/')}
            className="py-4 items-center"
          >
            <Text className="text-textLight text-base tracking-wide">Cancel</Text>
          </Pressable>
        </View>

        {/* Bottom Spacing */}
        <View className="h-12" />
      </View>
    </ScrollView>
  );
}
