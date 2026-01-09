import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry() {
  // Only initialize if DSN is configured
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    debug: __DEV__, // Enable debug logs in development
    environment: __DEV__ ? 'development' : 'production',
    enabled: !__DEV__, // Disable in development to avoid noise

    // Release tracking
    release: Constants.expoConfig?.version || '1.0.0',
    dist: Constants.expoConfig?.version?.replace(/\./g, '') || '100',

    // Performance monitoring
    tracesSampleRate: __DEV__ ? 0 : 0.2, // 20% of transactions in production
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000, // 30 seconds

    // Error filtering
    beforeSend(event, hint) {
      // Filter out development errors
      if (__DEV__) {
        return null;
      }

      // Filter out specific errors we don't care about
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message);

        // Ignore network errors from development
        if (message.includes('Network request failed') && __DEV__) {
          return null;
        }

        // Ignore cancelled requests
        if (message.includes('cancelled') || message.includes('aborted')) {
          return null;
        }
      }

      return event;
    },

    // Integrations
    integrations: [
      new Sentry.ReactNativeTracing({
        tracingOrigins: ['localhost', /^\//],
        routingInstrumentation: new Sentry.RoutingInstrumentation(),
      }),
    ],
  });
}

// Helper to capture errors with context
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    contexts: {
      additional: context,
    },
  });
}

// Helper to set user context
export function setSentryUser(userId: string, email?: string, displayName?: string) {
  Sentry.setUser({
    id: userId,
    email,
    username: displayName,
  });
}

// Helper to clear user context (on logout)
export function clearSentryUser() {
  Sentry.setUser(null);
}

// Helper to add breadcrumb for debugging
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  });
}
