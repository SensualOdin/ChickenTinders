import { View, Text, Pressable, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../lib/contexts/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { user, profile, isGuest } = useAuth();

  return (
    <View className="flex-1 bg-background">
      {/* Ambient Background Pattern */}
      <View className="absolute inset-0 opacity-[0.03]">
        <View className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <View className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </View>

      {/* Container with max-width for desktop */}
      <View className="flex-1 max-w-app mx-auto w-full px-6">

        {/* Top Right Navigation */}
        <View className="absolute top-6 right-6 z-10 animate-fade-in flex-row gap-3">
          {/* My Groups Button - Only for authenticated users */}
          {!isGuest && user && (
            <Pressable
              onPress={() => router.push('/my-groups')}
              className="bg-surface px-5 py-2.5 rounded-full shadow-soft border border-accent flex-row items-center gap-2 active:scale-95 transition-all"
            >
              <Text className="text-lg">👥</Text>
              <Text className="text-sm font-medium text-textDark tracking-wide">
                My Groups
              </Text>
            </Pressable>
          )}

          {/* Account Button */}
          <Pressable
            onPress={() => router.push('/account')}
            className="bg-surface px-5 py-2.5 rounded-full shadow-soft border border-accent flex-row items-center gap-2 active:scale-95 transition-all"
          >
            <Text className="text-lg">👤</Text>
            {!isGuest && profile && (
              <Text className="text-sm font-medium text-textDark tracking-wide">
                {profile.display_name}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Hero Section */}
        <View className="flex-1 justify-center items-center animate-slide-up">
          {/* Logo with refined spacing */}
          <View className="mb-12 items-center">
            <Image
              source={require('../assets/images/logo.png')}
              style={{ width: 280, height: 280 }}
              resizeMode="contain"
              className="mb-4"
              alt="ChickenTinders Logo"
            />
          </View>

          {/* Tagline with refined typography */}
          <Text
            className="text-3xl font-semibold text-textDark text-center mb-3 tracking-tight"
            style={{ fontFamily: 'Playfair Display' }}
          >
            Swipe Right on Dinner
          </Text>
          <Text className="text-lg text-textMuted text-center mb-16 px-6 leading-relaxed max-w-md">
            No more group chat chaos.{'\n'}
            Swipe, match, eat.
          </Text>

          {/* CTA Buttons with refined styling */}
          <View className="flex-row gap-4 mb-4 animate-scale-in">
            <Link href="/create" asChild>
              <Pressable className="bg-primary px-10 py-5 rounded-2xl active:scale-95 shadow-elevated transition-all">
                <Text className="text-surface text-base font-semibold tracking-wide">
                  Create Group
                </Text>
              </Pressable>
            </Link>

            <Link href="/join" asChild>
              <Pressable className="bg-surface border-2 border-primary px-10 py-5 rounded-2xl active:scale-95 shadow-soft transition-all">
                <Text className="text-primary text-base font-semibold tracking-wide">
                  Join Group
                </Text>
              </Pressable>
            </Link>
          </View>

          {/* Trust Signal with refined style */}
          <View className="flex-row items-center gap-2 mt-8 px-6 py-3 bg-surface rounded-full shadow-soft">
            <Text className="text-success text-base">✓</Text>
            <Text className="text-sm text-textMuted tracking-wide">
              No download • No sign-up • Just food
            </Text>
          </View>
        </View>

        {/* Footer with refined spacing */}
        <View className="py-8 flex-row justify-center gap-8 animate-fade-in">
          <Link href="/privacy">
            <Text className="text-sm text-textLight tracking-wide">Privacy</Text>
          </Link>
          <Text className="text-textLight">•</Text>
          <Link href="/terms">
            <Text className="text-sm text-textLight tracking-wide">Terms</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
