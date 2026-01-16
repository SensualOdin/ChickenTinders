import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../lib/contexts/AuthContext';
import { PhoneDemo } from '../components/PhoneDemo';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const { user, profile, isGuest } = useAuth();

  return (
    <ScrollView className="flex-1 bg-surface-main">
      {/* Navigation */}
      <View className="w-full max-w-app mx-auto">
        <View className="flex-row justify-between items-center px-8 pt-5 pb-3 bg-surface-main/95">
          <Pressable
            onPress={() => router.push('/')}
            className="flex-row items-center gap-3 active:scale-95 transition-all"
          >
            <Image
              source={require('../assets/images/icon.png')}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
            <Text className="text-xl font-semibold text-brand-primary" style={{ fontFamily: 'Fraunces' }}>
              Chicken Tinders
            </Text>
          </Pressable>

          <View className="flex-row gap-3">
            <Button
              href="/active-sessions"
              variant="ghost"
              size="sm"
            >
              Active Sessions
            </Button>
            {!isGuest && user && (
              <Button
                href="/my-groups"
                variant="ghost"
                size="sm"
              >
                My Groups
              </Button>
            )}
            <Button
              href="/account"
              variant="outline"
              size="sm"
            >
              {!isGuest && profile ? profile.display_name : 'Sign In'}
            </Button>
          </View>
        </View>
      </View>

      {/* Hero Section */}
      <View className="w-full px-8 pt-16 pb-12">
        <View className="max-w-7xl mx-auto flex-row flex-wrap items-center gap-8">
          {/* Hero Content - Left Side */}
          <View className="flex-1 min-w-[400px] justify-center">
            {/* Badge */}
            <View className="flex-row items-center gap-2 px-4 py-2 bg-surface-card rounded-full shadow-soft self-start mb-6 animate-slide-up">
              <View className="w-2 h-2 bg-feedback-success rounded-full animate-pulse" />
              <Text className="text-sm font-semibold text-text-muted tracking-wide">
                Free • No app required
              </Text>
            </View>

            {/* Title */}
            <Text
              className="text-6xl font-medium text-text-display leading-tight mb-6 animate-slide-up"
              style={{ fontFamily: 'Fraunces', animationDelay: '0.1s' }}
            >
              Swipe right{'\n'}on <Text className="italic text-brand-primary">dinner</Text>
            </Text>

            {/* Subtitle */}
            <Text className="text-xl text-text-muted mb-10 max-w-md leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              End the "where should we eat?" debate forever. Your group swipes, we find your match. No more 47 texts to decide on tacos.
            </Text>

            {/* CTAs */}
            <View className="flex-row gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button
                href="/create"
                variant="primary"
                size="lg"
              >
                Create a Group →
              </Button>

              <Button
                href="/join"
                variant="outline"
                size="lg"
              >
                Join with Code
              </Button>
            </View>

            {/* Trust Signals */}
            <View className="flex-row gap-6 pt-8 border-t border-neutral-gray200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <View className="flex-row items-center gap-2">
                <View className="w-5 h-5 bg-feedback-success rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text className="text-sm text-text-muted">No download</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-5 h-5 bg-feedback-success rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text className="text-sm text-text-muted">No sign-up required</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-5 h-5 bg-feedback-success rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text className="text-sm text-text-muted">Works instantly</Text>
              </View>
            </View>
          </View>

          {/* Phone Demo - Right Side */}
          <View className="flex-1 min-w-[400px] items-center justify-center relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Floating Food Emojis */}
            <View className="absolute top-[5%] right-[10%] animate-float" style={{ zIndex: 1 }}>
              <Text className="text-5xl">🍕</Text>
            </View>
            <View className="absolute bottom-[15%] right-[20%] animate-float" style={{ animationDelay: '1s', zIndex: 1 }}>
              <Text className="text-4xl">🌮</Text>
            </View>
            <View className="absolute top-[25%] left-[5%] animate-float" style={{ animationDelay: '2s', zIndex: 1 }}>
              <Text className="text-3xl">🍜</Text>
            </View>

            <PhoneDemo />
          </View>
        </View>
      </View>

      {/* How It Works Section */}
      <View className="w-full bg-surface-card py-20">
        <View className="max-w-app mx-auto px-8">
          <View className="items-center mb-16">
            <Text className="text-xs font-bold tracking-widest uppercase text-brand-primary mb-4">
              How It Works
            </Text>
            <Text
              className="text-4xl font-medium text-text-display mb-4 text-center"
              style={{ fontFamily: 'Fraunces' }}
            >
              Three steps to dinner bliss
            </Text>
            <Text className="text-lg text-text-muted text-center">
              From chaos to consensus in under 2 minutes
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-center gap-8">
            {/* Step 1 */}
            <View className="bg-surface-main rounded-3xl p-10 items-center max-w-xs hover:transform hover:-translate-y-2 transition-all">
              <View className="w-12 h-12 bg-brand-primary rounded-full items-center justify-center mb-6">
                <Text className="text-xl font-bold text-surface-card" style={{ fontFamily: 'Fraunces' }}>
                  1
                </Text>
              </View>
              <Text className="text-5xl mb-6">👥</Text>
              <Text
                className="text-xl font-semibold text-text-display mb-3 text-center"
                style={{ fontFamily: 'Fraunces' }}
              >
                Create Your Group
              </Text>
              <Text className="text-base text-text-muted text-center leading-relaxed">
                Start a session and share the code with your hungry friends. No app downloads, no accounts needed.
              </Text>
            </View>

            {/* Step 2 */}
            <View className="bg-surface-main rounded-3xl p-10 items-center max-w-xs hover:transform hover:-translate-y-2 transition-all">
              <View className="w-12 h-12 bg-brand-primary rounded-full items-center justify-center mb-6">
                <Text className="text-xl font-bold text-surface-card" style={{ fontFamily: 'Fraunces' }}>
                  2
                </Text>
              </View>
              <Text className="text-5xl mb-6">👆</Text>
              <Text
                className="text-xl font-semibold text-text-display mb-3 text-center"
                style={{ fontFamily: 'Fraunces' }}
              >
                Swipe Your Cravings
              </Text>
              <Text className="text-base text-text-muted text-center leading-relaxed">
                Everyone swipes right on spots they'd love, left on places they'd rather skip. Quick and honest.
              </Text>
            </View>

            {/* Step 3 */}
            <View className="bg-surface-main rounded-3xl p-10 items-center max-w-xs hover:transform hover:-translate-y-2 transition-all">
              <View className="w-12 h-12 bg-brand-primary rounded-full items-center justify-center mb-6">
                <Text className="text-xl font-bold text-surface-card" style={{ fontFamily: 'Fraunces' }}>
                  3
                </Text>
              </View>
              <Text className="text-5xl mb-6">🎉</Text>
              <Text
                className="text-xl font-semibold text-text-display mb-3 text-center"
                style={{ fontFamily: 'Fraunces' }}
              >
                See Your Match
              </Text>
              <Text className="text-base text-text-muted text-center leading-relaxed">
                We find the restaurant everyone agrees on. No more compromising, just eating.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Social Proof Section */}
      <View className="w-full py-20 bg-surface-main">
        <View className="max-w-app mx-auto px-8">
          <View className="items-center mb-16">
            <Text className="text-xs font-bold tracking-widest uppercase text-brand-primary mb-4">
              Loved by Foodies
            </Text>
            <Text
              className="text-4xl font-medium text-text-display text-center"
              style={{ fontFamily: 'Fraunces' }}
            >
              What groups are saying
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-center gap-6">
            {/* Testimonial 1 */}
            <View className="bg-surface-card rounded-2xl p-8 max-w-xs shadow-soft">
              <Text className="text-base text-text-body mb-6 leading-relaxed">
                "Finally ended a 3-year argument about where to get brunch. This app is saving friendships."
              </Text>
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-brand-primary items-center justify-center">
                  <Text className="text-xl">👩</Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold text-text-display">Sarah M.</Text>
                  <Text className="text-sm text-text-muted">Friend group of 6</Text>
                </View>
              </View>
            </View>

            {/* Testimonial 2 */}
            <View className="bg-surface-card rounded-2xl p-8 max-w-xs shadow-soft">
              <Text className="text-base text-text-body mb-6 leading-relaxed">
                "Used this for our office lunch runs. Went from 45 minutes of debate to 2 minutes. Life changing."
              </Text>
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-brand-primary items-center justify-center">
                  <Text className="text-xl">👨</Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold text-text-display">Marcus T.</Text>
                  <Text className="text-sm text-text-muted">Team of 12</Text>
                </View>
              </View>
            </View>

            {/* Testimonial 3 */}
            <View className="bg-surface-card rounded-2xl p-8 max-w-xs shadow-soft">
              <Text className="text-base text-text-body mb-6 leading-relaxed">
                "My family reunions used to start with a food fight (figuratively). Now we just swipe. Pure genius."
              </Text>
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-brand-primary items-center justify-center">
                  <Text className="text-xl">👵</Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold text-text-display">Linda K.</Text>
                  <Text className="text-sm text-text-muted">Extended family</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Final CTA Section */}
      <View className="w-full bg-brand-primary py-20">
        <View className="max-w-app mx-auto px-8 items-center">
          <Text className="text-6xl mb-6">🍽️</Text>
          <Text
            className="text-4xl font-medium text-surface-card mb-4 text-center"
            style={{ fontFamily: 'Fraunces' }}
          >
            Hungry? Let's settle this.
          </Text>
          <Text className="text-lg text-surface-card/80 mb-10 text-center max-w-lg">
            Create a group, invite your crew, and find your perfect dinner match in minutes.
          </Text>
          <Button
            href="/create"
            variant="secondary"
            size="lg"
            className="bg-surface-card text-brand-primary"
          >
            Start Swiping Now →
          </Button>
        </View>
      </View>

      {/* Footer */}
      <View className="w-full bg-text-display py-12">
        <View className="max-w-app mx-auto px-8 items-center">
          <View className="flex-row gap-8 mb-6">
            <Link href="/privacy">
              <Text className="text-sm text-surface-card/60 tracking-wide hover:text-surface-card transition-all">
                Privacy Policy
              </Text>
            </Link>
            <Link href="/terms">
              <Text className="text-sm text-surface-card/60 tracking-wide hover:text-surface-card transition-all">
                Terms of Service
              </Text>
            </Link>
            <Link href="/account">
              <Text className="text-sm text-surface-card/60 tracking-wide hover:text-surface-card transition-all">
                Contact Us
              </Text>
            </Link>
          </View>
          <Text className="text-sm text-surface-card/40">
            © 2025 Chicken Tinders. Made with 🍗 for hungry groups everywhere.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
