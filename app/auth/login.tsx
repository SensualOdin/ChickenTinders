import { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../lib/contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { InfoCard } from '../../components/ui/InfoCard';
import { Card } from '../../components/ui/Card';
import { Container } from '../../components/layout/Container';
import { Stack } from '../../components/layout/Stack';
import { haptic } from '../../lib/utils';
import { analytics } from '../../lib/monitoring/analytics';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const { error } = await signIn(email.trim(), password);

      if (error) {
        toast.error(error.message || 'Failed to sign in');
        haptic.error();
        analytics.errorOccurred('auth_error', error.message, { method: 'email' });
        return;
      }

      // Track successful sign in
      analytics.signIn('email');

      // Note: User context will be set automatically by auth state change
      // The onAuthStateChange listener in AuthContext will trigger after successful login

      toast.success('Welcome back! 🎉');
      haptic.success();
      router.replace('/');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error('Failed to sign in');
      haptic.error();
      analytics.errorOccurred('auth_exception', err.message, { method: 'email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-cream">
      <Toaster position="top-center" />

      <Container size="md" padding="md" className="py-12">
        <Stack spacing="xl">
          {/* Brand Section */}
          <View className="items-center">
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: 80, height: 80 }}
              className="mb-4"
              accessibilityLabel="ChickenTinders logo"
              accessibilityRole="image"
            />
            <Text
              className="text-4xl font-medium text-charcoal mb-2 text-center"
              style={{ fontFamily: 'Fraunces' }}
            >
              Welcome Back
            </Text>
            <Text className="text-base text-textMuted text-center">
              Sign in to access your saved groups and history
            </Text>
          </View>

          {/* Form Card */}
          <Card variant="elevated" padding="lg">
            <Stack spacing="md">
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                size="lg"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                autoComplete="password"
                size="lg"
              />

              <Button
                onPress={handleLogin}
                disabled={loading || authLoading}
                loading={loading}
                variant="primary"
                size="lg"
                fullWidth
                className="mt-2"
              >
                Sign In
              </Button>
            </Stack>
          </Card>

          {/* Alternative Action */}
          <View className="items-center">
            <Text className="text-sm text-textMuted mb-3">
              Don't have an account?
            </Text>
            <Button
              href="/auth/signup"
              variant="outline"
              size="md"
            >
              Create Account
            </Button>
          </View>

          {/* Guest Mode Link */}
          <View className="items-center pt-6 border-t border-cream-dark">
            <Text className="text-sm text-textMuted mb-3">
              Just want to try it out?
            </Text>
            <Button
              href="/"
              variant="ghost"
              size="sm"
            >
              Continue as Guest
            </Button>
          </View>

          {/* Info Box */}
          <InfoCard
            variant="info"
            title="Benefits of an Account"
            emoji="✨"
          >
            • View your past groups and matches{'\n'}
            • Save your preferences (radius, price){'\n'}
            • Never lose your group history{'\n'}
            • Quick group creation with defaults
          </InfoCard>
        </Stack>
      </Container>
    </ScrollView>
  );
}
