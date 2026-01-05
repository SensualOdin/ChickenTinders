import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Slider } from '../components/ui/Slider';
import { PriceTierSelector } from '../components/ui/PriceTierSelector';
import { DietaryTagSelector } from '../components/ui/DietaryTagSelector';
import { supabase } from '../lib/supabase';
import { generateGroupCode, isValidZipCode, getExpirationTime } from '../lib/utils';
import { getUserId, setUserId, getDisplayName, setDisplayName, getDietaryTags, setDietaryTags } from '../lib/storage';

export default function CreateGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [displayName, setDisplayNameState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(10);
  const [priceTier, setPriceTier] = useState(2);
  const [dietaryTags, setDietaryTagsState] = useState<string[]>([]);

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

      if (!userId) {
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

      // Save user preferences
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
      <View className="max-w-app mx-auto w-full px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-textDark mb-2">
            Create Group
          </Text>
          <Text className="text-base text-gray-600">
            Set your preferences and invite your friends
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        )}

        {/* Form */}
        <View className="gap-6">
          {/* Display Name */}
          <View>
            <Text className="text-base font-semibold text-textDark mb-2">
              Your Name
            </Text>
            <TextInput
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-textDark"
              placeholder="Enter your name"
              value={displayName}
              onChangeText={setDisplayNameState}
              autoCapitalize="words"
              maxLength={50}
            />
          </View>

          {/* Zip Code */}
          <View>
            <Text className="text-base font-semibold text-textDark mb-2">
              Location
            </Text>
            <TextInput
              className={`bg-white border-2 rounded-xl px-4 py-3 text-base text-textDark ${
                zipError ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Enter zip code (e.g., 10001)"
              value={zipCode}
              onChangeText={validateZipCode}
              keyboardType="numeric"
              maxLength={5}
            />
            {zipError && (
              <Text className="text-red-500 text-sm mt-1">{zipError}</Text>
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

          {/* Create Button */}
          <Pressable
            onPress={handleCreateGroup}
            disabled={loading}
            className={`bg-primary py-4 rounded-xl items-center active:scale-95 transition-transform ${
              loading ? 'opacity-50' : ''
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Create Group
              </Text>
            )}
          </Pressable>

          {/* Cancel */}
          <Pressable
            onPress={() => router.back()}
            className="py-3 items-center"
          >
            <Text className="text-gray-600 text-base">Cancel</Text>
          </Pressable>
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
