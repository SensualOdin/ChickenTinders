import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Text } from 'react-native';
import { AuthProvider } from '../lib/contexts/AuthContext';

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
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
