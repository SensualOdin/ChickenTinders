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

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, profile, isGuest, linkGuestAccount, loading: authLoading } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!displayName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      let error;

      // If guest user exists, link the account
      if (isGuest && profile) {
        const result = await linkGuestAccount(email.trim(), password);
        error = result.error;

        if (!error) {
          toast.success('Guest account linked! 🎉');
        }
      } else {
        // Create new account
        const result = await signUp(email.trim(), password, displayName.trim());
        error = result.error;

        if (!error) {
          toast.success('Account created! Check your email to verify. 📧');
        }
      }

      if (error) {
        toast.error(error.message || 'Failed to create account');
        haptic.error();
        return;
      }

      haptic.success();
      router.replace('/');
    } catch (err: any) {
      console.error('Sign up error:', err);
      toast.error('Failed to create account');
      haptic.error();
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
            />
            <Text
              className="text-4xl font-medium text-charcoal mb-2 text-center"
              style={{ fontFamily: 'Fraunces' }}
            >
              {isGuest && profile ? 'Save Your Account' : 'Create Account'}
            </Text>
            <Text className="text-base text-textMuted text-center">
              {isGuest && profile
                ? 'Link your guest account to never lose your groups'
                : 'Sign up to save your group history and preferences'}
            </Text>
          </View>

          {/* Form Card */}
          <Card variant="elevated" padding="lg">
            <Stack spacing="md">
          <Input
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            maxLength={50}
            size="lg"
          />

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
            placeholder="At least 6 characters"
            secureTextEntry
            autoComplete="password-new"
            size="lg"
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter password"
            secureTextEntry
            autoComplete="password-new"
            size="lg"
          />

              <Button
                onPress={handleSignUp}
                disabled={loading || authLoading}
                loading={loading}
                variant="primary"
                size="lg"
                fullWidth
                className="mt-2"
              >
                {isGuest && profile ? 'Link Account' : 'Create Account'}
              </Button>
            </Stack>
          </Card>

          {/* Alternative Action */}
          <View className="items-center">
            <Text className="text-sm text-textMuted mb-3">
              Already have an account?
            </Text>
            <Button
              href="/auth/login"
              variant="outline"
              size="md"
            >
              Sign In
            </Button>
          </View>

          {/* Guest Mode Link */}
          {!profile && (
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
          )}

          {/* Info Box */}
          <InfoCard
            variant="info"
            title="Account Benefits"
            emoji="✨"
          >
            • Keep your group history forever{'\n'}
            • Save your food preferences{'\n'}
            • Quickly create groups with defaults{'\n'}
            • Access from any device
          </InfoCard>
        </Stack>
      </Container>
    </ScrollView>
  );
}
