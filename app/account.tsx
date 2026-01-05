import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../lib/contexts/AuthContext';
import { haptic } from '../lib/utils';

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, isGuest, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      haptic.success();
      router.replace('/');
    } catch (error) {
      toast.error('Failed to sign out');
      haptic.error();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  // Guest user - encourage signup
  if (isGuest || !user) {
    return (
      <View className="flex-1 bg-background">
        <Toaster position="top-center" />

        <View className="flex-1 max-w-app mx-auto w-full px-4 py-8">
          {/* Header */}
          <View className="mb-8">
            <Pressable onPress={() => router.back()} className="mb-4">
              <Text className="text-primary text-base font-semibold">← Back</Text>
            </Pressable>

            <Text className="text-6xl mb-4">👤</Text>
            <Text className="text-3xl font-bold text-primary mb-2">
              Guest Mode
            </Text>
            <Text className="text-base text-gray-600">
              You're using ChickenTinders as a guest
            </Text>
          </View>

          {/* Guest Info */}
          {profile && (
            <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
              <Text className="text-lg font-bold text-textDark mb-3">
                Current Session
              </Text>
              <View className="gap-2">
                <View>
                  <Text className="text-sm text-gray-500">Display Name</Text>
                  <Text className="text-base font-semibold text-textDark">
                    {profile.display_name}
                  </Text>
                </View>
                <View>
                  <Text className="text-sm text-gray-500">Status</Text>
                  <Text className="text-base font-semibold text-orange-600">
                    Guest Account (temporary)
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Benefits Card */}
          <View className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-4">
            <Text className="text-lg font-bold text-blue-900 mb-3">
              ✨ Create an Account
            </Text>
            <Text className="text-sm text-blue-800 mb-4">
              Save your groups and preferences by creating a free account.
            </Text>
            <View className="gap-2 mb-4">
              <Text className="text-sm text-blue-800">• View group history</Text>
              <Text className="text-sm text-blue-800">• Save preferences</Text>
              <Text className="text-sm text-blue-800">• Access from any device</Text>
              <Text className="text-sm text-blue-800">• Never lose your data</Text>
            </View>
            <Pressable
              onPress={() => router.push('/auth/signup')}
              className="bg-primary py-3 rounded-xl items-center active:scale-95"
            >
              <Text className="text-white text-base font-bold">
                {profile ? 'Link Guest Account' : 'Create Account'}
              </Text>
            </Pressable>
          </View>

          {/* Already Have Account */}
          <View className="items-center">
            <Text className="text-sm text-gray-600 mb-3">
              Already have an account?
            </Text>
            <Pressable
              onPress={() => router.push('/auth/login')}
              className="border-2 border-secondary px-6 py-3 rounded-xl active:scale-95"
            >
              <Text className="text-secondary text-base font-semibold">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Authenticated user
  return (
    <ScrollView className="flex-1 bg-background">
      <Toaster position="top-center" />

      <View className="max-w-app mx-auto w-full px-4 py-8">
        {/* Header */}
        <View className="mb-8">
          <Pressable onPress={() => router.back()} className="mb-4">
            <Text className="text-primary text-base font-semibold">← Back</Text>
          </Pressable>

          <Text className="text-6xl mb-4">👤</Text>
          <Text className="text-3xl font-bold text-primary mb-2">
            My Account
          </Text>
          <Text className="text-base text-gray-600">
            Manage your profile and preferences
          </Text>
        </View>

        {/* Profile Info */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-textDark mb-3">
            Profile Information
          </Text>
          <View className="gap-3">
            <View>
              <Text className="text-sm text-gray-500">Display Name</Text>
              <Text className="text-base font-semibold text-textDark">
                {profile?.display_name}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Email</Text>
              <Text className="text-base font-semibold text-textDark">
                {user.email}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Account Status</Text>
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 bg-success rounded-full" />
                <Text className="text-base font-semibold text-success">
                  Active
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dietary Preferences */}
        {profile?.dietary_tags && profile.dietary_tags.length > 0 && (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-textDark mb-3">
              Dietary Preferences
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {profile.dietary_tags.map((tag) => (
                <View
                  key={tag}
                  className="bg-blue-100 px-3 py-1 rounded-full"
                >
                  <Text className="text-sm text-blue-900">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-textDark mb-3">
            Quick Actions
          </Text>
          <View className="gap-3">
            <Pressable
              onPress={() => router.push('/history')}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">📜</Text>
                <Text className="text-base font-semibold text-textDark">
                  Group History
                </Text>
              </View>
              <Text className="text-gray-400">→</Text>
            </Pressable>

            <Pressable
              onPress={() => toast('Coming soon!', { icon: '🚧' })}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">⚙️</Text>
                <Text className="text-base font-semibold text-textDark">
                  Settings
                </Text>
              </View>
              <Text className="text-gray-400">→</Text>
            </Pressable>

            <Pressable
              onPress={() => toast('Coming soon!', { icon: '🚧' })}
              className="flex-row items-center justify-between py-3"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🔔</Text>
                <Text className="text-base font-semibold text-textDark">
                  Notifications
                </Text>
              </View>
              <Text className="text-gray-400">→</Text>
            </Pressable>
          </View>
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={handleSignOut}
          className="bg-gray-200 py-4 rounded-xl items-center active:scale-95 mb-4"
        >
          <Text className="text-gray-700 text-lg font-bold">
            Sign Out
          </Text>
        </Pressable>

        {/* App Info */}
        <View className="items-center py-4">
          <Text className="text-sm text-gray-500">
            ChickenTinders v1.0
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            Made with 🍗 and ❤️
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
