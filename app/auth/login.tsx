import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../lib/contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { InfoCard } from '../../components/ui/InfoCard';
import { haptic } from '../../lib/utils';

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
        return;
      }

      toast.success('Welcome back! 🎉');
      haptic.success();
      router.replace('/');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error('Failed to sign in');
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
            Welcome Back
          </Text>
          <Text className="text-base text-gray-600">
            Sign in to access your group history and saved preferences
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4 mb-6">
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
        </View>

        {/* Login Button */}
        <Button
          onPress={handleLogin}
          disabled={loading || authLoading}
          loading={loading}
          variant="primary"
          size="lg"
          fullWidth
          className="mb-4"
        >
          Sign In
        </Button>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="px-4 text-sm text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Sign Up Link */}
        <View className="items-center">
          <Text className="text-sm text-gray-600 mb-3">
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

        {/* Continue as Guest */}
        <Button
          href="/"
          variant="ghost"
          size="md"
          fullWidth
          className="mt-6"
        >
          Continue as Guest
        </Button>

        {/* Info Box */}
        <InfoCard
          variant="info"
          title="Benefits of an Account"
          emoji="✨"
          className="mt-8"
        >
          • View your past groups and matches{'\n'}
          • Save your preferences (radius, price){'\n'}
          • Never lose your group history{'\n'}
          • Quick group creation with defaults
        </InfoCard>
      </View>
    </View>
  );
}
