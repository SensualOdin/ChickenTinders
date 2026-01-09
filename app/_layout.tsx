import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Text } from 'react-native';
import { AuthProvider } from '../lib/contexts/AuthContext';
import { useFonts } from 'expo-font';
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { initSentry, captureError } from '../lib/monitoring/sentry';
import { initAnalytics } from '../lib/monitoring/analytics';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

// Initialize monitoring services
initSentry();
initAnalytics();

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  // Capture error in Sentry
  useEffect(() => {
    captureError(error, {
      errorBoundary: 'RootLayout',
    });
  }, [error]);

  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <Text className="text-2xl font-bold text-primary mb-4">Oops! Something went wrong</Text>
      <Text className="text-base text-gray-600 mb-6 text-center">
        {error.message || 'An unexpected error occurred'}
      </Text>
      <button
        onClick={resetErrorBoundary}
        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold"
      >
        Try Again
      </button>
    </View>
  );
}

export default function RootLayout() {
  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    'Fraunces': Fraunces_500Medium,
    'Fraunces-Regular': Fraunces_400Regular,
    'Fraunces-SemiBold': Fraunces_600SemiBold,
    'DM Sans': DMSans_400Regular,
    'DM Sans-Medium': DMSans_500Medium,
    'DM Sans-SemiBold': DMSans_600SemiBold,
    'DM Sans-Bold': DMSans_700Bold,
  });

  // Hide splash when fonts loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render until fonts loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F8F6F1' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="[...missing]" />
        </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
