import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../lib/contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { InfoCard } from '../../components/ui/InfoCard';
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
    <View className="flex-1 bg-background">
      <Toaster position="top-center" />

      <View className="flex-1 max-w-app mx-auto w-full px-4 py-8">
        {/* Header */}
        <View className="mb-8">
          <Button
            href="/"
            variant="ghost"
            size="sm"
            className="mb-4 self-start -ml-2"
          >
            ← Back to Home
          </Button>

          <Text className="text-4xl mb-2">🍗</Text>
          <Text className="text-3xl font-bold text-primary mb-2">
            {isGuest && profile ? 'Save Your Account' : 'Create Account'}
          </Text>
          <Text className="text-base text-gray-600">
            {isGuest && profile
              ? 'Link your guest account to never lose your groups'
              : 'Sign up to save your group history and preferences'}
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4 mb-6">
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
        </View>

        {/* Sign Up Button */}
        <Button
          onPress={handleSignUp}
          disabled={loading || authLoading}
          loading={loading}
          variant="primary"
          size="lg"
          fullWidth
          className="mb-4"
        >
          {isGuest && profile ? 'Link Account' : 'Create Account'}
        </Button>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="px-4 text-sm text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Login Link */}
        <View className="items-center">
          <Text className="text-sm text-gray-600 mb-3">
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

        {/* Continue as Guest */}
        {!profile && (
          <Button
            href="/"
            variant="ghost"
            size="md"
            fullWidth
            className="mt-6"
          >
            Continue as Guest
          </Button>
        )}

        {/* Info Box */}
        <InfoCard
          variant="info"
          title="Account Benefits"
          emoji="✨"
          className="mt-8"
        >
          • Keep your group history forever{'\n'}
          • Save your food preferences{'\n'}
          • Quickly create groups with defaults{'\n'}
          • Access from any device
        </InfoCard>
      </View>
    </View>
  );
}
