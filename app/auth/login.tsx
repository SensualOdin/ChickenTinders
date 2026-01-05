import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../lib/contexts/AuthContext';
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
          <Pressable onPress={() => router.back()} className="mb-4">
            <Text className="text-primary text-base font-semibold">← Back</Text>
          </Pressable>

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
          {/* Email Input */}
          <View>
            <Text className="text-sm font-semibold text-textDark mb-2">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-textDark"
              style={{ outlineStyle: 'none' }}
            />
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-sm font-semibold text-textDark mb-2">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoComplete="password"
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-textDark"
              style={{ outlineStyle: 'none' }}
            />
          </View>
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading || authLoading}
          className={`py-4 rounded-xl items-center mb-4 ${
            loading || authLoading
              ? 'bg-gray-300'
              : 'bg-primary active:scale-95'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">
              Sign In
            </Text>
          )}
        </Pressable>

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
          <Pressable
            onPress={() => router.push('/auth/signup')}
            className="border-2 border-primary px-6 py-3 rounded-xl active:scale-95"
          >
            <Text className="text-primary text-base font-semibold">
              Create Account
            </Text>
          </Pressable>
        </View>

        {/* Continue as Guest */}
        <Pressable
          onPress={() => router.replace('/')}
          className="mt-6 py-3 items-center"
        >
          <Text className="text-gray-600 text-base underline">
            Continue as Guest
          </Text>
        </Pressable>

        {/* Info Box */}
        <View className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Text className="text-sm text-blue-900 font-semibold mb-2">
            ✨ Benefits of an Account
          </Text>
          <Text className="text-sm text-blue-800">
            • View your past groups and matches{'\n'}
            • Save your preferences (radius, price){'\n'}
            • Never lose your group history{'\n'}
            • Quick group creation with defaults
          </Text>
        </View>
      </View>
    </View>
  );
}
