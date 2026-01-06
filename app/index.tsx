import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../lib/contexts/AuthContext';
import { PhoneDemo } from '../components/PhoneDemo';

export default function LandingPage() {
  const router = useRouter();
  const { user, profile, isGuest } = useAuth();

  return (
    <ScrollView className="flex-1 bg-cream">
      {/* Navigation */}
      <View className="w-full max-w-app mx-auto">
        <View className="flex-row justify-between items-center px-8 pt-5 pb-3 bg-cream/95">
          <Pressable
            onPress={() => router.push('/')}
            className="flex-row items-center gap-3 active:scale-95 transition-all"
          >
            <Image
              source={require('../assets/images/icon.png')}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
            <Text className="text-xl font-semibold text-primary" style={{ fontFamily: 'Fraunces' }}>
              Chicken Tinders
            </Text>
          </Pressable>

          <View className="flex-row gap-3">
            {!isGuest && user && (
              <Pressable
                onPress={() => router.push('/my-groups')}
                className="bg-transparent px-5 py-2.5 rounded-full active:bg-cream-dark transition-all"
              >
                <Text className="text-sm font-semibold text-textDark tracking-wide">
                  My Groups
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => router.push('/account')}
              className="bg-surface border-2 border-primary px-5 py-2.5 rounded-full active:bg-primary transition-all"
            >
              <Text className="text-sm font-semibold text-primary tracking-wide">
                {!isGuest && profile ? profile.display_name : 'Sign In'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Hero Section */}
      <View className="w-full px-8 pt-16 pb-12">
        <View className="max-w-7xl mx-auto flex-row flex-wrap items-center gap-8">
          {/* Hero Content - Left Side */}
          <View className="flex-1 min-w-[400px] justify-center">
            {/* Badge */}
            <View className="flex-row items-center gap-2 px-4 py-2 bg-surface rounded-full shadow-soft self-start mb-6 animate-slide-up">
              <View className="w-2 h-2 bg-sage rounded-full animate-pulse" />
              <Text className="text-sm font-semibold text-textMuted tracking-wide">
                Free • No app required
              </Text>
            </View>

            {/* Title */}
            <Text
              className="text-6xl font-medium text-charcoal leading-tight mb-6 animate-slide-up"
              style={{ fontFamily: 'Fraunces', animationDelay: '0.1s' }}
            >
              Swipe right{'\n'}on <Text className="italic text-primary">dinner</Text>
            </Text>

            {/* Subtitle */}
            <Text className="text-xl text-textMuted mb-10 max-w-md leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              End the "where should we eat?" debate forever. Your group swipes, we find your match. No more 47 texts to decide on tacos.
            </Text>

            {/* CTAs */}
            <View className="flex-row gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/create" asChild>
                <Pressable className="bg-primary px-8 py-4 rounded-full shadow-elevated active:scale-95 active:bg-primary-dark transition-all">
                  <Text className="text-surface text-base font-semibold tracking-wide">
                    Create a Group →
                  </Text>
                </Pressable>
              </Link>

              <Link href="/join" asChild>
                <Pressable className="bg-surface border-2 border-cream-dark px-8 py-4 rounded-full active:border-primary active:bg-cream transition-all">
                  <Text className="text-primary text-base font-semibold tracking-wide">
                    Join with Code
                  </Text>
                </Pressable>
              </Link>
            </View>

            {/* Trust Signals */}
            <View className="flex-row gap-6 pt-8 border-t border-cream-dark animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <View className="flex-row items-center gap-2">
                <View className="w-5 h-5 bg-sage rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text className="text-sm text-textMuted">No download</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-5 h-5 bg-sage rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text className="text-sm text-textMuted">No sign-up required</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-5 h-5 bg-sage rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text className="text-sm text-textMuted">Works instantly</Text>
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
      <View className="w-full bg-surface py-20">
        <View className="max-w-app mx-auto px-8">
          <View className="items-center mb-16">
            <Text className="text-xs font-bold tracking-widest uppercase text-primary mb-4">
              How It Works
            </Text>
            <Text
              className="text-4xl font-medium text-charcoal mb-4 text-center"
              style={{ fontFamily: 'Fraunces' }}
            >
              Three steps to dinner bliss
            </Text>
            <Text className="text-lg text-textMuted text-center">
              From chaos to consensus in under 2 minutes
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-center gap-8">
            {/* Step 1 */}
            <View className="bg-cream rounded-3xl p-10 items-center max-w-xs hover:transform hover:-translate-y-2 transition-all">
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mb-6">
                <Text className="text-xl font-bold text-surface" style={{ fontFamily: 'Fraunces' }}>
                  1
                </Text>
              </View>
              <Text className="text-5xl mb-6">👥</Text>
              <Text
                className="text-xl font-semibold text-charcoal mb-3 text-center"
                style={{ fontFamily: 'Fraunces' }}
              >
                Create Your Group
              </Text>
              <Text className="text-base text-textMuted text-center leading-relaxed">
                Start a session and share the code with your hungry friends. No app downloads, no accounts needed.
              </Text>
            </View>

            {/* Step 2 */}
            <View className="bg-cream rounded-3xl p-10 items-center max-w-xs hover:transform hover:-translate-y-2 transition-all">
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mb-6">
                <Text className="text-xl font-bold text-surface" style={{ fontFamily: 'Fraunces' }}>
                  2
                </Text>
              </View>
              <Text className="text-5xl mb-6">👆</Text>
              <Text
                className="text-xl font-semibold text-charcoal mb-3 text-center"
                style={{ fontFamily: 'Fraunces' }}
              >
                Swipe Your Cravings
              </Text>
              <Text className="text-base text-textMuted text-center leading-relaxed">
                Everyone swipes right on spots they'd love, left on places they'd rather skip. Quick and honest.
              </Text>
            </View>

            {/* Step 3 */}
            <View className="bg-cream rounded-3xl p-10 items-center max-w-xs hover:transform hover:-translate-y-2 transition-all">
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mb-6">
                <Text className="text-xl font-bold text-surface" style={{ fontFamily: 'Fraunces' }}>
                  3
                </Text>
              </View>
              <Text className="text-5xl mb-6">🎉</Text>
              <Text
                className="text-xl font-semibold text-charcoal mb-3 text-center"
                style={{ fontFamily: 'Fraunces' }}
              >
                See Your Match
              </Text>
              <Text className="text-base text-textMuted text-center leading-relaxed">
                We find the restaurant everyone agrees on. No more compromising, just eating.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Social Proof Section */}
      <View className="w-full py-20 bg-cream-dark">
        <View className="max-w-app mx-auto px-8">
          <View className="items-center mb-16">
            <Text className="text-xs font-bold tracking-widest uppercase text-primary mb-4">
              Loved by Foodies
            </Text>
            <Text
              className="text-4xl font-medium text-charcoal text-center"
              style={{ fontFamily: 'Fraunces' }}
            >
              What groups are saying
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-center gap-6">
            {/* Testimonial 1 */}
            <View className="bg-surface rounded-2xl p-8 max-w-xs shadow-soft">
              <Text className="text-base text-textDark mb-6 leading-relaxed">
                "Finally ended a 3-year argument about where to get brunch. This app is saving friendships."
              </Text>
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-gold items-center justify-center">
                  <Text className="text-xl">👩</Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold text-charcoal">Sarah M.</Text>
                  <Text className="text-sm text-textMuted">Friend group of 6</Text>
                </View>
              </View>
            </View>

            {/* Testimonial 2 */}
            <View className="bg-surface rounded-2xl p-8 max-w-xs shadow-soft">
              <Text className="text-base text-textDark mb-6 leading-relaxed">
                "Used this for our office lunch runs. Went from 45 minutes of debate to 2 minutes. Life changing."
              </Text>
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-gold items-center justify-center">
                  <Text className="text-xl">👨</Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold text-charcoal">Marcus T.</Text>
                  <Text className="text-sm text-textMuted">Team of 12</Text>
                </View>
              </View>
            </View>

            {/* Testimonial 3 */}
            <View className="bg-surface rounded-2xl p-8 max-w-xs shadow-soft">
              <Text className="text-base text-textDark mb-6 leading-relaxed">
                "My family reunions used to start with a food fight (figuratively). Now we just swipe. Pure genius."
              </Text>
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-gold items-center justify-center">
                  <Text className="text-xl">👵</Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold text-charcoal">Linda K.</Text>
                  <Text className="text-sm text-textMuted">Extended family</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Final CTA Section */}
      <View className="w-full bg-primary py-20">
        <View className="max-w-app mx-auto px-8 items-center">
          <Text className="text-6xl mb-6">🍽️</Text>
          <Text
            className="text-4xl font-medium text-surface mb-4 text-center"
            style={{ fontFamily: 'Fraunces' }}
          >
            Hungry? Let's settle this.
          </Text>
          <Text className="text-lg text-surface/80 mb-10 text-center max-w-lg">
            Create a group, invite your crew, and find your perfect dinner match in minutes.
          </Text>
          <Link href="/create" asChild>
            <Pressable className="bg-surface px-8 py-4 rounded-full shadow-elevated active:scale-95 active:bg-cream transition-all">
              <Text className="text-primary text-base font-semibold tracking-wide">
                Start Swiping Now →
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Footer */}
      <View className="w-full bg-charcoal py-12">
        <View className="max-w-app mx-auto px-8 items-center">
          <View className="flex-row gap-8 mb-6">
            <Link href="/privacy">
              <Text className="text-sm text-surface/60 tracking-wide hover:text-surface transition-all">
                Privacy Policy
              </Text>
            </Link>
            <Link href="/terms">
              <Text className="text-sm text-surface/60 tracking-wide hover:text-surface transition-all">
                Terms of Service
              </Text>
            </Link>
            <Pressable onPress={() => router.push('/account')}>
              <Text className="text-sm text-surface/60 tracking-wide hover:text-surface transition-all">
                Contact Us
              </Text>
            </Pressable>
          </View>
          <Text className="text-sm text-surface/40">
            © 2025 Chicken Tinders. Made with 🍗 for hungry groups everywhere.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
