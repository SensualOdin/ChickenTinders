import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../lib/contexts/AuthContext';
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
          <Pressable onPress={() => router.push('/')} className="mb-4">
            <Text className="text-primary text-base font-semibold">← Back to Home</Text>
          </Pressable>

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
          {/* Display Name Input */}
          <View>
            <Text className="text-sm font-semibold text-textDark mb-2">
              Display Name
            </Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor="#9CA3AF"
              maxLength={50}
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-textDark"
              style={{ outlineStyle: 'none' }}
            />
          </View>

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
              placeholder="At least 6 characters"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoComplete="password-new"
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-textDark"
              style={{ outlineStyle: 'none' }}
            />
          </View>

          {/* Confirm Password Input */}
          <View>
            <Text className="text-sm font-semibold text-textDark mb-2">
              Confirm Password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoComplete="password-new"
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-textDark"
              style={{ outlineStyle: 'none' }}
            />
          </View>
        </View>

        {/* Sign Up Button */}
        <Pressable
          onPress={handleSignUp}
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
              {isGuest && profile ? 'Link Account' : 'Create Account'}
            </Text>
          )}
        </Pressable>

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
          <Pressable
            onPress={() => router.push('/auth/login')}
            className="border-2 border-secondary px-6 py-3 rounded-xl active:scale-95"
          >
            <Text className="text-secondary text-base font-semibold">
              Sign In
            </Text>
          </Pressable>
        </View>

        {/* Continue as Guest */}
        {!profile && (
          <Pressable
            onPress={() => router.replace('/')}
            className="mt-6 py-3 items-center"
          >
            <Text className="text-gray-600 text-base underline">
              Continue as Guest
            </Text>
          </Pressable>
        )}

        {/* Info Box */}
        <View className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Text className="text-sm text-blue-900 font-semibold mb-2">
            ✨ Account Benefits
          </Text>
          <Text className="text-sm text-blue-800">
            • Keep your group history forever{'\n'}
            • Save your food preferences{'\n'}
            • Quickly create groups with defaults{'\n'}
            • Access from any device
          </Text>
        </View>
      </View>
    </View>
  );
}
